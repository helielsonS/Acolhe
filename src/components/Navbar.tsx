import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface NavbarProps {
  activeTab: 'feed' | 'help' | 'rights' | 'admin' | 'profile';
  setActiveTab: (tab: 'feed' | 'help' | 'rights' | 'admin' | 'profile') => void;
  onOpenCreateModal: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateModal,
  onOpenAuthModal,
}) => {
  const { currentUser, isAdmin, isAuthenticated } = useAuth();
  const { reports, flags } = useData();

  const pendingReportsCount = reports.filter(r => r.status === 'pendente').length;
  const pendingFlagsCount = flags.filter(f => f.status === 'pendente').length;
  const totalAdminAlerts = pendingReportsCount + pendingFlagsCount;

  return (
    <header className="sticky top-0 z-40 bg-[#faf7f2]/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('feed')}
          className="text-left cursor-pointer group"
        >
          <span className="text-xl sm:text-2xl font-editorial font-bold text-[#134e5e] group-hover:text-[#0e3b47] transition-colors whitespace-nowrap shrink-0">
            Vozes de Crateús
          </span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('feed')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'feed'
                ? 'text-[#134e5e] font-semibold border-b-2 border-[#134e5e]'
                : 'hover:text-stone-900'
            }`}
          >
            Relatos
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'help'
                ? 'text-[#134e5e] font-semibold border-b-2 border-[#134e5e]'
                : 'hover:text-stone-900'
            }`}
          >
            Central de Ajuda
          </button>

          <button
            onClick={() => setActiveTab('rights')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'rights'
                ? 'text-[#134e5e] font-semibold border-b-2 border-[#134e5e]'
                : 'hover:text-stone-900'
            }`}
          >
            Orientações Legais
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'text-[#134e5e] font-semibold border-b-2 border-[#134e5e]'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <span>Painel de Moderação</span>
              {totalAdminAlerts > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-[#134e5e] text-white">
                  {totalAdminAlerts}
                </span>
              )}
            </button>
          )}

          {isAuthenticated ? (
            <button
              onClick={() => setActiveTab('profile')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'profile'
                  ? 'text-[#134e5e] font-semibold border-b-2 border-[#134e5e]'
                : 'hover:text-stone-900'
              }`}
            >
              Meu Perfil
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="whitespace-nowrap shrink-0 transition-colors py-1 hover:text-stone-900 text-stone-600"
            >
              Entrar
            </button>
          )}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#134e5e] hover:bg-[#0f3d4a] rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>+ Publicar Relato</span>
          </button>

          {/* Mobile menu link trigger or indicator */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => setActiveTab(activeTab === 'feed' ? 'help' : 'feed')}
              className="px-2.5 py-2 text-xs font-medium text-stone-700 border border-stone-300 rounded-lg whitespace-nowrap shrink-0"
            >
              {activeTab === 'feed' ? 'Canais de Ajuda' : 'Ver Relatos'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Secondary Navigation Ribbon */}
      <div className="flex md:hidden items-center justify-around text-xs font-medium text-stone-600 border-t border-stone-200/60 mt-2.5 pt-2">
        <button
          onClick={() => setActiveTab('feed')}
          className={`py-1 ${activeTab === 'feed' ? 'text-[#134e5e] font-bold' : ''}`}
        >
          Relatos
        </button>
        <button
          onClick={() => setActiveTab('help')}
          className={`py-1 ${activeTab === 'help' ? 'text-[#134e5e] font-bold' : ''}`}
        >
          Ajuda & Canais
        </button>
        <button
          onClick={() => setActiveTab('rights')}
          className={`py-1 ${activeTab === 'rights' ? 'text-[#134e5e] font-bold' : ''}`}
        >
          Direitos
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`py-1 flex items-center gap-1 ${activeTab === 'admin' ? 'text-[#134e5e] font-bold' : ''}`}
          >
            Moderação
            {totalAdminAlerts > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
            )}
          </button>
        )}
        <button
          onClick={() => (isAuthenticated ? setActiveTab('profile') : onOpenAuthModal())}
          className={`py-1 ${activeTab === 'profile' ? 'text-[#134e5e] font-bold' : ''}`}
        >
          {isAuthenticated ? 'Perfil' : 'Entrar'}
        </button>
      </div>
    </header>
  );
};
