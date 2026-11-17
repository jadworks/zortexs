import { useCallback, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import {
  CartItem,
  CategoryId,
  LegalDocType,
  NotificationToast,
  OrderRecord,
  OrderStage,
  PaymentMethod,
  Product,
} from './types';
import { calculateCartTotals, getStageDefinition } from './utils/orderLogic';
import {
  getNotificationPermissionState,
  playSoftNotificationChime,
  PushPermissionState,
  requestBrowserNotificationPermission,
  triggerBrowserPushNotification,
} from './utils/notifications';
import {
  advanceOrderStage,
  createPreOrder,
  loadLocalOrders,
  markOrderPaidInStore,
  subscribeFirestoreOrders,
} from './services/orderService';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CatalogSection } from './components/CatalogSection';
import { OrderTrackingSection } from './components/OrderTrackingSection';
import { CartCheckoutDrawer } from './components/CartCheckoutDrawer';
import { LegalModal } from './components/LegalModal';
import { Footer } from './components/Footer';
import { ToastStack } from './components/ToastStack';

const CART_STORAGE_KEY = 'le_comptoir_dore_cart_v1';

function loadInitialCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [cart, setCart] = useState<CartItem[]>(loadInitialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>(loadLocalOrders);
  const [kitchenMode, setKitchenMode] = useState(false);
  const [pushPermission, setPushPermission] = useState<PushPermissionState>(
    getNotificationPermissionState
  );
  const [legalDoc, setLegalDoc] = useState<LegalDocType | null>(null);
  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  const previousStagesRef = useRef<Record<string, OrderStage>>({});

  const pushToast = useCallback((title: string, body: string, orderNumber?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [{ id, title, body, orderNumber, createdAtMs: Date.now() }, ...prev].slice(0, 4));
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  }, []);

  const notifyOrderChange = useCallback(
    (order: OrderRecord) => {
      const stageDef = getStageDefinition(order.stage);
      const title = `Commande ${order.orderNumber} · ${stageDef.label}`;
      const body =
        order.estimatedMinutesRemaining > 0
          ? `${stageDef.description} (${order.estimatedReadyLabel})`
          : stageDef.description;

      pushToast(title, body, order.orderNumber);
      triggerBrowserPushNotification(title, body);
      playSoftNotificationChime();
    },
    [pushToast]
  );

  // Save cart to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage errors
    }
  }, [cart]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Subscribe to Firestore orders ONLY when authenticated & email verified
  useEffect(() => {
    if (!user || !user.emailVerified) {
      setOrders(loadLocalOrders());
      return;
    }

    const unsub = subscribeFirestoreOrders(user, (remoteOrders) => {
      const merged = remoteOrders.length > 0 ? remoteOrders : loadLocalOrders();
      merged.forEach((ord) => {
        const prevStage = previousStagesRef.current[ord.id];
        if (prevStage && prevStage !== ord.stage) {
          notifyOrderChange(ord);
        }
        previousStagesRef.current[ord.id] = ord.stage;
      });
      setOrders(merged);
    });

    return () => unsub();
  }, [user, notifyOrderChange]);

  const handleAddToCart = (product: Product, selectedChoiceId?: string) => {
    const choice = product.optionGroup?.choices.find((c) => c.id === selectedChoiceId);
    const cartKey = choice ? `${product.id}__${choice.id}` : product.id;
    const unitPriceCents = product.priceCents + (choice?.extraCents ?? 0);

    setCart((prev) => {
      const existing = prev.find((i) => i.cartKey === cartKey);
      if (existing) {
        return prev.map((i) =>
          i.cartKey === cartKey ? { ...i, quantity: Math.min(50, i.quantity + 1) } : i
        );
      }
      return [
        ...prev,
        {
          cartKey,
          productId: product.id,
          name: product.name,
          category: product.category,
          unitPriceCents,
          quantity: 1,
          optionsLabel: choice?.label,
          imageUrl: product.imageUrl,
          isPreorderFresh: product.isPreorderFresh,
          prepMinutes: product.prepMinutes,
        },
      ];
    });
  };

  const handleUpdateQty = (cartKey: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.cartKey === cartKey ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const handleRemoveItem = (cartKey: string) => {
    setCart((prev) => prev.filter((i) => i.cartKey !== cartKey));
  };

  const handleSubmitOrder = async (payload: {
    customerName: string;
    customerPhone: string;
    pickupSlot: string;
    paymentMethod: PaymentMethod;
    notes: string;
  }) => {
    const created = await createPreOrder({
      user,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      pickupSlot: payload.pickupSlot,
      paymentMethod: payload.paymentMethod,
      notes: payload.notes,
      items: cart,
    });

    previousStagesRef.current[created.id] = created.stage;
    if (created.source === 'local') {
      setOrders((prev) => [created, ...prev]);
    }
    setCart([]);
    setIsCartOpen(false);
    notifyOrderChange(created);

    const suiviEl = document.getElementById('suivi');
    if (suiviEl) {
      suiviEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEnablePush = async () => {
    const state = await requestBrowserNotificationPermission();
    setPushPermission(state);
    if (state === 'granted') {
      triggerBrowserPushNotification(
        'Notifications activées · Le Comptoir Doré',
        'Vous recevrez une alerte dès que votre pain ou tacos change d’étape.'
      );
      pushToast(
        'Notifications push activées',
        'Vous serez alerté en direct à chaque étape de préparation.'
      );
    } else {
      pushToast(
        'Alertes en direct actives dans la page',
        'Les notifications du navigateur sont indisponibles ou bloquées, mais les alertes visuelles restent actives ici.'
      );
    }
  };

  const handleTestPush = () => {
    const sample = orders[0];
    if (sample) {
      notifyOrderChange(sample);
    } else {
      const title = 'Le Comptoir Doré · Test de notification';
      const body = 'Votre fournée de baguettes est au four — prête dans environ 8 minutes.';
      triggerBrowserPushNotification(title, body);
      pushToast(title, body);
      playSoftNotificationChime();
    }
  };

  const handleAdvanceStage = async (order: OrderRecord) => {
    const updated = await advanceOrderStage(order, user);
    if (!updated) return;
    previousStagesRef.current[updated.id] = updated.stage;
    if (updated.source === 'local') {
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    }
    notifyOrderChange(updated);
  };

  const handleMarkPaid = async (order: OrderRecord) => {
    const updated = await markOrderPaidInStore(order, user);
    if (updated.source === 'local') {
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    }
    pushToast(
      `Paiement encaissé · ${updated.orderNumber}`,
      'Le règlement en boutique a bien été enregistré.'
    );
  };

  const handleSignInGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      pushToast('Connexion réussie', 'Vos précommandes sont maintenant synchronisées avec votre compte.');
    } catch {
      pushToast(
        'Connexion annulée',
        'Vous pouvez continuer à précommander sans compte ou réessayer plus tard.'
      );
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    pushToast('Déconnexion effectuée', 'Retour au mode local sur cet appareil.');
  };

  const { itemCount } = calculateCartTotals(cart);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900">
      <Header cartCount={itemCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1">
        <HeroSection onSelectBreadCategory={() => setActiveCategory('pains')} />

        <CatalogSection
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onAddToCart={handleAddToCart}
        />

        <OrderTrackingSection
          orders={orders}
          user={user}
          authLoading={authLoading}
          pushPermission={pushPermission}
          kitchenMode={kitchenMode}
          onToggleKitchenMode={() => setKitchenMode((v) => !v)}
          onEnablePush={handleEnablePush}
          onTestPush={handleTestPush}
          onAdvanceStage={handleAdvanceStage}
          onMarkPaid={handleMarkPaid}
          onSignInGoogle={handleSignInGoogle}
          onSignOut={handleSignOut}
        />
      </main>

      <Footer onOpenLegal={(doc) => setLegalDoc(doc)} />

      <CartCheckoutDrawer
        isOpen={isCartOpen}
        items={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onSubmitOrder={handleSubmitOrder}
      />

      <LegalModal docType={legalDoc} onClose={() => setLegalDoc(null)} />

      <ToastStack
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}
