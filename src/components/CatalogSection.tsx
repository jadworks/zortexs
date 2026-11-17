import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { CATEGORY_TABS, CATALOG_PRODUCTS } from '../data/catalog';
import { CategoryId, Product } from '../types';
import { formatEuro } from '../utils/orderLogic';
import { DailyOffersBanner } from './DailyOffersBanner';
import { ProductImage } from './ProductImage';

interface CatalogSectionProps {
  activeCategory: CategoryId;
  onCategoryChange: (cat: CategoryId) => void;
  onAddToCart: (product: Product, selectedChoiceId?: string) => void;
}

export function CatalogSection({
  activeCategory,
  onCategoryChange,
  onAddToCart,
}: CatalogSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = CATALOG_PRODUCTS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return (
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery) ||
      item.categoryLabel.toLowerCase().includes(normalizedQuery)
    );
  });

  const handleAdd = (product: Product, explicitChoiceId?: string) => {
    const defaultChoice = product.optionGroup?.choices[0]?.id;
    const choiceId = explicitChoiceId ?? selectedOptions[product.id] ?? defaultChoice;
    onAddToCart(product, choiceId);
    setJustAddedId(product.id);
    window.setTimeout(() => {
      setJustAddedId((curr) => (curr === product.id ? null : curr));
    }, 1000);
  };

  return (
    <section id="boutique" className="py-12 sm:py-16 bg-white border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <DailyOffersBanner onAddOffer={handleAdd} />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-medium text-amber-800 mb-2">
              Carte &amp; Confiserie du Comptoir
            </p>
            <h2 className="font-display text-3xl font-semibold text-stone-900 [text-wrap:balance]">
              Commandez vos bonbons, tacos, chips et goûters
            </h2>
          </div>

          <div className="w-full md:w-72">
            <label htmlFor="catalog-search" className="sr-only">
              Rechercher un produit
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="catalog-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher bonbons, tacos, chips..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF9F6] border border-stone-300 rounded-lg text-stone-900 placeholder:text-stone-500 focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Filtrer par catégorie"
          className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-100 rounded-lg mb-8 w-fit max-w-full"
        >
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onCategoryChange(tab.id)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-700 ${
                  isActive
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="border border-stone-200 rounded-xl p-10 text-center bg-[#FAF9F6]">
            <p className="text-base font-medium text-stone-900 mb-2">
              Aucun produit ne correspond à « {searchQuery} »
            </p>
            <p className="text-sm text-stone-600 mb-5">
              Essayez un autre mot-clé ou affichez toute la boutique.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                onCategoryChange('all');
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-stone-900 rounded-lg hover:bg-stone-800 cursor-pointer"
            >
              Afficher toute la boutique
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const selectedChoiceId =
                selectedOptions[product.id] ?? product.optionGroup?.choices[0]?.id;
              const selectedChoice = product.optionGroup?.choices.find(
                (c) => c.id === selectedChoiceId
              );
              const displayPriceCents =
                product.priceCents + (selectedChoice?.extraCents ?? 0);
              const isAdded = justAddedId === product.id;

              return (
                <article
                  key={product.id}
                  className="flex flex-col justify-between bg-[#FAF9F6] border border-stone-200 rounded-xl overflow-hidden transition-transform duration-150 hover:-translate-y-0.5"
                >
                  <div>
                    <div className="aspect-[4/3] w-full bg-stone-100 overflow-hidden border-b border-stone-200">
                      <ProductImage
                        src={product.imageUrl}
                        alt={product.name}
                        title={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
                        <span>{product.categoryLabel}</span>
                        {product.promoLabel ? (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-semibold text-amber-800">
                              {product.promoLabel}
                            </span>
                          </>
                        ) : (
                          product.batchInfo && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{product.batchInfo}</span>
                            </>
                          )
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-base font-semibold text-stone-900 leading-snug">
                          {product.name}
                        </h3>
                        <div className="text-right shrink-0 tabular-nums">
                          {product.originalPriceCents && (
                            <span className="block text-xs text-stone-400 line-through">
                              {formatEuro(product.originalPriceCents)}
                            </span>
                          )}
                          <span className="text-base font-semibold text-stone-900 whitespace-nowrap">
                            {formatEuro(displayPriceCents)}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-stone-600 leading-relaxed mb-4">
                        {product.description}
                      </p>

                      {product.optionGroup && (
                        <div className="mb-4">
                          <label
                            htmlFor={`opt-${product.id}`}
                            className="block text-xs font-medium text-stone-700 mb-1"
                          >
                            {product.optionGroup.label}
                          </label>
                          <select
                            id={`opt-${product.id}`}
                            value={selectedChoiceId}
                            onChange={(e) =>
                              setSelectedOptions((prev) => ({
                                ...prev,
                                [product.id]: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-stone-900"
                          >
                            {product.optionGroup.choices.map((choice) => (
                              <option key={choice.id} value={choice.id}>
                                {choice.label}
                                {choice.extraCents > 0
                                  ? ` (+${formatEuro(choice.extraCents)})`
                                  : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-0">
                    <button
                      type="button"
                      onClick={() => handleAdd(product)}
                      aria-label={`Ajouter ${product.name} au panier`}
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 ${
                        isAdded
                          ? 'bg-emerald-800 text-white'
                          : 'bg-stone-900 text-white hover:bg-stone-800'
                      }`}
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {isAdded
                          ? 'Ajouté au panier'
                          : product.isPreorderFresh
                          ? 'Précommander'
                          : 'Ajouter au panier'}
                      </span>
                    </button>
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
