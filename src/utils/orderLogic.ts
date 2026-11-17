import {
  BLUEPRINT_LIMITS,
  CartItem,
  OrderStage,
  PaymentMethod,
  SHOP_CONTACT,
} from '../types';

export interface StageDefinition {
  id: OrderStage;
  stepNumber: number;
  label: string;
  shortLabel: string;
  description: string;
  defaultMinutesRemaining: number;
}

export const ORDER_STAGES: readonly StageDefinition[] = [
  {
    id: 'received',
    stepNumber: 1,
    label: 'Commande reçue',
    shortLabel: 'Reçue',
    description: 'Votre précommande est enregistrée et transmise à l’équipe.',
    defaultMinutesRemaining: 22,
  },
  {
    id: 'preparing',
    stepNumber: 2,
    label: 'En préparation',
    shortLabel: 'Préparation',
    description: 'Pétrissage du pain, montage des tacos ou préparation de votre sachet.',
    defaultMinutesRemaining: 15,
  },
  {
    id: 'baking',
    stepNumber: 3,
    label: 'Au four & cuisson',
    shortLabel: 'Cuisson',
    description: 'Cuisson dorée au fournil ou passage au grill en cours.',
    defaultMinutesRemaining: 8,
  },
  {
    id: 'packing',
    stepNumber: 4,
    label: 'Emballage & contrôle',
    shortLabel: 'Emballage',
    description: 'Vérification des articles, boissons fraîches et confiseries.',
    defaultMinutesRemaining: 3,
  },
  {
    id: 'ready',
    stepNumber: 5,
    label: 'Prête au retrait',
    shortLabel: 'Prête',
    description: 'Votre commande vous attend au comptoir.',
    defaultMinutesRemaining: 0,
  },
  {
    id: 'picked_up',
    stepNumber: 6,
    label: 'Retirée',
    shortLabel: 'Retirée',
    description: 'Commande remise en main propre. Merci et bonne dégustation !',
    defaultMinutesRemaining: 0,
  },
] as const;

export const PICKUP_SLOTS: readonly { id: string; label: string; baseMinutes: number }[] = [
  { id: 'asap', label: 'Dès que possible (~20 min)', baseMinutes: 20 },
  { id: 'batch_0730', label: 'Fournée du matin · 07h30', baseMinutes: 25 },
  { id: 'batch_1200', label: 'Fournée du midi · 12h00', baseMinutes: 25 },
  { id: 'batch_1700', label: 'Fournée du goûter · 17h00', baseMinutes: 25 },
  { id: 'batch_1930', label: 'Service du soir · 19h30', baseMinutes: 25 },
];

export function formatEuro(cents: number): string {
  const euros = cents / 100;
  return (
    euros.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' €'
  );
}

