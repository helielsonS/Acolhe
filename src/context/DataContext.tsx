import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, CommunityReport, ContentFlag, ReactionType, ReportStatus, FlagReason } from '../types';
import { INITIAL_CATEGORIES, INITIAL_REPORTS, INITIAL_FLAGS } from '../data/initialData';
import { useAuth } from './AuthContext';

interface DataContextType {
  reports: CommunityReport[];
  categories: Category[];
  flags: ContentFlag[];
  userReactions: Record<string, ReactionType[]>;
  addReport: (data: {
    title: string;
    content: string;
    categoryId: string;
    city: string;
    neighborhood: string;
    isAnonymous: boolean;
    triggerWarning?: string;
    dateOccurred: string;
    isOfficialChannelContacted: boolean;
    officialProtocolNumber?: string;
  }) => Promise<CommunityReport>;
  deleteReport: (id: string) => void;
  updateReport: (id: string, updates: Partial<CommunityReport>) => void;
  toggleReaction: (reportId: string, reaction: ReactionType) => void;
  flagReport: (reportId: string, reason: FlagReason, description: string) => Promise<void>;
  moderateReport: (reportId: string, status: ReportStatus, rejectionReason?: string) => void;
  resolveFlag: (flagId: string, resolutionNote: string, removePost?: boolean) => void;
  addCategory: (name: string, description: string, iconName?: string) => void;
  toggleCategoryActive: (categoryId: string) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  resetToInitial: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const REPORTS_KEY = 'vozes_crateus_reports_v1';
const CATEGORIES_KEY = 'vozes_crateus_categories_v1';
const FLAGS_KEY = 'vozes_crateus_flags_v1';
const REACTIONS_KEY = 'vozes_crateus_reactions_v1';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();

