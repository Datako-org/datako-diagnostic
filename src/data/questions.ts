import { Question } from '@/types/diagnostic';

// ============================================================
// TRANSPORT & LOGISTIQUE - Diagnostic terrain (retours EGUITRA, TRANSPETROL)
// Qualification dans CompanyProfileStep, questions scorées ci-dessous
// ============================================================

// Bloc 1 - État des données (step 2, dimension "data")
// 2 questions conservées de l'ancien diagnostic + 2 nouvelles terrain
const transportDataQuestions: Question[] = [
  {
    id: 'tl_q1',
    step: 2,
    dimension: 'data',
    sector: 'transport',
    question_text: 'Où sont stockées vos données de flotte (véhicules, maintenance, carburant, trajets) ?',
    question_type: 'single_choice',
    options: [
      { label: 'Aucune centralisation claire', value: 'none', score: 0 },
      { label: 'Papier, emails, carnets de bord', value: 'paper', score: 15 },
      { label: 'Excel / Google Sheets (plusieurs fichiers)', value: 'spreadsheets', score: 40 },
      { label: 'Logiciel de base + Excel en complément', value: 'software_excel', score: 60 },
      { label: 'Système centralisé (TMS, ERP)', value: 'centralized', score: 90 },
    ],
    max_score: 100,
    order_index: 1,
  },
  {
    id: 'tl_q2',
    step: 2,
    dimension: 'data',
    sector: 'transport',
    question_text: 'Vos équipes peuvent-elles accéder facilement aux données dont elles ont besoin ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, très difficile d\'obtenir l\'info', value: 'no', score: 0 },
      { label: 'Partiellement, données dispersées', value: 'partial', score: 25 },
      { label: 'Oui, mais nécessite de demander ou compiler', value: 'compile', score: 50 },
      { label: 'Oui, données accessibles en temps réel (mobile/web)', value: 'realtime', score: 100 },
    ],
    max_score: 100,
    order_index: 2,
  },
  {
    id: 'tl_q3',
    step: 2,
    dimension: 'data',
    sector: 'transport',
    question_text: 'Les coûts varient-ils selon la destination ? (carburant, primes chauffeur, péages)',
    question_type: 'single_choice',
    options: [
      { label: 'Pas sûr', value: 'unsure', score: 10 },
      { label: 'Non', value: 'no', score: 30 },
      { label: 'Oui', value: 'yes', score: 60 },
      { label: 'Oui et on les suit précisément', value: 'yes_tracked', score: 100 },
    ],
    max_score: 100,
    order_index: 3,
  },
  {
    id: 'tl_q4',
    step: 2,
    dimension: 'data',
    sector: 'transport',
    question_text: 'Comment répartissez-vous les revenus entre partenaires / parties prenantes ?',
    question_type: 'single_choice',
    options: [
      { label: 'Pas de répartition formalisée', value: 'none', score: 0 },
      { label: 'Calcul manuel à chaque livraison', value: 'manual', score: 25 },
      { label: 'Excel avec formules', value: 'excel', score: 50 },
      { label: 'Système automatisé', value: 'automated', score: 100 },
    ],
    max_score: 100,
    order_index: 4,
  },
];

