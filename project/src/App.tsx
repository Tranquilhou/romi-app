import { AppProvider, useApp } from '@/context/AppContext';
import { LandingPage } from '@/pages/LandingPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ShoppingListPage } from '@/pages/ShoppingListPage';
import { RecipesPage } from '@/pages/RecipesPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AppShell } from '@/components/AppShell';

function AppContent() {
  const { state } = useApp();

  if (!state.profile.onboarded) {
    if (state.currentView === 'onboarding') return <OnboardingPage />;
    return <LandingPage />;
  }

  const view = state.currentView;
  return (
    <AppShell>
      {view === 'dashboard' && <DashboardPage />}
      {view === 'shopping-list' && <ShoppingListPage />}
      {view === 'recipes' && <RecipesPage />}
      {view === 'settings' && <SettingsPage />}
    </AppShell>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
