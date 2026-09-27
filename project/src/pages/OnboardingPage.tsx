import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SUPERMARKETS } from '@/data/supermarkets';
import type { DietaryPreference, KitchenAppliance, MealMood, PortionStyle, ProteinTarget, SupermarketId } from '@/types';
import { ChevronLeft, ChevronRight, Check, Users, Wallet, ChefHat, ShoppingCart, Sparkles, Apple, Dumbbell, Ban, Microwave, ArrowLeft, Leaf, Zap, Utensils, HeartPulse, Globe2 } from 'lucide-react';

const TOTAL_STEPS = 10;

const PAIN_OPTIONS = [
  { id: 'ideas', label: 'Je ne sais jamais quoi cuisiner', desc: "Fini la panne d'inspiration à 18h.", icon: ChefHat },
  { id: 'budget', label: 'Je dépense trop en courses', desc: 'Un budget tenu, chaque semaine.', icon: Wallet },
  { id: 'time', label: 'Je passe trop de temps en cuisine', desc: 'Des recettes prêtes en 30 min.', icon: Zap },
  { id: 'balance', label: 'Je mange mal en semaine', desc: 'Des repas équilibrés, sans y penser.', icon: HeartPulse },
  { id: 'waste', label: 'Je jette trop de nourriture', desc: 'Les bonnes quantités, rien en trop.', icon: ShoppingCart },
];

const DIET_OPTIONS: { id: DietaryPreference; label: string }[] = [
  { id: 'vegetarian', label: 'Végétarien' },
  { id: 'pescetarian', label: 'Pescétarien' },
  { id: 'gluten_free', label: 'Sans gluten' },
  { id: 'lactose_free', label: 'Sans lactose' },
];

const PORTION_OPTIONS: { id: PortionStyle; label: string; desc: string }[] = [
  { id: 'any', label: 'Peu importe', desc: 'Je te laisse gérer les portions.' },
  { id: 'light', label: 'Léger', desc: '400–600 kcal' },
  { id: 'balanced', label: 'Équilibré', desc: '600–800 kcal' },
  { id: 'hearty', label: 'Costaud', desc: '+800 kcal' },
];

const PROTEIN_OPTIONS: { id: ProteinTarget; label: string; desc: string }[] = [
  { id: 'any', label: 'Comme ça vient', desc: 'Romi décide pour moi.' },
  { id: 'high', label: 'Riche en protéines', desc: '+30g par assiette' },
  { id: 'extra', label: 'Extra protéines', desc: '+40g par assiette' },
  { id: 'max', label: 'Protéines max', desc: '+50g par assiette' },
];

const MOOD_OPTIONS: { id: MealMood; label: string; icon: typeof Leaf }[] = [
  { id: 'healthy', label: 'Healthy', icon: Leaf },
  { id: 'quick', label: 'Rapide & facile', icon: Zap },
  { id: 'protein', label: 'Riche en protéines', icon: Dumbbell },
  { id: 'gourmand', label: 'Gourmand', icon: ChefHat },
  { id: 'family', label: 'En famille', icon: Users },
  { id: 'world', label: 'Saveurs du monde', icon: Globe2 },
];

const EXCLUDED_GROUPS = [
  {
    label: 'Légumes',
    items: ['Champignons', 'Aubergine', 'Courgette', 'Chou', 'Brocoli', 'Oignon', 'Poivron', 'Épinards', 'Betterave', 'Endive', 'Céleri', 'Avocat', 'Patate douce'],
  },
  { label: 'Produits de la mer', items: ['Poisson', 'Fruits de mer'] },
  {
    label: 'Autres',
    items: ['Coriandre', 'Olives', 'Fromage bleu', 'Ail', 'Anchois', 'Gingembre', 'Curry', 'Fromage de chèvre', 'Piment', 'Tofu', 'Moutarde', 'Légumineuses', 'Lait de coco', 'Miel'],
  },
];

const APPLIANCE_OPTIONS: { id: KitchenAppliance; label: string; icon: string }[] = [
  { id: 'oven', label: 'Four', icon: '🍞' },
  { id: 'stove', label: 'Plaque', icon: '🔥' },
  { id: 'airfryer', label: 'Air fryer', icon: '💨' },
];

const BUDGET_OPTIONS = [25, 30, 40, 50, 60, 80];

