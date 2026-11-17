import { ArrowRight, MessageCircle } from 'lucide-react';
import { HERO_IMAGE_URL } from '../data/catalog';
import { SHOP_CONTACT } from '../types';
import { buildWhatsAppUrl } from '../utils/orderLogic';
import { ProductImage } from './ProductImage';

interface HeroSectionProps {
  onSelectBreadCategory: () => void;
}

export function HeroSection({ onSelectBreadCategory }: HeroSectionProps) {
  return (
    <section id="accueil" className="border-b border-stone-200 bg-[#FAF9F6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 pb-10 sm:pt-12 sm:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div>
              <p className="text-xs font-medium tracking-wide text-stone-600 mb-4">
                {SHOP_CONTACT.subtitle} · {SHOP_CONTACT.hours}
              </p>

              <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-stone-900 leading-[1.12] [text-wrap:balance] mb-5">
                Pains chauds, viennoiseries, tacos &amp; gourmandises de quartier
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl mb-8">
                Réservez votre baguette tradition et vos croissants avant la sortie du four,
                complétez avec nos French tacos grillés, chips artisanales et bonbons. Réglez en
                ligne ou directement au comptoir lors du retrait.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#boutique"
                  onClick={onSelectBreadCategory}
                  className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                >
                  <span>Précommander une fournée</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>

                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-stone-900 bg-white border border-stone-300 rounded-lg hover:border-stone-500 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                  <span>WhatsApp · {SHOP_CONTACT.whatsappDisplay}</span>
                </a>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-200 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-stone-600">
              <span>Fournées 07h30, 12h00 et 17h00</span>
              <span aria-hidden="true">·</span>
              <span>Paiement en ligne ou au retrait</span>
              <span aria-hidden="true">·</span>
              <span>Suivi en direct</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[280px] lg:min-h-[420px] rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
              <ProductImage
                src={HERO_IMAGE_URL}
                alt="Comptoir artisanal avec baguettes tradition, croissants dorés et pains au chocolat"
                title="Le Comptoir Doré — Fournil artisanal"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div
          id="precommande"
          className="mt-10 pt-8 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div>
            <p className="text-xs font-semibold text-amber-800 mb-1">01. Précommande fournil</p>
            <p className="text-sm font-medium text-stone-900">Pain &amp; viennoiseries chauds</p>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Choisissez votre créneau de fournée pour garantir la disponibilité à l’heure exacte.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-800 mb-1">02. Paiement flexible</p>
            <p className="text-sm font-medium text-stone-900">En ligne ou au comptoir</p>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Réglez à l’avance par carte bancaire ou directement en boutique lors du retrait.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-800 mb-1">03. Suivi &amp; alertes push</p>
            <p className="text-sm font-medium text-stone-900">Étapes et heure estimée</p>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Visualisez l’avancement (pétrissage, four, emballage) et recevez une alerte dès que c’est prêt.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-800 mb-1">04. Contact direct</p>
            <p className="text-sm font-medium text-stone-900">WhatsApp {SHOP_CONTACT.whatsappDisplay}</p>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Une demande spéciale sur un tacos ou une grosse commande ? Écrivez-nous en un clic.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
