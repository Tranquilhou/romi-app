import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SUPERMARKETS } from '@/data/supermarkets';
import type { DietaryPreference, KitchenAppliance, MealMood, PortionStyle, ProteinTarget, SupermarketId } from '@/types';
import { Modal } from '@/components/Modal';
import { Check, RotateCcw, Users, Wallet, Apple, Microwave, ChefHat, AlertTriangle, Dumbbell, Sparkles, Ban } from 'lucide-react';

const DIET_OPTIONS: { id: DietaryPreference; label: string }[] = [
  { id: 'vegetarian', label: 'Végétarien' },
  { id: 'pescetarian', label: 'Pescétarien' },
  { id: 'gluten_free', label: 'Sans gluten' },
  { id: 'lactose_free', label: 'Sans lactose' },
];

const PORTION_OPTIONS: { id: PortionStyle; label: string }[] = [
  { id: 'any', label: 'Peu importe' },
  { id: 'light', label: 'Léger' },
  { id: 'balanced', label: 'Équilibré' },
  { id: 'hearty', label: 'Costaud' },
];

const PROTEIN_OPTIONS: { id: ProteinTarget; label: string }[] = [
  { id: 'any', label: 'Comme ça vient' },
  { id: 'high', label: 'Riche en protéines' },
  { id: 'extra', label: 'Extra protéines' },
  { id: 'max', label: 'Protéines max' },
];

const MOOD_OPTIONS: { id: MealMood; label: string; icon: string }[] = [
  { id: 'healthy', label: 'Healthy', icon: '🥗' },
  { id: 'quick', label: 'Express', icon: '⚡' },
  { id: 'protein', label: 'Protéiné', icon: '💪' },
  { id: 'gourmand', label: 'Gourmand', icon: '🍖' },
  { id: 'family', label: 'Familial', icon: '👨‍👩‍👧' },
  { id: 'world', label: 'World', icon: '🌍' },
];

const APPLIANCE_OPTIONS: { id: KitchenAppliance; label: string; icon: string }[] = [
  { id: 'oven', label: 'Four', icon: '🍞' },
  { id: 'stove', label: 'Plaque', icon: '🔥' },
  { id: 'airfryer', label: 'Air fryer', icon: '💨' },
];

