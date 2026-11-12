import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ReportCard } from './ReportCard';
import { AVAILABLE_CITIES } from '../data/initialData';
import { Search, Filter, SlidersHorizontal, Plus, ShieldCheck, HeartHandshake } from 'lucide-react';

interface FeedSectionProps {
  onOpenCreate: () => void;
  onOpenFlagModal: (reportId: string) => void;
}

export const FeedSection: React.FC<FeedSectionProps> = ({ onOpenCreate, onOpenFlagModal }) => {
  const { reports, categories } = useData();
  const { currentUser, isAdmin } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'supported' | 'oldest'>('recent');
  const [statusFilter, setStatusFilter] = useState<'aprovados' | 'pendentes' | 'meus'>('aprovados');

  const filteredReports = useMemo(() => {
    return reports
      .filter(report => {
        // Status filter:
        if (statusFilter === 'aprovados') {
          // Regular feed only shows approved, unless current user is author of a pending report
          if (report.status !== 'aprovado' && !(currentUser && currentUser.id === report.authorId) && !isAdmin) {
            return false;
          }
        } else if (statusFilter === 'pendentes') {
          if (report.status !== 'pendente') return false;
        } else if (statusFilter === 'meus') {
          if (!currentUser || report.authorId !== currentUser.id) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && report.categoryId !== selectedCategory) {
          return false;
        }

        // City filter
        if (selectedCity !== 'all' && report.city !== selectedCity) {
          return false;
        }

        // Search term (title, content, neighborhood, category name)
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchTitle = report.title.toLowerCase().includes(term);
          const matchContent = report.content.toLowerCase().includes(term);
          const matchNeighborhood = report.neighborhood.toLowerCase().includes(term);
          const cat = categories.find(c => c.id === report.categoryId);
          const matchCategory = cat?.name.toLowerCase().includes(term);
          return matchTitle || matchContent || matchNeighborhood || matchCategory;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'recent') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'supported') {
          const totalA = a.reactions.solidariedade + a.reactions.forca + a.reactions.apoio + a.reactions.escuta;
          const totalB = b.reactions.solidariedade + b.reactions.forca + b.reactions.apoio + b.reactions.escuta;
          return totalB - totalA;
        }
        return 0;
      });
  }, [reports, categories, searchTerm, selectedCategory, selectedCity, sortBy, statusFilter, currentUser, isAdmin]);

  return (
    <section className="py-8 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Search and Filters Bar */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-4 sm:p-5 shadow-xs mb-6">
        {/* Search Input */}
        <div className="relative mb-3.5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por palavras-chave, assunto, bairro de Crateús..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white text-stone-900 placeholder-stone-400 focus:border-[#134e5e]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Dropdowns row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          {/* Category Filter */}
          <div>
            <label className="block text-stone-600 font-medium mb-1">Categoria</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 text-xs focus:bg-white focus:border-[#134e5e]"
            >
              <option value="all">Todas as categorias</option>
              {categories.filter(c => c.active).map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-stone-600 font-medium mb-1">Cidade / Região</label>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 text-xs focus:bg-white focus:border-[#134e5e]"
            >
              <option value="all">Todas as cidades (Crateús & Região)</option>
              {AVAILABLE_CITIES.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-stone-600 font-medium mb-1">Ordenar por</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 text-xs focus:bg-white focus:border-[#134e5e]"
            >
              <option value="recent">Mais recentes</option>
              <option value="supported">Mais apoiados pela comunidade</option>
              <option value="oldest">Mais antigos</option>
            </select>
          </div>
        </div>

        {/* Status segment buttons (if logged in or admin) */}
        {(currentUser || isAdmin) && (
          <div className="flex items-center gap-1.5 pt-3 mt-3 border-t border-stone-100 flex-wrap text-xs">
            <span className="text-stone-500 font-medium mr-1">Visualização:</span>
            <button
              onClick={() => setStatusFilter('aprovados')}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === 'aprovados'
                  ? 'bg-[#134e5e] text-white font-medium'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Feed Público Aprovado
            </button>

            {isAdmin && (
              <button
                onClick={() => setStatusFilter('pendentes')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  statusFilter === 'pendentes'
                    ? 'bg-[#134e5e] text-white font-medium'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Aguardando Moderação
              </button>
            )}

            {currentUser && (
              <button
                onClick={() => setStatusFilter('meus')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  statusFilter === 'meus'
                    ? 'bg-[#134e5e] text-white font-medium'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Apenas Meus Relatos
              </button>
            )}
          </div>
        )}
      </div>

      {/* Feed Subtitle / Count Bar */}
      <div className="flex items-center justify-between text-xs text-stone-500 mb-4 px-1">
        <span>
          Mostrando <strong className="text-stone-800 font-semibold">{filteredReports.length}</strong> relato(s)
          {selectedCategory !== 'all' && (
            <span> na categoria "{categories.find(c => c.id === selectedCategory)?.name}"</span>
          )}
          {selectedCity !== 'all' && <span> em {selectedCity}</span>}
        </span>

        <button
          onClick={onOpenCreate}
          className="text-[#134e5e] hover:text-[#0f3d4a] font-medium flex items-center gap-1 underline underline-offset-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Escrever um relato</span>
        </button>
      </div>

      {/* Reports List */}
      {filteredReports.length > 0 ? (
        <div className="space-y-4">
          {filteredReports.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              onOpenFlagModal={onOpenFlagModal}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-xl p-8 text-center max-w-md mx-auto my-6">
          <div className="w-12 h-12 rounded-full bg-[#f4f7f5] text-[#52796f] flex items-center justify-center mx-auto mb-3">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-base font-editorial font-bold text-stone-800 mb-1">
            Nenhum relato encontrado com estes filtros
          </h3>
          <p className="text-stone-500 text-xs leading-relaxed mb-4">
            Tente remover os termos de busca ou selecionar outra categoria. Você também pode ser a primeira pessoa a
            compartilhar um relato com a comunidade.
          </p>
          <button
            onClick={onOpenCreate}
            className="px-4 py-2 bg-[#134e5e] hover:bg-[#0f3d4a] text-white rounded-lg text-xs font-medium"
          >
            Publicar novo relato
          </button>
        </div>
      )}
    </section>
  );
};