export function OnboardingPage() {
  const { completeOnboarding, setCurrentView } = useApp();
  const [step, setStep] = useState(1);
  const [supermarket, setSupermarket] = useState<SupermarketId>('lidl');
  const [people, setPeople] = useState(2);
  const [budget, setBudget] = useState(30);
  const [painPoints, setPainPoints] = useState<string[]>(['ideas']);
  const [moods, setMoods] = useState<MealMood[]>([]);
  const [diets, setDiets] = useState<DietaryPreference[]>([]);
  const [portionStyle, setPortionStyle] = useState<PortionStyle>('any');
  const [proteinTarget, setProteinTarget] = useState<ProteinTarget>('any');
  const [excluded, setExcluded] = useState<string[]>([]);
  const [appliances, setAppliances] = useState<KitchenAppliance[]>(['stove']);

  const toggle = <T,>(values: T[], update: (next: T[]) => void, value: T) => {
    update(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  const toggleMood = (mood: MealMood) => {
    if (moods.includes(mood)) {
      setMoods(moods.filter((item) => item !== mood));
    } else if (moods.length < 3) {
      setMoods([...moods, mood]);
    }
  };

  const handleFinish = () => {
    completeOnboarding({
      supermarket,
      adults: people,
      children: 0,
      weeklyBudget: budget,
      dietaryPreferences: diets,
      kitchenAppliances: appliances,
      portionStyle,
      proteinTarget,
      mealMoods: moods,
      painPoints,
      excludedIngredients: excluded,
    });
  };

  const renderHeader = () => (
    <div className="sticky top-0 z-40 border-b border-[#e8e2d3] bg-[#faf8f0]/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-2xl items-center gap-4 px-5 py-4">
        {step === 1 ? (
          <button onClick={() => setCurrentView('landing')} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0ede4] text-gray-700 transition-all hover:bg-[#e7e3d7] active:scale-90" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </button>
        ) : (
          <button onClick={() => setStep(step - 1)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0ede4] text-gray-700 transition-all hover:bg-[#e7e3d7] active:scale-90" aria-label="Étape précédente">
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e3dece]">
          <div className="h-full rounded-full bg-[#28904c] transition-all duration-500" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>
      </div>
    </div>
  );

  const selectionClass = (selected: boolean) => `transition-all active:scale-[0.98] ${selected ? 'border-[#27774a] bg-[#eef5e7] shadow-[0_4px_12px_rgba(39,119,74,0.08)]' : 'border-transparent bg-white shadow-[0_4px_18px_rgba(59,48,27,0.06)] hover:border-[#d7e7d1]'}`;

  return (
    <div className="min-h-screen bg-[#faf8f0] text-[#14382a]">
      {renderHeader()}
      <div className="mx-auto max-w-2xl px-5 py-8 sm:py-10">
        {step === 1 && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-4xl font-bold leading-tight text-[#123c2a] sm:text-5xl">Qu'est-ce qui te parle ?</h1>
            <p className="mt-2 text-gray-500">Choisis tout ce que tu vis en ce moment. On adaptera ton plan.</p>
            <div className="mt-6 space-y-3">
              {PAIN_OPTIONS.map((option) => {
                const selected = painPoints.includes(option.id);
                return (
                  <button key={option.id} onClick={() => toggle(painPoints, setPainPoints, option.id)} className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left ${selectionClass(selected)}`}>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e9f3df] text-[#287845]"><option.icon className="h-5 w-5" /></span>
                    <span className="min-w-0 flex-1"><span className="block font-bold text-[#132d22]">{option.label}</span><span className="mt-0.5 block text-sm text-gray-500">{option.desc}</span></span>
                    {selected && <Check className="h-5 w-5 shrink-0 text-[#287845]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-4xl font-bold leading-tight text-[#123c2a] sm:text-5xl">Choisis ton magasin</h1>
            <p className="mt-2 text-gray-500">On adaptera les ingrédients et les prix à ton enseigne préférée.</p>
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-[0_4px_18px_rgba(59,48,27,0.06)]">
              <span className="flex items-center gap-3 font-bold text-gray-800"><span className="text-lg">🇫🇷</span> France</span>
              <ChevronRight className="h-4 w-4 rotate-90 text-gray-500" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {SUPERMARKETS.map((store) => (
                <button key={store.id} onClick={() => setSupermarket(store.id)} className={`flex min-h-[102px] flex-col items-center justify-center gap-2 rounded-2xl border-2 ${selectionClass(supermarket === store.id)}`}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-extrabold text-white" style={{ backgroundColor: store.color }}>{store.name.charAt(0)}</span>
                  <span className="text-sm font-bold text-gray-800">{store.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h1 className="text-center font-serif text-4xl font-bold leading-tight text-[#123c2a] sm:text-5xl">Vous êtes combien ?</h1>
            <p className="text-center text-gray-500">On adapte les quantités et le coût.</p>
            <div className="flex min-h-[430px] flex-col items-center justify-center">
              <div className="text-8xl font-bold leading-none text-[#2b9148]">{people}</div>
              <div className="mt-2 text-gray-400">personne{people > 1 ? 's' : ''}</div>
              <div className="mt-9 flex items-center gap-5">
                <button onClick={() => setPeople(Math.max(1, people - 1))} className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f0ede4] text-2xl font-semibold text-gray-700 active:scale-90">−</button>
                <button onClick={() => setPeople(Math.min(12, people + 1))} className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1d6b43] text-2xl font-semibold text-white shadow-lg shadow-emerald-900/20 active:scale-90">+</button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-4xl font-bold leading-tight text-[#123c2a] sm:text-5xl">Quel est ton budget ?</h1>
            <p className="mt-2 text-gray-500">On adaptera tes repas à ton budget.</p>
            <div className="mt-10 text-center">
              <div className="text-7xl font-bold leading-none text-[#2b9148]">{budget} €</div>
              <div className="mt-2 text-gray-400">par semaine</div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#e8f2df] px-4 py-2 text-sm font-semibold text-[#287845]"><Users className="h-4 w-4" /> {people} personnes</div>
            </div>
            <input type="range" min="25" max="200" step="5" value={budget} onChange={(event) => setBudget(Number(event.target.value))} className="mt-10 w-full accent-[#2b9148]" />
            <div className="mt-2 flex justify-between text-sm font-semibold text-gray-700"><span>25 €<small className="ml-1 block font-normal text-gray-400">Budget serré</small></span><span className="text-right">200 €<small className="mr-1 block font-normal text-gray-400">Budget confort</small></span></div>
            <div className="mt-8 flex items-start gap-3 rounded-2xl bg-[#f4f0e4] p-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f2df] text-[#2b9148]"><Wallet className="h-5 w-5" /></span><p className="text-sm text-gray-600"><strong className="text-[#287845]">Jusqu'à 25 % d'économies</strong><br />Romi limite le gaspillage et optimise tes courses selon tes préférences.</p></div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-4xl font-bold leading-tight text-[#123c2a] sm:text-5xl">Quelle ambiance ?</h1>
            <p className="mt-2 text-gray-500">Choisis jusqu'à 3 styles de repas.</p>
            <div className="mt-6 space-y-3">
              {MOOD_OPTIONS.map((option) => {
                const selected = moods.includes(option.id);
                return <button key={option.id} onClick={() => toggleMood(option.id)} className={`flex w-full items-center gap-4 rounded-2xl border-2 p-3 text-left ${selectionClass(selected)}`}><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e9f3df] text-[#287845]"><option.icon className="h-5 w-5" /></span><span className="font-bold text-[#132d22]">{option.label}</span>{selected && <Check className="ml-auto h-5 w-5 text-[#287845]" />}</button>;
              })}
            </div>
            <p className="mt-3 text-center text-xs text-gray-400">{moods.length} / 3 sélectionnés</p>
          </div>
        )}

        {step === 6 && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-4xl font-bold leading-tight text-[#123c2a] sm:text-5xl">Régime ou allergies ?</h1>
            <p className="mt-2 text-gray-500">Coche ce qui te concerne, on s'adapte.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button onClick={() => setDiets([])} className={`rounded-xl px-4 py-3 text-sm font-semibold ${diets.length === 0 ? 'bg-[#1d6b43] text-white' : 'border border-gray-200 bg-white text-gray-600'}`}>Aucun</button>
              {DIET_OPTIONS.map((option) => <button key={option.id} onClick={() => toggle(diets, setDiets, option.id)} className={`rounded-xl px-4 py-3 text-sm font-semibold ${diets.includes(option.id) ? 'bg-[#1d6b43] text-white' : 'border border-gray-200 bg-white text-gray-600'}`}>{option.label}</button>)}
            </div>
            <div className="mt-6 rounded-2xl bg-[#e8f2df] p-4 text-center text-sm font-medium text-[#287845]">Toujours respecté<br /><span className="font-normal">Chaque recette de ta semaine respecte tes besoins, sans exception.</span></div>
          </div>
        )}

        {step === 7 && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-4xl font-bold leading-tight text-[#123c2a] sm:text-5xl">Ton assiette idéale ?</h1>
            <p className="mt-2 text-gray-500">On adapte les portions à tes besoins.</p>
            <div className="mt-6 space-y-3">{PORTION_OPTIONS.map((option) => <button key={option.id} onClick={() => setPortionStyle(option.id)} className={`flex w-full items-center justify-between rounded-2xl border-2 p-5 text-left ${selectionClass(portionStyle === option.id)}`}><span><strong className="block text-gray-900">{option.label}</strong><span className="text-sm text-gray-400">{option.desc}</span></span>{portionStyle === option.id && <Check className="h-5 w-5 text-[#287845]" />}</button>)}</div>
            <div className="mt-6 rounded-2xl bg-[#e8f2df] p-4 text-center text-sm font-medium text-[#287845]">Tu choisis, Romi dose : portions, courses et budget s'ajustent tout seuls.</div>
          </div>
        )}

        {step === 8 && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-4xl font-bold leading-tight text-[#123c2a] sm:text-5xl">Et côté protéines ?</h1>
            <p className="mt-2 text-gray-500">On adapte tes repas selon tes envies.</p>
            <div className="mt-6 space-y-3">{PROTEIN_OPTIONS.map((option) => <button key={option.id} onClick={() => setProteinTarget(option.id)} className={`flex w-full items-center justify-between rounded-2xl border-2 p-5 text-left ${selectionClass(proteinTarget === option.id)}`}><span><strong className="block text-gray-900">{option.label}</strong><span className="text-sm text-gray-400">{option.desc}</span></span>{proteinTarget === option.id && <Check className="h-5 w-5 text-[#287845]" />}</button>)}</div>
            <div className="mt-6 rounded-2xl bg-[#e8f2df] p-4 text-center text-sm font-medium text-[#287845]">Zéro calcul : les grammes sont déjà comptés, assiette par assiette.</div>
          </div>
        )}

        {step === 9 && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-4xl font-bold leading-tight text-[#123c2a] sm:text-5xl">Tu n'aimes pas ?</h1>
            <p className="mt-2 text-gray-500">Coche les ingrédients à exclure, on les évitera dans tes recettes.</p>
            <div className="mt-6 space-y-5">{EXCLUDED_GROUPS.map((group) => <div key={group.label}><div className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-400">{group.label}</div><div className="flex flex-wrap gap-2">{group.items.map((item) => <button key={item} onClick={() => toggle(excluded, setExcluded, item)} className={`rounded-xl px-3 py-2.5 text-sm font-semibold ${excluded.includes(item) ? 'bg-[#1d6b43] text-white' : 'border border-gray-200 bg-white text-gray-600'}`}>{item}</button>)}</div></div>)}</div>
          </div>
        )}

        {step === 10 && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-4xl font-bold leading-tight text-[#123c2a] sm:text-5xl">Ton équipement ?</h1>
            <p className="mt-2 text-gray-500">Sélectionne ce que tu as ou veux utiliser.</p>
            <div className="mt-6 grid grid-cols-3 gap-3">{APPLIANCE_OPTIONS.map((option) => <button key={option.id} onClick={() => toggle(appliances, setAppliances, option.id)} className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-5 ${selectionClass(appliances.includes(option.id))}`}><span className="text-3xl">{option.icon}</span><span className="text-sm font-semibold text-gray-700">{option.label}</span>{appliances.includes(option.id) && <Check className="h-4 w-4 text-[#287845]" />}</button>)}</div>
            <div className="mt-6 rounded-2xl bg-[#e8f2df] p-4 text-center text-sm font-medium text-[#287845]">Adapté à ta cuisine<br /><span className="font-normal">On ne te proposera que des recettes faisables avec ton équipement.</span></div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          {step < TOTAL_STEPS ? <button onClick={() => setStep(step + 1)} className="btn-primary w-full bg-[#1d6b43] shadow-[0_8px_20px_rgba(29,107,67,0.2)] sm:w-auto sm:min-w-[220px]">Continuer <ChevronRight className="h-4 w-4" /></button> : <button onClick={handleFinish} className="btn-primary w-full bg-[#1d6b43] shadow-[0_8px_20px_rgba(29,107,67,0.2)] sm:w-auto sm:min-w-[220px]">Générer mon menu <Check className="h-4 w-4" /></button>}
        </div>
      </div>
    </div>
  );
}
