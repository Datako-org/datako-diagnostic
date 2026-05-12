import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AdminDiagnosticRow, CRM_STATUS_CONFIG, CrmStatus } from '@/types/diagnostic';
import { getMaturityColor, getMaturityLabel } from '@/data/recommendations';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Download, Eye, Trash2, Loader2 } from 'lucide-react';

type MaturityLevel = 'debutant' | 'intermediaire' | 'avance' | 'expert';

const SECTOR_LABELS: Record<string, string> = {
  transport: 'Transport',
  retail: 'Commerce',
  energy: 'Énergie',
  autre: 'Autre',
};

interface AdminTableProps {
  data: AdminDiagnosticRow[];
  onView: (row: AdminDiagnosticRow) => void;
  onDeleteAll: (ids: string[]) => void;
  password: string;
}

const MaturityBadge = ({ level }: { level: string }) => {
  const colors = getMaturityColor(level as MaturityLevel);
  const label = getMaturityLabel(level as MaturityLevel);
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${colors.text} ${colors.bg} ${colors.border}`}>
      {label}
    </span>
  );
};

export const CrmStatusBadge = ({ status }: { status: CrmStatus }) => {
  const cfg = CRM_STATUS_CONFIG[status] ?? CRM_STATUS_CONFIG.new;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${cfg.className}`}>
      {cfg.label}
    </span>
  );
};

