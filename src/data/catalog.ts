import { OrderRecord, Product } from '../types';

export const HERO_IMAGE_URL =
  '/src/assets/images/hero_confiserie_snacks_1794939539580.jpg';

const IMG_VIENNOISERIES = '/src/assets/images/cat_viennoiseries_1794938992559.jpg';
const IMG_TACOS = '/src/assets/images/cat_french_tacos_1794938993709.jpg';
const IMG_SNACKS = '/src/assets/images/cat_chips_snacks_1794938994097.jpg';
const IMG_BONBONS = '/src/assets/images/cat_bonbons_confiseries_1794938995033.jpg';

export const CATEGORY_TABS: readonly { id: 'all' | Product['category']; label: string }[] = [
  { id: 'all', label: 'Toute la boutique' },
  { id: 'tacos', label: 'Tacos Maison' },
  { id: 'snacks', label: 'Chips & Snacks' },
  { id: 'bonbons', label: 'Bonbons & Confiseries' },
  { id: 'viennoiseries', label: 'Viennoiseries & Goûters' },
];

export const CATALOG_PRODUCTS: readonly Product[] = [
  {
    id: 'menu-tacos-boisson',
    name: 'Menu Tacos + Frites + Boisson',
    category: 'tacos',
    categoryLabel: 'Tacos Maison',
    description:
      'Tacos M garni au grill, barquette de frites croustillantes sauce cheddar et boisson fraîche 33 cl.',
    priceCents: 950,
    originalPriceCents: 1150,
    promoLabel: 'Combo du jour · -2,00 €',
    isDailyOffer: true,
    imageUrl: IMG_TACOS,
    isPreorderFresh: false,
    batchInfo: 'Service midi, sortie d’école & soir',
    prepMinutes: 15,
    optionGroup: {
      label: 'Viande principale',
      choices: [
        { id: 'tenders', label: 'Tenders croustillants', extraCents: 0 },
        { id: 'viande-hachee', label: 'Bœuf grillé', extraCents: 0 },
        { id: 'falafel', label: 'Option végétarienne falafel', extraCents: 0 },
      ],
    },
  },
  {
    id: 'pack-sortie-ecole',
    name: 'Formule Sortie d’École : Chips + Bonbons + Soda',
    category: 'snacks',
    categoryLabel: 'Chips & Snacks',
    description:
      '1 paquet de chips artisanales 150g, 1 sachet de bonbons 150g au choix et 1 boisson bien fraîche.',
    priceCents: 690,
    originalPriceCents: 880,
    promoLabel: 'Formule goûter · -1,90 €',
    isDailyOffer: true,
    imageUrl: IMG_SNACKS,
    isPreorderFresh: false,
    batchInfo: 'Prêt en 5 min',
    prepMinutes: 5,
    optionGroup: {
      label: 'Choix des bonbons & chips',
      choices: [
        { id: 'acidule-sel', label: 'Bonbons acidulés · Chips sel de mer', extraCents: 0 },
        { id: 'doux-paprika', label: 'Bonbons doux · Chips paprika fumé', extraCents: 0 },
      ],
    },
  },
  {
    id: 'box-gouter-viennoiseries',
    name: 'Box Goûter : 4 Viennoiseries + Bonbons',
    category: 'viennoiseries',
    categoryLabel: 'Viennoiseries & Goûters',
    description:
      '2 croissants pur beurre, 2 pains au chocolat tièdes et un mini sachet de douceurs pour le goûter.',
    priceCents: 790,
    originalPriceCents: 990,
    promoLabel: 'Offre -20 %',
    isDailyOffer: true,
    imageUrl: IMG_VIENNOISERIES,
    isPreorderFresh: true,
    batchInfo: 'Chaudes pour 16h30 · 17h30',
    prepMinutes: 14,
  },
  {
    id: 'tacos-maison-classique',
    name: 'French Tacos Grillé',
    category: 'tacos',
    categoryLabel: 'Tacos Maison',
    description:
      'Tortilla pressée au grill, frites dorées, sauce fromagère maison et viande marinée au choix.',
    priceCents: 850,
    imageUrl: IMG_TACOS,
    isPreorderFresh: false,
    batchInfo: 'Préparé à la minute',
    prepMinutes: 14,
    optionGroup: {
      label: 'Format & Sauce',
      choices: [
        { id: 'm-algerienne', label: 'Taille M · Poulet · Algérienne', extraCents: 0 },
        { id: 'm-samourai', label: 'Taille M · Cordon Bleu · Samouraï', extraCents: 0 },
        { id: 'l-double', label: 'Taille L (2 viandes) · Biggy', extraCents: 250 },
      ],
    },
  },
  {
    id: 'sachet-bonbons-acidules',
    name: 'Sachet Bonbons Acidulés (250g)',
    category: 'bonbons',
    categoryLabel: 'Bonbons & Confiseries',
    description:
      'Langues arc-en-ciel sucrées, bouteilles cola piquantes et fraises tendres préparés à la pelle.',
    priceCents: 390,
    imageUrl: IMG_BONBONS,
    isPreorderFresh: false,
    batchInfo: 'Pesé à la demande',
    prepMinutes: 5,
    optionGroup: {
      label: 'Mélange',
      choices: [
        { id: 'acidule', label: '100 % Acidulé', extraCents: 0 },
        { id: 'doux', label: 'Doux & Fruités', extraCents: 0 },
        { id: 'mixte', label: 'Mélange du Comptoir', extraCents: 0 },
      ],
    },
  },
  {
    id: 'pates-fruits-nougat',
    name: 'Assortiment Pâtes de Fruits & Nougat',
    category: 'bonbons',
    categoryLabel: 'Bonbons & Confiseries',
    description:
      'Confiseries françaises à l’ancienne aux fruits du verger et nougat tendre aux amandes.',
    priceCents: 560,
    imageUrl: IMG_BONBONS,
    isPreorderFresh: false,
    batchInfo: 'En bocaux au comptoir',
    prepMinutes: 5,
  },
  {
    id: 'chips-artisanales-mer',
    name: 'Chips Craquantes au Sel de Mer',
    category: 'snacks',
    categoryLabel: 'Chips & Snacks',
    description:
      'Pommes de terre tranchées épaisses cuites au chaudron, paquet 150g à partager entre amis.',
    priceCents: 290,
    imageUrl: IMG_SNACKS,
    isPreorderFresh: false,
    batchInfo: 'En rayon',
    prepMinutes: 5,
    optionGroup: {
      label: 'Saveur',
      choices: [
        { id: 'sel-mer', label: 'Sel de Guérande', extraCents: 0 },
        { id: 'poivre', label: 'Poivre noir concassé', extraCents: 0 },
        { id: 'paprika', label: 'Paprika fumé', extraCents: 0 },
      ],
    },
  },
  {
    id: 'coffret-snack-boisson',
    name: 'Duo Chips & Soda Artisanal Frais',
    category: 'snacks',
    categoryLabel: 'Chips & Snacks',
    description:
      'Un grand sachet de chips au choix accompagné d’une bouteille fraîche de limonade ou cola.',
    priceCents: 490,
    imageUrl: IMG_SNACKS,
    isPreorderFresh: false,
    batchInfo: 'Sorti du frigo',
    prepMinutes: 5,
  },
  {
    id: 'croissant-beurre-aop',
    name: 'Croissant Pur Beurre AOP',
    category: 'viennoiseries',
    categoryLabel: 'Viennoiseries & Goûters',
    description:
      'Feuilletage aérien au beurre Charentes-Poitou, réchauffé à la demande pour le goûter.',
    priceCents: 145,
    imageUrl: IMG_VIENNOISERIES,
    isPreorderFresh: true,
    batchInfo: 'Disponible dès 10h00 & 16h30',
    prepMinutes: 12,
  },
  {
    id: 'pain-chocolat-maison',
    name: 'Pain au Chocolat Artisanal',
    category: 'viennoiseries',
    categoryLabel: 'Viennoiseries & Goûters',
    description:
      'Deux barres de chocolat noir 70 % enveloppées dans une pâte feuilletée tiède et fondante.',
    priceCents: 155,
    imageUrl: IMG_VIENNOISERIES,
    isPreorderFresh: true,
    batchInfo: 'Disponible dès 10h00 & 16h30',
    prepMinutes: 12,
  },
  {
    id: 'coffret-matin-6',
    name: 'Coffret Goûter 6 Viennoiseries',
    category: 'viennoiseries',
    categoryLabel: 'Viennoiseries & Goûters',
    description:
      '3 croissants pur beurre et 3 pains au chocolat tout juste tiédis pour partager après les cours.',
    priceCents: 840,
    imageUrl: IMG_VIENNOISERIES,
    isPreorderFresh: true,
    batchInfo: 'Réservé sur créneau',
    prepMinutes: 15,
  },
];

