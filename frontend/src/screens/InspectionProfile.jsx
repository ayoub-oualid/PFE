import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Alert,
  CircularProgress,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip
} from '@mui/material';
import { useGetInspectionQuery, useDeleteInspectionMutation } from '../slices/inspectionsApiSlice';
import InspectionReportButton from '../components/InspectionReportButton';
import { useNavigate, Link } from 'react-router-dom';

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
  const [deleteInspection] = useDeleteInspectionMutation();
  const [open, setOpen] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteInspection(inspectionId).unwrap();
      setOpen(false);
      navigate('/home');
    } catch (err) {
      setDeleteError(err?.data?.message || 'Échec de la suppression de l\'inspection');
    }
  };

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
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Profil d'inspection
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          ID: {inspectionId}
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Détails de l'inspection
              </Typography>
              <ProfileField 
                label="Inspecteur" 
                value={
                  inspection.inspector ? (
                    <Chip 
                      label={inspection.inspector.name} 
                      component={Link} 
                      to={`/details/user/${inspection.inspector._id}`} 
                      clickable 
                    />
                  ) : 'Non fourni'
                } 
              />
              <ProfileField 
                label="Collaborateur" 
                value={
                  inspection.collaborator ? (
                    <Chip 
                      label={inspection.collaborator.fullName} 
                      component={Link} 
                      to={`/details/collaborator/${inspection.collaborator._id}`} 
                      clickable 
                    />
                  ) : 'Non fourni'
                } 
              />
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
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
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
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Rapport d'inspection</Typography>
                <InspectionReportButton inspectionId={inspectionId} />
                <Button variant="contained" color="error" onClick={() => setOpen(true)}>
                  Supprimer
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmer la suppression"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer cette inspection ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {deleteError && (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            {deleteError}
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default InspectionProfile;