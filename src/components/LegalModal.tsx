import { X } from 'lucide-react';
import { LegalDocType, SHOP_CONTACT } from '../types';

interface LegalModalProps {
  docType: LegalDocType | null;
  onClose: () => void;
}

export function LegalModal({ docType, onClose }: LegalModalProps) {
  if (!docType) return null;

  const isMentions = docType === 'mentions';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-white border border-stone-200 rounded-xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-200 mb-6">
          <h2 id="legal-modal-title" className="font-display text-2xl font-semibold text-stone-900">
            {isMentions ? 'Mentions légales' : 'Politique de confidentialité'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la fenêtre légale"
            className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {isMentions ? (
          <div className="space-y-5 text-sm text-stone-700 leading-relaxed">
            <section>
              <h3 className="font-semibold text-stone-900 mb-1">1. Éditeur du site</h3>
              <p>
                Le présent site est édité par <strong>{SHOP_CONTACT.name}</strong> ({SHOP_CONTACT.subtitle}),
                commerce de proximité spécialisé en boulangerie, viennoiserie, restauration rapide
                (French tacos) et épicerie sucrée/salée.
              </p>
              <p className="mt-1">
                Adresse : {SHOP_CONTACT.address}
                <br />
                Téléphone &amp; WhatsApp : {SHOP_CONTACT.whatsappDisplay}
                <br />
                Courriel : {SHOP_CONTACT.email}
                <br />
                SIRET : 894 312 450 00018 · RCS Lyon · TVA non applicable, art. 293 B du CGI (le cas échéant)
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-stone-900 mb-1">2. Directeur de la publication</h3>
              <p>Direction de l’établissement {SHOP_CONTACT.name}.</p>
            </section>

            <section>
              <h3 className="font-semibold text-stone-900 mb-1">3. Hébergement</h3>
              <p>
                L’application web et les bases de données associées sont hébergées sur une
                infrastructure cloud sécurisée conforme aux standards européens (Google Cloud /
                Firebase).
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-stone-900 mb-1">4. Propriété intellectuelle</h3>
              <p>
                L’ensemble des textes, photographies, visuels, logos et éléments graphiques présents
                sur ce site sont la propriété exclusive de {SHOP_CONTACT.name}. Toute reproduction
                sans autorisation préalable est interdite.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-stone-900 mb-1">5. Médiation et réclamations</h3>
              <p>
                Pour toute question relative à une précommande ou au retrait en boutique, vous
                pouvez nous joindre directement par WhatsApp au {SHOP_CONTACT.whatsappDisplay} ou par
                courriel à {SHOP_CONTACT.email}.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-5 text-sm text-stone-700 leading-relaxed">
            <section>
              <h3 className="font-semibold text-stone-900 mb-1">
                1. Données collectées et finalité (RGPD)
              </h3>
              <p>
                Dans le cadre de la précommande de pains, viennoiseries, tacos et articles
                d’épicerie, {SHOP_CONTACT.name} collecte uniquement les informations strictement
                nécessaires : votre nom de retrait, votre numéro de téléphone, le créneau choisi, le
                détail des articles et le mode de règlement.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-stone-900 mb-1">
                2. Notifications push &amp; stockage local
              </h3>
              <p>
                Les notifications push navigateur ne sont activées qu’avec votre consentement
                explicite afin de vous prévenir lors des changements d’étape (cuisson, emballage,
                commande prête). Le panier et les commandes locales sont conservés dans le stockage
                local de votre navigateur ou synchronisés dans Firestore si vous vous connectez avec
                Google.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-stone-900 mb-1">3. Durée de conservation</h3>
              <p>
                Les données liées aux précommandes sont conservées pendant la durée nécessaire au
                suivi de la commande, à la gestion comptable légale et au service client, et au
                maximum 12 mois pour l’historique actif.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-stone-900 mb-1">4. Partage et sécurité</h3>
              <p>
                Vos données personnelles ne sont ni vendues ni cédées à des tiers commerciaux. En
                cas de contact volontaire via WhatsApp ({SHOP_CONTACT.whatsappDisplay}), les échanges
                relèvent également de la politique de confidentialité du service WhatsApp.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-stone-900 mb-1">5. Vos droits</h3>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
                Informatique et Libertés, vous disposez d’un droit d’accès, de rectification et de
                suppression de vos données en écrivant à {SHOP_CONTACT.email} ou par WhatsApp au{' '}
                {SHOP_CONTACT.whatsappDisplay}.
              </p>
            </section>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
