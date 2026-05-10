export type CrmStatus =
  | 'new'
  | 'contacted'
  | 'meeting_scheduled'
  | 'proposal_sent'
  | 'won'
  | 'lost';

export const CRM_STATUS_CONFIG: Record<CrmStatus, { label: string; className: string }> = {
  new:               { label: 'Nouveau',       className: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  contacted:         { label: 'Contacté',      className: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  meeting_scheduled: { label: 'RDV programmé',      className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  proposal_sent:     { label: 'Proposition envoyée', className: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  won:               { label: 'Gagné',         className: 'bg-green-500/10 text-green-400 border-green-500/30' },
  lost:              { label: 'Perdu',         className: 'bg-gray-500/10 text-gray-400 border-gray-500/30' },
};

export interface AdminDiagnosticRow {
  id: string;
  completed_at: string;
  total_score: number;
  maturity_level: string;
  axis_scores: unknown;
  org_name: string;
  sector: string;
  country: string;
  size: string;
  respondent_name: string;
  email: string;
  role: string;
  phone: string | null;
  crm_status: CrmStatus;
  internal_notes: string | null;
  deleted_at?: string | null;
}

export interface AdminDiagnosticAnswer {
  id: string;
  question_id: string | null;
  answer_value: string;
  score: number;
}

export interface AdminStats {
  total: number;
  avgScore: number;
  sectorCounts: Record<string, number>;
  advancedPercent: number;
}

export interface CrmStats {
  new: number;
  contacted: number;
  meeting_scheduled: number;
  proposal_sent: number;
  won: number;
  lost: number;
  conversionRate: number;
}

export interface Organization {
  id?: string;
  name: string;
  sector: string;
  country: string;
  size: string;
  // Transport qualification fields (not scored)
  activity_type?: string;
  product_type?: string;
  fleet_size?: string;
  fleet_ownership?: string;
}

export interface Respondent {
  id?: string;
  organization_id?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  consent_given: boolean;
}

export interface DiagnosticAnswer {
  questionId: string;
  value: string;
  score: number;
}

export interface DimensionScore {
  dimension: string;
  label: string;
  score: number;
  maxScore: number;
  percentage: number;
  weight: number;
}

export interface DiagnosticResult {
  id?: string;
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  maturityLevel: 'debutant' | 'intermediaire' | 'avance' | 'expert';
  dimensionScores: DimensionScore[];
  sector: string;
}

export interface DiagnosticFormData {
  organization: Organization;
  respondent: Respondent;
  answers: Record<string, DiagnosticAnswer>;
  additionalNeed?: string;
}

export interface Question {
  id: string;
  step: number;
  dimension: string;
  sector?: string;
  question_text: string;
  question_type: 'single_choice' | 'multi_choice';
  options: QuestionOption[];
  max_score: number;
  order_index: number;
  scoring_mode?: 'default' | 'count';
}

export interface QuestionOption {
  label: string;
  value: string;
  score: number;
}

export interface SectorRecommendation {
  title: string;
  actions: string[];
  impact: string;
  roi?: string;
}

export const SECTORS = [
  { value: 'transport', label: 'Transport & Logistique' },
  { value: 'retail', label: 'Commerce & Distribution' },
  { value: 'energy', label: 'Énergie & Mines' },
  { value: 'autre', label: 'Autre' },
] as const;

export const COMPANY_SIZES = [
  { value: '1-10', label: '1 à 10 employés' },
  { value: '11-50', label: '11 à 50 employés' },
  { value: '51-250', label: '51 à 250 employés' },
  { value: '250+', label: 'Plus de 250 employés' },
] as const;

export const ROLES = [
  { value: 'ceo', label: 'Dirigeant / Gérant' },
  { value: 'ops', label: 'Opérations' },
  { value: 'it', label: 'IT / DSI' },
  { value: 'finance', label: 'Finance / DAF' },
  { value: 'other', label: 'Autre' },
] as const;

export const COUNTRIES = [
  { value: 'guinée', label: 'Guinée' },
  { value: 'sénégal', label: 'Sénégal' },
  { value: 'côte d\'ivoire', label: 'Côte d\'Ivoire' },
  { value: 'france', label: 'France' },
  { value: 'other', label: 'Autre' },
] as const;

export const DIMENSIONS = [
  { id: 'data', label: 'État des données', weight: 0.40 },
  { id: 'pilotage', label: 'Pilotage & Performance', weight: 0.40 },
  { id: 'automation', label: 'Automatisation & IA', weight: 0.20 },
] as const;
