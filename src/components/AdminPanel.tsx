import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  AlertTriangle,
  Layers,
  Users,
  BarChart3,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Plus,
  RefreshCw,
  Clock,
  Flag,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    reports,
    flags,
    categories,
    moderateReport,
    deleteReport,
    resolveFlag,
    addCategory,
    toggleCategoryActive,
    resetToInitial,
  } = useData();
  const { allUsers, toggleUserStatus, currentUser } = useAuth();

  const [adminTab, setAdminTab] = useState<'moderacao' | 'denuncias' | 'categorias' | 'usuarios' | 'metricas'>('moderacao');

  // Categorias form
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Rejection modal
  const [rejectReportId, setRejectReportId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Texto contém violação das diretrizes comunitárias');

  const pendingReports = reports.filter(r => r.status === 'pendente');
  const pendingFlags = flags.filter(f => f.status === 'pendente');

  const totalReactions = reports.reduce((acc, r) => {
    return acc + r.reactions.solidariedade + r.reactions.forca + r.reactions.apoio + r.reactions.escuta;
  }, 0);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName, newCatDesc || 'Categoria comunitária cadastrada');
    setNewCatName('');
    setNewCatDesc('');
  };

  const handleConfirmRejection = () => {
    if (rejectReportId) {
      moderateReport(rejectReportId, 'rejeitado', rejectionReason);
      setRejectReportId(null);
    }
  };

  return (
    <section className="py-8 px-4 sm:px-6 max-w-6xl mx-auto font-sans">
      {/* Top Banner */}
      <div className="bg-[#134e5e] text-white rounded-2xl p-6 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#84a98c] text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Área Restrita da Coordenação e Moderação</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-white">
            Painel Administrativo Comunitário
          </h1>
          <p className="text-xs text-stone-200 mt-1 max-w-2xl">
            Moderação de relatos sensíveis, análise de denúncias de conteúdo, governança de categorias e supervisão de usuários
            de Crateús e região.
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Restaurar dados de demonstração originais de Crateús?')) {
              resetToInitial();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f3d4a] hover:bg-[#0a2a33] text-stone-200 rounded-lg text-xs font-medium border border-[#84a98c]/30"
          title="Restaurar dados iniciais"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restaurar Demonstração</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-stone-200 mb-6 overflow-x-auto pb-1 text-xs sm:text-sm font-medium">
        <button
          onClick={() => setAdminTab('moderacao')}
          className={`px-3.5 py-2 rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            adminTab === 'moderacao'
              ? 'bg-white border-t-2 border-t-[#134e5e] text-[#134e5e] font-semibold shadow-xs border-x border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Clock className="w-4 h-4 text-[#52796f]" />
          <span>Fila de Moderação</span>
          {pendingReports.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-xs font-bold bg-amber-600 text-white">
              {pendingReports.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('denuncias')}
          className={`px-3.5 py-2 rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            adminTab === 'denuncias'
              ? 'bg-white border-t-2 border-t-[#134e5e] text-[#134e5e] font-semibold shadow-xs border-x border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Flag className="w-4 h-4 text-[#52796f]" />
          <span>Denúncias de Conteúdo</span>
          {pendingFlags.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-xs font-bold bg-rose-600 text-white">
              {pendingFlags.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('categorias')}
          className={`px-3.5 py-2 rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            adminTab === 'categorias'
              ? 'bg-white border-t-2 border-t-[#134e5e] text-[#134e5e] font-semibold shadow-xs border-x border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Layers className="w-4 h-4 text-[#52796f]" />
          <span>Categorias ({categories.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('usuarios')}
          className={`px-3.5 py-2 rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            adminTab === 'usuarios'
              ? 'bg-white border-t-2 border-t-[#134e5e] text-[#134e5e] font-semibold shadow-xs border-x border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Users className="w-4 h-4 text-[#52796f]" />
          <span>Usuários ({allUsers.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('metricas')}
          className={`px-3.5 py-2 rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            adminTab === 'metricas'
              ? 'bg-white border-t-2 border-t-[#134e5e] text-[#134e5e] font-semibold shadow-xs border-x border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#52796f]" />
          <span>Métricas</span>
        </button>
      </div>

      {/* Tab 1: Fila de Moderação */}
      {adminTab === 'moderacao' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-600 mb-2">
            <span>
              Relatos com status <strong>Pendente</strong> ({pendingReports.length})
            </span>
            <span className="text-stone-400">Total de relatos na base: {reports.length}</span>
          </div>

          {pendingReports.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-xl p-8 text-center max-w-md mx-auto">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-editorial font-bold text-stone-800 text-base mb-1">
                Fila de moderação zerada!
              </h3>
              <p className="text-xs text-stone-500">
                Todos os relatos submetidos pelos membros da comunidade já foram avaliados e aprovados ou arquivados.
              </p>
            </div>
          ) : (
            pendingReports.map(report => {
              const cat = categories.find(c => c.id === report.categoryId);
              return (
                <div
                  key={report.id}
                  className="bg-white border border-amber-200/90 rounded-xl p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-stone-500">
                      <span className="font-semibold text-[#134e5e]">{cat?.name}</span>
                      <span aria-hidden="true">·</span>
                      <span>{report.city} ({report.neighborhood})</span>
                      <span aria-hidden="true">·</span>
                      <span>{report.isAnonymous ? 'Autor Anônimo' : report.authorName}</span>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      Pendente de Aprovação
                    </span>
                  </div>

                  <h3 className="text-lg font-editorial font-bold text-stone-900">
                    {report.title}
                  </h3>

                  {report.triggerWarning && (
                    <div className="text-xs bg-amber-50 text-amber-900 border border-amber-200 rounded p-2">
                      <strong>Gatilho informado:</strong> {report.triggerWarning}
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line bg-stone-50/70 p-3 rounded-lg border border-stone-200/60">
                    {report.content}
                  </p>

                  {report.isOfficialChannelContacted && (
                    <div className="text-xs text-emerald-800">
                      Formalizado em canal oficial: <strong>{report.officialProtocolNumber || 'Sim'}</strong>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                    <button
                      onClick={() => setRejectReportId(report.id)}
                      className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Rejeitar</span>
                    </button>
                    <button
                      onClick={() => moderateReport(report.id, 'aprovado')}
                      className="px-4 py-1.5 bg-[#134e5e] hover:bg-[#0f3d4a] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Aprovar & Publicar</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Denúncias de Conteúdo */}
      {adminTab === 'denuncias' && (
        <div className="space-y-4">
          <div className="text-xs text-stone-600 mb-2">
            Denúncias registradas por usuários contra publicações:
          </div>

          {flags.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-xl p-8 text-center max-w-md mx-auto">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-editorial font-bold text-stone-800 text-sm mb-1">
                Nenhuma denúncia registrada
              </h3>
              <p className="text-xs text-stone-500">
                A comunidade está em harmonia com as diretrizes éticas estabelecidas.
              </p>
            </div>
          ) : (
            flags.map(flag => (
              <div
                key={flag.id}
                className={`bg-white border rounded-xl p-5 shadow-xs space-y-2 ${
                  flag.status === 'pendente' ? 'border-rose-200 bg-rose-50/10' : 'border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-rose-700">
                    Motivo: {flag.reason.replace('_', ' ').toUpperCase()}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      flag.status === 'pendente'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {flag.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs font-medium text-stone-800">
                  Relato denunciado: <span className="italic">"{flag.reportTitle}"</span>
                </div>

                <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded border border-stone-200">
                  <strong>Justificativa da denúncia:</strong> {flag.description}
                </p>

                {flag.resolutionNote && (
                  <div className="text-[11px] text-stone-500 italic">
                    Resolução: {flag.resolutionNote}
                  </div>
                )}

                {flag.status === 'pendente' && (
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                    <button
                      onClick={() => resolveFlag(flag.id, 'Denúncia descartada após revisão da moderação', false)}
                      className="px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-100 border border-stone-300 rounded-lg"
                    >
                      Descartar Denúncia (Manter Relato)
                    </button>
                    <button
                      onClick={() => resolveFlag(flag.id, 'Relato removido por violação comprovada', true)}
                      className="px-3 py-1.5 text-xs text-white bg-rose-700 hover:bg-rose-800 rounded-lg font-semibold"
                    >
                      Remover Relato do Feed
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Gestão de Categorias */}
      {adminTab === 'categorias' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add Category Form */}
          <div className="md:col-span-1 bg-white border border-stone-200 rounded-xl p-5 shadow-xs h-fit">
            <h3 className="font-editorial font-bold text-stone-900 text-base mb-1">
              Nova Categoria
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Crie novas categorias para classificação dos relatos da região.
            </p>

            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nome da Categoria</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  placeholder="Ex: Violência no Campo / Conflito de Terras"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Descrição</label>
                <textarea
                  rows={3}
                  value={newCatDesc}
                  onChange={e => setNewCatDesc(e.target.value)}
                  placeholder="Explicação de quais casos se enquadram nesta categoria..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#134e5e] hover:bg-[#0f3d4a] text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Categoria</span>
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="md:col-span-2 space-y-3">
            {categories.map(cat => {
              const count = reports.filter(r => r.categoryId === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="bg-white border border-stone-200 rounded-xl p-4 flex items-start justify-between gap-3 shadow-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-editorial font-bold text-stone-900 text-sm">
                        {cat.name}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        ({count} relatos)
                      </span>
                      {!cat.active && (
                        <span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">
                          Desativada
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-1">{cat.description}</p>
                  </div>

                  <button
                    onClick={() => toggleCategoryActive(cat.id)}
                    className={`px-3 py-1 rounded text-xs font-semibold shrink-0 transition-colors ${
                      cat.active
                        ? 'bg-[#e8efe9] text-[#134e5e] hover:bg-[#d6e3d7]'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat.active ? 'Ativa' : 'Inativa'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Gestão de Usuários */}
      {adminTab === 'usuarios' && (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-editorial font-bold text-stone-900 text-sm">
              Usuários Registrados na Plataforma ({allUsers.length})
            </h3>
            <span className="text-xs text-stone-500">
              Dados criptografados e protegidos pela LGPD
            </span>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            {allUsers.map(user => {
              const userReportsCount = reports.filter(r => r.authorId === user.id).length;
              return (
                <div
                  key={user.id}
                  className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-stone-50/50"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900">{user.name}</span>
                      <span className="text-stone-400">·</span>
                      <span className="text-stone-500">{user.email}</span>
                      {user.role === 'admin' && (
                        <span className="bg-[#134e5e] text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                          MODERADOR
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      {user.city} · {userReportsCount} relato(s) criado(s) · Cadastrado em{' '}
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        user.status === 'active'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-rose-50 text-rose-800'
                      }`}
                    >
                      {user.status === 'active' ? 'Ativo' : 'Suspenso'}
                    </span>

                    {user.id !== currentUser?.id && (
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className="px-2.5 py-1 text-xs border border-stone-200 rounded hover:bg-stone-100 text-stone-700"
                      >
                        {user.status === 'active' ? 'Suspender' : 'Reativar'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 5: Métricas Comunitárias */}
      {adminTab === 'metricas' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
            <span className="text-xs text-stone-500 font-medium">Total de Relatos</span>
            <div className="text-3xl font-editorial font-bold text-[#134e5e] mt-1 tabular-nums">
              {reports.length}
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              {reports.filter(r => r.status === 'aprovado').length} aprovados no feed
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
            <span className="text-xs text-stone-500 font-medium">Pendentes na Fila</span>
            <div className="text-3xl font-editorial font-bold text-amber-700 mt-1 tabular-nums">
              {pendingReports.length}
            </div>
            <div className="text-[11px] text-stone-400 mt-1">Aguardando decisão da moderação</div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
            <span className="text-xs text-stone-500 font-medium">Reações de Solidariedade</span>
            <div className="text-3xl font-editorial font-bold text-[#52796f] mt-1 tabular-nums">
              {totalReactions}
            </div>
            <div className="text-[11px] text-stone-400 mt-1">Apoios empáticos registrados</div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
            <span className="text-xs text-stone-500 font-medium">Denúncias Abertas</span>
            <div className="text-3xl font-editorial font-bold text-rose-700 mt-1 tabular-nums">
              {pendingFlags.length}
            </div>
            <div className="text-[11px] text-stone-400 mt-1">Contra conteúdos no feed</div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectReportId && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="font-editorial font-bold text-stone-900 text-lg mb-2">
              Justificativa de Não Aprovação
            </h3>
            <p className="text-xs text-stone-600 mb-4">
              Informe a justificativa para que o autor compreenda por que o relato não foi publicado no feed comunitário.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              className="w-full p-3 text-xs border border-stone-300 rounded-lg mb-4 text-stone-800"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectReportId(null)}
                className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmRejection}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold"
              >
                Confirmar Rejeição
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
