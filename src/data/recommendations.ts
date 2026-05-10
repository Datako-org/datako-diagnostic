import { SectorRecommendation } from '@/types/diagnostic';

type MaturityLevel = 'debutant' | 'intermediaire' | 'avance' | 'expert';

// ============================================================
// TRANSPORT & LOGISTIQUE
// ============================================================

const transportRecommendations: Record<MaturityLevel, SectorRecommendation> = {
  debutant: {
    title: 'Votre priorité : centraliser vos données et voir la rentabilité de chaque camion en temps réel',
    actions: [
      'Centraliser les données de chaque rotation (revenus, coûts carburant, primes, péages)',
      'Voir instantanément le gain net après chaque livraison',
      'Fleet Manager vous permet de saisir une rotation et voir immédiatement votre marge',
    ],
    impact: 'Visibilité immédiate sur la rentabilité par camion | Fin des surprises en fin de mois | Décisions basées sur des chiffres réels',
  },
  intermediaire: {
    title: 'Vous avez les bases. Passez au suivi automatique des gains par rotation et par camion',
    actions: [
      'Automatiser le calcul des marges par rotation et par camion',
      'Suivre les commissions et répartitions entre partenaires en un clic',
      'Fleet Manager calcule vos marges, commissions et répartitions automatiquement',
    ],
    impact: 'Gain de temps : plus de calculs manuels | Transparence totale avec vos partenaires | Pilotage hebdomadaire de la rentabilité',
  },
  avance: {
    title: 'Excellent niveau. Optimisez avec le cockpit analytique avancé',
    actions: [
      'Analyser le profit par camion sur la durée',
      'Mettre en place un cashflow prévisionnel',
      'Préparer des rapports investisseur et simulation de croissance',
    ],
    impact: 'Optimisation fine de votre flotte | Anticipation du cashflow | Données prêtes pour convaincre investisseurs et banques',
  },
  expert: {
    title: 'Vous êtes au top. Explorez l\'automatisation avancée',
    actions: [
      'Saisie des rotations via WhatsApp (envoi automatique)',
      'Alertes saisonnalité et optimisation des routes',
      'Rapports investisseur automatiques et tableaux de bord temps réel',
    ],
    impact: 'Automatisation complète du suivi | Gain de temps maximal | Excellence opérationnelle et avantage concurrentiel',
  },
};

// ============================================================
// COMMERCE & DISTRIBUTION
// ============================================================

const retailRecommendations: Record<MaturityLevel, SectorRecommendation> = {
  debutant: {
    title: 'Votre priorité absolue : Centraliser vos données commerciales',
    actions: [
      'Centraliser ventes, stocks, et clients dans une base unique',
      'Créer un dashboard simple de suivi commercial',
      'Automatiser l\'import des données de caisse/ventes',
    ],
    impact: 'Gain de temps : 10-15h/semaine | Visibilité immédiate sur vos performances réelles | Détection rapide des ruptures de stock',
  },
  intermediaire: {
    title: 'Vous avez les bases. Passez à l\'optimisation commerciale data-driven',
    actions: [
      'Analyser vos marges par produit et par point de vente',
      'Automatiser vos reportings commerciaux',
      'Détecter les opportunités (produits stars, zones performantes)',
    ],
    impact: 'ROI : 10-15% d\'amélioration de la marge | Pilotage commercial basé sur la data | Réactivité immédiate sur les tendances',
  },
  avance: {
    title: 'Excellent niveau. Passez à l\'IA prédictive et personnalisation',
    actions: [
      'Prévision de la demande pour optimiser les stocks',
      'Pricing dynamique basé sur la demande',
      'Personnalisation de l\'expérience client',
      'Automatisation complète des workflows commerciaux',
    ],
    impact: 'Réduction de 20-30% des ruptures de stock | 5-10% d\'amélioration du CA | Personnalisation à l\'échelle',
  },
  expert: {
    title: 'Vous êtes au top. Explorez l\'innovation continue',
    actions: [
      'Benchmarking sectoriel retail',
      'IA avancée (computer vision, prédiction comportement)',
      'Écosystème data étendu (fournisseurs, marketplace)',
    ],
    impact: 'Innovation continue et avantage concurrentiel | Expérience client différenciante | Optimisation maximale',
  },
};

// ============================================================
// ÉNERGIE & UTILITIES
// ============================================================

