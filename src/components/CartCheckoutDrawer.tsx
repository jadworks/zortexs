import { useState } from 'react';
import { CreditCard, Minus, Plus, Store, Trash2, X } from 'lucide-react';
import { BLUEPRINT_LIMITS, CartItem, PaymentMethod } from '../types';
import {
  calculateCartTotals,
  formatEuro,
  PICKUP_SLOTS,
  validateCheckoutInput,
} from '../utils/orderLogic';
import { ProductImage } from './ProductImage';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  items: readonly CartItem[];
  onClose: () => void;
  onUpdateQty: (cartKey: string, delta: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onSubmitOrder: (payload: {
    customerName: string;
    customerPhone: string;
    pickupSlot: string;
    paymentMethod: PaymentMethod;
    notes: string;
  }) => Promise<void>;
}

export function CartCheckoutDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onSubmitOrder,
}: CartCheckoutDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupSlot, setPickupSlot] = useState(PICKUP_SLOTS[0].label);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('in_store');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const { totalCents, itemCount } = calculateCartTotals(items);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateCheckoutInput({
      customerName,
      customerPhone,
      pickupSlot,
      notes,
      paymentMethod,
      items,
    });

    if (!check.valid) {
      setErrors(check.errors as Record<string, string>);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await onSubmitOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        pickupSlot,
        paymentMethod,
        notes: notes.trim(),
      });
      setNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-stone-950/45"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-cart-title"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-lg bg-[#FAF9F6] h-full flex flex-col border-l border-stone-200 shadow-2xl">
        <div className="px-6 py-4 bg-white border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 id="drawer-cart-title" className="font-display text-xl font-semibold text-stone-900">
              Votre précommande
            </h2>
            <p className="text-xs text-stone-600 tabular-nums">
              {itemCount} article{itemCount > 1 ? 's' : ''} · Total {formatEuro(totalCents)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le panier"
            className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {items.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-xl p-8 text-center">
              <p className="text-base font-medium text-stone-900 mb-2">Votre panier est vide</p>
              <p className="text-sm text-stone-600 mb-5">
                Ajoutez du pain frais, des viennoiseries, un tacos maison ou des confiseries pour
                lancer votre précommande.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-white bg-stone-900 rounded-lg hover:bg-stone-800 cursor-pointer"
              >
                Parcourir la boutique
              </button>
            </div>
          ) : (
            <>
              <ul className="space-y-3" aria-label="Articles dans le panier">
                {items.map((item) => (
                  <li
                    key={item.cartKey}
                    className="flex items-center gap-3.5 bg-white border border-stone-200 rounded-xl p-3"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                      <ProductImage
                        src={item.imageUrl}
                        alt={item.name}
                        title={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-900 truncate">{item.name}</p>
                      {item.optionsLabel && (
                        <p className="text-xs text-stone-500 truncate">{item.optionsLabel}</p>
                      )}
                      <p className="text-xs font-medium text-stone-700 tabular-nums mt-1">
                        {formatEuro(item.unitPriceCents * item.quantity)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.cartKey, -1)}
                        aria-label={`Retirer une unité de ${item.name}`}
                        className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-stone-300 bg-white text-stone-700 hover:bg-stone-100 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold tabular-nums text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.cartKey, 1)}
                        aria-label={`Ajouter une unité de ${item.name}`}
                        className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-stone-300 bg-white text-stone-700 hover:bg-stone-100 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.cartKey)}
                        aria-label={`Supprimer ${item.name} du panier`}
                        className="w-8 h-8 inline-flex items-center justify-center rounded-md text-stone-400 hover:text-red-700 hover:bg-red-50 cursor-pointer ml-1"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <form id="checkout-form" onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-4">
                  <h3 className="text-sm font-semibold text-stone-900">
                    Coordonnées &amp; créneau de fournée
                  </h3>

                  <div>
                    <label
                      htmlFor="checkout-name"
                      className="block text-xs font-medium text-stone-700 mb-1"
                    >
                      Nom pour le retrait
                    </label>
                    <input
                      id="checkout-name"
                      type="text"
                      required
                      maxLength={BLUEPRINT_LIMITS.customerNameMax}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex. Camille Laurent"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                    {errors.customerName && (
                      <p className="text-xs text-red-700 mt-1" role="alert">
                        {errors.customerName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-phone"
                      className="block text-xs font-medium text-stone-700 mb-1"
                    >
                      Téléphone mobile (pour le retrait)
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      required
                      maxLength={BLUEPRINT_LIMITS.customerPhoneMax}
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Ex. 06 12 34 56 78"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                    {errors.customerPhone && (
                      <p className="text-xs text-red-700 mt-1" role="alert">
                        {errors.customerPhone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-slot"
                      className="block text-xs font-medium text-stone-700 mb-1"
                    >
                      Heure de fournée ou retrait souhaitée
                    </label>
                    <select
                      id="checkout-slot"
                      value={pickupSlot}
                      onChange={(e) => setPickupSlot(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-stone-900"
                    >
                      {PICKUP_SLOTS.map((slot) => (
                        <option key={slot.id} value={slot.label}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                    {errors.pickupSlot && (
                      <p className="text-xs text-red-700 mt-1" role="alert">
                        {errors.pickupSlot}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-notes"
                      className="block text-xs font-medium text-stone-700 mb-1"
                    >
                      Précisions cuisson ou sauce (optionnel)
                    </label>
                    <textarea
                      id="checkout-notes"
                      rows={2}
                      maxLength={BLUEPRINT_LIMITS.notesMax}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex. Baguette bien cuite, sans oignons dans le tacos..."
                      className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                    {errors.notes && (
                      <p className="text-xs text-red-700 mt-1" role="alert">
                        {errors.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-stone-900">Mode de paiement</h3>

                  <div className="grid grid-cols-1 gap-2.5">
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                        paymentMethod === 'online'
                          ? 'border-stone-900 bg-stone-50'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={() => setPaymentMethod('online')}
                        className="mt-1 accent-stone-900"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                          <CreditCard className="w-4 h-4 text-amber-800" aria-hidden="true" />
                          <span>Payer en ligne maintenant</span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5">
                          Règlement sécurisé immédiat : votre sac est prêt au retrait coupe-file.
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                        paymentMethod === 'in_store'
                          ? 'border-stone-900 bg-stone-50'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="in_store"
                        checked={paymentMethod === 'in_store'}
                        onChange={() => setPaymentMethod('in_store')}
                        className="mt-1 accent-stone-900"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                          <Store className="w-4 h-4 text-amber-800" aria-hidden="true" />
                          <span>Payer en boutique au retrait</span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5">
                          Espèces, carte sans contact ou titres-restaurant directement au comptoir.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-4 bg-white border-t border-stone-200 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-600">Total de la précommande</span>
              <span className="text-lg font-semibold text-stone-900 tabular-nums">
                {formatEuro(totalCents)}
              </span>
            </div>
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full py-3 px-5 text-sm font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {isSubmitting
                ? 'Validation en cours...'
                : paymentMethod === 'online'
                ? `Payer ${formatEuro(totalCents)} et précommander`
                : 'Confirmer la précommande (paiement au retrait)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
