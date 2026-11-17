import { useState } from 'react';
import { Plus, Tag } from 'lucide-react';
import { DAILY_OFFERS } from '../data/catalog';
import { Product } from '../types';
import { computeSavingsCents, formatEuro } from '../utils/orderLogic';
import { ProductImage } from './ProductImage';

interface DailyOffersBannerProps {
  onAddOffer: (product: Product, defaultChoiceId?: string) => void;
}

export function DailyOffersBanner({ onAddOffer }: DailyOffersBannerProps) {
  const [addedId, setAddedId] = useState<string | null>(null);

  if (DAILY_OFFERS.length === 0) return null;

  const handleAdd = (offer: Product) => {
    const defaultChoice = offer.optionGroup?.choices[0]?.id;
    onAddOffer(offer, defaultChoice);
    setAddedId(offer.id);
    window.setTimeout(() => {
      setAddedId((curr) => (curr === offer.id ? null : curr));
    }, 1000);
  };

  return (
    <div
      aria-labelledby="daily-offers-heading"
      className="mb-12 pb-12 border-b border-stone-200"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 mb-1.5">
            <Tag className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Offres du jour &amp; Promotions</span>
          </p>
          <h3
            id="daily-offers-heading"
            className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 [text-wrap:balance]"
          >
            Les combos sortie d’école à prix doux
          </h3>
        </div>
        <p className="text-sm text-stone-600 max-w-md">
          Formules préparées à la commande pour le midi, 16h30 ou la soirée.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DAILY_OFFERS.map((offer) => {
          const savings = computeSavingsCents(offer.originalPriceCents, offer.priceCents);
          const isAdded = addedId === offer.id;

          return (
            <article
              key={offer.id}
              className="flex flex-col justify-between bg-[#FAF9F6] border border-stone-200 rounded-xl overflow-hidden transition-transform duration-150 hover:-translate-y-0.5"
            >
              <div>
                <div className="aspect-[4/3] w-full bg-stone-100 overflow-hidden border-b border-stone-200">
                  <ProductImage
                    src={offer.imageUrl}
                    alt={offer.name}
                    title={offer.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 mb-1.5">
                    <span>{offer.promoLabel ?? 'Offre du jour'}</span>
                    {savings > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>Économisez {formatEuro(savings)}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="text-base font-semibold text-stone-900 leading-snug">
                      {offer.name}
                    </h4>
                    <div className="text-right shrink-0 tabular-nums">
                      {offer.originalPriceCents && (
                        <span className="block text-xs text-stone-400 line-through">
                          {formatEuro(offer.originalPriceCents)}
                        </span>
                      )}
                      <span className="text-base font-bold text-stone-900">
                        {formatEuro(offer.priceCents)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-stone-600 leading-relaxed">{offer.description}</p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-1">
                <button
                  type="button"
                  onClick={() => handleAdd(offer)}
                  aria-label={`Profiter de l’offre ${offer.name}`}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 ${
                    isAdded
                      ? 'bg-emerald-800 text-white'
                      : 'bg-stone-900 text-white hover:bg-stone-800'
                  }`}
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>{isAdded ? 'Ajouté au panier' : 'Profiter de l’offre'}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
