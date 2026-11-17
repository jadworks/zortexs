import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildItemsSummary,
  buildOrderWhatsAppMessage,
  buildWhatsAppUrl,
  calculateCartTotals,
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
    cartKey: 'baguette-tradition',
    productId: 'baguette-tradition',
    name: 'Baguette de Tradition',
    category: 'pains',
    unitPriceCents: 135,
    quantity: 2,
    imageUrl: '/src/assets/images/cat_pains_baguettes_1794938993059.jpg',
    isPreorderFresh: true,
    prepMinutes: 18,
  },
  {
    cartKey: 'tacos-m__sauce-algerienne',
    productId: 'tacos-m',
    name: 'Tacos Maison M',
    category: 'tacos',
    unitPriceCents: 850,
    quantity: 1,
    optionsLabel: 'Poulet mariné · Sauce Algérienne',
    imageUrl: '/src/assets/images/cat_french_tacos_1794938993709.jpg',
    isPreorderFresh: false,
    prepMinutes: 14,
  },
];

test('formatEuro formats cents using French decimal comma and euro sign', () => {
  assert.equal(formatEuro(135), '1,35 €');
  assert.equal(formatEuro(1120), '11,20 €');
  assert.equal(formatEuro(0), '0,00 €');
});

test('calculateCartTotals computes total cents, item count, and max prep minutes', () => {
  const totals = calculateCartTotals(sampleCart);
  assert.equal(totals.totalCents, 1120);
  assert.equal(totals.itemCount, 3);
  assert.equal(totals.maxPrepMinutes, 18);
});

test('getNextStage advances cleanly through preparation pipeline and stops at picked_up', () => {
  assert.equal(getNextStage('received'), 'preparing');
  assert.equal(getNextStage('preparing'), 'baking');
  assert.equal(getNextStage('baking'), 'packing');
  assert.equal(getNextStage('packing'), 'ready');
  assert.equal(getNextStage('ready'), 'picked_up');
  assert.equal(getNextStage('picked_up'), null);
});

test('computeStageEstimation computes dynamic clock time and ready labels', () => {
  const fixedNow = new Date(2026, 10, 17, 14, 10, 0);
  assert.equal(formatFrenchTime(fixedNow), '14h10');

  const bakingEst = computeStageEstimation('baking', 'Dès que possible (~20 min)', fixedNow, 18);
  assert.equal(bakingEst.estimatedMinutesRemaining, 8);
  assert.equal(bakingEst.estimatedReadyLabel, 'Vers 14h18');
  assert.equal(bakingEst.progressPercent, 50);

  const readyEst = computeStageEstimation('ready', 'Dès que possible (~20 min)', fixedNow, 18);
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
    '2x Baguette de Tradition, 1x Tacos Maison M (Poulet mariné · Sauce Algérienne)'
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
    pickupSlot: 'Fournée du midi · 12h00',
    notes: 'Baguette bien cuite svp',
    paymentMethod: 'online',
    items: sampleCart,
  });
  assert.equal(good.valid, true);
});

test('buildWhatsAppUrl encodes French order details targeting 0759802141', () => {
  const msg = buildOrderWhatsAppMessage({
    orderNumber: 'CD-1042',
    customerName: 'Camille Laurent',
    pickupSlot: 'Fournée du midi · 12h00',
    itemsSummary: '2x Baguette de Tradition',
    totalCents: 270,
    paymentMethod: 'in_store',
  });
  const url = buildWhatsAppUrl(msg);
  assert.ok(url.startsWith('https://wa.me/33759802141?text='));
  assert.ok(url.includes('CD-1042'));
});
