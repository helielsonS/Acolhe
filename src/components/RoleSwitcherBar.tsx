import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User as UserIcon, EyeOff, ShieldAlert, LogOut } from 'lucide-react';

interface RoleSwitcherBarProps {
  onQuickExit: () => void;
  onOpenPrivacy: () => void;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({ onQuickExit, onOpenPrivacy }) => {
  const { currentUser, isAdmin, switchRole, logout } = useAuth();

  return (
    <div className="bg-[#134e5e] text-white text-xs py-2 px-4 border-b border-[#0f3d4a]/40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Security and privacy notice */}
        <div className="flex items-center gap-2 text-stone-200">
          <Shield className="w-3.5 h-3.5 text-[#84a98c] shrink-0" />
          <span className="hidden sm:inline">Espaço Protegido & Sigiloso · Crateús (CE) e Região</span>
          <span className="sm:hidden">Espaço Seguro · Crateús</span>
          <button
            onClick={onOpenPrivacy}
            className="text-[#a3b18a] hover:text-white underline underline-offset-2 ml-1"
          >
            Proteção de Dados & Sigilo
          </button>
        </div>

        {/* Center / Right: Demo Role Switcher + Quick Exit */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#0e3b47]/70 px-2.5 py-1 rounded-md border border-[#1d6577]/50">
            <span className="text-stone-300 font-medium">Modo de visualização:</span>
            <button
              onClick={() => switchRole('admin')}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                isAdmin
                  ? 'bg-[#84a98c] text-[#0f3d4a] font-semibold'
                  : 'text-stone-200 hover:text-white'
              }`}
              title="Acessar painel de moderação e gestão como Administrador"
            >
              Moderador/Admin
            </button>
            <span className="text-stone-500">|</span>
            <button
              onClick={() => switchRole('user')}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                currentUser && !isAdmin
                  ? 'bg-[#84a98c] text-[#0f3d4a] font-semibold'
                  : 'text-stone-200 hover:text-white'
              }`}
              title="Visualizar como Cidadão autenticado"
            >
              Cidadão
            </button>
            <span className="text-stone-500">|</span>
            <button
              onClick={() => switchRole('guest')}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                !currentUser
                  ? 'bg-[#84a98c] text-[#0f3d4a] font-semibold'
                  : 'text-stone-200 hover:text-white'
              }`}
              title="Navegar como visitante não identificado"
            >
              Visitante
            </button>
          </div>

          {/* Quick Exit Emergency Safety Button */}
          <button
            onClick={onQuickExit}
            className="flex items-center gap-1.5 bg-rose-700 hover:bg-rose-800 text-white font-medium px-2.5 py-1 rounded transition-colors shadow-sm shrink-0"
            title="Sair imediatamente e redirecionar para página neutra por segurança (Tecla Esc)"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="font-semibold">Saída Rápida (Esc)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
