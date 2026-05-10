import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DiagnosticResult } from '@/types/diagnostic';
import { getRecommendations, getMaturityLabel, getMaturityColor } from '@/data/recommendations';
import { motion } from 'framer-motion';
import { RotateCcw, Calendar, FileText, CheckCircle2, TrendingUp, Zap, Download, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsPageProps {
  result: DiagnosticResult;
  onRestart: () => void;
}

const DIMENSION_ICONS: Record<string, React.ReactNode> = {
  data: <FileText className="h-5 w-5" />,
  pilotage: <TrendingUp className="h-5 w-5" />,
  automation: <Zap className="h-5 w-5" />,
};

export const ResultsPage = ({ result, onRestart }: ResultsPageProps) => {
  const [scoringOpen, setScoringOpen] = useState(false);
  const maturityLabel = getMaturityLabel(result.maturityLevel);
  const maturityColor = getMaturityColor(result.maturityLevel);
  const recommendation = getRecommendations(result.sector, result.maturityLevel);

  const handleContactEmail = () => {
    const subject = encodeURIComponent('Demande de rendez-vous - Diagnostic Data & IA');
    const body = encodeURIComponent(
      `Bonjour,\n\nSuite à mon diagnostic Data & IA, je souhaite prendre rendez-vous avec un expert Datakö.\n\n` +
      `Résultats du diagnostic :\n` +
      `- Score global : ${result.percentage}%\n` +
      `- Niveau de maturité : ${maturityLabel}\n` +
      `- Données : ${result.dimensionScores.find(d => d.dimension === 'data')?.percentage || 0}%\n` +
      `- Pilotage : ${result.dimensionScores.find(d => d.dimension === 'pilotage')?.percentage || 0}%\n` +
      `- Automatisation : ${result.dimensionScores.find(d => d.dimension === 'automation')?.percentage || 0}%\n\n` +
      `Cordialement`
    );
    window.open(`mailto:contact@datako.com?subject=${subject}&body=${body}`, '_blank');
  };

  const handleContactWhatsApp = () => {
    const message = encodeURIComponent(
      `Bonjour,\n\nSuite à mon diagnostic Data & IA sur Datakö, je souhaite prendre rendez-vous.\n\n` +
      `Résultats :\n` +
      `- Score : ${result.percentage}%\n` +
      `- Niveau : ${maturityLabel}`
    );
    window.open(`https://wa.me/+224612434545?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-8 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-display font-bold gradient-datako-text">
            Datakö
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="no-print border-border" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger mon diagnostic
            </Button>
            <Button variant="outline" onClick={onRestart} className="no-print border-border">
              <RotateCcw className="mr-2 h-4 w-4" />
              Nouveau diagnostic
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Score Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Votre diagnostic Data & IA
            </h1>
            <p className="text-muted-foreground mb-8">
              Analyse complète de votre maturité data
            </p>

            {/* Score Circle */}
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="w-48 h-48 rounded-full border-gradient-datako flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold gradient-datako-text">
                    {result.percentage}%
                  </div>
                  <div className="text-muted-foreground text-sm mt-1">
                    Score global
                  </div>
                </div>
              </div>
            </div>

            {/* Maturity Level Badge */}
            <div className="flex items-center justify-center gap-2">
              <div className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-full border",
                maturityColor.bg,
                maturityColor.border
              )}>
                <span className={cn("text-lg font-semibold", maturityColor.text)}>
                  Niveau : {maturityLabel}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="no-print"
                onClick={() => setScoringOpen(true)}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Dimension Scores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card rounded-xl p-8 border border-border mb-8"
          >
            <h2 className="text-xl font-semibold mb-6">Détail par dimension</h2>
            <div className="space-y-6">
              {result.dimensionScores.map((dim, index) => (
                <motion.div
                  key={dim.dimension}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">
                        {DIMENSION_ICONS[dim.dimension]}
                      </span>
                      <span className="font-medium">{dim.label}</span>
                      <span className="text-xs text-muted-foreground">
                        (poids : {Math.round(dim.weight * 100)}%)
                      </span>
                    </div>
                    <span className={cn(
                      "font-semibold text-lg",
                      dim.percentage <= 30 ? 'text-orange-400' :
                        dim.percentage <= 60 ? 'text-blue-400' :
                          dim.percentage <= 85 ? 'text-green-400' :
                            'text-purple-400'
                    )}>
                      {dim.percentage}%
                    </span>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dim.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                      className="absolute left-0 top-0 h-full progress-gradient rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl p-8 border border-primary/30 glow-datako mb-8"
          >
            <h2 className="text-xl font-semibold mb-2 gradient-datako-text">
              {recommendation.title}
            </h2>

            {/* Action Items */}
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Actions recommandées
              </h3>
              {recommendation.actions.map((action, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>{action}</span>
                </motion.div>
              ))}
            </div>

            {/* Impact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20"
            >
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">Impact estimé</span>
              </div>
              <p className="text-muted-foreground">{recommendation.impact}</p>
              {recommendation.roi && (
                <p className="text-primary font-medium mt-1">{recommendation.roi}</p>
              )}
            </motion.div>
          </motion.div>

          {/* Fleet Manager CTA (transport only) */}
          {result.sector === 'transport' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-card rounded-xl p-8 border border-green-500/30 mb-8"
            >
              <h2 className="text-xl font-semibold mb-2 text-center">
                Fleet Manager par Datakö
              </h2>
              <p className="text-muted-foreground text-center mb-6">
                Saisissez une rotation, voyez instantanément votre gain net. Marges, commissions, répartitions — tout est calculé pour vous.
              </p>
              <div className="flex justify-center">
                <Button
                  className="bg-green-600 text-white hover:bg-green-700"
                  onClick={() => {
                    const message = encodeURIComponent(
                      `Bonjour,\n\nSuite à mon diagnostic Datakö (score : ${result.percentage}%, niveau : ${maturityLabel}), je souhaite réserver une démo Fleet Manager.\n\nMerci !`
                    );
                    window.open(`https://wa.me/+224612434545?text=${message}`, '_blank');
                  }}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Réserver une démo Fleet Manager
                </Button>
              </div>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-xl p-8 border border-border"
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              Passez à l'action
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              Un expert Datakö vous contactera sous 48h avec une analyse détaillée et un plan d'action personnalisé.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="gradient-datako text-primary-foreground hover:opacity-90"
                onClick={handleContactEmail}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Prendre rendez-vous (Email)
              </Button>
              <Button
                variant="outline"
                className="border-green-500 text-green-500 hover:bg-green-500/10"
                onClick={handleContactWhatsApp}
              >
                <Calendar className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </motion.div>

          {/* Footer link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => window.open("https://datakö.com", "_blank")}
            >
              <FileText className="mr-2 h-4 w-4" />
              En savoir plus sur Datakö
            </Button>
          </motion.div>

          {/* Download bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="mt-6 text-center no-print"
          >
            <Button variant="outline" className="border-border" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger mon diagnostic
            </Button>
          </motion.div>
        </div>
      </main>

      {/* Dialog scoring */}
      <Dialog open={scoringOpen} onOpenChange={setScoringOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>Comment ce score est calculé ?</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-2">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                3 axes évalués
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Données', pct: 40, desc: 'Qualité, centralisation, accessibilité' },
                  { label: 'Pilotage', pct: 40, desc: 'KPIs, tableaux de bord, décisions data-driven' },
                  { label: 'Automatisation', pct: 20, desc: 'Processus automatisés, maturité IA' },
                ].map((ax) => (
                  <div key={ax.label} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{ax.label}</span>
                      <span className="text-sm font-semibold">{ax.pct}%</span>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full progress-gradient rounded-full"
                        style={{ width: `${ax.pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{ax.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Niveaux de maturité
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Débutant',      range: '0–39%',    color: 'text-orange-400' },
                  { label: 'Intermédiaire', range: '40–64%',   color: 'text-blue-400' },
                  { label: 'Avancé',        range: '65–84%',   color: 'text-green-400' },
                  { label: 'Expert',        range: '85–100%',  color: 'text-purple-400' },
                ].map((lvl) => (
                  <div key={lvl.label} className="flex justify-between items-center">
                    <span className={cn('text-sm font-medium', lvl.color)}>{lvl.label}</span>
                    <span className="text-sm text-muted-foreground">{lvl.range}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground border-t border-border pt-4">
              Ce score vise à identifier vos priorités, pas à vous noter.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="py-6 px-8 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Datakö. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
};