export function SettingsPage() {
  const { state, setProfile, regenerateWeek, resetApp } = useApp();
  const [showReset, setShowReset] = useState(false);
  const p = state.profile;

  const toggleArr = <T extends string>(key: keyof typeof p, val: T) => {
    const current = p[key] as unknown as T[];
    setProfile({ [key]: current.includes(val) ? current.filter((x) => x !== val) : [...current, val] } as Partial<typeof p>);
  };

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-2xl px-5 py-5">
          <h1 className="text-xl font-bold text-gray-900">Paramètres</h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5 py-6 space-y-6">
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400"><ChefHat className="h-4 w-4" /> Supermarché</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {SUPERMARKETS.map((s) => (
              <button key={s.id} onClick={() => setProfile({ supermarket: s.id as SupermarketId })}
                className={`flex items-center gap-2 rounded-2xl border-2 p-3 transition-all active:scale-[0.98] ${p.supermarket === s.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ backgroundColor: s.color }}>{s.name.charAt(0)}</div>
                <span className="text-sm font-semibold text-gray-700">{s.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400"><Users className="h-4 w-4" /> Foyer</h2>
          <div className="space-y-3">
            <div className="card flex items-center justify-between p-4">
              <span className="font-medium text-gray-700">Adultes</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setProfile({ adults: Math.max(1, p.adults - 1) })} className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-600 active:scale-90">−</button>
                <span className="w-6 text-center font-bold text-gray-900">{p.adults}</span>
                <button onClick={() => setProfile({ adults: p.adults + 1 })} className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-lg font-bold text-white active:scale-90">+</button>
              </div>
            </div>
            <div className="card flex items-center justify-between p-4">
              <span className="font-medium text-gray-700">Enfants</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setProfile({ children: Math.max(0, p.children - 1) })} className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-600 active:scale-90">−</button>
                <span className="w-6 text-center font-bold text-gray-900">{p.children}</span>
                <button onClick={() => setProfile({ children: p.children + 1 })} className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-lg font-bold text-white active:scale-90">+</button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400"><Wallet className="h-4 w-4" /> Budget hebdomadaire</h2>
          <div className="card p-5">
            <div className="text-center"><span className="text-4xl font-extrabold text-emerald-500">{p.weeklyBudget} €</span></div>
            <input type="range" min="10" max="120" step="5" value={p.weeklyBudget} onChange={(e) => setProfile({ weeklyBudget: Number(e.target.value) })} className="mt-4 w-full accent-emerald-500" />
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400"><Sparkles className="h-4 w-4" /> Envies de la semaine</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {MOOD_OPTIONS.map((opt) => (
              <button key={opt.id} onClick={() => toggleArr('mealMoods', opt.id)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all active:scale-95 ${p.mealMoods.includes(opt.id) ? 'bg-emerald-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
                <span>{opt.icon}</span> {opt.label}
                {p.mealMoods.includes(opt.id) && <Check className="ml-auto h-4 w-4" />}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400"><Apple className="h-4 w-4" /> Régime & allergies</h2>
          <div className="flex flex-wrap gap-2">
            {DIET_OPTIONS.map((d) => (
              <button key={d.id} onClick={() => toggleArr('dietaryPreferences', d.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-95 ${p.dietaryPreferences.includes(d.id) ? 'bg-emerald-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
                {d.label}
                {p.dietaryPreferences.includes(d.id) && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400"><ChefHat className="h-4 w-4" /> Style d'assiette</h2>
          <div className="flex flex-wrap gap-2">
            {PORTION_OPTIONS.map((opt) => (
              <button key={opt.id} onClick={() => setProfile({ portionStyle: opt.id })}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-95 ${p.portionStyle === opt.id ? 'bg-emerald-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400"><Dumbbell className="h-4 w-4" /> Cible protéines</h2>
          <div className="flex flex-wrap gap-2">
            {PROTEIN_OPTIONS.map((opt) => (
              <button key={opt.id} onClick={() => setProfile({ proteinTarget: opt.id })}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-95 ${p.proteinTarget === opt.id ? 'bg-emerald-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400"><Ban className="h-4 w-4" /> Ingrédients exclus</h2>
          {p.excludedIngredients.length === 0 ? (
            <p className="text-sm text-gray-400">Aucun ingrédient exclu.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {p.excludedIngredients.map((item) => (
                <span key={item} className="flex items-center gap-1.5 rounded-xl bg-gray-50 px-3 py-2 text-sm font-medium text-gray-600">
                  {item}
                  <button onClick={() => setProfile({ excludedIngredients: p.excludedIngredients.filter((x) => x !== item) })} className="text-gray-400 hover:text-rose-500">✕</button>
                </span>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400"><Microwave className="h-4 w-4" /> Équipements</h2>
          <div className="flex flex-wrap gap-2">
            {APPLIANCE_OPTIONS.map((a) => (
              <button key={a.id} onClick={() => toggleArr('kitchenAppliances', a.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-95 ${p.kitchenAppliances.includes(a.id) ? 'bg-emerald-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
                <span>{a.icon}</span> {a.label}
                {p.kitchenAppliances.includes(a.id) && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3 pt-2">
          <button onClick={regenerateWeek} className="btn-primary w-full"><RotateCcw className="h-4 w-4" /> Régénérer mon menu</button>
          <button onClick={() => setShowReset(true)} className="btn-secondary w-full text-rose-500 hover:bg-rose-50 hover:border-rose-200"><AlertTriangle className="h-4 w-4" /> Réinitialiser l'application</button>
        </section>
      </div>

      <Modal open={showReset} onClose={() => setShowReset(false)} maxWidth="max-w-md">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50"><AlertTriangle className="h-7 w-7 text-rose-500" /></div>
          <h2 className="text-xl font-bold text-gray-900">Réinitialiser ?</h2>
          <p className="mt-1 text-sm text-gray-500">Toutes vos données seront effacées. Cette action est irréversible.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setShowReset(false)} className="btn-secondary flex-1">Annuler</button>
            <button onClick={() => { resetApp(); setShowReset(false); }} className="flex-1 rounded-2xl bg-rose-500 px-6 py-3.5 font-semibold text-white transition-all hover:bg-rose-600 active:scale-[0.98]">Réinitialiser</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
