import { useState, useMemo } from 'react';
import { useApp, computeShoppingList } from '@/context/AppContext';
import { Modal } from '@/components/Modal';
import { Check, ShoppingBag, Package, Link2, Copy, ChefHat } from 'lucide-react';

type Filter = 'all' | 'to_buy' | 'pantry';

const AISLE_ICONS: Record<string, string> = {
  'Fruits & Légumes': '🥦',
  'Crémerie & Frais': '🧀',
  'Viandes & Poissons': '🥩',
  'Épicerie & Condiments': '🍝',
  'Surgelés': '🧊',
};

const AISLE_ORDER = ['Fruits & Légumes', 'Crémerie & Frais', 'Viandes & Poissons', 'Épicerie & Condiments', 'Surgelés'];

export function ShoppingListPage() {
  const { state, toggleCheckedItem, togglePantryItem, setCurrentView } = useApp();
  const [filter, setFilter] = useState<Filter>('all');
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const items = useMemo(() => computeShoppingList(state.currentPlan), [state.currentPlan]);

  const totalCost = items.reduce((s, i) => s + i.estimatedPrice, 0);
  const checkedCount = items.filter((i) => state.checkedItems.includes(i.name.toLowerCase())).length;
  const progress = items.length > 0 ? (checkedCount / items.length) * 100 : 0;

  const filteredItems = items.filter((item) => {
    const key = item.name.toLowerCase();
    if (filter === 'to_buy') return !state.checkedItems.includes(key) && !state.pantryItems.includes(key);
    if (filter === 'pantry') return state.pantryItems.includes(key);
    return true;
  });

  const grouped = useMemo(() => {
    const map = new Map<string, typeof items>();
    for (const item of filteredItems) {
      const arr = map.get(item.category) || [];
      arr.push(item);
      map.set(item.category, arr);
    }
    return AISLE_ORDER.filter((c) => map.has(c)).map((c) => ({ category: c, items: map.get(c)! }));
  }, [filteredItems]);

  const handleCopy = () => {
    const text = items
      .map((i) => `${i.totalAmount} ${i.name} (${i.estimatedPrice.toFixed(2)} €)`)
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (state.currentPlan.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
        <ShoppingBag className="h-12 w-12 text-gray-300" />
        <h2 className="mt-4 text-xl font-bold text-gray-900">Aucune liste de courses</h2>
        <p className="mt-1 text-gray-500">Générez d'abord un menu pour la semaine.</p>
        <button onClick={() => setCurrentView('dashboard')} className="btn-primary mt-6">
          Voir mon menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-5">
          <h1 className="text-xl font-bold text-gray-900">Liste de courses</h1>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">{totalCost.toFixed(2)} €</span>
              <span className="text-sm text-gray-400"> total estimé</span>
            </div>
            <button
              onClick={() => setShowShare(true)}
              className="btn-ghost text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
            >
              <Link2 className="h-4 w-4" /> Partager
            </button>
          </div>

          {/* Progress */}
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-gray-500">{checkedCount} / {items.length} articles</span>
              <span className="font-semibold text-emerald-600">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 flex gap-2">
            {([
              { id: 'all', label: 'Tout', count: items.length },
              { id: 'to_buy', label: 'À acheter', count: items.length - checkedCount - state.pantryItems.length },
              { id: 'pantry', label: 'En stock', count: state.pantryItems.length },
            ] as const).map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-all active:scale-95 ${
                  filter === f.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {f.label} <span className="opacity-60">({f.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grouped items */}
      <div className="mx-auto max-w-3xl px-5 py-6">
        {grouped.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <Package className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-gray-400">Aucun article dans cette catégorie.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map((group) => (
              <div key={group.category}>
                <h2 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400">
                  <span className="text-lg">{AISLE_ICONS[group.category]}</span>
                  {group.category}
                </h2>
                <div className="card divide-y divide-gray-50">
                  {group.items.map((item) => {
                    const key = item.name.toLowerCase();
                    const isChecked = state.checkedItems.includes(key);
                    const isPantry = state.pantryItems.includes(key);
                    return (
                      <div key={key} className="flex items-center gap-3 p-3">
                        <button
                          onClick={() => toggleCheckedItem(key)}
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all active:scale-90 ${
                            isChecked
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          {isChecked && <Check className="h-4 w-4" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium ${isChecked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-400">{item.totalAmount}</div>
                        </div>
                        <span className="text-sm font-semibold text-amber-600">{item.estimatedPrice.toFixed(2)} €</span>
                        <button
                          onClick={() => togglePantryItem(key)}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all active:scale-90 ${
                            isPantry ? 'bg-blue-50 text-blue-500' : 'text-gray-300 hover:bg-gray-100'
                          }`}
                          title="Déjà en stock"
                        >
                          <Package className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      <Modal open={showShare} onClose={() => setShowShare(false)} maxWidth="max-w-md">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <Link2 className="h-7 w-7 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Partager la liste</h2>
          <p className="mt-1 text-sm text-gray-500">Copiez votre liste de courses pour la partager ou l'imprimer.</p>
          <button onClick={handleCopy} className="btn-primary mt-6 w-full">
            {copied ? <><Check className="h-4 w-4" /> Copié !</> : <><Copy className="h-4 w-4" /> Copier la liste</>}
          </button>
          <button onClick={() => { setShowShare(false); setCurrentView('dashboard'); }} className="btn-secondary mt-3 w-full">
            <ChefHat className="h-4 w-4" /> Retour au menu
          </button>
        </div>
      </Modal>
    </div>
  );
}