// Bloc 2 - Pilotage & Performance (step 3, dimension "pilotage")
const transportPilotageQuestions: Question[] = [
  {
    id: 'tl_q5',
    step: 3,
    dimension: 'pilotage',
    sector: 'transport',
    question_text: 'Comment suivez-vous aujourd\'hui l\'activité de vos camions ?',
    question_type: 'single_choice',
    options: [
      { label: 'Pas de suivi structuré', value: 'none', score: 0 },
      { label: 'WhatsApp / téléphone', value: 'whatsapp', score: 15 },
      { label: 'Papier / cahier', value: 'paper', score: 25 },
      { label: 'Excel', value: 'excel', score: 50 },
      { label: 'Logiciel dédié', value: 'software', score: 100 },
    ],
    max_score: 100,
    order_index: 1,
  },
  {
    id: 'tl_q6',
    step: 3,
    dimension: 'pilotage',
    sector: 'transport',
    question_text: 'Savez-vous aujourd\'hui quel camion est le plus rentable dans votre flotte ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non', value: 'no', score: 0 },
      { label: 'Pas précisément', value: 'not_precise', score: 30 },
      { label: 'Oui, approximativement', value: 'approximate', score: 60 },
      { label: 'Oui, avec des chiffres précis', value: 'precise', score: 100 },
    ],
    max_score: 100,
    order_index: 2,
  },
  {
    id: 'tl_q7',
    step: 3,
    dimension: 'pilotage',
    sector: 'transport',
    question_text: 'Comment savez-vous combien vous avez gagné après chaque rotation ?',
    question_type: 'single_choice',
    options: [
      { label: 'On ne sait pas en temps réel', value: 'no_realtime', score: 0 },
      { label: 'Le chef logistique calcule manuellement', value: 'manual', score: 25 },
      { label: 'On attend le bilan mensuel', value: 'monthly', score: 40 },
      { label: 'On a un outil qui calcule instantanément', value: 'instant', score: 100 },
    ],
    max_score: 100,
    order_index: 3,
  },
  {
    id: 'tl_q8',
    step: 3,
    dimension: 'pilotage',
    sector: 'transport',
    question_text: 'À quelle fréquence suivez-vous la rentabilité de vos opérations ?',
    question_type: 'single_choice',
    options: [
      { label: 'Rarement', value: 'rarely', score: 0 },
      { label: 'Une fois par mois', value: 'monthly', score: 30 },
      { label: 'Une fois par semaine', value: 'weekly', score: 60 },
      { label: 'Après chaque livraison', value: 'per_delivery', score: 100 },
    ],
    max_score: 100,
    order_index: 4,
  },
];

// Bloc 3 - Automatisation & IA (step 4, dimension "automation") — inchangé
const transportAutomationQuestions: Question[] = [
  {
    id: 'tl_q9',
    step: 4,
    dimension: 'automation',
    sector: 'transport',
    question_text: 'Avez-vous des processus automatisés dans votre gestion de flotte ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, tout est manuel', value: 'none', score: 0 },
      { label: 'Intéressé mais pas encore mis en place', value: 'interested', score: 30 },
      { label: 'Quelques automatisations basiques (ex : alertes email)', value: 'basic', score: 60 },
      { label: 'Oui, plusieurs workflows automatisés', value: 'multiple', score: 100 },
    ],
    max_score: 100,
    order_index: 1,
  },
  {
    id: 'tl_q10',
    step: 4,
    dimension: 'automation',
    sector: 'transport',
    question_text: 'Seriez-vous intéressé par des solutions d\'IA pour :',
    question_type: 'multi_choice',
    scoring_mode: 'count',
    options: [
      { label: 'Prédiction de maintenance (anticiper les pannes)', value: 'predictive_maintenance', score: 1 },
      { label: 'Optimisation des routes et trajets', value: 'route_optimization', score: 1 },
      { label: 'Détection d\'anomalies (coûts inhabituels, consommation excessive)', value: 'anomaly_detection', score: 1 },
      { label: 'Automatisation des reportings mensuels', value: 'auto_reporting', score: 1 },
      { label: 'Analyse prédictive (coûts futurs, besoins en véhicules)', value: 'predictive_analytics', score: 1 },
      { label: 'Pas encore pertinent pour nous', value: 'not_relevant', score: 0 },
    ],
    max_score: 100,
    order_index: 2,
  },
];

// ============================================================
// COMMERCE & DISTRIBUTION - Diagnostic sectoriel complet
// ============================================================

