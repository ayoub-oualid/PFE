import React, { useState } from 'react';
import { 
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Rating,
  Step,
  StepLabel,
  Stepper,
  Typography,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { 
  useCreateReportMutation,
  useGetReportsByInspectionQuery,
  useUpdateReportMutation 
} from '../slices/reportsApiSlice';

// Questions array should contain 15 objects with format:
// { id: number, question: string, field: "field1" through "field15", category: 0|1|2 }
const questions = [{
  "id": 1,
  "question": "Le collaborateur respecte-t-il les procédures de sécurité sur le train?",
  "field": "field1",
  "category": 0
},
{
  "id": 2,
  "question": "Le collaborateur respecte-t-il les horaires et les délais des tâches assignées?",
  "field": "field2",
  "category": 0
},
{
  "id": 3,
  "question": "Le collaborateur interagit-il de manière professionnelle avec les passagers?",
  "field": "field3",
  "category": 0
},
{
  "id": 4,
  "question": "Le collaborateur montre-t-il des compétences techniques adéquates pour les tâches demandées?",
  "field": "field4",
  "category": 0
},
{
  "id": 5,
  "question": "Le collaborateur prend-il des initiatives pour résoudre les problèmes sur le train?",
  "field": "field5",
  "category": 0
},
{
  "id": 6,
  "question": "Le collaborateur garde-t-il le matériel et l'équipement en bon état?",
  "field": "field6",
  "category": 0
},
{
  "id": 7,
  "question": "Le collaborateur respecte-t-il les consignes de sécurité lors de l'utilisation de l'équipement?",
  "field": "field7",
  "category": 0
},
{
  "id": 8,
  "question": "Le collaborateur travaille-t-il efficacement en équipe avec ses collègues?",
  "field": "field8",
  "category": 0
},
{
  "id": 9,
  "question": "Le collaborateur est-il ponctuel au début de son service?",
  "field": "field9",
  "category": 1
},
{
  "id": 10,
  "question": "Le collaborateur fournit-il un service client de qualité aux passagers?",
  "field": "field10",
  "category": 1
},
{
  "id": 11,
  "question": "Le collaborateur est-il attentif aux besoins des passagers et répond-il efficacement à leurs demandes?",
  "field": "field11",
  "category": 1
},
{
  "id": 12,
  "question": "Le collaborateur respecte-t-il les protocoles en cas d'urgence?",
  "field": "field12",
  "category": 1
},
{
  "id": 13,
  "question": "Le collaborateur fait-il preuve de responsabilité dans l'exécution de ses tâches?",
  "field": "field13",
  "category": 1
},
{
  "id": 14,
  "question": "Le collaborateur communique-t-il clairement et efficacement avec les autres membres de l'équipe?",
  "field": "field14",
  "category": 1
},
{
  "id": 15,
  "question": "Le collaborateur fait-il preuve d’une bonne gestion du temps pour l'accomplissement de ses tâches?",
  "field": "field15",
  "category": 1
}];

const QuestionGroup = ({ questions, ratings, onRatingChange }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    {questions.map((q) => (
      <Card key={q.id} variant="outlined" sx={{ p: 2 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {q.question}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Rating
            value={ratings[q.field] || 0}
            onChange={(_, newValue) => onRatingChange(q.field, newValue)}
            size="large"
          />
          <Typography variant="body2" color="text.secondary">
            {ratings[q.field] ? `${ratings[q.field]}/5` : 'Non noté'}
          </Typography>
        </Box>
      </Card>
    ))}
  </Box>
);

const ReportForm = ({ inspectionId, existingReport, onClose }) => {
  const [createReport] = useCreateReportMutation();
  const [updateReport] = useUpdateReportMutation();
  const [activeStep, setActiveStep] = useState(0);
  const [ratings, setRatings] = useState(
    existingReport ? 
    Object.fromEntries(
      Array.from({ length: 15 }, (_, i) => [`field${i + 1}`, existingReport[`field${i + 1}`]])
    ) : {}
  );

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleRatingChange = (field, value) => {
    setRatings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const reportData = {
        ...ratings,
        inspection: inspectionId
      };

      if (existingReport) {
        await updateReport({
          id: existingReport._id,
          ...reportData
        }).unwrap();
      } else {
        await createReport(reportData).unwrap();
      }
      onClose();
    } catch (err) {
      console.error('Échec de l\'enregistrement du rapport:', err);
    }
  };

  const isStepComplete = (step) => {
    const stepQuestions = questions.filter(q => q.category === step);
    return stepQuestions.every(q => ratings[q.field] > 0);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Évaluation de la sécurité et des procédures
            </Typography>
            <QuestionGroup
              questions={questions.filter(q => q.category === 0)}
              ratings={ratings}
              onRatingChange={handleRatingChange}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Évaluation du service et de la communication
            </Typography>
            <QuestionGroup
              questions={questions.filter(q => q.category === 1)}
              ratings={ratings}
              onRatingChange={handleRatingChange}
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Réviser les évaluations
            </Typography>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Note moyenne: {(Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length).toFixed(1)}/5
              </Typography>
              {questions.map((q) => (
                <Box key={q.id} sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {q.question}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={ratings[q.field] || 0} readOnly size="small" />
                    <Typography variant="body2">
                      {ratings[q.field] || 0}/5
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Card>
          </Box>
        );
      default:
        return 'Étape inconnue';
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
        {['Sécurité & Procédures', 'Service & Communication', 'Réviser'].map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {renderStepContent(activeStep)}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
        <Button
          variant="outlined"
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Retour
        </Button>
        <Button
          variant="contained"
          onClick={activeStep === 2 ? handleSubmit : handleNext}
          disabled={activeStep !== 2 && !isStepComplete(activeStep)}
        >
          {activeStep === 2 ? 'Soumettre' : 'Suivant'}
        </Button>
      </Box>
    </Box>
  );
};

const InspectionReportButton = ({ inspectionId }) => {
  const [open, setOpen] = useState(false);
  const { data: reports, isLoading } = useGetReportsByInspectionQuery(inspectionId);
  const existingReport = reports?.[0];

  if (isLoading) {
    return <CircularProgress size={24} />;
  }

  return (
    <>
      <IconButton
        color="primary"
        onClick={() => setOpen(true)}
      >
        {existingReport ? <EditIcon /> : <AddIcon />}
      </IconButton>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {existingReport ? 'Modifier le rapport' : 'Créer un rapport'}
        </DialogTitle>
        <DialogContent>
          <ReportForm
            inspectionId={inspectionId}
            existingReport={existingReport}
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InspectionReportButton;