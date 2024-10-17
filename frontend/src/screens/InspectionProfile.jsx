import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Alert,
  CircularProgress,
  Divider 
} from '@mui/material';
import { useGetInspectionQuery } from '../slices/inspectionsApiSlice';
import InspectionReportButton from '../components/InspectionReportButton';

const ProfileField = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" sx={{ mt: 1 }}>
      {value || 'Non fourni'}
    </Typography>
    <Divider sx={{ mt: 2 }} />
  </Box>
);

const InspectionProfile = ({ inspectionId }) => {
  const {
    data: inspection,
    isLoading,
    error,
  } = useGetInspectionQuery(inspectionId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error?.data?.message || error?.error || 'Échec du chargement du profil d\'inspection'}
        </Alert>
      </Box>
    );
  }

  if (!inspection) {
    return <Alert severity="info">Inspection non trouvée</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Profil d'inspection
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          ID: {inspectionId}
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Détails de l'inspection
              </Typography>
              <ProfileField label="Inspecteur" value={inspection.inspector?.name} />
              <ProfileField label="Collaborateur" value={inspection.collaborator?.fullName} />
              <ProfileField label="Ligne" value={inspection.line?.trainNumber} />
              <ProfileField 
                label="Date et heure prévues" 
                value={new Date(inspection.plannedDateTime).toLocaleString()} 
              />
              <ProfileField label="Statut" value={inspection.status} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informations supplémentaires
              </Typography>
              <ProfileField 
                label="Évaluation" 
                value={inspection.rating ? `${inspection.rating} / 5` : 'Non évalué'} 
              />
              <ProfileField 
                label="Dernière mise à jour" 
                value={new Date(inspection.updatedAt).toLocaleDateString()} 
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Rapport d'inspection</Typography>
        <InspectionReportButton inspectionId={inspectionId} />
      </Box>
    </CardContent>
  </Card>
</Grid>
      </Grid>
    </Box>
  );
};

export default InspectionProfile;