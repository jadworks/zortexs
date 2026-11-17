export type CategoryId =
  | 'all'
  | 'tacos'
  | 'snacks'
  | 'bonbons'
  | 'viennoiseries';

export type ProductCategory = Exclude<CategoryId, 'all'>;

export type OrderStage =
  | 'received'
  | 'preparing'
  | 'baking'
  | 'packing'
  | 'ready'
  | 'picked_up';

export type PaymentMethod = 'online' | 'in_store';
export type PaymentStatus = 'paid' | 'pending_pickup';

export type LegalDocType = 'mentions' | 'confidentialite';

export const BLUEPRINT_LIMITS = {
  orderNumberPattern: /^CD-[0-9]{4,8}$/,
  idPattern: /^[a-zA-Z0-9_-]+$/,
  phonePattern: /^[0-9+\s().-]+$/,
  customerNameMin: 2,
  customerNameMax: 80,
  customerPhoneMin: 8,
  customerPhoneMax: 20,
  pickupSlotMin: 3,
  pickupSlotMax: 60,
  itemsSummaryMin: 2,
  itemsSummaryMax: 400,
  notesMax: 240,
  optionsLabelMax: 100,
  maxQuantityPerItem: 50,
} as const;

export const SHOP_CONTACT = {
  name: 'Le Comptoir Doré',
  subtitle: 'Confiserie, Tacos & Snacks de quartier',
  whatsappDisplay: '07 59 80 21 41',
  whatsappRaw: '0759802141',
  whatsappIntl: '33759802141',
  email: 'contact@lecomptoirdore.fr',
  address: '14 Rue de la République, 69002 Lyon',
  hours: 'Ouvert tous les jours · 10h00 – 22h30',
} as const;

export interface ProductOptionGroup {
  label: string;
  choices: {
    id: string;
    label: string;
    extraCents: number;
  }[];
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  description: string;
  priceCents: number;
  originalPriceCents?: number;
  promoLabel?: string;
  isDailyOffer?: boolean;
  imageUrl: string;
  isPreorderFresh: boolean;
  batchInfo?: string;
  prepMinutes: number;
  badgeText?: string;
  optionGroup?: ProductOptionGroup;
}

export interface CartItem {
  cartKey: string;
  productId: string;
  name: string;
  category: ProductCategory;
  unitPriceCents: number;
  quantity: number;
  optionsLabel?: string;
  imageUrl: string;
  isPreorderFresh: boolean;
  prepMinutes: number;
}

export interface OrderItemRecord {
  id?: string;
  orderId: string;
  ownerId: string;
  productId: string;
  name: string;
  category: ProductCategory;
  quantity: number;
  unitPriceCents: number;
  optionsLabel?: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  ownerId: string;
  customerName: string;
  customerPhone: string;
  pickupSlot: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  stage: OrderStage;
  estimatedMinutesRemaining: number;
  estimatedReadyLabel: string;
  totalCents: number;
  itemCount: number;
  itemsSummary: string;
  notes?: string;
  createdAtMs: number;
  updatedAtMs: number;
  source: 'firestore' | 'local';
  items?: OrderItemRecord[];
}

export interface NotificationToast {
  id: string;
  title: string;
  body: string;
  orderNumber?: string;
  createdAtMs: number;
}
