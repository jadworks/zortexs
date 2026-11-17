import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildItemsSummary,
  buildOrderWhatsAppMessage,
  buildWhatsAppUrl,
  calculateCartTotals,
  computeSavingsCents,
  computeStageEstimation,
  formatEuro,
  formatFrenchTime,
  generateOrderNumber,
  getNextStage,
  validateCheckoutInput,
} from './orderLogic';
import { CartItem } from '../types';

const sampleCart: CartItem[] = [
  {
    cartKey: 'sachet-bonbons-acidules__acidule',
    productId: 'sachet-bonbons-acidules',
    name: 'Sachet Bonbons Acidulés (250g)',
    category: 'bonbons',
    unitPriceCents: 390,
    quantity: 2,
    optionsLabel: '100 % Acidulé',
    imageUrl: '/src/assets/images/cat_bonbons_confiseries_1794938995033.jpg',
    isPreorderFresh: false,
    prepMinutes: 5,
  },
  {
    cartKey: 'tacos-m__sauce-algerienne',
    productId: 'tacos-maison-classique',
    name: 'French Tacos Grillé',
    category: 'tacos',
    unitPriceCents: 850,
    quantity: 1,
    optionsLabel: 'Taille M · Poulet · Algérienne',
    imageUrl: '/src/assets/images/cat_french_tacos_1794938993709.jpg',
    isPreorderFresh: false,
    prepMinutes: 14,
  },
];

test('formatEuro formats cents using French decimal comma and euro sign', () => {
  assert.equal(formatEuro(390), '3,90 €');
  assert.equal(formatEuro(1630), '16,30 €');
  assert.equal(formatEuro(0), '0,00 €');
});

test('computeSavingsCents computes combo discount savings safely', () => {
  assert.equal(computeSavingsCents(1150, 950), 200);
  assert.equal(computeSavingsCents(undefined, 950), 0);
  assert.equal(computeSavingsCents(800, 950), 0);
});

test('calculateCartTotals computes total cents, item count, and max prep minutes', () => {
  const totals = calculateCartTotals(sampleCart);
  assert.equal(totals.totalCents, 1630);
  assert.equal(totals.itemCount, 3);
  assert.equal(totals.maxPrepMinutes, 14);
});

test('getNextStage advances cleanly through preparation pipeline and stops at picked_up', () => {
  assert.equal(getNextStage('received'), 'preparing');
  assert.equal(getNextStage('preparing'), 'baking');
  assert.equal(getNextStage('baking'), 'packing');
  assert.equal(getNextStage('packing'), 'ready');
  assert.equal(getNextStage('ready'), 'picked_up');
  assert.equal(getNextStage('picked_up'), null);
});

test('computeStageEstimation computes dynamic clock time and after-school slots', () => {
  const fixedNow = new Date(2026, 10, 17, 14, 10, 0);
  assert.equal(formatFrenchTime(fixedNow), '14h10');

  const bakingEst = computeStageEstimation('baking', 'Dès que possible (~15 min)', fixedNow, 15);
  assert.equal(bakingEst.estimatedMinutesRemaining, 7);
  assert.equal(bakingEst.estimatedReadyLabel, 'Vers 14h17');
  assert.equal(bakingEst.progressPercent, 50);

  const schoolOut = computeStageEstimation('received', 'Sortie d’école · 16h30', fixedNow, 15);
  assert.equal(schoolOut.estimatedReadyLabel, 'Retrait 16h30');

  const readyEst = computeStageEstimation('ready', 'Dès que possible (~15 min)', fixedNow, 15);
  assert.equal(readyEst.estimatedMinutesRemaining, 0);
  assert.equal(readyEst.estimatedReadyLabel, 'Disponible maintenant');
  assert.equal(readyEst.progressPercent, 100);
});

test('generateOrderNumber matches blueprint pattern ^CD-[0-9]{4,8}$', () => {
  const orderNumber = generateOrderNumber(42);
  assert.match(orderNumber, /^CD-[0-9]{4,8}$/);
  assert.equal(orderNumber, 'CD-0042');
});

test('buildItemsSummary summarizes and truncates safely below 400 characters', () => {
  const summary = buildItemsSummary(sampleCart);
  assert.equal(
    summary,
    '2x Sachet Bonbons Acidulés (250g) (100 % Acidulé), 1x French Tacos Grillé (Taille M · Poulet · Algérienne)'
  );
  assert.ok(summary.length <= 400);
});

test('validateCheckoutInput rejects invalid empty fields and accepts valid French input', () => {
  const bad = validateCheckoutInput({
    customerName: 'A',
    customerPhone: '123',
    pickupSlot: '',
    paymentMethod: 'in_store',
    items: [],
  });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.cart);
  assert.ok(bad.errors.customerName);
  assert.ok(bad.errors.customerPhone);
  assert.ok(bad.errors.pickupSlot);

  const good = validateCheckoutInput({
    customerName: 'Camille Laurent',
    customerPhone: '06 12 34 56 78',
    pickupSlot: 'Sortie d’école · 16h30',
    notes: 'Tacos sans oignons svp',
    paymentMethod: 'online',
    items: sampleCart,
  });
  assert.equal(good.valid, true);
});

test('buildWhatsAppUrl encodes French order details targeting 0759802141', () => {
  const msg = buildOrderWhatsAppMessage({
    orderNumber: 'CD-1042',
    customerName: 'Camille Laurent',
    pickupSlot: 'Sortie d’école · 16h30',
    itemsSummary: '2x Sachet Bonbons Acidulés (250g)',
    totalCents: 780,
    paymentMethod: 'in_store',
  });
  const url = buildWhatsAppUrl(msg);
  assert.ok(url.startsWith('https://wa.me/33759802141?text='));
  assert.ok(url.includes('CD-1042'));
});
