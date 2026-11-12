import React from 'react';
import { ShieldCheck, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onNavigateTab: (tab: 'feed' | 'help' | 'rights') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onNavigateTab }) => {
  return (
    <footer className="bg-[#f0ebe1] border-t border-stone-200/90 text-stone-700 py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
        {/* Col 1: About */}
        <div className="md:col-span-2 space-y-3">
          <div className="font-editorial text-xl font-bold text-[#134e5e]">
            Vozes de Crateús
          </div>
          <p className="text-stone-600 leading-relaxed max-w-md">
            Plataforma cívica e comunitária dedicada à escuta acolhedora, visibilidade e suporte a relatos de violência,
            abuso e injustiça em Crateús (CE) e no Sertão dos Inhamuns, com possibilidade de expansão regional.
          </p>
          <div className="text-[11px] text-stone-500 flex items-center gap-1.5 pt-1">
            <ShieldCheck className="w-4 h-4 text-[#52796f]" />
            <span>Privacidade garantida conforme a LGPD · Publicação anônima protegida</span>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-2">
          <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
            Navegação da Plataforma
          </div>
          <ul className="space-y-1.5 text-stone-600">
            <li>
              <button
                onClick={() => onNavigateTab('feed')}
                className="hover:text-[#134e5e] hover:underline"
              >
                Mural de Relatos Comunitários
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('help')}
                className="hover:text-[#134e5e] hover:underline"
              >
                Canais Oficiais de Crateús & Telefones
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateTab('rights')}
                className="hover:text-[#134e5e] hover:underline"
              >
                Cartilha de Direitos e Leis
              </button>
            </li>
            <li>
              <button
                onClick={onOpenPrivacy}
                className="hover:text-[#134e5e] hover:underline"
              >
                Termos de Privacidade e Sigilo
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Emergency Quick Contacts */}
        <div className="space-y-2">
          <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
            Canais Públicos 24h
          </div>
          <div className="space-y-1 text-stone-600 text-[11px]">
            <div><strong>190</strong> · Polícia Militar (Flagrantes)</div>
            <div><strong>180</strong> · Atendimento à Mulher</div>
            <div><strong>192</strong> · SAMU Socorro Médico</div>
            <div><strong>100</strong> · Disque Direitos Humanos</div>
            <div><strong>188</strong> · CVV Apoio Emocional</div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-stone-300/60 flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-500">
        <div>
          © {new Date().getFullYear()} Vozes de Crateús · Iniciativa comunitária de apoio e cidadania. Não substitui órgãos estatais.
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onOpenPrivacy} className="hover:text-stone-800 underline">
            Privacidade & Segurança
          </button>
          <span>·</span>
          <span>Crateús - Ceará</span>
        </div>
      </div>
    </footer>
  );
};
