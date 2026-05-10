import { useDiagnostic } from '@/hooks/useDiagnostic';
import { getQuestionsForStep } from '@/data/questions';
import { LandingPage } from '@/components/diagnostic/LandingPage';
import { ProgressBar } from '@/components/diagnostic/ProgressBar';
import { CompanyProfileStep } from '@/components/diagnostic/steps/CompanyProfileStep';
import { QuestionStep } from '@/components/diagnostic/steps/QuestionStep';
import { ContactStep } from '@/components/diagnostic/steps/ContactStep';
import { NeedsStep } from '@/components/diagnostic/steps/NeedsStep';
import { ResultsPage } from '@/components/diagnostic/ResultsPage';

const STEP_TITLES: Record<number, { title: string; subtitle?: string }> = {
  2: { title: 'Fondations Data', subtitle: 'Évaluons la maturité de vos données' },
  3: { title: 'BI & Analytics', subtitle: 'Vos pratiques de pilotage et reporting' },
  4: { title: 'IA & Automation', subtitle: 'Votre niveau d\'automatisation' },
};

const Index = () => {
  const {
    currentStep,
    formData,
    result,
    isSubmitting,
    updateOrganization,
    updateRespondent,
    updateAnswer,
    nextStep,
    prevStep,
    submitDiagnostic,
    resetDiagnostic,
  } = useDiagnostic();

  // Total steps: contexte (1) + données (2) + pilotage (3) + automatisation (4) + contact (5) + besoin (6)
  const totalSteps = 6;

  // Step 0: Landing page
  if (currentStep === 0) {
    return <LandingPage onStart={nextStep} />;
  }

  // Results page (after submission)
  if (result) {
    return <ResultsPage result={result} onRestart={resetDiagnostic} />;
  }

  // Step 1: Contexte (Company Profile)
  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-background">
        <ProgressBar currentStep={1} totalSteps={totalSteps} />
        <CompanyProfileStep
          data={formData.organization}
          role={formData.respondent.role}
          onUpdate={updateOrganization}
          onUpdateRole={(role) => updateRespondent({ role })}
          onNext={nextStep}
          onPrev={prevStep}
        />
      </div>
    );
  }

  // Step 5: Contact
  if (currentStep === 5) {
    return (
      <div className="min-h-screen bg-background">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <ContactStep
          data={formData.respondent}
          onUpdate={updateRespondent}
          onSubmit={nextStep}
          onPrev={prevStep}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  // Step 6: Besoin complémentaire
  if (currentStep === 6) {
    return (
      <div className="min-h-screen bg-background">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <NeedsStep
          onSubmit={submitDiagnostic}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  // Question steps (2-4)
  const stepQuestions = getQuestionsForStep(currentStep, formData.organization.sector);
  const stepInfo = STEP_TITLES[currentStep];

  if (stepQuestions.length > 0 && stepInfo) {
    return (
      <div className="min-h-screen bg-background">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <QuestionStep
          title={stepInfo.title}
          subtitle={stepInfo.subtitle}
          questions={stepQuestions}
          answers={formData.answers}
          onAnswer={updateAnswer}
          onNext={nextStep}
          onPrev={prevStep}
          isLastStep={currentStep === 4}
        />
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  );
};

export default Index;
