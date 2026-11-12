import React, { useState } from 'react';
import { CommunityReport, ReactionType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  Flag,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
  Trash2,
  FileCheck2,
} from 'lucide-react';

interface ReportCardProps {
  report: CommunityReport;
  onOpenFlagModal: (reportId: string) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onOpenFlagModal }) => {
  const { currentUser, isAdmin } = useAuth();
  const { categories, toggleReaction, deleteReport, moderateReport, userReactions } = useData();

  const [isWarningDismissed, setIsWarningDismissed] = useState<boolean>(!report.triggerWarning);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const category = categories.find(c => c.id === report.categoryId);
  const isAuthor = currentUser && currentUser.id === report.authorId;
  const currentReactions = userReactions[report.id] || [];

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return report.dateOccurred || 'Data informada';
    }
  };

  const hasWarning = !!report.triggerWarning;

  return (
    <article className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 transition-shadow hover:shadow-xs relative">
      {/* Top Header: Unboxed metadata with typographic separators */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 mb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-[#134e5e]">{category?.name || 'Relato Comunitário'}</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>{report.city} ({report.neighborhood})</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>{formatDate(report.createdAt)}</span>

          {/* Status for author or admin */}
          {(isAuthor || isAdmin) && (
            <>
              <span aria-hidden="true" className="text-stone-300">·</span>
              {report.status === 'aprovado' && (
                <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Aprovado na moderação
                </span>
              )}
              {report.status === 'pendente' && (
                <span className="text-amber-700 font-medium inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Em análise pela moderação
                </span>
              )}
              {report.status === 'rejeitado' && (
                <span className="text-rose-700 font-medium inline-flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> Não aprovado
                </span>
              )}
            </>
          )}
        </div>

        {/* Options dropdown button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Opções do relato"
            className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-7 w-48 bg-white border border-stone-200 rounded-lg shadow-lg py-1.5 z-20 text-xs">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenFlagModal(report.id);
                }}
                className="w-full text-left px-3.5 py-1.5 text-stone-700 hover:bg-stone-50 flex items-center gap-2"
              >
                <Flag className="w-3.5 h-3.5 text-stone-400" />
                <span>Denunciar relato</span>
              </button>

              {(isAuthor || isAdmin) && (
                <>
                  <div className="my-1 border-t border-stone-100" />
                  <button
                    onClick={() => {
                      if (window.confirm('Tem certeza de que deseja excluir este relato?')) {
                        deleteReport(report.id);
                      }
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir relato</span>
                  </button>
                </>
              )}

              {isAdmin && report.status === 'pendente' && (
                <>
                  <div className="my-1 border-t border-stone-100" />
                  <button
                    onClick={() => {
                      moderateReport(report.id, 'aprovado');
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Aprovar publicação</span>
                  </button>
                  <button
                    onClick={() => {
                      const reason = window.prompt('Motivo da reprovação (opcional):') || undefined;
                      moderateReport(report.id, 'rejeitado', reason);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-rose-700 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Rejeitar publicação</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h2 className="text-lg sm:text-xl font-editorial font-bold text-stone-900 mb-2 leading-snug">
        {report.title}
      </h2>

      {/* Author Indicator */}
      <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-3.5">
        {report.isAnonymous ? (
          <>
            <Shield className="w-3.5 h-3.5 text-[#52796f]" />
            <span className="font-medium text-stone-600">Autoria 100% Anônima e Protegida</span>
          </>
        ) : (
          <span className="font-medium text-stone-700">Por {report.authorName}</span>
        )}
      </div>

      {/* Content Warning Notice if present and not revealed */}
      {hasWarning && !isWarningDismissed ? (
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-700 flex-1">
              <span className="font-semibold text-stone-900 block mb-0.5">Aviso de Conteúdo Sensível:</span>
              <p className="mb-2.5 text-stone-600">{report.triggerWarning}</p>
              <button
                onClick={() => setIsWarningDismissed(true)}
                className="px-3 py-1.5 bg-[#134e5e] hover:bg-[#0f3d4a] text-white font-medium rounded-md text-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ler relato completo</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Report Prose Body */
        <div className="mb-4 text-stone-700 text-sm leading-relaxed whitespace-pre-line font-sans">
          {report.content}
          {hasWarning && isWarningDismissed && (
            <button
              onClick={() => setIsWarningDismissed(false)}
              className="block mt-2 text-xs text-stone-400 hover:text-stone-600 underline"
            >
              Ocultar relato sensível
            </button>
          )}
        </div>
      )}

      {/* Official Channel Registered Notice */}
      {report.isOfficialChannelContacted && (
        <div className="mb-4 bg-[#f4f7f5] border border-[#84a98c]/30 rounded-lg px-3.5 py-2 text-xs text-[#284b3e] flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-[#52796f] shrink-0" />
          <span>
            <strong>Formalizado em órgão oficial:</strong>{' '}
            {report.officialProtocolNumber ? (
              <span className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-[#84a98c]/40">
                {report.officialProtocolNumber}
              </span>
            ) : (
              'Vítima registrou em canal governamental competente'
            )}
          </span>
        </div>
      )}

      {/* Empathetic Support Reactions Section */}
      <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs text-stone-400 font-medium">Reações de Apoio & Solidariedade:</div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Reaction 1: Solidariedade */}
          <button
            onClick={() => toggleReaction(report.id, 'solidariedade')}
            title="Expressar Solidariedade e Acolhimento"
            className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              currentReactions.includes('solidariedade')
                ? 'bg-[#134e5e] text-white border-[#134e5e]'
                : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
            }`}
          >
            <span>🤝</span>
            <span>Solidariedade</span>
            <span className="font-semibold tabular-nums">{report.reactions.solidariedade}</span>
          </button>

          {/* Reaction 2: Força */}
          <button
            onClick={() => toggleReaction(report.id, 'forca')}
            title="Expressar Força e Coragem"
            className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              currentReactions.includes('forca')
                ? 'bg-[#52796f] text-white border-[#52796f]'
                : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
            }`}
          >
            <span>✊</span>
            <span>Força</span>
            <span className="font-semibold tabular-nums">{report.reactions.forca}</span>
          </button>

          {/* Reaction 3: Apoio */}
          <button
            onClick={() => toggleReaction(report.id, 'apoio')}
            title="Dizer: Não está só"
            className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              currentReactions.includes('apoio')
                ? 'bg-[#84a98c] text-[#0f3d4a] border-[#84a98c]'
                : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
            }`}
          >
            <span>🕊️</span>
            <span>Não está só</span>
            <span className="font-semibold tabular-nums">{report.reactions.apoio}</span>
          </button>

          {/* Reaction 4: Escuta */}
          <button
            onClick={() => toggleReaction(report.id, 'escuta')}
            title="Dizer: Sua voz foi ouvida e acolhida"
            className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              currentReactions.includes('escuta')
                ? 'bg-[#0e7490] text-white border-[#0e7490]'
                : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
            }`}
          >
            <span>👂</span>
            <span>Voz ouvida</span>
            <span className="font-semibold tabular-nums">{report.reactions.escuta}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
