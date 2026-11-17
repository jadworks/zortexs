import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { SEED_DEMO_ORDERS } from '../data/catalog';
import {
  BLUEPRINT_LIMITS,
  CartItem,
  OrderRecord,
  OrderStage,
  PaymentMethod,
  PaymentStatus,
} from '../types';
import {
  buildItemsSummary,
  calculateCartTotals,
  computeStageEstimation,
  generateOrderNumber,
  getNextStage,
} from '../utils/orderLogic';

const LOCAL_ORDERS_KEY = 'le_comptoir_dore_orders_v1';
const ADMIN_EMAIL = 'jad.mahi66@gmail.com';

export function isUserAdmin(user: User | null): boolean {
  return Boolean(user && user.email === ADMIN_EMAIL && user.emailVerified);
}

export function loadLocalOrders(): OrderRecord[] {
  if (typeof window === 'undefined') return [...SEED_DEMO_ORDERS];
  try {
    const raw = window.localStorage.getItem(LOCAL_ORDERS_KEY);
    if (!raw) {
      window.localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(SEED_DEMO_ORDERS));
      return [...SEED_DEMO_ORDERS];
    }
    const parsed = JSON.parse(raw) as OrderRecord[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [...SEED_DEMO_ORDERS];
    }
    return parsed;
  } catch {
    return [...SEED_DEMO_ORDERS];
  }
}

export function saveLocalOrders(orders: OrderRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // Ignore storage quota errors
  }
}

function sanitizeId(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 120);
  return cleaned.length > 0 ? cleaned : `id-${Date.now()}`;
}

export function subscribeFirestoreOrders(
  user: User,
  onData: (orders: OrderRecord[]) => void
): () => void {
  const ordersRef = collection(db, 'orders');
  const q = isUserAdmin(user)
    ? query(ordersRef, orderBy('createdAt', 'desc'))
    : query(ordersRef, where('ownerId', '==', user.uid), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: OrderRecord[] = snapshot.docs.map((snap) => {
        const d = snap.data();
        const createdAt =
          d.createdAt instanceof Timestamp ? d.createdAt.toMillis() : Date.now();
        const updatedAt =
          d.updatedAt instanceof Timestamp ? d.updatedAt.toMillis() : Date.now();

        return {
          id: snap.id,
          orderNumber: String(d.orderNumber ?? 'CD-0000'),
          ownerId: String(d.ownerId ?? user.uid),
          customerName: String(d.customerName ?? ''),
          customerPhone: String(d.customerPhone ?? ''),
          pickupSlot: String(d.pickupSlot ?? ''),
          paymentMethod: d.paymentMethod === 'online' ? 'online' : 'in_store',
          paymentStatus: d.paymentStatus === 'paid' ? 'paid' : 'pending_pickup',
          stage: (d.stage as OrderStage) ?? 'received',
          estimatedMinutesRemaining: Number(d.estimatedMinutesRemaining ?? 0),
          estimatedReadyLabel: String(d.estimatedReadyLabel ?? ''),
          totalCents: Number(d.totalCents ?? 0),
          itemCount: Number(d.itemCount ?? 1),
          itemsSummary: String(d.itemsSummary ?? ''),
          notes: typeof d.notes === 'string' ? d.notes : undefined,
          createdAtMs: createdAt,
          updatedAtMs: updatedAt,
          source: 'firestore',
        };
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    }
  );
}

export async function createPreOrder(params: {
  user: User | null;
  customerName: string;
  customerPhone: string;
  pickupSlot: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  items: readonly CartItem[];
}): Promise<OrderRecord> {
  const { totalCents, itemCount, maxPrepMinutes } = calculateCartTotals(params.items);
  const estimation = computeStageEstimation(
    'received',
    params.pickupSlot,
    new Date(),
    maxPrepMinutes
  );

  const orderNumber = generateOrderNumber();
  const orderId = sanitizeId(`ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
  const paymentStatus: PaymentStatus =
    params.paymentMethod === 'online' ? 'paid' : 'pending_pickup';
  const customerName = params.customerName.trim().slice(0, BLUEPRINT_LIMITS.customerNameMax);
  const customerPhone = params.customerPhone.trim().slice(0, BLUEPRINT_LIMITS.customerPhoneMax);
  const pickupSlot = params.pickupSlot.trim().slice(0, BLUEPRINT_LIMITS.pickupSlotMax);
  const notes = (params.notes ?? '').trim().slice(0, BLUEPRINT_LIMITS.notesMax);
  const itemsSummary = buildItemsSummary(params.items);

  if (params.user && params.user.emailVerified) {
    const batch = writeBatch(db);
    const orderDocRef = doc(db, 'orders', orderId);
    const orderPayload: Record<string, unknown> = {
      orderNumber,
      ownerId: params.user.uid,
      customerName,
      customerPhone,
      pickupSlot,
      paymentMethod: params.paymentMethod,
      paymentStatus,
      stage: 'received',
      estimatedMinutesRemaining: estimation.estimatedMinutesRemaining,
      estimatedReadyLabel: estimation.estimatedReadyLabel.slice(0, 40),
      totalCents,
      itemCount,
      itemsSummary,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (notes.length > 0) {
      orderPayload.notes = notes;
    }

    batch.set(orderDocRef, orderPayload);

    params.items.forEach((item, index) => {
      const itemId = sanitizeId(`item-${index}-${item.productId}`);
      const itemRef = doc(db, 'orders', orderId, 'items', itemId);
      const itemPayload: Record<string, unknown> = {
        orderId,
        ownerId: params.user!.uid,
        productId: sanitizeId(item.productId).slice(0, 64),
        name: item.name.slice(0, 80),
        category: item.category,
        quantity: Math.max(1, Math.min(BLUEPRINT_LIMITS.maxQuantityPerItem, item.quantity)),
        unitPriceCents: item.unitPriceCents,
        createdAt: serverTimestamp(),
      };
      if (item.optionsLabel && item.optionsLabel.trim().length > 0) {
        itemPayload.optionsLabel = item.optionsLabel.trim().slice(0, BLUEPRINT_LIMITS.optionsLabelMax);
      }
      batch.set(itemRef, itemPayload);
    });

    try {
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${orderId}`);
    }

    return {
      id: orderId,
      orderNumber,
      ownerId: params.user.uid,
      customerName,
      customerPhone,
      pickupSlot,
      paymentMethod: params.paymentMethod,
      paymentStatus,
      stage: 'received',
      estimatedMinutesRemaining: estimation.estimatedMinutesRemaining,
      estimatedReadyLabel: estimation.estimatedReadyLabel,
      totalCents,
      itemCount,
      itemsSummary,
      notes: notes.length > 0 ? notes : undefined,
      createdAtMs: Date.now(),
      updatedAtMs: Date.now(),
      source: 'firestore',
    };
  }

  // Local persistence mode (for immediate storefront usage without Google sign-in)
  const localOrder: OrderRecord = {
    id: orderId,
    orderNumber,
    ownerId: 'demo-local',
    customerName,
    customerPhone,
    pickupSlot,
    paymentMethod: params.paymentMethod,
    paymentStatus,
    stage: 'received',
    estimatedMinutesRemaining: estimation.estimatedMinutesRemaining,
    estimatedReadyLabel: estimation.estimatedReadyLabel,
    totalCents,
    itemCount,
    itemsSummary,
    notes: notes.length > 0 ? notes : undefined,
    createdAtMs: Date.now(),
    updatedAtMs: Date.now(),
    source: 'local',
  };
  const existing = loadLocalOrders();
  const next = [localOrder, ...existing];
  saveLocalOrders(next);
  return localOrder;
}

