import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { FlagReason } from '../types';
import { X, Flag, CheckCircle2, AlertCircle } from 'lucide-react';

interface ReportFlagModalProps {
  reportId: string | null;
  onClose: () => void;
}

export const ReportFlagModal: React.FC<ReportFlagModalProps> = ({ reportId, onClose }) => {
  const { flagReport, reports } = useData();

  const [reason, setReason] = useState<FlagReason>('violacao_privacidade');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!reportId) return null;

  const targetReport = reports.find(r => r.id === reportId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    try {
      await flagReport(reportId, reason, description);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 1800);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fcfaf7] border border-stone-200 rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 bg-[#f4efe6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-rose-700" />
            <h2 className="text-base font-editorial font-bold text-stone-900">
              Denunciar Conteúdo à Moderação
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-6 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-editorial font-bold text-stone-900 text-base">
              Denúncia Enviada com Sucesso
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Nossa equipe de moderação comunitária revisará esta publicação para averiguar possíveis infrações às diretrizes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
            <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-lg text-stone-600">
              Relato a ser analisado: <strong className="text-stone-900">"{targetReport?.title}"</strong>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Motivo da Denúncia *
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value as FlagReason)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs focus:border-[#134e5e]"
              >
                <option value="violacao_privacidade">Violação de Privacidade / Exposição de Terceiros</option>
                <option value="discurso_odio">Discurso de Ódio / Discriminação / Ofensa</option>
                <option value="desinformacao">Informação Falsa / Boato / Difamação Injustificada</option>
                <option value="ofensivo">Conteúdo Excessivamente Gráfico ou Inadequado</option>
                <option value="spam">Spam / Publicidade / Conteúdo Não Relacionado</option>
                <option value="outro">Outro Motivo Ético</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Detalhes ou Justificativa *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Por favor, explique o que há de inadequado nesta publicação para orientar os moderadores."
                className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-xs focus:border-[#134e5e]"
              />
            </div>

            <div className="flex items-start gap-2 text-[11px] text-stone-500 bg-amber-50/70 p-2.5 rounded border border-amber-200/60">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                As denúncias são anônimas e sigilosas. Relatos com violações graves serão temporariamente recolhidos para
                inspeção.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-stone-600 hover:text-stone-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-semibold shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Submeter Denúncia'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
