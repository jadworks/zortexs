import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { LegalDocType, SHOP_CONTACT } from '../types';
import { buildWhatsAppUrl } from '../utils/orderLogic';

interface FooterProps {
  onOpenLegal: (doc: LegalDocType) => void;
}

export function Footer({ onOpenLegal }: FooterProps) {
  return (
    <footer id="contact" className="bg-stone-950 text-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-stone-800">
          <div>
            <p className="font-display text-xl font-semibold text-white mb-2">
              {SHOP_CONTACT.name}
            </p>
            <p className="text-sm text-stone-400 leading-relaxed max-w-xs">
              Boulangerie de quartier, viennoiseries pur beurre, tacos maison, chips artisanales et
              confiseries.
            </p>
          </div>

          <div className="space-y-2.5 text-sm">
            <p className="font-semibold text-white">Boutique &amp; Retrait</p>
            <p className="flex items-start gap-2 text-stone-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{SHOP_CONTACT.address}</span>
            </p>
            <p className="text-stone-400">{SHOP_CONTACT.hours}</p>
            <p className="flex items-center gap-2 text-stone-300">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
              <a href={`mailto:${SHOP_CONTACT.email}`} className="hover:underline">
                {SHOP_CONTACT.email}
              </a>
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <p className="font-semibold text-white">Commander ou poser une question</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-stone-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>WhatsApp · {SHOP_CONTACT.whatsappDisplay}</span>
              </a>
              <a
                href={`tel:+33${SHOP_CONTACT.whatsappRaw.slice(1)}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-stone-200 border border-stone-700 rounded-lg hover:border-stone-500 transition-colors whitespace-nowrap"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span>Appeler</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-stone-400">
          <p>© 2026 {SHOP_CONTACT.name} — Tous droits réservés.</p>

          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => onOpenLegal('mentions')}
              className="hover:text-white underline underline-offset-4 cursor-pointer"
            >
              Mentions légales
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal('confidentialite')}
              className="hover:text-white underline underline-offset-4 cursor-pointer"
            >
              Politique de confidentialité
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