const exportCSV = (data: AdminDiagnosticRow[]) => {
  const headers = ['Date', 'Entreprise', 'Secteur', 'Pays', 'Taille', 'Nom contact', 'Email', 'Poste', 'Score (%)', 'Niveau', 'Statut CRM', 'Notes'];

  const escape = (v: string | number | null | undefined) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };

  const rows = data.map((d) => [
    d.completed_at ? format(new Date(d.completed_at), 'dd/MM/yyyy') : '',
    escape(d.org_name),
    escape(SECTOR_LABELS[d.sector] ?? d.sector),
    escape(d.country),
    escape(d.size),
    escape(d.respondent_name),
    escape(d.email),
    escape(d.role),
    d.total_score,
    d.maturity_level,
    CRM_STATUS_CONFIG[d.crm_status]?.label ?? d.crm_status,
    escape(d.internal_notes),
  ]);

  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `diagnostics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const AdminTable = ({ data, onView, onDeleteAll, password }: AdminTableProps) => {
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showHardDeleteDialog, setShowHardDeleteDialog] = useState(false);
  const [confirmHardText, setConfirmHardText] = useState('');
  const [isHardDeleting, setIsHardDeleting] = useState(false);

  const deletedRows = data.filter((d) => !!d.deleted_at);
  const hasDeletedRows = deletedRows.length > 0;
  const allDeletedSelected = deletedRows.length > 0 && deletedRows.every((d) => selectedIds.has(d.id));

  // Reset selection when data changes
  useEffect(() => {
    setSelectedIds((prev) => {
      const dataIds = new Set(data.map((d) => d.id));
      const next = new Set([...prev].filter((id) => dataIds.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [data]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allDeletedSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(deletedRows.map((d) => d.id)));
    }
  };

  const handleHardDeleteSelected = async () => {
    const ids = [...selectedIds];
    setIsHardDeleting(true);
    try {
      const res = await fetch('/.netlify/functions/admin-diagnostics', {
        method: 'DELETE',
        headers: { 'x-admin-password': password, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, permanent: true }),
      });
      if (!res.ok) throw new Error('Hard delete failed');
      toast.success(`${ids.length} diagnostic${ids.length !== 1 ? 's' : ''} supprimé${ids.length !== 1 ? 's' : ''} définitivement`);
      setSelectedIds(new Set());
      onDeleteAll(ids);
    } catch {
      toast.error('Erreur lors de la suppression définitive');
    } finally {
      setIsHardDeleting(false);
      setShowHardDeleteDialog(false);
      setConfirmHardText('');
    }
  };

  const handleDeleteAll = async () => {
    const ids = data.filter((d) => !d.deleted_at).map((d) => d.id);
    setIsDeleting(true);
    try {
      const res = await fetch('/.netlify/functions/admin-diagnostics', {
        method: 'DELETE',
        headers: { 'x-admin-password': password, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success(`${ids.length} diagnostic${ids.length !== 1 ? 's' : ''} supprimé${ids.length !== 1 ? 's' : ''} (restaurables si besoin)`);
      onDeleteAll(ids);
    } catch {
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
      setShowDeleteAll(false);
      setConfirmText('');
    }
  };

  return (
    <>
    <div className="space-y-3">
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        {data.length} diagnostic{data.length !== 1 ? 's' : ''}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        {selectedIds.size > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => { setConfirmHardText(''); setShowHardDeleteDialog(true); }}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer définitivement ({selectedIds.size})
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => exportCSV(data)} disabled={data.length === 0} className="gap-2">
          <Download className="h-4 w-4" />
          Exporter CSV
        </Button>
        <Button
          variant="destructive"
          size="sm"
          disabled={data.length === 0}
          onClick={() => { setConfirmText(''); setShowDeleteAll(true); }}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Tout supprimer
        </Button>
      </div>
    </div>

    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {hasDeletedRows && (
              <TableHead className="w-[40px]" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={allDeletedSelected}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Tout sélectionner"
                />
              </TableHead>
            )}
            <TableHead>Date</TableHead>
            <TableHead>Entreprise</TableHead>
            <TableHead className="hidden md:table-cell">Secteur</TableHead>
            <TableHead>Score</TableHead>
            <TableHead className="hidden sm:table-cell">Niveau</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="hidden lg:table-cell">Email</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={hasDeletedRows ? 9 : 8} className="text-center py-8 text-muted-foreground">
                Aucun diagnostic trouvé
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow
                key={row.id}
                className={`cursor-pointer hover:bg-muted/50 ${row.deleted_at ? 'opacity-60' : ''} ${selectedIds.has(row.id) ? 'bg-muted/40' : ''}`}
                onClick={() => onView(row)}
              >
                {hasDeletedRows && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {row.deleted_at && (
                      <Checkbox
                        checked={selectedIds.has(row.id)}
                        onCheckedChange={() => toggleSelect(row.id)}
                        aria-label="Sélectionner"
                      />
                    )}
                  </TableCell>
                )}
                <TableCell className="whitespace-nowrap text-sm">
                  {row.completed_at ? format(new Date(row.completed_at), 'dd/MM/yyyy', { locale: fr }) : '—'}
                </TableCell>
                <TableCell className="font-medium max-w-[160px] truncate text-muted-foreground">
                  {row.org_name || '—'}
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {SECTOR_LABELS[row.sector] ?? (row.sector || '—')}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono">{row.total_score}%</Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="flex flex-wrap items-center gap-1">
                    <MaturityBadge level={row.maturity_level} />
                    {row.deleted_at && (
                      <Badge variant="secondary" className="text-[10px]">
                        Supprimé le {format(new Date(row.deleted_at), 'dd/MM/yy')}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <CrmStatusBadge status={row.crm_status ?? 'new'} />
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[180px] truncate">
                  {row.email || '—'}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(row)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
    </div>

    <AlertDialog open={showHardDeleteDialog} onOpenChange={(open) => { setShowHardDeleteDialog(open); if (!open) setConfirmHardText(''); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Suppression définitive</AlertDialogTitle>
          <AlertDialogDescription>
            Vous allez supprimer <strong>{selectedIds.size}</strong> diagnostic{selectedIds.size !== 1 ? 's' : ''} de façon irréversible. Cette action ne peut pas être annulée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="px-1 py-2">
          <Input
            placeholder="Tapez SUPPRIMER pour confirmer"
            value={confirmHardText}
            onChange={(e) => setConfirmHardText(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isHardDeleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleHardDeleteSelected}
            disabled={confirmHardText !== 'SUPPRIMER' || isHardDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isHardDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Supprimer définitivement
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <AlertDialog open={showDeleteAll} onOpenChange={(open) => { setShowDeleteAll(open); if (!open) setConfirmText(''); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>⚠️ Supprimer tous les diagnostics affichés ?</AlertDialogTitle>
          <AlertDialogDescription>
            Vous allez masquer les <strong>{data.length}</strong> diagnostic{data.length !== 1 ? 's' : ''} actuellement visibles (après filtres). Ils pourront être restaurés ultérieurement.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="px-1 py-2">
          <Input
            placeholder="Tapez SUPPRIMER pour confirmer"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAll}
            disabled={confirmText !== 'SUPPRIMER' || isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Supprimer tout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};

export default AdminTable;