// Bloc 1 - État des données (Q1-Q4)
const retailDataQuestions: Question[] = [
  {
    id: 'rt_q1',
    step: 2,
    dimension: 'data',
    sector: 'retail',
    question_text: 'Où sont stockées vos données de ventes et de stocks ?',
    question_type: 'single_choice',
    options: [
      { label: 'Aucune centralisation claire', value: 'none', score: 0 },
      { label: 'Papier, cahiers, registres', value: 'paper', score: 15 },
      { label: 'Excel / Sheets par point de vente', value: 'spreadsheets', score: 40 },
      { label: 'Logiciel de caisse + Excel en complément', value: 'pos_excel', score: 60 },
      { label: 'ERP / CRM centralisé', value: 'centralized', score: 90 },
    ],
    max_score: 100,
    order_index: 1,
  },
  {
    id: 'rt_q2',
    step: 2,
    dimension: 'data',
    sector: 'retail',
    question_text: 'Comment gérez-vous vos stocks multi-sites ?',
    question_type: 'single_choice',
    options: [
      { label: 'Pas de suivi cross-sites', value: 'none', score: 0 },
      { label: 'Chaque site gère indépendamment', value: 'independent', score: 20 },
      { label: 'Consolidation manuelle périodique', value: 'manual', score: 50 },
      { label: 'Visibilité temps réel centralisée sur tous les sites', value: 'realtime', score: 100 },
    ],
    max_score: 100,
    order_index: 2,
  },
  {
    id: 'rt_q3',
    step: 2,
    dimension: 'data',
    sector: 'retail',
    question_text: 'Vos équipes peuvent-elles accéder aux données dont elles ont besoin ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, très difficile d\'obtenir l\'info', value: 'no', score: 0 },
      { label: 'Partiellement, données dispersées', value: 'partial', score: 25 },
      { label: 'Oui, mais nécessite de demander ou compiler', value: 'compile', score: 50 },
      { label: 'Oui, données accessibles en temps réel (mobile/web)', value: 'realtime', score: 100 },
    ],
    max_score: 100,
    order_index: 3,
  },
  {
    id: 'rt_q4',
    step: 2,
    dimension: 'data',
    sector: 'retail',
    question_text: 'Pouvez-vous retrouver l\'historique complet des ventes par produit/client/magasin ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, très difficile ou impossible', value: 'no', score: 0 },
      { label: 'Partiellement, il manque souvent des infos', value: 'partial', score: 20 },
      { label: 'Oui, mais en cherchant dans plusieurs fichiers', value: 'multiple_files', score: 40 },
      { label: 'Oui, immédiatement dans un système', value: 'instant', score: 100 },
    ],
    max_score: 100,
    order_index: 4,
  },
];

// Bloc 2 - Pilotage & Performance (Q5-Q8)
const retailPilotageQuestions: Question[] = [
  {
    id: 'rt_q5',
    step: 3,
    dimension: 'pilotage',
    sector: 'retail',
    question_text: 'Suivez-vous la marge par produit et par point de vente ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, pas de suivi détaillé des marges', value: 'no', score: 0 },
      { label: 'Estimation approximative', value: 'estimate', score: 30 },
      { label: 'Oui, mais calcul manuel mensuel', value: 'manual_monthly', score: 60 },
      { label: 'Oui, calcul automatique et suivi en temps réel', value: 'auto_realtime', score: 100 },
    ],
    max_score: 100,
    order_index: 1,
  },
  {
    id: 'rt_q6',
    step: 3,
    dimension: 'pilotage',
    sector: 'retail',
    question_text: 'Comment analysez-vous les performances de vos points de vente ?',
    question_type: 'single_choice',
    options: [
      { label: 'Pas d\'analyse structurée', value: 'none', score: 0 },
      { label: 'Analyse basique occasionnelle', value: 'basic', score: 20 },
      { label: 'Rapports manuels mensuels', value: 'manual_monthly', score: 40 },
      { label: 'Dashboard automatisé avec KPIs en temps réel', value: 'auto_dashboard', score: 100 },
    ],
    max_score: 100,
    order_index: 2,
  },
  {
    id: 'rt_q7',
    step: 3,
    dimension: 'pilotage',
    sector: 'retail',
    question_text: 'Suivez-vous des KPIs commerciaux (taux de conversion, panier moyen, rotation stocks, etc.) ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, pas de KPIs définis', value: 'no', score: 0 },
      { label: 'Quelques indicateurs basiques', value: 'basic', score: 25 },
      { label: 'Oui, mais calcul manuel et irrégulier', value: 'manual_irregular', score: 50 },
      { label: 'Oui, KPIs suivis régulièrement et pilotés', value: 'regular_tracked', score: 100 },
    ],
    max_score: 100,
    order_index: 3,
  },
  {
    id: 'rt_q8',
    step: 3,
    dimension: 'pilotage',
    sector: 'retail',
    question_text: 'Comment prenez-vous vos décisions commerciales (assortiment, prix, promotions) ?',
    question_type: 'single_choice',
    options: [
      { label: 'Décisions rapides sans analyse approfondie', value: 'no_analysis', score: 10 },
      { label: 'Principalement expérience et feeling', value: 'experience', score: 30 },
      { label: 'Mix data + intuition terrain', value: 'mixed', score: 70 },
      { label: 'Analyses data systématiques (data-driven)', value: 'data_driven', score: 100 },
    ],
    max_score: 100,
    order_index: 4,
  },
];

