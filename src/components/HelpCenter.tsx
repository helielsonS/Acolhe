import React, { useState } from 'react';
import { OFFICIAL_CHANNELS, LEGAL_GUIDES } from '../data/initialData';
import {
  Phone,
  MapPin,
  Clock,
  AlertOctagon,
  ShieldAlert,
  ExternalLink,
  BookOpen,
  HelpCircle,
  FileText,
  Search,
} from 'lucide-react';

interface HelpCenterProps {
  onOpenCreate: () => void;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ onOpenCreate }) => {
  const [activeSubTab, setActiveSubTab] = useState<'canais' | 'direitos'>('canais');
  const [channelFilter, setChannelFilter] = useState<'all' | 'Crateús (Local)' | 'Nacional' | 'policial' | 'juridico' | 'assistencial'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChannels = OFFICIAL_CHANNELS.filter(ch => {
    if (channelFilter === 'Crateús (Local)' && ch.scope !== 'Crateús (Local)') return false;
    if (channelFilter === 'Nacional' && ch.scope !== 'Nacional') return false;
    if (channelFilter === 'policial' && ch.category !== 'policial') return false;
    if (channelFilter === 'juridico' && ch.category !== 'juridico') return false;
    if (channelFilter === 'assistencial' && ch.category !== 'assistencial') return false;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        ch.name.toLowerCase().includes(term) ||
        ch.description.toLowerCase().includes(term) ||
        ch.shortName.toLowerCase().includes(term) ||
        ch.phone.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <section className="py-8 px-4 sm:px-6 max-w-5xl mx-auto font-sans">
      {/* Prominent Emergency Service Disclaimer Box */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 rounded-2xl p-5 mb-8 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-900 shrink-0 mt-0.5">
            <AlertOctagon className="w-6 h-6 text-amber-800" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-editorial font-bold text-amber-950 mb-1">
              Esclarecimento Fundamental: Não Substituição de Serviços Oficiais
            </h2>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed mb-3">
              O aplicativo <strong>Vozes de Crateús</strong> é uma plataforma comunitária de apoio moral, registro cívico
              e conscientização pública.{' '}
              <span className="font-semibold underline">
                Ele NÃO substitui a autoridade policial, serviços médicos do SAMU, o Ministério Público, a Defensoria Pública
                ou qualquer órgão oficial de atendimento de emergência.
              </span>
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-amber-950">
              <span className="bg-white/80 border border-amber-200 px-2.5 py-1 rounded-md">
                Emergência Policial Imediata: <strong>190</strong>
              </span>
              <span className="bg-white/80 border border-amber-200 px-2.5 py-1 rounded-md">
                Central da Mulher: <strong>180</strong>
              </span>
              <span className="bg-white/80 border border-amber-200 px-2.5 py-1 rounded-md">
                Socorro Médico Urgente: <strong>192</strong>
              </span>
              <span className="bg-white/80 border border-amber-200 px-2.5 py-1 rounded-md">
                Apoio Emocional CVV: <strong>188</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-3 border-b border-stone-200 mb-6">
        <button
          onClick={() => setActiveSubTab('canais')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 relative ${
            activeSubTab === 'canais'
              ? 'text-[#134e5e] border-b-2 border-[#134e5e]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Phone className="w-4 h-4 text-[#52796f]" />
          <span>Canais Oficiais & Telefones (Crateús e Brasil)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('direitos')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 relative ${
            activeSubTab === 'direitos'
              ? 'text-[#134e5e] border-b-2 border-[#134e5e]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#52796f]" />
          <span>Cartilha de Direitos & O Que Fazer</span>
        </button>
      </div>

      {/* Sub-Tab 1: Canais Oficiais */}
      {activeSubTab === 'canais' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Filtrar canal oficial (ex: Defensoria, DDM, Delegacia, CREAS...)"
                className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:bg-white focus:border-[#134e5e]"
              />
            </div>

            {/* Quick Segment Filter */}
            <div className="flex items-center gap-1 flex-wrap">
              <button
                onClick={() => setChannelFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  channelFilter === 'all'
                    ? 'bg-[#134e5e] text-white font-medium'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setChannelFilter('Crateús (Local)')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  channelFilter === 'Crateús (Local)'
                    ? 'bg-[#134e5e] text-white font-medium'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Crateús (Local)
              </button>
              <button
                onClick={() => setChannelFilter('policial')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  channelFilter === 'policial'
                    ? 'bg-[#134e5e] text-white font-medium'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Policial / Flagrante
              </button>
              <button
                onClick={() => setChannelFilter('juridico')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  channelFilter === 'juridico'
                    ? 'bg-[#134e5e] text-white font-medium'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Defensoria / MP
              </button>
              <button
                onClick={() => setChannelFilter('assistencial')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  channelFilter === 'assistencial'
                    ? 'bg-[#134e5e] text-white font-medium'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                CREAS / Apoio Social
              </button>
            </div>
          </div>

          {/* Channels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChannels.map(channel => (
              <div
                key={channel.id}
                className={`bg-white border rounded-xl p-5 shadow-xs transition-shadow hover:shadow-sm ${
                  channel.emergency
                    ? 'border-rose-200/90 bg-gradient-to-br from-white to-rose-50/20'
                    : 'border-stone-200/90'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-[#134e5e] block">
                      {channel.scope} · {channel.category.toUpperCase()}
                    </span>
                    <h3 className="text-base font-editorial font-bold text-stone-900 leading-snug">
                      {channel.name}
                    </h3>
                  </div>
                  {channel.emergency && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      Emergência 24h
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {channel.description}
                </p>

                <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#52796f] shrink-0" />
                    <span className="font-semibold text-stone-900">{channel.phoneDisplay}</span>
                  </div>

                  {channel.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span>{channel.address}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{channel.workingHours}</span>
                  </div>
                </div>

                {/* Call or Visit Button */}
                <div className="pt-2">
                  {channel.actionUrl?.startsWith('tel:') ? (
                    <a
                      href={channel.actionUrl}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#134e5e] hover:bg-[#0f3d4a] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Ligar Agora ({channel.phone})</span>
                    </a>
                  ) : (
                    <a
                      href={channel.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors border border-stone-300"
                    >
                      <span>Acessar Portal Oficial</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Cartilha de Direitos & Orientações */}
      {activeSubTab === 'direitos' && (
        <div className="space-y-6">
          <div className="bg-[#f2efe9] border border-stone-300/70 rounded-xl p-5 mb-4">
            <h3 className="text-lg font-editorial font-bold text-[#134e5e] mb-1">
              Guia Prático de Direitos e Providências
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Orientações jurídicas e de proteção pessoal para orientar cidadãos e vítimas em situações delicadas.
              Consulte sempre profissionais habilitados da Defensoria Pública ou advogados para representação judicial.
            </p>
          </div>

          <div className="space-y-5">
            {LEGAL_GUIDES.map(guide => (
              <div
                key={guide.id}
                className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs"
              >
                <div className="text-xs font-semibold text-[#52796f] uppercase tracking-wider mb-1">
                  {guide.category}
                </div>
                <h4 className="text-xl font-editorial font-bold text-stone-900 mb-1">
                  {guide.title}
                </h4>
                <p className="text-xs text-stone-500 mb-6">
                  {guide.subtitle}
                </p>

                {/* Steps */}
                <div className="space-y-4 mb-6">
                  {guide.steps.map(step => (
                    <div key={step.step} className="flex items-start gap-3.5">
                      <div className="w-7 h-7 rounded-full bg-[#134e5e] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {step.step}
                      </div>
                      <div className="text-xs leading-relaxed">
                        <strong className="block text-stone-900 font-semibold mb-0.5 text-sm">
                          {step.title}
                        </strong>
                        <span className="text-stone-600">{step.description}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Important Notice */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-700 leading-relaxed">
                  <strong className="font-semibold text-stone-900 block mb-1">Atenção jurídica:</strong>
                  {guide.importantNotice}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
