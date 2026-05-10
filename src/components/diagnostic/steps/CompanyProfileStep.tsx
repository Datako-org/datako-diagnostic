import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Organization, SECTORS, COMPANY_SIZES, ROLES, COUNTRIES } from '@/types/diagnostic';
import { motion } from 'framer-motion';

interface CompanyProfileStepProps {
  data: Organization;
  role: string;
  onUpdate: (data: Partial<Organization>) => void;
  onUpdateRole: (role: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const CompanyProfileStep = ({
  data,
  role,
  onUpdate,
  onUpdateRole,
  onNext,
  onPrev,
}: CompanyProfileStepProps) => {
  const isTransport = data.sector === 'transport';
  const isValid = data.name && data.sector && data.country && data.size && role
    && (!isTransport || (data.activity_type && data.product_type && data.fleet_size && data.fleet_ownership));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold mb-3">
          Profil de votre entreprise
        </h2>
        <p className="text-muted-foreground">
          Ces informations nous permettent d'adapter le diagnostic à votre contexte
        </p>
      </div>

      <div className="space-y-6 bg-card rounded-xl p-8 border border-border">
        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="company-name">Nom de l'entreprise *</Label>
          <Input
            id="company-name"
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Ex: Acme Industries"
            className="bg-input border-border focus:border-primary"
          />
        </div>

        {/* Sector */}
        <div className="space-y-2">
          <Label>Secteur d'activité *</Label>
          <Select value={data.sector} onValueChange={(value) => onUpdate({ sector: value })}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Sélectionnez votre secteur" />
            </SelectTrigger>
            <SelectContent>
              {SECTORS.map((sector) => (
                <SelectItem key={sector.value} value={sector.value}>
                  {sector.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label>Pays / Région *</Label>
          <Select value={data.country} onValueChange={(value) => onUpdate({ country: value })}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Sélectionnez votre pays" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Company Size */}
        <div className="space-y-2">
          <Label>Taille de l'entreprise *</Label>
          <Select value={data.size} onValueChange={(value) => onUpdate({ size: value })}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Nombre d'employés" />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_SIZES.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label>Votre fonction *</Label>
          <Select value={role} onValueChange={onUpdateRole}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Sélectionnez votre rôle" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transport qualification fields */}
        {isTransport && (
          <>
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground mb-4">
                Informations spécifiques Transport
              </p>
            </div>

            <div className="space-y-2">
              <Label>Activité principale *</Label>
              <Select value={data.activity_type || ''} onValueChange={(value) => onUpdate({ activity_type: value })}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Sélectionnez votre activité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transport">Transport uniquement</SelectItem>
                  <SelectItem value="vente">Vente uniquement</SelectItem>
                  <SelectItem value="mixte">Transport + Vente</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Type de produits transportés *</Label>
              <Select value={data.product_type || ''} onValueChange={(value) => onUpdate({ product_type: value })}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Sélectionnez le type de produit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carburants">Carburants / hydrocarbures</SelectItem>
                  <SelectItem value="marchandises">Marchandises générales</SelectItem>
                  <SelectItem value="materiaux">Matériaux de construction</SelectItem>
                  <SelectItem value="minerais">Minerais</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Taille de la flotte *</Label>
              <Select value={data.fleet_size || ''} onValueChange={(value) => onUpdate({ fleet_size: value })}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Nombre de camions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1-5 camions</SelectItem>
                  <SelectItem value="6-15">6-15 camions</SelectItem>
                  <SelectItem value="16-50">16-50 camions</SelectItem>
                  <SelectItem value="50+">50+ camions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Propriété des camions *</Label>
              <Select value={data.fleet_ownership || ''} onValueChange={(value) => onUpdate({ fleet_ownership: value })}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="own">Oui, tous nos propres camions</SelectItem>
                  <SelectItem value="partners">Non, certains appartiennent à des partenaires</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={onPrev}
          className="border-border hover:bg-secondary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="gradient-datako text-primary-foreground hover:opacity-90"
        >
          Continuer
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};