// Bloc 3 - Automatisation & IA (Q9-Q10)
const retailAutomationQuestions: Question[] = [
  {
    id: 'rt_q9',
    step: 4,
    dimension: 'automation',
    sector: 'retail',
    question_text: 'Avez-vous des processus automatisés dans votre gestion commerciale ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, tout est manuel', value: 'none', score: 0 },
      { label: 'Intéressé mais pas encore mis en place', value: 'interested', score: 30 },
      { label: 'Quelques automatisations basiques (ex : alertes stock)', value: 'basic', score: 60 },
      { label: 'Oui, plusieurs workflows automatisés', value: 'multiple', score: 100 },
    ],
    max_score: 100,
    order_index: 1,
  },
  {
    id: 'rt_q10',
    step: 4,
    dimension: 'automation',
    sector: 'retail',
    question_text: 'Seriez-vous intéressé par des solutions d\'IA pour :',
    question_type: 'multi_choice',
    scoring_mode: 'count',
    options: [
      { label: 'Prévision de la demande', value: 'demand_forecast', score: 1 },
      { label: 'Optimisation des prix dynamiques', value: 'dynamic_pricing', score: 1 },
      { label: 'Détection ruptures de stock', value: 'stockout_detection', score: 1 },
      { label: 'Analyse comportement clients', value: 'customer_behavior', score: 1 },
      { label: 'Recommandations produits personnalisées', value: 'product_reco', score: 1 },
      { label: 'Pas encore pertinent pour nous', value: 'not_relevant', score: 0 },
    ],
    max_score: 100,
    order_index: 2,
  },
];

// ============================================================
// ÉNERGIE & UTILITIES - Diagnostic sectoriel complet
// ============================================================

// Bloc 1 - État des données (Q1-Q4)
const energyDataQuestions: Question[] = [
  {
    id: 'en_q1',
    step: 2,
    dimension: 'data',
    sector: 'energy',
    question_text: 'Où sont stockées vos données opérationnelles (production, distribution, consommation) ?',
    question_type: 'single_choice',
    options: [
      { label: 'Aucune centralisation claire', value: 'none', score: 0 },
      { label: 'Papier, registres manuels', value: 'paper', score: 15 },
      { label: 'Excel / Sheets multiples', value: 'spreadsheets', score: 40 },
      { label: 'Logiciel métier + Excel en complément', value: 'software_excel', score: 60 },
      { label: 'Système centralisé (SCADA, ERP)', value: 'centralized', score: 90 },
    ],
    max_score: 100,
    order_index: 1,
  },
  {
    id: 'en_q2',
    step: 2,
    dimension: 'data',
    sector: 'energy',
    question_text: 'Comment suivez-vous vos équipements et infrastructures ?',
    question_type: 'single_choice',
    options: [
      { label: 'Maintenance réactive uniquement', value: 'reactive', score: 0 },
      { label: 'Suivi papier ou mémoire', value: 'paper', score: 20 },
      { label: 'Planning manuel et fiches d\'intervention', value: 'manual', score: 50 },
      { label: 'Système GMAO avec historique complet', value: 'gmao', score: 100 },
    ],
    max_score: 100,
    order_index: 2,
  },
  {
    id: 'en_q3',
    step: 2,
    dimension: 'data',
    sector: 'energy',
    question_text: 'Vos équipes terrain peuvent-elles accéder aux données dont elles ont besoin ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, très difficile d\'obtenir l\'info', value: 'no', score: 0 },
      { label: 'Partiellement, données dispersées', value: 'partial', score: 25 },
      { label: 'Oui, mais nécessite de retourner au bureau', value: 'office', score: 50 },
      { label: 'Oui, données accessibles en temps réel (mobile/tablette)', value: 'realtime', score: 100 },
    ],
    max_score: 100,
    order_index: 3,
  },
  {
    id: 'en_q4',
    step: 2,
    dimension: 'data',
    sector: 'energy',
    question_text: 'Pouvez-vous retrouver l\'historique complet d\'un équipement (maintenance, incidents, performance) ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, très difficile ou impossible', value: 'no', score: 0 },
      { label: 'Partiellement, il manque souvent des infos', value: 'partial', score: 20 },
      { label: 'Oui, mais en cherchant dans plusieurs sources', value: 'multiple_sources', score: 40 },
      { label: 'Oui, immédiatement dans un système', value: 'instant', score: 100 },
    ],
    max_score: 100,
    order_index: 4,
  },
];