export const DAILY_OFFERS: readonly Product[] = CATALOG_PRODUCTS.filter(
  (p) => p.isDailyOffer
);

export const SEED_DEMO_ORDERS: readonly OrderRecord[] = [
  {
    id: 'demo-cd-1042',
    orderNumber: 'CD-1042',
    ownerId: 'demo-local',
    customerName: 'Sophie Moreau',
    customerPhone: '06 48 12 90 33',
    pickupSlot: 'Dès que possible (~15 min)',
    paymentMethod: 'online',
    paymentStatus: 'paid',
    stage: 'baking',
    estimatedMinutesRemaining: 8,
    estimatedReadyLabel: (() => {
      const d = new Date(Date.now() + 8 * 60_000);
      return `Vers ${String(d.getHours()).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')}`;
    })(),
    totalCents: 1340,
    itemCount: 2,
    itemsSummary: '1x Menu Tacos + Frites + Boisson (Tenders croustillants), 1x Sachet Bonbons Acidulés (250g)',
    notes: 'Tacos bien grillé et boisson bien fraîche svp.',
    createdAtMs: Date.now() - 12 * 60_000,
    updatedAtMs: Date.now() - 2 * 60_000,
    source: 'local',
  },
  {
    id: 'demo-cd-1039',
    orderNumber: 'CD-1039',
    ownerId: 'demo-local',
    customerName: 'Lucas Bernard',
    customerPhone: '07 81 55 24 19',
    pickupSlot: 'Sortie d’école · 16h30',
    paymentMethod: 'in_store',
    paymentStatus: 'pending_pickup',
    stage: 'ready',
    estimatedMinutesRemaining: 0,
    estimatedReadyLabel: 'Disponible maintenant',
    totalCents: 1080,
    itemCount: 2,
    itemsSummary: '1x Formule Sortie d’École : Chips + Bonbons + Soda, 1x Sachet Bonbons Acidulés (250g)',
    createdAtMs: Date.now() - 28 * 60_000,
    updatedAtMs: Date.now() - 1 * 60_000,
    source: 'local',
  },
];
