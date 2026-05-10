import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MAX_CHARS = 500;

interface NeedsStepProps {
  onSubmit: (text?: string) => void;
  isSubmitting: boolean;
}

export const NeedsStep = ({ onSubmit, isSubmitting }: NeedsStepProps) => {
  const [text, setText] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold mb-3">
          Une dernière chose...
        </h2>
        <p className="text-muted-foreground">
          Vous pouvez nous en dire plus sur votre besoin principal (optionnel)
        </p>
      </div>

      <div className="bg-card rounded-xl p-8 border border-border space-y-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Ex : je cherche à mieux suivre mes coûts par camion, automatiser mes reportings..."
          rows={5}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground text-right">
          {text.length} / {MAX_CHARS}
        </p>
      </div>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => onSubmit()}
          disabled={isSubmitting}
          className="border-border hover:bg-secondary"
        >
          Passer
        </Button>
        <Button
          onClick={() => onSubmit(text.trim() || undefined)}
          disabled={isSubmitting}
          className="gradient-datako text-primary-foreground hover:opacity-90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              Envoyer
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};
