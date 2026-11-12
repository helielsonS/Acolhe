import React from 'react';
import { ShieldCheck, PhoneCall, HeartHandshake, Eye, AlertCircle } from 'lucide-react';

interface HeroDisclaimerProps {
  onOpenCreate: () => void;
  onOpenHelp: () => void;
}

export const HeroDisclaimer: React.FC<HeroDisclaimerProps> = ({ onOpenCreate, onOpenHelp }) => {
  return (
    <section className="bg-gradient-to-b from-[#f3ede3] to-[#faf7f2] border-b border-stone-200/80 pt-8 pb-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Important Disclaimer Notice Banner */}
        <div className="bg-amber-50/90 border border-amber-200 text-amber-950 px-4 py-3 rounded-xl mb-6 flex items-start gap-3 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-amber-900">Aviso Institucional de Emergência:</span>{' '}
            Este aplicativo é uma iniciativa cívica e comunitária de acolhimento, escuta e visibilidade. Ele{' '}
            <strong className="underline underline-offset-2">não substitui serviços de urgência e emergência</strong>. Se
            você ou alguém está em perigo imediato, ligue imediatamente para a <strong>Polícia Militar (190)</strong> ou{' '}
            <strong>SAMU (192)</strong>.
          </div>
        </div>

        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-[#134e5e] leading-tight mb-4 tracking-tight">
            Sua história merece ser ouvida com respeito, cuidado e segurança
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed mb-6 font-sans">
            Espaço de escuta, acolhimento e memória cidadã para Crateús (CE) e região dos Inhamuns. Compartilhe de forma
            totalmente anônima relatos de violência, abusos ou injustiças, encontre solidariedade e acesse a rede oficial de
            direitos.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenCreate}
              className="px-5 py-2.5 bg-[#134e5e] hover:bg-[#0f3d4a] text-white font-medium rounded-lg shadow-sm text-sm transition-colors flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4 text-[#84a98c]" />
              <span>Compartilhar Relato Seguro</span>
            </button>
            <button
              onClick={onOpenHelp}
              className="px-5 py-2.5 bg-[#e8efe9] hover:bg-[#dbe7dc] text-[#134e5e] border border-[#84a98c]/40 font-medium rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-[#52796f]" />
              <span>Ver Telefones Oficiais de Crateús</span>
            </button>
          </div>
        </div>

        {/* Quick Dial Operational Ribbon */}
        <div className="bg-white/80 border border-stone-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2.5 text-center sm:text-left flex items-center gap-2 justify-center sm:justify-start">
            <ShieldCheck className="w-4 h-4 text-[#52796f]" />
            <span>Canais Oficiais e Gratuitos para Urgências (24 Horas)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <a
              href="tel:190"
              className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 transition-colors"
            >
              <span className="block font-bold text-stone-900 text-sm">190</span>
              <span className="text-stone-500 text-[11px]">Polícia Militar</span>
            </a>
            <a
              href="tel:180"
              className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 transition-colors"
            >
              <span className="block font-bold text-stone-900 text-sm">180</span>
              <span className="text-stone-500 text-[11px]">Central da Mulher</span>
            </a>
            <a
              href="tel:192"
              className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 transition-colors"
            >
              <span className="block font-bold text-stone-900 text-sm">192</span>
              <span className="text-stone-500 text-[11px]">SAMU Socorro</span>
            </a>
            <a
              href="tel:100"
              className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 transition-colors"
            >
              <span className="block font-bold text-stone-900 text-sm">100</span>
              <span className="text-stone-500 text-[11px]">Direitos Humanos</span>
            </a>
            <a
              href="tel:188"
              className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 col-span-2 sm:col-span-1 transition-colors"
            >
              <span className="block font-bold text-stone-900 text-sm">188</span>
              <span className="text-stone-500 text-[11px]">CVV Apoio Emocional</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