const energyRecommendations: Record<MaturityLevel, SectorRecommendation> = {
  debutant: {
    title: 'Votre priorité absolue : Centraliser vos données opérationnelles',
    actions: [
      'Centraliser production, maintenance, et incidents dans une base unique',
      'Créer un dashboard simple de suivi opérationnel',
      'Automatiser la remontée d\'informations terrain',
    ],
    impact: 'Gain de temps : 8-12h/semaine | Visibilité immédiate sur les incidents et la performance | Détection rapide des anomalies',
  },
  intermediaire: {
    title: 'Vous avez les bases. Passez à l\'optimisation opérationnelle data-driven',
    actions: [
      'Analyser vos coûts et pertes par site/équipement',
      'Automatiser vos reportings réglementaires et opérationnels',
      'Détecter les équipements à risque et optimisations possibles',
    ],
    impact: 'ROI : 10-15% de réduction des coûts opérationnels | Pilotage basé sur la data | Réduction des temps d\'intervention',
  },
  avance: {
    title: 'Excellent niveau. Passez à l\'IA prédictive et optimisation réseau',
    actions: [
      'Maintenance prédictive pour anticiper les pannes',
      'Optimisation de la production/distribution en temps réel',
      'Détection d\'anomalies et fraudes automatique',
      'Prévision de la demande pour ajuster la production',
    ],
    impact: 'Réduction de 25-35% des pannes non prévues | 5-10% d\'optimisation de la performance | Amélioration de la qualité de service',
  },
  expert: {
    title: 'Vous êtes au top. Explorez l\'innovation continue',
    actions: [
      'Smart grid et IoT avancé',
      'Jumeaux numériques des infrastructures',
      'IA avancée pour optimisation globale du réseau',
    ],
    impact: 'Innovation continue et différenciation | Excellence opérationnelle | Leadership technologique',
  },
};

// ============================================================
// RECOMMANDATIONS GÉNÉRIQUES (fallback)
// ============================================================

const genericRecommendations: Record<MaturityLevel, SectorRecommendation> = {
  debutant: {
    title: 'Votre priorité : Structurer et centraliser vos données',
    actions: [
      'Identifier et centraliser vos sources de données clés',
      'Mettre en place un premier tableau de bord de suivi',
      'Définir vos KPIs prioritaires',
    ],
    impact: 'Gain de temps : 5-10h/semaine | Visibilité sur votre activité | Détection rapide des anomalies',
  },
  intermediaire: {
    title: 'Vous avez les bases. Passez à l\'optimisation',
    actions: [
      'Automatiser vos reportings et tableaux de bord',
      'Analyser vos données en profondeur pour identifier les leviers',
      'Former vos équipes à la culture data',
    ],
    impact: 'ROI : 10-15% d\'amélioration de la performance opérationnelle | Pilotage basé sur la data | Réactivité plus rapide sur les dérives',
  },
  avance: {
    title: 'Excellent niveau. Passez à l\'IA et l\'automatisation avancée',
    actions: [
      'Déployer des modèles prédictifs sur vos cas d\'usage clés',
      'Automatiser les processus répétitifs avec l\'IA',
      'Mettre en place la détection d\'anomalies en temps réel',
    ],
    impact: 'Réduction significative des incidents non prévus | Gains de productivité mesurables | Automatisation des tâches répétitives',
  },
  expert: {
    title: 'Vous êtes au top. Explorez l\'innovation',
    actions: [
      'Benchmarking sectoriel avancé',
      'Innovation IA (modèles avancés, automatisation complète)',
      'Écosystème data étendu avec vos partenaires',
    ],
    impact: 'Innovation continue et amélioration constante | Avantage concurrentiel durable | Optimisation maximale des opérations',
  },
};

// ============================================================
// MAPPING PAR SECTEUR
// ============================================================

const recommendationsBySector: Record<string, Record<MaturityLevel, SectorRecommendation>> = {
  transport: transportRecommendations,
  retail: retailRecommendations,
  energy: energyRecommendations,
};

export const getRecommendations = (
  sector: string,
  maturityLevel: MaturityLevel
): SectorRecommendation => {
  const sectorRecs = recommendationsBySector[sector];
  if (sectorRecs) {
    return sectorRecs[maturityLevel];
  }
  return genericRecommendations[maturityLevel];
};

export const getMaturityLabel = (level: MaturityLevel): string => {
  const labels: Record<MaturityLevel, string> = {
    debutant: 'Débutant',
    intermediaire: 'Intermédiaire',
    avance: 'Avancé',
    expert: 'Expert',
  };
  return labels[level];
};

export const getMaturityColor = (level: MaturityLevel) => {
  const colors: Record<MaturityLevel, { text: string; bg: string; border: string }> = {
    debutant: {
      text: 'text-orange-400',
      bg: 'bg-orange-400/10',
      border: 'border-orange-400/30',
    },
    intermediaire: {
      text: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/30',
    },
    avance: {
      text: 'text-green-400',
      bg: 'bg-green-400/10',
      border: 'border-green-400/30',
    },
    expert: {
      text: 'text-purple-400',
      bg: 'bg-purple-400/10',
      border: 'border-purple-400/30',
    },
  };
  return colors[level];
};