// Bloc 2 - Pilotage & Performance (Q5-Q8)
const energyPilotageQuestions: Question[] = [
  {
    id: 'en_q5',
    step: 3,
    dimension: 'pilotage',
    sector: 'energy',
    question_text: 'Suivez-vous vos coûts par site/équipement et vos pertes techniques ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, pas de suivi détaillé', value: 'no', score: 0 },
      { label: 'Estimation approximative', value: 'estimate', score: 30 },
      { label: 'Oui, mais calcul manuel mensuel', value: 'manual_monthly', score: 60 },
      { label: 'Oui, calcul automatique et suivi en temps réel', value: 'auto_realtime', score: 100 },
    ],
    max_score: 100,
    order_index: 1,
  },
  {
    id: 'en_q6',
    step: 3,
    dimension: 'pilotage',
    sector: 'energy',
    question_text: 'Comment créez-vous vos reportings opérationnels (production, incidents, maintenance) ?',
    question_type: 'single_choice',
    options: [
      { label: 'Pas de reporting structuré', value: 'none', score: 0 },
      { label: 'Rapports basiques occasionnels', value: 'basic', score: 20 },
      { label: 'Compilation manuelle (prend plusieurs heures)', value: 'manual', score: 40 },
      { label: 'Dashboard automatisé mis à jour en temps réel', value: 'auto_dashboard', score: 100 },
    ],
    max_score: 100,
    order_index: 2,
  },
  {
    id: 'en_q7',
    step: 3,
    dimension: 'pilotage',
    sector: 'energy',
    question_text: 'Suivez-vous des KPIs opérationnels (disponibilité, MTBF, taux d\'incidents, rendement) ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, pas de KPIs définis', value: 'no', score: 0 },
      { label: 'Quelques indicateurs basiques', value: 'basic', score: 25 },
      { label: 'Oui, mais calcul manuel et irrégulier', value: 'manual_irregular', score: 50 },
      { label: 'Oui, KPIs suivis régulièrement et pilotés', value: 'regular_tracked', score: 100 },
    ],
    max_score: 100,
    order_index: 3,
  },
  {
    id: 'en_q8',
    step: 3,
    dimension: 'pilotage',
    sector: 'energy',
    question_text: 'Comment prenez-vous vos décisions (maintenance, investissement, optimisation réseau) ?',
    question_type: 'single_choice',
    options: [
      { label: 'Décisions rapides sans analyse approfondie', value: 'no_analysis', score: 10 },
      { label: 'Principalement expérience et intuition', value: 'experience', score: 30 },
      { label: 'Mix data + expérience terrain', value: 'mixed', score: 70 },
      { label: 'Analyses data systématiques (data-driven)', value: 'data_driven', score: 100 },
    ],
    max_score: 100,
    order_index: 4,
  },
];

