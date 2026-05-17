import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import datakoLogo from "@/assets/datako-logo-white.png";

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage = ({ onStart }: LandingPageProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a
            href="https://datakö.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 -m-2 rounded-lg transition-all duration-200 hover:opacity-80 hover:scale-[1.02]"
          >
            <img src={datakoLogo} alt="Datakö" className="h-20 sm:h-28 w-auto" />
          </a>
          <div className="text-xs sm:text-sm text-muted-foreground">Diagnostic Data & IA</div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
              <span className="gradient-datako-text">Diagnostic</span>
              <br />
              <span className="text-foreground">Data & IA – Datakö</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto"
          >
            Évaluez votre maturité data et identifiez vos priorités d'action en moins de 8 minutes
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-sm text-muted-foreground/70 mb-12"
          >
            Conçu par Datakö <span className="text-xl leading-none align-middle">·</span> experts Data & IA
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              onClick={onStart}
              size="lg"
              className="gradient-datako text-primary-foreground text-lg px-8 py-6 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--datako-glow)/0.35)] hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Démarrer le diagnostic
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          {/* Reassurance elements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <ReassuranceItem
              icon={<Shield className="h-6 w-6" />}
              title="Données confidentielles"
              description="Vos réponses sont sécurisées et traitées de manière confidentielle"
            />
            <ReassuranceItem
              icon={<Clock className="h-6 w-6" />}
              title="Sans engagement"
              description="Un diagnostic gratuit pour comprendre votre situation"
            />
            <ReassuranceItem
              icon={<MessageCircle className="h-6 w-6" />}
              title="Réponse sous 48h"
              description="Un expert Datakö vous recontacte rapidement"
            />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-8 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Datakö. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
};

interface ReassuranceItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ReassuranceItem = ({ icon, title, description }: ReassuranceItemProps) => (
  <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
    <div className="p-3 rounded-full bg-primary/10 text-primary">{icon}</div>
    <h3 className="font-semibold text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground text-center">{description}</p>
  </div>
);
