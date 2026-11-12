import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { AVAILABLE_CITIES, CRATEUS_NEIGHBORHOODS } from '../data/initialData';
import { X, Shield, EyeOff, AlertTriangle, FileCheck2, Info, CheckCircle2 } from 'lucide-react';

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNotice: () => void;
}

export const CreateReportModal: React.FC<CreateReportModalProps> = ({
  isOpen,
  onClose,
  onSuccessNotice,
}) => {
  const { categories, addReport } = useData();
  const { currentUser, isAdmin } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'violencia-domestica');
  const [city, setCity] = useState('Crateús (CE)');
  const [neighborhood, setNeighborhood] = useState('Centro');
  const [isAnonymous, setIsAnonymous] = useState(currentUser?.defaultAnonymous ?? true);
  const [hasTriggerWarning, setHasTriggerWarning] = useState(false);
  const [triggerWarning, setTriggerWarning] = useState('Violência psicológica e intimidação');
  const [dateOccurred, setDateOccurred] = useState('Novembro de 2026');
  const [isOfficialChannelContacted, setIsOfficialChannelContacted] = useState(false);
  const [officialProtocolNumber, setOfficialProtocolNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await addReport({
        title,
        content,
        categoryId,
        city,
        neighborhood,
        isAnonymous,
        triggerWarning: hasTriggerWarning ? triggerWarning : undefined,
        dateOccurred,
        isOfficialChannelContacted,
        officialProtocolNumber: isOfficialChannelContacted ? officialProtocolNumber : undefined,
      });

      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        setIsSubmitting(false);
        // Reset form
        setTitle('');
        setContent('');
        setHasTriggerWarning(false);
        setIsOfficialChannelContacted(false);
        setOfficialProtocolNumber('');
        onSuccessNotice();
        onClose();
      }, 1600);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#fcfaf7] border border-stone-200 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-200 bg-[#f4efe6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#134e5e] text-white flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-editorial font-bold text-[#134e5e]">
                Compartilhar Relato Seguro
              </h2>
              <p className="text-xs text-stone-500">
                Comunidade de Crateús (CE) e Região dos Inhamuns
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md"
            aria-label="Fechar formulário"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-editorial font-bold text-stone-900 mb-2">
              Relato registrado com sucesso e acolhimento
            </h3>
            <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
              {isAdmin
                ? 'Como você está no modo administrador, seu relato já foi aprovado e inserido no feed.'
                : 'Seu relato foi recebido com sigilo e segurança. Ele passará pela moderação comunitária antes de se tornar público.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Privacy Shield Assurance Banner */}
            <div className="bg-[#eef4f1] border border-[#84a98c]/40 rounded-xl p-3.5 text-xs text-[#1e3b30] flex items-start gap-2.5">
              <EyeOff className="w-4 h-4 text-[#52796f] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-semibold text-[#134e5e] block mb-0.5">Garantia de Anonimato & Proteção:</span>
                Ao optar pelo relato anônimo, seus dados de cadastro não são veiculados publicamente em nenhum momento.
                Recomendamos não incluir nomes completos de parentes ou endereços residenciais exatos.
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div className="bg-white border border-stone-200 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-stone-800 block">
                  Publicar em modo 100% Anônimo
                </span>
                <span className="text-[11px] text-stone-500">
                  {isAnonymous
                    ? 'Seu nome não aparecerá; será exibido apenas "Relato Anônimo".'
                    : `Será assinado como: ${currentUser?.name || 'Seu nome de usuário'}`}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={e => setIsAnonymous(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#134e5e]"></div>
              </label>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Título do Relato *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Recusa de atendimento à idosa no posto de saúde local"
                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:border-[#134e5e] focus:bg-white"
                maxLength={120}
              />
              <div className="text-[11px] text-stone-400 text-right mt-1">
                {title.length}/120 caracteres
              </div>
            </div>

            {/* Category and City Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Categoria *
                </label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:border-[#134e5e]"
                >
                  {categories.filter(c => c.active).map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Cidade / Município *
                </label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:border-[#134e5e]"
                >
                  {AVAILABLE_CITIES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Neighborhood and Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Bairro ou Localidade
                </label>
                {city.includes('Crateús') ? (
                  <select
                    value={neighborhood}
                    onChange={e => setNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:border-[#134e5e]"
                  >
                    {CRATEUS_NEIGHBORHOODS.map(n => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={e => setNeighborhood(e.target.value)}
                    placeholder="Ex: Centro, Zona Rural..."
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:border-[#134e5e]"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Período ou Data do Ocorrido
                </label>
                <input
                  type="text"
                  value={dateOccurred}
                  onChange={e => setDateOccurred(e.target.value)}
                  placeholder="Ex: Novembro de 2026, Há 2 semanas..."
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:border-[#134e5e]"
                />
              </div>
            </div>

            {/* Content / Narrative */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Relato Completo *
              </label>
              <textarea
                required
                rows={5}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Descreva o que aconteceu com o máximo de serenidade e detalhes pertinentes. Seu relato ajuda a comunidade a romper o silêncio e mobilizar apoio."
                className="w-full p-3 text-sm bg-white border border-stone-300 rounded-lg focus:border-[#134e5e] focus:bg-white leading-relaxed font-sans"
              />
              <div className="text-[11px] text-stone-400 flex items-center justify-between mt-1">
                <span>Evite acusações com nomes de terceiros sem processo formal</span>
                <span>{content.length} caracteres</span>
              </div>
            </div>

            {/* Content Warning Option */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                <input
                  type="checkbox"
                  checked={hasTriggerWarning}
                  onChange={e => setHasTriggerWarning(e.target.checked)}
                  className="rounded text-[#134e5e] focus:ring-[#134e5e]"
                />
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Este relato contém temas sensíveis ou possíveis gatilhos emocionais
                </span>
              </label>

              {hasTriggerWarning && (
                <div className="pt-2 pl-6">
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Especificação do gatilho (para alertar outros leitores com cuidado):
                  </label>
                  <input
                    type="text"
                    value={triggerWarning}
                    onChange={e => setTriggerWarning(e.target.value)}
                    placeholder="Ex: Violência física, abuso psicológico, luto..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md focus:border-[#134e5e]"
                  />
                </div>
              )}
            </div>

            {/* Official Report Protocol Check */}
            <div className="bg-[#f7f5f0] border border-stone-200 rounded-xl p-3 text-xs space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                <input
                  type="checkbox"
                  checked={isOfficialChannelContacted}
                  onChange={e => setIsOfficialChannelContacted(e.target.checked)}
                  className="rounded text-[#134e5e] focus:ring-[#134e5e]"
                />
                <span className="flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-[#52796f]" />
                  Já realizei registro ou denúncia em canal oficial (Polícia, CREAS, MP, DDM)
                </span>
              </label>

              {isOfficialChannelContacted && (
                <div className="pt-2 pl-6">
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Número de Protocolo / BO (opcional para dar credibilidade ao relato):
                  </label>
                  <input
                    type="text"
                    value={officialProtocolNumber}
                    onChange={e => setOfficialProtocolNumber(e.target.value)}
                    placeholder="Ex: BO-DDM-2026/0129 ou OUV-SUS-982"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md focus:border-[#134e5e]"
                  />
                </div>
              )}
            </div>

            {/* Moderation Disclosure */}
            <div className="flex items-start gap-2 text-[11px] text-stone-500 bg-white p-2.5 rounded-lg border border-stone-200/80">
              <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <span>
                Para proteger todos os membros e manter um ambiente acolhedor, relatos novos passam por moderação prévia
                conforme as Diretrizes Comunitárias de Crateús.
              </span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#134e5e] hover:bg-[#0f3d4a] rounded-lg shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando com segurança...' : 'Enviar Relato para Moderação'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
