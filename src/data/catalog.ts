import { OrderRecord, Product } from '../types';

export const HERO_IMAGE_URL =
  '/src/assets/images/hero_boulangerie_comptoir_1794938993753.jpg';

const IMG_PAINS = '/src/assets/images/cat_pains_baguettes_1794938993059.jpg';
const IMG_VIENNOISERIES = '/src/assets/images/cat_viennoiseries_1794938992559.jpg';
const IMG_TACOS = '/src/assets/images/cat_french_tacos_1794938993709.jpg';
const IMG_SNACKS = '/src/assets/images/cat_chips_snacks_1794938994097.jpg';
const IMG_BONBONS = '/src/assets/images/cat_bonbons_confiseries_1794938995033.jpg';

export const CATEGORY_TABS: readonly { id: 'all' | Product['category']; label: string }[] = [
  { id: 'all', label: 'Toute la boutique' },
  { id: 'pains', label: 'Pains & Baguettes' },
  { id: 'viennoiseries', label: 'Viennoiseries' },
  { id: 'tacos', label: 'Tacos Maison' },
  { id: 'snacks', label: 'Chips & Snacks' },
  { id: 'bonbons', label: 'Bonbons & Confiseries' },
];

export const CATALOG_PRODUCTS: readonly Product[] = [
  {
    id: 'baguette-tradition',
    name: 'Baguette de Tradition',
    category: 'pains',
    categoryLabel: 'Pains & Baguettes',
    description:
      'Farine Label Rouge, fermentation lente au levain naturel et croûte fine croustillante.',
    priceCents: 135,
    imageUrl: IMG_PAINS,
    isPreorderFresh: true,
    batchInfo: 'Fournées 07h30 · 12h00 · 17h00',
    prepMinutes: 18,
    badgeText: 'Précommande fournil',
    optionGroup: {
      label: 'Cuisson',
      choices: [
        { id: 'doree', label: 'Dorée classique', extraCents: 0 },
        { id: 'bien-cuite', label: 'Bien cuite', extraCents: 0 },
        { id: 'peu-cuite', label: 'Blonde moelleuse', extraCents: 0 },
      ],
    },
  },
  {
    id: 'pain-campagne-levain',
    name: 'Miche de Campagne au Levain',
    category: 'pains',
    categoryLabel: 'Pains & Baguettes',
    description:
      'Pain de 600g à la mie alvéolée et aux notes toastées, idéal pour accompagner vos repas.',
    priceCents: 380,
    imageUrl: IMG_PAINS,
    isPreorderFresh: true,
    batchInfo: 'Fournées 07h30 · 17h00',
    prepMinutes: 22,
    badgeText: 'Précommande fournil',
    optionGroup: {
      label: 'Découpe',
      choices: [
        { id: 'entier', label: 'Pain entier', extraCents: 0 },
        { id: 'tranche', label: 'Tranché sur place', extraCents: 0 },
      ],
    },
  },
  {
    id: 'croissant-beurre-aop',
    name: 'Croissant Pur Beurre AOP',
    category: 'viennoiseries',
    categoryLabel: 'Viennoiseries',
    description:
      'Feuilletage aérien au beurre Charentes-Poitou, doré au four chaque matin dès l’aube.',
    priceCents: 145,
    imageUrl: IMG_VIENNOISERIES,
    isPreorderFresh: true,
    batchInfo: 'Sortie du four 07h30 · 10h00',
    prepMinutes: 15,
    badgeText: 'Fournée du jour',
  },
  {
    id: 'pain-chocolat-maison',
    name: 'Pain au Chocolat Artisanal',
    category: 'viennoiseries',
    categoryLabel: 'Viennoiseries',
    description:
      'Deux barres de chocolat noir 70 % enveloppées dans une pâte feuilletée tiède et fondante.',
    priceCents: 155,
    imageUrl: IMG_VIENNOISERIES,
    isPreorderFresh: true,
    batchInfo: 'Sortie du four 07h30 · 10h00',
    prepMinutes: 15,
    badgeText: 'Fournée du jour',
  },
  {
    id: 'coffret-matin-6',
    name: 'Assortiment Petit-Déjeuner (6 pièces)',
    category: 'viennoiseries',
    categoryLabel: 'Viennoiseries',
    description:
      '3 croissants pur beurre et 3 pains au chocolat tout juste sortis du four pour la famille.',
    priceCents: 840,
    imageUrl: IMG_VIENNOISERIES,
    isPreorderFresh: true,
    batchInfo: 'Réservé sur créneau',
    prepMinutes: 18,
    badgeText: 'Offre fournil',
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
    badgeText: 'Chaud à la commande',
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
    id: 'menu-tacos-boisson',
    name: 'Menu Tacos + Frites + Boisson',
    category: 'tacos',
    categoryLabel: 'Tacos Maison',
    description:
      'Tacos M garni, barquette de frites croustillantes sauce cheddar et boisson fraîche 33 cl.',
    priceCents: 1150,
    imageUrl: IMG_TACOS,
    isPreorderFresh: false,
    batchInfo: 'Service midi & soir',
    prepMinutes: 16,
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
    id: 'chips-artisanales-mer',
    name: 'Chips Craquantes au Sel de Mer',
    category: 'snacks',
    categoryLabel: 'Chips & Snacks',
    description:
      'Pommes de terre tranchées épaisses cuites au chaudron, paquet 150g à partager.',
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
    id: 'sachet-bonbons-acidules',
    name: 'Sachet Bonbons Acidulés (250g)',
    category: 'bonbons',
    categoryLabel: 'Bonbons & Confiseries',
    description:
      'Langues arc-en-ciel sucrées, bouteilles cola piquantes et fraises tendres préparés en sachet.',
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
];

export const SEED_DEMO_ORDERS: readonly OrderRecord[] = [
  {
    id: 'demo-cd-1042',
    orderNumber: 'CD-1042',
    ownerId: 'demo-local',
    customerName: 'Sophie Moreau',
    customerPhone: '06 48 12 90 33',
    pickupSlot: 'Dès que possible (~20 min)',
    paymentMethod: 'online',
    paymentStatus: 'paid',
    stage: 'baking',
    estimatedMinutesRemaining: 8,
    estimatedReadyLabel: (() => {
      const d = new Date(Date.now() + 8 * 60_000);
      return `Vers ${String(d.getHours()).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')}`;
    })(),
    totalCents: 1125,
    itemCount: 3,
    itemsSummary: '2x Baguette de Tradition (Dorée classique), 1x French Tacos Grillé',
    notes: 'Baguettes bien dorées s’il vous plaît.',
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
    pickupSlot: 'Fournée du goûter · 17h00',
    paymentMethod: 'in_store',
    paymentStatus: 'pending_pickup',
    stage: 'ready',
    estimatedMinutesRemaining: 0,
    estimatedReadyLabel: 'Disponible maintenant',
    totalCents: 1230,
    itemCount: 2,
    itemsSummary: '1x Assortiment Petit-Déjeuner (6 pièces), 1x Sachet Bonbons Acidulés (250g)',
    createdAtMs: Date.now() - 28 * 60_000,
    updatedAtMs: Date.now() - 1 * 60_000,
    source: 'local',
  },
];
