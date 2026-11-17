import {
  Bell,
  BellOff,
  CheckCircle2,
  ChefHat,
  Clock,
  Flame,
  LogIn,
  LogOut,
  MessageCircle,
  PackageCheck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { OrderRecord, OrderStage, SHOP_CONTACT } from '../types';
import { PushPermissionState } from '../utils/notifications';
import {
  buildOrderWhatsAppMessage,
  buildWhatsAppUrl,
  formatEuro,
  formatFrenchTime,
  getNextStage,
  getStageDefinition,
  ORDER_STAGES,
} from '../utils/orderLogic';

interface OrderTrackingSectionProps {
  orders: readonly OrderRecord[];
  user: User | null;
  authLoading: boolean;
  pushPermission: PushPermissionState;
  kitchenMode: boolean;
  onToggleKitchenMode: () => void;
  onEnablePush: () => void;
  onTestPush: () => void;
  onAdvanceStage: (order: OrderRecord) => void;
  onMarkPaid: (order: OrderRecord) => void;
  onSignInGoogle: () => void;
  onSignOut: () => void;
}

function StageIcon({ stage }: { stage: OrderStage }) {
  switch (stage) {
    case 'received':
      return <ShoppingBag className="w-4 h-4" aria-hidden="true" />;
    case 'preparing':
      return <ChefHat className="w-4 h-4" aria-hidden="true" />;
    case 'baking':
      return <Flame className="w-4 h-4" aria-hidden="true" />;
    case 'packing':
      return <PackageCheck className="w-4 h-4" aria-hidden="true" />;
    case 'ready':
    case 'picked_up':
      return <CheckCircle2 className="w-4 h-4" aria-hidden="true" />;
  }
}

export function OrderTrackingSection({
  orders,
  user,
  authLoading,
  pushPermission,
  kitchenMode,
  onToggleKitchenMode,
  onEnablePush,
  onTestPush,
  onAdvanceStage,
  onMarkPaid,
  onSignInGoogle,
  onSignOut,
}: OrderTrackingSectionProps) {
  const pipelineStages = ORDER_STAGES.slice(0, 5);

  return (
    <section id="suivi" className="py-12 sm:py-16 bg-[#FAF9F6] border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-medium text-amber-800 mb-2">
              Suivi du comptoir &amp; de la cuisine en temps réel
            </p>
            <h2 className="font-display text-3xl font-semibold text-stone-900 [text-wrap:balance]">
              Avancement des précommandes et heures d’achèvement
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {pushPermission === 'granted' ? (
              <button
                type="button"
                onClick={onTestPush}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Notifications push actives · Tester</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onEnablePush}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-stone-900 bg-white border border-stone-300 rounded-lg hover:border-stone-500 transition-colors whitespace-nowrap cursor-pointer"
              >
                {pushPermission === 'denied' ? (
                  <BellOff className="w-3.5 h-3.5 text-stone-500" aria-hidden="true" />
                ) : (
                  <Bell className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
                )}
                <span>
                  {pushPermission === 'denied'
                    ? 'Alertes bloquées (tester en direct)'
                    : 'Activer les notifications push'}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={onToggleKitchenMode}
              aria-pressed={kitchenMode}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                kitchenMode
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-800 border-stone-300 hover:border-stone-500'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{kitchenMode ? 'Mode Comptoir : Actif' : 'Vue Comptoir (Gérant)'}</span>
            </button>

            {!authLoading &&
              (user ? (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:border-stone-500 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{user.displayName || user.email} · Déconnexion</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSignInGoogle}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-800 bg-white border border-stone-300 rounded-lg hover:border-stone-500 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Synchroniser (Google)</span>
                </button>
              ))}
          </div>
        </div>

        {kitchenMode && (
          <div className="mb-6 bg-white border border-stone-300 rounded-xl p-4 text-sm text-stone-700">
            <p className="font-semibold text-stone-900 mb-1">
              Console Comptoir &amp; Cuisine activée
            </p>
            <p className="text-xs text-stone-600">
              Faites avancer les commandes étape par étape pour mettre à jour l’heure d’achèvement
              estimée et déclencher les notifications push en temps réel.
            </p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-xl p-10 text-center">
            <p className="text-base font-semibold text-stone-900 mb-2">
              Aucune précommande enregistrée pour le moment
            </p>
            <p className="text-sm text-stone-600">
              Ajoutez des articles depuis la boutique pour suivre ici chaque étape de préparation en
              direct.
            </p>
          </div>
        ) : (
          <div className="space-y-6" data-testid="orders-list">
            {orders.map((order) => {
              const currentDef = getStageDefinition(order.stage);
              const nextStage = getNextStage(order.stage);
              const nextDef = nextStage ? getStageDefinition(nextStage) : null;
              const createdTime = formatFrenchTime(new Date(order.createdAtMs));
              const whatsAppMsg = buildOrderWhatsAppMessage(order);

              return (
                <article
                  key={order.id}
                  className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-stone-200">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-1.5">
                        <span className="font-mono font-semibold text-stone-900">
                          {order.orderNumber}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Passée à {createdTime}</span>
                        <span aria-hidden="true">·</span>
                        <span>{order.pickupSlot}</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {order.paymentStatus === 'paid'
                            ? 'Payée en ligne'
                            : 'Paiement en boutique au retrait'}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-stone-900">
                        {order.customerName} — {formatEuro(order.totalCents)}
                      </h3>
                      <p className="text-sm text-stone-600 mt-1">{order.itemsSummary}</p>
                      {order.notes && (
                        <p className="text-xs text-stone-500 mt-1.5">
                          Précision : « {order.notes} »
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-stone-900 tabular-nums">
                        <Clock className="w-4 h-4 text-amber-800" aria-hidden="true" />
                        <span>
                          {order.estimatedReadyLabel}
                          {order.estimatedMinutesRemaining > 0 &&
                          !order.estimatedReadyLabel.includes('min')
                            ? ` (~${order.estimatedMinutesRemaining} min)`
                            : ''}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-amber-900">
                        Étape actuelle : {currentDef.label}
                      </p>
                    </div>
                  </div>

                  <div className="py-5">
                    <ol
                      aria-label={`Étapes de préparation pour la commande ${order.orderNumber}`}
                      className="grid grid-cols-1 sm:grid-cols-5 gap-3"
                    >
                      {pipelineStages.map((step) => {
                        const isDone = currentDef.stepNumber > step.stepNumber;
                        const isCurrent = currentDef.stepNumber === step.stepNumber;

                        return (
                          <li
                            key={step.id}
                            className={`rounded-lg border p-3 transition-colors ${
                              isCurrent
                                ? 'border-stone-900 bg-[#FAF9F6]'
                                : isDone
                                ? 'border-emerald-200 bg-emerald-50/60'
                                : 'border-stone-200 bg-white opacity-70'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-mono tabular-nums text-stone-500">
                                0{step.stepNumber}
                              </span>
                              <span
                                className={
                                  isCurrent
                                    ? 'text-amber-800'
                                    : isDone
                                    ? 'text-emerald-800'
                                    : 'text-stone-400'
                                }
                              >
                                <StageIcon stage={step.id} />
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-stone-900">
                              {step.shortLabel}
                            </p>
                            <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                              {isCurrent
                                ? 'En cours'
                                : isDone
                                ? 'Terminée'
                                : 'À venir'}
                            </p>
                          </li>
                        );
                      })}
                    </ol>
                    <p className="text-xs text-stone-600 mt-3">{currentDef.description}</p>
                  </div>

                  <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                    <a
                      href={buildWhatsAppUrl(whatsAppMsg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-900 bg-[#FAF9F6] border border-stone-300 rounded-lg hover:border-stone-500 transition-colors whitespace-nowrap"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                      <span>Écrire sur WhatsApp ({SHOP_CONTACT.whatsappDisplay})</span>
                    </a>

                    {kitchenMode && (
                      <div className="flex flex-wrap items-center gap-2.5">
                        {order.paymentStatus === 'pending_pickup' && (
                          <button
                            type="button"
                            onClick={() => onMarkPaid(order)}
                            className="px-3.5 py-2 text-xs font-semibold text-stone-800 bg-white border border-stone-300 rounded-lg hover:border-stone-500 cursor-pointer"
                          >
                            Encaisser en boutique
                          </button>
                        )}
                        {nextDef && (
                          <button
                            type="button"
                            onClick={() => onAdvanceStage(order)}
                            aria-label={`Passer ${order.orderNumber} à l'étape ${nextDef.label}`}
                            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                          >
                            Passer à : {nextDef.label}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
