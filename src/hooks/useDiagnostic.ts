import { useState, useCallback } from 'react';
import {
  DiagnosticFormData,
  DiagnosticAnswer,
  DiagnosticResult,
  DimensionScore,
  Organization,
  Respondent,
  DIMENSIONS,
} from '@/types/diagnostic';
import { getAllQuestions } from '@/data/questions';
import { supabase } from '@/integrations/supabase/client';

const INITIAL_ORGANIZATION: Organization = {
  name: '',
  sector: '',
  country: '',
  size: '',
};

const INITIAL_RESPONDENT: Respondent = {
  name: '',
  email: '',
  phone: '',
  role: '',
  consent_given: false,
};

export const useDiagnostic = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<DiagnosticFormData>({
    organization: INITIAL_ORGANIZATION,
    respondent: INITIAL_RESPONDENT,
    answers: {},
  });
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateOrganization = useCallback((data: Partial<Organization>) => {
    setFormData(prev => ({
      ...prev,
      organization: { ...prev.organization, ...data },
    }));
  }, []);

  const updateRespondent = useCallback((data: Partial<Respondent>) => {
    setFormData(prev => ({
      ...prev,
      respondent: { ...prev.respondent, ...data },
    }));
  }, []);

  const updateAnswer = useCallback((questionId: string, answer: DiagnosticAnswer) => {
    setFormData(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer },
    }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const calculateResults = useCallback((): DiagnosticResult => {
    const sector = formData.organization.sector;
    const questions = getAllQuestions(sector);
    const answers = formData.answers;

    // Group questions by dimension
    const dimensionMap = new Map<string, { total: number; count: number }>();

    questions.forEach(q => {
      if (!dimensionMap.has(q.dimension)) {
        dimensionMap.set(q.dimension, { total: 0, count: 0 });
      }
      const dimData = dimensionMap.get(q.dimension)!;
      dimData.count += 1;

      const answer = answers[q.id];
      if (answer) {
        dimData.total += answer.score;
      }
    });

    // Calculate dimension scores (average per dimension, 0-100)
    const dimensionScores: DimensionScore[] = [];

    DIMENSIONS.forEach(dim => {
      const data = dimensionMap.get(dim.id);
      const percentage = data && data.count > 0
        ? Math.round(data.total / data.count)
        : 0;

      dimensionScores.push({
        dimension: dim.id,
        label: dim.label,
        score: data?.total || 0,
        maxScore: (data?.count || 0) * 100,
        percentage,
        weight: dim.weight,
      });
    });

    // Calculate weighted total score
    const percentage = Math.round(
      dimensionScores.reduce((acc, dim) => acc + dim.percentage * dim.weight, 0)
    );

    // Determine maturity level (4 levels)
    let maturityLevel: 'debutant' | 'intermediaire' | 'avance' | 'expert';
    if (percentage <= 30) {
      maturityLevel = 'debutant';
    } else if (percentage <= 60) {
      maturityLevel = 'intermediaire';
    } else if (percentage <= 85) {
      maturityLevel = 'avance';
    } else {
      maturityLevel = 'expert';
    }

    const totalScore = dimensionScores.reduce((acc, d) => acc + d.score, 0);
    const maxPossibleScore = dimensionScores.reduce((acc, d) => acc + d.maxScore, 0);

    return {
      totalScore,
      maxPossibleScore,
      percentage,
      maturityLevel,
      dimensionScores,
      sector,
    };
  }, [formData]);

  const submitDiagnostic = useCallback(async (additionalNeed?: string) => {
    setIsSubmitting(true);
    console.log('Diagnostic submission started', {
      organization: formData.organization,
      respondent: formData.respondent,
      answersCount: Object.keys(formData.answers).length,
    });

    try {
      const calculatedResult = calculateResults();

      // Create organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.organization.name,
          sector: formData.organization.sector,
          country: formData.organization.country,
          size: formData.organization.size,
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Create respondent
      const { data: respondentData, error: respondentError } = await supabase
        .from('respondents')
        .insert({
          organization_id: orgData.id,
          name: formData.respondent.name,
          email: formData.respondent.email,
          phone: formData.respondent.phone || null,
          role: formData.respondent.role,
          consent_given: formData.respondent.consent_given,
        })
        .select()
        .single();

      if (respondentError) throw respondentError;

      // Create diagnostic
      const { data: diagnosticData, error: diagnosticError } = await supabase
        .from('diagnostics')
        .insert([{
          organization_id: orgData.id,
          respondent_id: respondentData.id,
          total_score: calculatedResult.percentage,
          maturity_level: calculatedResult.maturityLevel,
          axis_scores: JSON.parse(JSON.stringify(calculatedResult.dimensionScores)),
          status: 'completed',
          completed_at: new Date().toISOString(),
          ...(additionalNeed ? { additional_need: additionalNeed } : {}),
        }])
        .select()
        .single();

      if (diagnosticError) throw diagnosticError;

      // Store answers
      const answersToInsert = Object.entries(formData.answers).map(([questionId, answer]) => ({
        diagnostic_id: diagnosticData.id,
        question_id: questionId,
        answer_value: answer.value,
        score: answer.score,
      }));

      // Store transport qualification data as answers (not scored)
      if (formData.organization.sector === 'transport') {
        const org = formData.organization;
        const qualFields = [
          { id: 'tl_qual_activity', value: org.activity_type },
          { id: 'tl_qual_product', value: org.product_type },
          { id: 'tl_qual_fleet_size', value: org.fleet_size },
          { id: 'tl_qual_fleet_ownership', value: org.fleet_ownership },
        ];
        qualFields.forEach(f => {
          if (f.value) {
            answersToInsert.push({
              diagnostic_id: diagnosticData.id,
              question_id: f.id,
              answer_value: f.value,
              score: 0,
            });
          }
        });
      }

      if (answersToInsert.length > 0) {
        const { error: answersError } = await supabase
          .from('answers')
          .insert(answersToInsert);

        if (answersError) throw answersError;
      }

      // Try to send emails via edge function (if available)
      try {
        await supabase.functions.invoke('send-diagnostic-emails', {
          body: {
            diagnosticId: diagnosticData.id,
            organization: formData.organization,
            respondent: formData.respondent,
            result: calculatedResult,
          },
        });
      } catch {
        console.log('Email sending skipped');
      }

      setResult({ ...calculatedResult, id: diagnosticData.id });
      nextStep();
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Erreur lors de l\'envoi. Vérifiez la console.');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, calculateResults, nextStep]);

  const resetDiagnostic = useCallback(() => {
    setCurrentStep(0);
    setFormData({
      organization: INITIAL_ORGANIZATION,
      respondent: INITIAL_RESPONDENT,
      answers: {},
    });
    setResult(null);
  }, []);

  return {
    currentStep,
    formData,
    result,
    isSubmitting,
    updateOrganization,
    updateRespondent,
    updateAnswer,
    nextStep,
    prevStep,
    goToStep,
    submitDiagnostic,
    resetDiagnostic,
  };
};