// Bloc 3 - Automatisation & IA (Q9-Q10)
const energyAutomationQuestions: Question[] = [
  {
    id: 'en_q9',
    step: 4,
    dimension: 'automation',
    sector: 'energy',
    question_text: 'Avez-vous des processus automatisés dans votre gestion opérationnelle ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, tout est manuel', value: 'none', score: 0 },
      { label: 'Intéressé mais pas encore mis en place', value: 'interested', score: 30 },
      { label: 'Quelques automatisations basiques (ex : alertes)', value: 'basic', score: 60 },
      { label: 'Oui, plusieurs workflows automatisés', value: 'multiple', score: 100 },
    ],
    max_score: 100,
    order_index: 1,
  },
  {
    id: 'en_q10',
    step: 4,
    dimension: 'automation',
    sector: 'energy',
    question_text: 'Seriez-vous intéressé par des solutions d\'IA pour :',
    question_type: 'multi_choice',
    scoring_mode: 'count',
    options: [
      { label: 'Maintenance prédictive des équipements', value: 'predictive_maintenance', score: 1 },
      { label: 'Optimisation de la production/distribution', value: 'production_optimization', score: 1 },
      { label: 'Détection d\'anomalies et fraudes', value: 'anomaly_fraud', score: 1 },
      { label: 'Prévision de la demande énergétique', value: 'demand_forecast', score: 1 },
      { label: 'Optimisation de la performance réseau', value: 'network_optimization', score: 1 },
      { label: 'Pas encore pertinent pour nous', value: 'not_relevant', score: 0 },
    ],
    max_score: 100,
    order_index: 2,
  },
];

// ============================================================
// QUESTIONS GÉNÉRIQUES (fallback pour les autres secteurs)
// ============================================================

const genericDataQuestions: Question[] = [
  {
    id: 'gen_q1',
    step: 2,
    dimension: 'data',
    question_text: 'Quelles sont vos principales sources de données aujourd\'hui ?',
    question_type: 'single_choice',
    options: [
      { label: 'Aucune source structurée', value: 'none', score: 0 },
      { label: 'Papier, emails', value: 'paper', score: 15 },
      { label: 'Fichiers Excel / Google Sheets', value: 'spreadsheets', score: 40 },
      { label: 'ERP ou logiciel métier', value: 'erp', score: 65 },
      { label: 'Plusieurs systèmes connectés / Data warehouse', value: 'connected', score: 90 },
    ],
    max_score: 100,
    order_index: 1,
  },
  {
    id: 'gen_q2',
    step: 2,
    dimension: 'data',
    question_text: 'Vos données sont-elles centralisées dans un référentiel unique ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, les données sont dispersées', value: 'dispersed', score: 0 },
      { label: 'Partiellement centralisées', value: 'partial', score: 40 },
      { label: 'Oui, référentiel central', value: 'centralized', score: 90 },
    ],
    max_score: 100,
    order_index: 2,
  },
  {
    id: 'gen_q3',
    step: 2,
    dimension: 'data',
    question_text: 'Vos équipes peuvent-elles accéder facilement aux données dont elles ont besoin ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, très difficile d\'obtenir l\'info', value: 'no', score: 0 },
      { label: 'Partiellement, données dispersées', value: 'partial', score: 25 },
      { label: 'Oui, mais nécessite de demander ou compiler', value: 'compile', score: 50 },
      { label: 'Oui, données accessibles en temps réel', value: 'realtime', score: 100 },
    ],
    max_score: 100,
    order_index: 3,
  },
  {
    id: 'gen_q4',
    step: 2,
    dimension: 'data',
    question_text: 'Comment évaluez-vous la qualité de vos données ?',
    question_type: 'single_choice',
    options: [
      { label: 'Mauvaise - beaucoup d\'erreurs', value: 'poor', score: 0 },
      { label: 'Passable - quelques problèmes', value: 'fair', score: 25 },
      { label: 'Correcte - généralement fiable', value: 'good', score: 50 },
      { label: 'Bonne - validation en place', value: 'very_good', score: 75 },
      { label: 'Excellente - gouvernance stricte', value: 'excellent', score: 100 },
    ],
    max_score: 100,
    order_index: 4,
  },
];