export function formatFrenchTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}h${minutes}`;
}

export function getStageDefinition(stage: OrderStage): StageDefinition {
  return ORDER_STAGES.find((s) => s.id === stage) ?? ORDER_STAGES[0];
}

export function getNextStage(stage: OrderStage): OrderStage | null {
  const idx = ORDER_STAGES.findIndex((s) => s.id === stage);
  if (idx === -1 || idx >= ORDER_STAGES.length - 1) {
    return null;
  }
  return ORDER_STAGES[idx + 1].id;
}

export function computeStageEstimation(
  stage: OrderStage,
  pickupSlot: string,
  now: Date = new Date(),
  maxItemPrepMinutes = 18
): {
  estimatedMinutesRemaining: number;
  estimatedReadyLabel: string;
  progressPercent: number;
} {
  const def = getStageDefinition(stage);
  const progressPercent = Math.round(((def.stepNumber - 1) / (ORDER_STAGES.length - 2)) * 100);
  const clampedProgress = Math.max(0, Math.min(100, progressPercent));

  if (stage === 'ready') {
    return {
      estimatedMinutesRemaining: 0,
      estimatedReadyLabel: 'Disponible maintenant',
      progressPercent: 100,
    };
  }
  if (stage === 'picked_up') {
    return {
      estimatedMinutesRemaining: 0,
      estimatedReadyLabel: 'Commande retirée',
      progressPercent: 100,
    };
  }

  let minutes = def.defaultMinutesRemaining;
  if (stage === 'received') {
    minutes = Math.max(12, Math.min(45, maxItemPrepMinutes + 4));
  }

  // If user selected a specific future batch slot (e.g. "Fournée du matin · 07h30"), keep it visible
  const readyDate = new Date(now.getTime() + minutes * 60_000);
  const clockLabel = `Vers ${formatFrenchTime(readyDate)}`;

  if (pickupSlot.includes('07h30') && stage === 'received') {
    return {
      estimatedMinutesRemaining: minutes,
      estimatedReadyLabel: 'Fournée 07h30',
      progressPercent: clampedProgress,
    };
  }
  if (pickupSlot.includes('12h00') && stage === 'received') {
    return {
      estimatedMinutesRemaining: minutes,
      estimatedReadyLabel: 'Fournée 12h00',
      progressPercent: clampedProgress,
    };
  }
  if (pickupSlot.includes('17h00') && stage === 'received') {
    return {
      estimatedMinutesRemaining: minutes,
      estimatedReadyLabel: 'Fournée 17h00',
      progressPercent: clampedProgress,
    };
  }
  if (pickupSlot.includes('19h30') && stage === 'received') {
    return {
      estimatedMinutesRemaining: minutes,
      estimatedReadyLabel: 'Service 19h30',
      progressPercent: clampedProgress,
    };
  }

  return {
    estimatedMinutesRemaining: minutes,
    estimatedReadyLabel: clockLabel,
    progressPercent: clampedProgress,
  };
}

export function generateOrderNumber(seed?: number): string {
  const num = seed ?? Math.floor(1000 + Math.random() * 8999);
  const normalized = String(Math.abs(Math.floor(num))).slice(0, 6).padStart(4, '0');
  return `CD-${normalized}`;
}

export function calculateCartTotals(items: readonly CartItem[]): {
  totalCents: number;
  itemCount: number;
  maxPrepMinutes: number;
} {
  let totalCents = 0;
  let itemCount = 0;
  let maxPrepMinutes = 10;

  for (const item of items) {
    totalCents += item.unitPriceCents * item.quantity;
    itemCount += item.quantity;
    if (item.prepMinutes > maxPrepMinutes) {
      maxPrepMinutes = item.prepMinutes;
    }
  }

  return { totalCents, itemCount, maxPrepMinutes };
}

export function buildItemsSummary(items: readonly CartItem[]): string {
  const raw = items
    .map((item) => {
      const opt = item.optionsLabel ? ` (${item.optionsLabel})` : '';
      return `${item.quantity}x ${item.name}${opt}`;
    })
    .join(', ');

  if (raw.length <= BLUEPRINT_LIMITS.itemsSummaryMax) {
    return raw;
  }
  return raw.slice(0, BLUEPRINT_LIMITS.itemsSummaryMax - 1).trimEnd() + '…';
}

export interface CheckoutValidationResult {
  valid: boolean;
  errors: {
    customerName?: string;
    customerPhone?: string;
    pickupSlot?: string;
    notes?: string;
    cart?: string;
  };
}

export function validateCheckoutInput(input: {
  customerName: string;
  customerPhone: string;
  pickupSlot: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  items: readonly CartItem[];
}): CheckoutValidationResult {
  const errors: CheckoutValidationResult['errors'] = {};
  const name = input.customerName.trim();
  const phone = input.customerPhone.trim();
  const slot = input.pickupSlot.trim();
  const notes = (input.notes ?? '').trim();

  if (input.items.length === 0) {
    errors.cart = 'Votre panier est vide. Ajoutez au moins un article avant de précommander.';
  }

  if (
    name.length < BLUEPRINT_LIMITS.customerNameMin ||
    name.length > BLUEPRINT_LIMITS.customerNameMax
  ) {
    errors.customerName = 'Veuillez saisir un nom complet (2 à 80 caractères).';
  }

  if (
    phone.length < BLUEPRINT_LIMITS.customerPhoneMin ||
    phone.length > BLUEPRINT_LIMITS.customerPhoneMax ||
    !BLUEPRINT_LIMITS.phonePattern.test(phone)
  ) {
    errors.customerPhone = 'Numéro de téléphone invalide (ex. 06 12 34 56 78).';
  }

  if (
    slot.length < BLUEPRINT_LIMITS.pickupSlotMin ||
    slot.length > BLUEPRINT_LIMITS.pickupSlotMax
  ) {
    errors.pickupSlot = 'Veuillez sélectionner un créneau de retrait.';
  }

  if (notes.length > BLUEPRINT_LIMITS.notesMax) {
    errors.notes = 'Les précisions ne peuvent pas dépasser 240 caractères.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${SHOP_CONTACT.whatsappIntl}`;
  if (!message || message.trim().length === 0) {
    return `${base}?text=${encodeURIComponent(
      'Bonjour Le Comptoir Doré, je souhaite un renseignement concernant une précommande.'
    )}`;
  }
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

export function buildOrderWhatsAppMessage(order: {
  orderNumber: string;
  customerName: string;
  pickupSlot: string;
  itemsSummary: string;
  totalCents: number;
  paymentMethod: PaymentMethod;
}): string {
  const paymentLabel =
    order.paymentMethod === 'online' ? 'Payée en ligne' : 'Paiement en boutique au retrait';
  return [
    `Bonjour Le Comptoir Doré !`,
    `Commande ${order.orderNumber} (${order.customerName})`,
    `Articles : ${order.itemsSummary}`,
    `Retrait : ${order.pickupSlot}`,
    `Total : ${formatEuro(order.totalCents)} (${paymentLabel})`,
  ].join('\n');
}
