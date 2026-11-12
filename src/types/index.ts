export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  city: string;
  defaultAnonymous: boolean;
  avatarSeed?: string;
  createdAt: string;
  status: 'active' | 'suspended';
}

export type ReactionType = 'solidariedade' | 'forca' | 'apoio' | 'escuta';

export interface ReportReactions {
  solidariedade: number;
  forca: number;
  apoio: number;
  escuta: number;
}

export type ReportStatus = 'pendente' | 'aprovado' | 'rejeitado';

export interface CommunityReport {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  city: string;
  neighborhood: string;
  authorId: string;
  authorName: string;
  isAnonymous: boolean;
  triggerWarning?: string;
  dateOccurred: string;
  status: ReportStatus;
  rejectionReason?: string;
  createdAt: string;
  reactions: ReportReactions;
  isOfficialChannelContacted: boolean;
  officialProtocolNumber?: string;
  flagsCount: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconName: string;
  active: boolean;
  order: number;
}

export type FlagReason = 
  | 'desinformacao'
  | 'discurso_odio'
  | 'violacao_privacidade'
  | 'spam'
  | 'ofensivo'
  | 'outro';

export interface ContentFlag {
  id: string;
  reportId: string;
  reportTitle: string;
  reporterUserId: string;
  reason: FlagReason;
  description: string;
  createdAt: string;
  status: 'pendente' | 'resolvido' | 'descartado';
  resolutionNote?: string;
}

export interface OfficialChannel {
  id: string;
  name: string;
  shortName: string;
  category: 'policial' | 'juridico' | 'assistencial' | 'saude' | 'nacional';
  scope: 'Crateús (Local)' | 'Regional (Inhamuns)' | 'Estadual (CE)' | 'Nacional';
  phone: string;
  phoneDisplay: string;
  address?: string;
  workingHours: string;
  description: string;
  emergency: boolean;
  actionUrl?: string;
}

export interface LegalGuide {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  steps: {
    step: number;
    title: string;
    description: string;
  }[];
  importantNotice: string;
}