export async function advanceOrderStage(
  order: OrderRecord,
  user: User | null
): Promise<OrderRecord | null> {
  const nextStage = getNextStage(order.stage);
  if (!nextStage) return null;

  const estimation = computeStageEstimation(nextStage, order.pickupSlot, new Date());
  const nextPaymentStatus: PaymentStatus =
    nextStage === 'picked_up' ? 'paid' : order.paymentStatus;

  if (order.source === 'firestore' && user && isUserAdmin(user)) {
    const orderRef = doc(db, 'orders', order.id);
    try {
      await updateDoc(orderRef, {
        stage: nextStage,
        estimatedMinutesRemaining: estimation.estimatedMinutesRemaining,
        estimatedReadyLabel: estimation.estimatedReadyLabel.slice(0, 40),
        paymentStatus: nextPaymentStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${order.id}`);
    }
    return {
      ...order,
      stage: nextStage,
      estimatedMinutesRemaining: estimation.estimatedMinutesRemaining,
      estimatedReadyLabel: estimation.estimatedReadyLabel,
      paymentStatus: nextPaymentStatus,
      updatedAtMs: Date.now(),
    };
  }

  // Local order update
  const updated: OrderRecord = {
    ...order,
    stage: nextStage,
    estimatedMinutesRemaining: estimation.estimatedMinutesRemaining,
    estimatedReadyLabel: estimation.estimatedReadyLabel,
    paymentStatus: nextPaymentStatus,
    updatedAtMs: Date.now(),
  };
  const existing = loadLocalOrders();
  const next = existing.map((o) => (o.id === order.id ? updated : o));
  saveLocalOrders(next);
  return updated;
}

export async function markOrderPaidInStore(
  order: OrderRecord,
  user: User | null
): Promise<OrderRecord> {
  if (order.source === 'firestore' && user && isUserAdmin(user)) {
    const orderRef = doc(db, 'orders', order.id);
    try {
      await updateDoc(orderRef, {
        paymentStatus: 'paid',
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${order.id}`);
    }
  } else {
    const existing = loadLocalOrders();
    const next = existing.map((o) =>
      o.id === order.id ? { ...o, paymentStatus: 'paid' as const, updatedAtMs: Date.now() } : o
    );
    saveLocalOrders(next);
  }
  return { ...order, paymentStatus: 'paid', updatedAtMs: Date.now() };
}