const genericPilotageQuestions: Question[] = [
  {
    id: 'gen_q5',
    step: 3,
    dimension: 'pilotage',
    question_text: 'Disposez-vous de tableaux de bord pour suivre vos KPIs ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non', value: 'no', score: 0 },
      { label: 'Oui, dans Excel/Sheets', value: 'spreadsheet', score: 30 },
      { label: 'Oui, outil BI (Power BI, Tableau)', value: 'bi_tool', score: 70 },
      { label: 'Dashboards temps réel', value: 'realtime', score: 100 },
    ],
    max_score: 100,
    order_index: 1,
  },
  {
    id: 'gen_q6',
    step: 3,
    dimension: 'pilotage',
    question_text: 'Vos rapports sont-ils automatisés ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, tout est manuel', value: 'manual', score: 0 },
      { label: 'Rapports basiques occasionnels', value: 'basic', score: 20 },
      { label: 'Partiellement automatisés', value: 'partial', score: 50 },
      { label: 'Entièrement automatisés', value: 'automated', score: 100 },
    ],
    max_score: 100,
    order_index: 2,
  },
  {
    id: 'gen_q7',
    step: 3,
    dimension: 'pilotage',
    question_text: 'Suivez-vous des KPIs opérationnels régulièrement ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, pas de KPIs définis', value: 'no', score: 0 },
      { label: 'Quelques indicateurs basiques', value: 'basic', score: 25 },
      { label: 'Oui, mais calcul manuel et irrégulier', value: 'manual', score: 50 },
      { label: 'Oui, KPIs suivis régulièrement et pilotés', value: 'tracked', score: 100 },
    ],
    max_score: 100,
    order_index: 3,
  },
  {
    id: 'gen_q8',
    step: 3,
    dimension: 'pilotage',
    question_text: 'Comment prenez-vous vos décisions stratégiques ?',
    question_type: 'single_choice',
    options: [
      { label: 'Décisions rapides sans analyse approfondie', value: 'no_analysis', score: 10 },
      { label: 'Principalement expérience et intuition', value: 'experience', score: 30 },
      { label: 'Mix data + expérience', value: 'mixed', score: 70 },
      { label: 'Culture data-driven', value: 'data_driven', score: 100 },
    ],
    max_score: 100,
    order_index: 4,
  },
];

const genericAutomationQuestions: Question[] = [
  {
    id: 'gen_q9',
    step: 4,
    dimension: 'automation',
    question_text: 'Avez-vous des processus automatisés ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, tout est manuel', value: 'none', score: 0 },
      { label: 'Intéressé mais pas encore mis en place', value: 'interested', score: 30 },
      { label: 'Quelques automatisations basiques', value: 'basic', score: 60 },
      { label: 'Plusieurs workflows automatisés', value: 'multiple', score: 100 },
    ],
    max_score: 100,
    order_index: 1,
  },
  {
    id: 'gen_q10',
    step: 4,
    dimension: 'automation',
    question_text: 'Quels cas d\'usage IA vous intéressent ?',
    question_type: 'multi_choice',
    scoring_mode: 'count',
    options: [
      { label: 'Prédiction et forecasting', value: 'prediction', score: 1 },
      { label: 'Automatisation de tâches répétitives', value: 'task_automation', score: 1 },
      { label: 'Analyse de documents', value: 'document_ai', score: 1 },
      { label: 'Détection d\'anomalies', value: 'anomaly_detection', score: 1 },
      { label: 'Reporting automatisé', value: 'auto_reporting', score: 1 },
      { label: 'Pas encore pertinent pour nous', value: 'not_relevant', score: 0 },
    ],
    max_score: 100,
    order_index: 2,
  },
];

// ============================================================
// MAPPING PAR SECTEUR
// ============================================================

const questionsBySector: Record<string, Question[]> = {
  transport: [
    ...transportDataQuestions,
    ...transportPilotageQuestions,
    ...transportAutomationQuestions,
  ],
  retail: [
    ...retailDataQuestions,
    ...retailPilotageQuestions,
    ...retailAutomationQuestions,
  ],
  energy: [
    ...energyDataQuestions,
    ...energyPilotageQuestions,
    ...energyAutomationQuestions,
  ],
};

const genericQuestions: Question[] = [
  ...genericDataQuestions,
  ...genericPilotageQuestions,
  ...genericAutomationQuestions,
];

// ============================================================
// FONCTIONS D'ACCÈS
// ============================================================

export const getQuestionsForStep = (step: number, sector?: string): Question[] => {
  const allQuestions = (sector && questionsBySector[sector]) || genericQuestions;
  return allQuestions.filter(q => q.step === step);
};

export const getAllQuestions = (sector?: string): Question[] => {
  return (sector && questionsBySector[sector]) || genericQuestions;
};

export const hasSectorQuestions = (sector: string): boolean => {
  return sector in questionsBySector;
};