  const [reports, setReports] = useState<CommunityReport[]>(() => {
    try {
      const saved = localStorage.getItem(REPORTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_REPORTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(CATEGORIES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_CATEGORIES;
  });

  const [flags, setFlags] = useState<ContentFlag[]>(() => {
    try {
      const saved = localStorage.getItem(FLAGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_FLAGS;
  });

  const [userReactions, setUserReactions] = useState<Record<string, ReactionType[]>>(() => {
    try {
      const saved = localStorage.getItem(REACTIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      'rep-001': ['solidariedade', 'escuta'],
      'rep-002': ['apoio', 'forca'],
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
    } catch {
      // ignore
    }
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch {
      // ignore
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(FLAGS_KEY, JSON.stringify(flags));
    } catch {
      // ignore
    }
  }, [flags]);

  useEffect(() => {
    try {
      localStorage.setItem(REACTIONS_KEY, JSON.stringify(userReactions));
    } catch {
      // ignore
    }
  }, [userReactions]);

  const addReport = async (data: {
    title: string;
    content: string;
    categoryId: string;
    city: string;
    neighborhood: string;
    isAnonymous: boolean;
    triggerWarning?: string;
    dateOccurred: string;
    isOfficialChannelContacted: boolean;
    officialProtocolNumber?: string;
  }): Promise<CommunityReport> => {
    const isAnon = data.isAnonymous || (currentUser?.defaultAnonymous ?? true);
    
    // Non-admin reports are sent to moderation queue ('pendente')
    // Admin reports can be immediately approved if desired
    const initialStatus: ReportStatus = isAdmin ? 'aprovado' : 'pendente';

    const newReport: CommunityReport = {
      id: `rep-${Date.now()}`,
      title: data.title.trim(),
      content: data.content.trim(),
      categoryId: data.categoryId,
      city: data.city || 'Crateús (CE)',
      neighborhood: data.neighborhood || 'Centro',
      authorId: currentUser?.id || `anon-${Date.now()}`,
      authorName: isAnon ? 'Relato Anônimo' : (currentUser?.name || 'Cidadão de Crateús'),
      isAnonymous: isAnon,
      triggerWarning: data.triggerWarning?.trim() || undefined,
      dateOccurred: data.dateOccurred || 'Recente',
      status: initialStatus,
      createdAt: new Date().toISOString(),
      reactions: {
        solidariedade: 0,
        forca: 0,
        apoio: 0,
        escuta: 0,
      },
      isOfficialChannelContacted: !!data.isOfficialChannelContacted,
      officialProtocolNumber: data.officialProtocolNumber?.trim() || undefined,
      flagsCount: 0,
    };

    setReports(prev => [newReport, ...prev]);
    return newReport;
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const updateReport = (id: string, updates: Partial<CommunityReport>) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const toggleReaction = (reportId: string, reaction: ReactionType) => {
    const currentList = userReactions[reportId] || [];
    const hasReacted = currentList.includes(reaction);

    const nextList = hasReacted
      ? currentList.filter(r => r !== reaction)
      : [...currentList, reaction];

    setUserReactions(prev => ({
      ...prev,
      [reportId]: nextList,
    }));

    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          const delta = hasReacted ? -1 : 1;
          const currentCount = r.reactions[reaction] || 0;
          return {
            ...r,
            reactions: {
              ...r.reactions,
              [reaction]: Math.max(0, currentCount + delta),
            },
          };
        }
        return r;
      })
    );
  };

  const flagReport = async (reportId: string, reason: FlagReason, description: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    const newFlag: ContentFlag = {
      id: `flg-${Date.now()}`,
      reportId,
      reportTitle: report.title,
      reporterUserId: currentUser?.id || 'visitante-anonimo',
      reason,
      description: description.trim(),
      createdAt: new Date().toISOString(),
      status: 'pendente',
    };

    setFlags(prev => [newFlag, ...prev]);

    // increment flags count on the report
    setReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, flagsCount: (r.flagsCount || 0) + 1 } : r))
    );
  };

  const moderateReport = (reportId: string, status: ReportStatus, rejectionReason?: string) => {
    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          return {
            ...r,
            status,
            rejectionReason: status === 'rejeitado' ? (rejectionReason || 'Conteúdo não atende às diretrizes comunitárias') : undefined,
          };
        }
        return r;
      })
    );
  };

  const resolveFlag = (flagId: string, resolutionNote: string, removePost?: boolean) => {
    const flag = flags.find(f => f.id === flagId);
    if (!flag) return;

    setFlags(prev =>
      prev.map(f => (f.id === flagId ? { ...f, status: 'resolvido', resolutionNote } : f))
    );

    if (removePost) {
      moderateReport(flag.reportId, 'rejeitado', `Removido após denúncia: ${resolutionNote}`);
    }
  };

  const addCategory = (name: string, description: string, iconName = 'ShieldAlert') => {
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      iconName,
      active: true,
      order: categories.length + 1,
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const toggleCategoryActive = (categoryId: string) => {
    setCategories(prev =>
      prev.map(c => (c.id === categoryId ? { ...c, active: !c.active } : c))
    );
  };

  const updateCategory = (categoryId: string, updates: Partial<Category>) => {
    setCategories(prev =>
      prev.map(c => (c.id === categoryId ? { ...c, ...updates } : c))
    );
  };

  const resetToInitial = () => {
    setReports(INITIAL_REPORTS);
    setCategories(INITIAL_CATEGORIES);
    setFlags(INITIAL_FLAGS);
    setUserReactions({});
    localStorage.removeItem(REPORTS_KEY);
    localStorage.removeItem(CATEGORIES_KEY);
    localStorage.removeItem(FLAGS_KEY);
    localStorage.removeItem(REACTIONS_KEY);
  };

  return (
    <DataContext.Provider
      value={{
        reports,
        categories,
        flags,
        userReactions,
        addReport,
        deleteReport,
        updateReport,
        toggleReaction,
        flagReport,
        moderateReport,
        resolveFlag,
        addCategory,
        toggleCategoryActive,
        updateCategory,
        resetToInitial,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser utilizado dentro de DataProvider');
  }
  return context;
};
