import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { AVAILABLE_CITIES } from '../data/initialData';
import {
  User as UserIcon,
  Shield,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  Download,
  LogOut,
  Save,
  Lock,
} from 'lucide-react';

interface UserProfileProps {
  onOpenCreate: () => void;
  onOpenPrivacy: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onOpenCreate, onOpenPrivacy }) => {
  const { currentUser, updateProfile, logout } = useAuth();
  const { reports, categories, deleteReport } = useData();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [city, setCity] = useState(currentUser?.city || 'Crateús (CE)');
  const [defaultAnonymous, setDefaultAnonymous] = useState(currentUser?.defaultAnonymous ?? true);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!currentUser) return null;

  const myReports = reports.filter(r => r.authorId === currentUser.id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      city,
      defaultAnonymous,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleExportData = () => {
    const exportObject = {
      userData: currentUser,
      reports: myReports,
      exportedAt: new Date().toISOString(),
      platform: 'Vozes de Crateús - Proteção Comunitária',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `meus_dados_vozes_crateus_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <section className="py-8 px-4 sm:px-6 max-w-5xl mx-auto font-sans">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#52796f] uppercase tracking-wider block mb-1">
            Gestão Pessoal & Privacidade
          </span>
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-900">
            Meu Perfil e Relatos
          </h1>
        </div>

        <button
          onClick={logout}
          className="px-3.5 py-1.5 text-xs text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sair da Conta</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Data & Privacy Settings */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-stone-100">
              <div className="w-12 h-12 rounded-full bg-[#134e5e] text-white flex items-center justify-center font-editorial font-bold text-lg">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-editorial font-bold text-stone-900 text-base leading-snug">
                  {currentUser.name}
                </div>
                <div className="text-xs text-stone-500">{currentUser.email}</div>
                <div className="text-[11px] text-[#52796f] font-medium mt-0.5">{currentUser.city}</div>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:bg-white focus:border-[#134e5e]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">E-mail Cadastrado</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:bg-white focus:border-[#134e5e]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Cidade Principal</label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:bg-white focus:border-[#134e5e]"
                >
                  {AVAILABLE_CITIES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Privacy Preference Toggle */}
              <div className="pt-2 border-t border-stone-100">
                <label className="flex items-start gap-2 cursor-pointer text-stone-800">
                  <input
                    type="checkbox"
                    checked={defaultAnonymous}
                    onChange={e => setDefaultAnonymous(e.target.checked)}
                    className="mt-0.5 rounded text-[#134e5e] focus:ring-[#134e5e]"
                  />
                  <div>
                    <span className="font-semibold block">Preferência de Anonimato Padrão</span>
                    <span className="text-[11px] text-stone-500 leading-tight block mt-0.5">
                      Marcar automaticamente novos relatos como anônimos para sua proteção.
                    </span>
                  </div>
                </label>
              </div>

              {savedNotice && (
                <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-center font-medium text-xs">
                  Alterações salvas com sucesso!
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-[#134e5e] hover:bg-[#0f3d4a] text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Alterações</span>
              </button>
            </form>
          </div>

          {/* Privacy & LGPD Tools Box */}
          <div className="bg-[#f2efe9] border border-stone-300/70 rounded-2xl p-5 text-xs space-y-3">
            <div className="flex items-center gap-2 text-[#134e5e] font-semibold">
              <Shield className="w-4 h-4 text-[#52796f]" />
              <span>Garantia de Privacidade & LGPD</span>
            </div>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              Seus dados nunca são comercializados ou compartilhados com terceiros. Em caso de relatos anônimos, a
              desvinculação pública é irreversível para resguardar sua integridade moral e física.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleExportData}
                className="w-full py-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-stone-500" />
                <span>Exportar Meus Dados (JSON)</span>
              </button>

              <button
                onClick={onOpenPrivacy}
                className="w-full text-center text-[11px] text-[#134e5e] hover:underline pt-1"
              >
                Ler Termos de Privacidade e Proteção
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: User's Reports History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-editorial font-bold text-stone-900">
              Meus Relatos Compartilhados ({myReports.length})
            </h2>

            <button
              onClick={onOpenCreate}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#134e5e] hover:bg-[#0f3d4a] rounded-lg shadow-xs"
            >
              + Novo Relato
            </button>
          </div>

          {myReports.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center">
              <FileText className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <h3 className="font-editorial font-bold text-stone-800 text-base mb-1">
                Você ainda não publicou relatos
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
                Quando você registrar uma história, poderá acompanhar o status de moderação e as manifestações de apoio da
                comunidade aqui.
              </p>
              <button
                onClick={onOpenCreate}
                className="px-4 py-2 bg-[#134e5e] hover:bg-[#0f3d4a] text-white text-xs font-medium rounded-lg"
              >
                Compartilhar meu primeiro relato
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myReports.map(report => {
                const cat = categories.find(c => c.id === report.categoryId);
                return (
                  <div
                    key={report.id}
                    className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-stone-500">
                        <span className="font-semibold text-[#134e5e]">{cat?.name}</span>
                        <span aria-hidden="true">·</span>
                        <span>{report.city}</span>
                        <span aria-hidden="true">·</span>
                        <span>{report.isAnonymous ? 'Publicado como Anônimo' : 'Publicado com seu nome'}</span>
                      </div>

                      {/* Status Badge */}
                      {report.status === 'aprovado' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Aprovado no Feed
                        </span>
                      )}
                      {report.status === 'pendente' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Clock className="w-3 h-3" /> Em Análise pela Moderação
                        </span>
                      )}
                      {report.status === 'rejeitado' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <XCircle className="w-3 h-3" /> Não Aprovado
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-editorial font-bold text-stone-900">
                      {report.title}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {report.content}
                    </p>

                    {report.rejectionReason && (
                      <div className="text-xs bg-rose-50 text-rose-800 border border-rose-200 rounded p-2">
                        <strong>Motivo informado pela moderação:</strong> {report.rejectionReason}
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
                      <span>
                        Apoios recebidos:{' '}
                        <strong className="text-stone-800">
                          {report.reactions.solidariedade +
                            report.reactions.forca +
                            report.reactions.apoio +
                            report.reactions.escuta}
                        </strong>
                      </span>

                      <button
                        onClick={() => {
                          if (window.confirm('Tem certeza de que deseja apagar este relato?')) {
                            deleteReport(report.id);
                          }
                        }}
                        className="text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
