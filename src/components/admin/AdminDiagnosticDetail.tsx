import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  AdminDiagnosticRow, AdminDiagnosticAnswer, DimensionScore,
  CrmStatus, CRM_STATUS_CONFIG,
} from '@/types/diagnostic';
import { getAllQuestions } from '@/data/questions';
import { getRecommendations, getMaturityLabel, getMaturityColor } from '@/data/recommendations';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, Trash2 } from 'lucide-react';

type MaturityLevel = 'debutant' | 'intermediaire' | 'avance' | 'expert';

interface DetailData {
  organizations: { name: string; sector: string; country: string; size: string } | null;
  respondents: { name: string; email: string; phone: string | null; role: string } | null;
  axis_scores: DimensionScore[];
  answers: AdminDiagnosticAnswer[];
  maturity_level: string;
  total_score: number;
  crm_status: CrmStatus;
  internal_notes: string | null;
  additional_need: string | null;
}

interface AdminDiagnosticDetailProps {
  diagnostic: AdminDiagnosticRow | null;
  onClose: () => void;
  password: string;
  onUpdate: (id: string, crm_status: CrmStatus, internal_notes: string | null) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

const SECTOR_LABELS: Record<string, string> = {
  transport: 'Transport & Logistique',
  retail: 'Commerce & Distribution',
  energy: 'Énergie & Mines',
  autre: 'Autre',
};

const SIZE_LABELS: Record<string, string> = {
  '1-10': '1 à 10 employés',
  '11-50': '11 à 50 employés',
  '51-250': '51 à 250 employés',
  '250+': 'Plus de 250 employés',
};

const ROLE_LABELS: Record<string, string> = {
  ceo: 'Dirigeant / Gérant',
  ops: 'Opérations',
  it: 'IT / DSI',
  finance: 'Finance / DAF',
  other: 'Autre',
};

const getAnswerLabel = (
  questionId: string | null,
  answerValue: string,
  sector: string
): { questionText: string; answerLabel: string } => {
  if (!questionId) return { questionText: '—', answerLabel: answerValue };
  const questions = getAllQuestions(sector);
  const question = questions.find((q) => q.id === questionId);
  if (!question) return { questionText: questionId, answerLabel: answerValue };
  const questionText = question.question_text;
  if (question.question_type === 'multi_choice') {
    const values = answerValue.split(',').map((v) => v.trim());
    return { questionText, answerLabel: values.map((v) => question.options.find((o) => o.value === v)?.label ?? v).join(', ') };
  }
  return { questionText, answerLabel: question.options.find((o) => o.value === answerValue)?.label ?? answerValue };
};

const AdminDiagnosticDetail = ({ diagnostic, onClose, password, onUpdate, onDelete, onRestore }: AdminDiagnosticDetailProps) => {
  const [detail, setDetail] = useState<DetailData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // CRM local state
  const [localStatus, setLocalStatus] = useState<CrmStatus>('new');
  const [localNotes, setLocalNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Reset CRM state when a new diagnostic is opened
  useEffect(() => {
    if (diagnostic) {
      setLocalStatus(diagnostic.crm_status ?? 'new');
      setLocalNotes('');
      setSaveSuccess(false);
    }
  }, [diagnostic?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch detail data
  useEffect(() => {
    if (!diagnostic) { setDetail(null); return; }
    const fetchDetail = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch(`/.netlify/functions/admin-diagnostics?id=${diagnostic.id}`, {
          headers: { 'x-admin-password': password },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const raw = json.data;
        setDetail({
          organizations: raw.organizations,
          respondents: raw.respondents,
          axis_scores: Array.isArray(raw.axis_scores) ? raw.axis_scores : [],
          answers: Array.isArray(raw.answers) ? raw.answers : [],
          maturity_level: raw.maturity_level,
          total_score: raw.total_score,
          crm_status: raw.crm_status ?? 'new',
          internal_notes: raw.internal_notes ?? null,
          additional_need: raw.additional_need ?? null,
        });
        // Sync notes from server
        setLocalNotes(raw.internal_notes ?? '');
      } catch {
        setError('Impossible de charger les détails');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [diagnostic?.id, password]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!diagnostic) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/.netlify/functions/admin-diagnostics', {
        method: 'PATCH',
        headers: { 'x-admin-password': password, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: diagnostic.id,
          crm_status: localStatus,
          internal_notes: localNotes.trim() || null,
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      setSaveSuccess(true);
      onUpdate(diagnostic.id, localStatus, localNotes.trim() || null);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!diagnostic) return;
    setIsDeleting(true);
    try {
      const res = await fetch('/.netlify/functions/admin-diagnostics', {
        method: 'PATCH',
        headers: { 'x-admin-password': password, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: diagnostic.id, deleted_at: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Diagnostic supprimé (restaurable si besoin)');
      onDelete(diagnostic.id);
      onClose();
    } catch {
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleRestore = async () => {
    if (!diagnostic) return;
    setIsRestoring(true);
    try {
      const res = await fetch('/.netlify/functions/admin-diagnostics', {
        method: 'PATCH',
        headers: { 'x-admin-password': password, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: diagnostic.id, deleted_at: null }),
      });
      if (!res.ok) throw new Error('Restore failed');
      toast.success('Diagnostic restauré avec succès');
      onRestore(diagnostic.id);
    } catch {
      toast.error('Erreur lors de la restauration');
    } finally {
      setIsRestoring(false);
      setShowRestoreConfirm(false);
    }
  };

  const isDeleted = !!(diagnostic?.deleted_at);
  const sector = detail?.organizations?.sector ?? diagnostic?.sector ?? '';
  const maturityLevel = (detail?.maturity_level ?? diagnostic?.maturity_level ?? 'debutant') as MaturityLevel;
  const maturityColors = getMaturityColor(maturityLevel);
  const recommendation = getRecommendations(sector, maturityLevel);

  return (
    <>
    <Sheet open={!!diagnostic} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-[620px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <SheetTitle className="text-lg leading-tight">{diagnostic?.org_name || 'Diagnostic'}</SheetTitle>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${maturityColors.text} ${maturityColors.bg} ${maturityColors.border}`}>
              {diagnostic?.total_score}% — {getMaturityLabel(maturityLevel)}
            </span>
          </div>
        </SheetHeader>

        {isDeleted && diagnostic?.deleted_at && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            <Trash2 className="h-4 w-4 shrink-0" />
            <span>
              Supprimé le {format(new Date(diagnostic.deleted_at), 'dd/MM/yyyy à HH:mm', { locale: fr })} — masqué de la liste principale.
            </span>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && <p className="text-sm text-destructive py-4">{error}</p>}

        {!isLoading && !error && detail && (
          <Tabs defaultValue="suivi">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="suivi" className="flex-1">Suivi CRM</TabsTrigger>
              <TabsTrigger value="profil" className="flex-1">Profil</TabsTrigger>
              <TabsTrigger value="scores" className="flex-1">Scores</TabsTrigger>
              <TabsTrigger value="reponses" className="flex-1">Réponses</TabsTrigger>
            </TabsList>

            {/* ── SUIVI CRM ── */}
            <TabsContent value="suivi" className="space-y-5 mt-0">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Statut du lead</label>
                  <Select value={localStatus} onValueChange={(v) => setLocalStatus(v as CrmStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(CRM_STATUS_CONFIG) as CrmStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>
                          <span className={`inline-flex items-center gap-2`}>
                            <span className={`inline-block w-2 h-2 rounded-full ${
                              s === 'new' ? 'bg-blue-400' :
                              s === 'contacted' ? 'bg-purple-400' :
                              s === 'meeting_scheduled' ? 'bg-yellow-400' :
                              s === 'proposal_sent' ? 'bg-orange-400' :
                              s === 'won' ? 'bg-green-400' : 'bg-gray-400'
                            }`} />
                            {CRM_STATUS_CONFIG[s].label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Notes internes</label>
                  <Textarea
                    placeholder="Ajouter des notes sur ce lead (appel, contexte, prochaines étapes…)"
                    value={localNotes}
                    onChange={(e) => setLocalNotes(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Sauvegarder
                  </Button>
                  {saveSuccess && (
                    <span className="flex items-center gap-1 text-sm text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Sauvegardé
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  {isDeleted ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-green-500/50 text-green-500 hover:bg-green-500/10 hover:text-green-400"
                      onClick={() => setShowRestoreConfirm(true)}
                    >
                      ♻️ Restaurer ce diagnostic
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer ce diagnostic
                    </Button>
                  )}
                </div>
              </div>

              <Separator />

              <div className="text-xs text-muted-foreground space-y-1">
                <p><span className="font-medium">Contact :</span> {detail.respondents?.name} — {detail.respondents?.email}</p>
                {detail.respondents?.phone && <p><span className="font-medium">Tél :</span> {detail.respondents.phone}</p>}
                <p><span className="font-medium">Secteur :</span> {SECTOR_LABELS[sector] ?? sector}</p>
              </div>
            </TabsContent>

            {/* ── PROFIL ── */}
            <TabsContent value="profil" className="space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Entreprise</h3>
                <dl className="space-y-2">
                  <InfoRow label="Nom" value={detail.organizations?.name} />
                  <InfoRow label="Secteur" value={SECTOR_LABELS[detail.organizations?.sector ?? ''] ?? detail.organizations?.sector} />
                  <InfoRow label="Pays" value={detail.organizations?.country} />
                  <InfoRow label="Taille" value={SIZE_LABELS[detail.organizations?.size ?? ''] ?? detail.organizations?.size} />
                </dl>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Contact</h3>
                <dl className="space-y-2">
                  <InfoRow label="Nom" value={detail.respondents?.name} />
                  <InfoRow label="Email" value={detail.respondents?.email} />
                  <InfoRow label="Téléphone" value={detail.respondents?.phone ?? '—'} />
                  <InfoRow label="Poste" value={ROLE_LABELS[detail.respondents?.role ?? ''] ?? detail.respondents?.role} />
                </dl>
              </div>
              {detail.additional_need && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Besoin exprimé</h3>
                    <p className="text-sm italic text-foreground/80">{detail.additional_need}</p>
                  </div>
                </>
              )}
            </TabsContent>

            {/* ── SCORES ── */}
            <TabsContent value="scores" className="space-y-5 mt-0">
              {detail.axis_scores.map((dim) => (
                <div key={dim.dimension} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{dim.label}</span>
                    <Badge variant="secondary" className="font-mono text-xs">{dim.percentage}%</Badge>
                  </div>
                  <Progress value={dim.percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">Pondération : {Math.round(dim.weight * 100)}%</p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Score global</span>
                <span className="text-xl font-bold">{detail.total_score}%</span>
              </div>
            </TabsContent>

            {/* ── RÉPONSES ── */}
            <TabsContent value="reponses" className="space-y-3 mt-0">
              {detail.answers.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">Aucune réponse enregistrée</p>
              ) : (
                detail.answers.map((answer, i) => {
                  const { questionText, answerLabel } = getAnswerLabel(answer.question_id, answer.answer_value, sector);
                  return (
                    <div key={answer.id} className="p-3 rounded-lg border bg-muted/30 space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Q{i + 1} — {questionText}</p>
                      <p className="text-sm font-medium">{answerLabel}</p>
                      <p className="text-xs text-muted-foreground">Score : {answer.score} pts</p>
                    </div>
                  );
                })
              )}
            </TabsContent>

            {/* ── RECOMMANDATIONS (accessible via Scores tab or separate) ── */}
          </Tabs>
        )}

        {/* Recommendation shown below tabs always (when loaded) */}
        {!isLoading && !error && detail && (
          <div className="mt-4 rounded-lg p-4 border space-y-3 bg-muted/20">
            <p className={`text-sm font-semibold ${maturityColors.text}`}>{recommendation.title}</p>
            <ul className="space-y-1">
              {recommendation.actions.map((a, i) => (
                <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                  <span className="shrink-0">{i + 1}.</span><span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </SheetContent>
    </Sheet>

    <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer ce diagnostic ?</AlertDialogTitle>
          <AlertDialogDescription>
            Ce diagnostic sera masqué de la liste. Il pourra être restauré ultérieurement si besoin.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <AlertDialog open={showRestoreConfirm} onOpenChange={setShowRestoreConfirm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restaurer ce diagnostic ?</AlertDialogTitle>
          <AlertDialogDescription>
            Le diagnostic redeviendra visible dans la liste principale.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isRestoring}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleRestore} disabled={isRestoring}>
            {isRestoring ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Restaurer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex gap-2">
    <dt className="text-sm text-muted-foreground w-24 shrink-0">{label}</dt>
    <dd className="text-sm font-medium">{value || '—'}</dd>
  </div>
);

export default AdminDiagnosticDetail;
