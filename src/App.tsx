import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { Navbar } from './components/Navbar';
import { HeroDisclaimer } from './components/HeroDisclaimer';
import { FeedSection } from './components/FeedSection';
import { HelpCenter } from './components/HelpCenter';
import { AdminPanel } from './components/AdminPanel';
import { UserProfile } from './components/UserProfile';
import { CreateReportModal } from './components/CreateReportModal';
import { AuthModal } from './components/AuthModal';
import { ReportFlagModal } from './components/ReportFlagModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { Footer } from './components/Footer';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

function MainApp() {
  const { currentUser, isAdmin, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<'feed' | 'help' | 'rights' | 'admin' | 'profile'>('feed');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'recovery'>('login');
  const [flaggingReportId, setFlaggingReportId] = useState<string | null>(null);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Success notice toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Emergency Quick Exit Handler
  const handleQuickExit = () => {
    // Immediately navigate away to a neutral safe weather or news page
    window.location.replace('https://www.google.com.br/search?q=previsao+do+tempo+crateus+ceara');
  };

  // Keyboard shortcut listener for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isCreateModalOpen && !isAuthModalOpen && !flaggingReportId && !isPrivacyModalOpen) {
        handleQuickExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCreateModalOpen, isAuthModalOpen, flaggingReportId, isPrivacyModalOpen]);

  // If user tries to open admin tab without admin role, prompt or handle gracefully
  const handleSelectTab = (tab: 'feed' | 'help' | 'rights' | 'admin' | 'profile') => {
    if (tab === 'profile' && !isAuthenticated) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    if (tab === 'admin' && !isAdmin) {
      showToast('Aba de moderação é exclusiva para administradores. Use o seletor no topo para alternar para Administrador.');
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-stone-800 antialiased selection:bg-[#134e5e]/20 selection:text-[#0f3d4a]">
      {/* Top Testing & Safety Bar */}
      <RoleSwitcherBar
        onQuickExit={handleQuickExit}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
      />

      {/* Main Top Bar Contract Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenAuthModal={() => {
          setAuthModalMode('login');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'feed' && (
          <>
            <HeroDisclaimer
              onOpenCreate={() => setIsCreateModalOpen(true)}
              onOpenHelp={() => handleSelectTab('help')}
            />
            <FeedSection
              onOpenCreate={() => setIsCreateModalOpen(true)}
              onOpenFlagModal={reportId => setFlaggingReportId(reportId)}
            />
          </>
        )}

        {activeTab === 'help' && (
          <HelpCenter onOpenCreate={() => setIsCreateModalOpen(true)} />
        )}

        {activeTab === 'rights' && (
          <HelpCenter onOpenCreate={() => setIsCreateModalOpen(true)} />
        )}

        {activeTab === 'admin' && <AdminPanel />}

        {activeTab === 'profile' && (
          <UserProfile
            onOpenCreate={() => setIsCreateModalOpen(true)}
            onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#134e5e] text-white px-4 py-3 rounded-xl shadow-lg border border-[#84a98c]/30 flex items-center gap-2.5 text-xs max-w-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#84a98c] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <CreateReportModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccessNotice={() => showToast('Relato enviado com sucesso para a moderação comunitária.')}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <ReportFlagModal
        reportId={flaggingReportId}
        onClose={() => setFlaggingReportId(null)}
      />

      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Site Footer */}
      <Footer
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        onNavigateTab={handleSelectTab}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
}
