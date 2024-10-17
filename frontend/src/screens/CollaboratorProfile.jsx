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
  Divider,
  Chip
} from '@mui/material';
import { useGetCollaboratorQuery } from '../slices/collaboratorsApiSlice';
import { Link } from 'react-router-dom';

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

const CollaboratorProfile = ({ collaboratorId }) => {
  const {
    data: collaborator,
    isLoading,
    error,
  } = useGetCollaboratorQuery(collaboratorId);

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
          {error?.data?.message || error?.error || 'Échec du chargement du profil du collaborateur'}
        </Alert>
      </Box>
    );
  }

  if (!collaborator) {
    return <Alert severity="info">Collaborateur non trouvé</Alert>;
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Profil du Collaborateur
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          ID: {collaboratorId}
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informations de base
              </Typography>
              <ProfileField label="Nom complet" value={collaborator.fullName} />
              <ProfileField label="ID Employé" value={collaborator.employeeId} />
              <ProfileField label="Département" value={collaborator.department} />
              <ProfileField label="Poste" value={collaborator.position} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informations sur l'affectation
              </Typography>
              <ProfileField 
                label="Statut de l'affectation" 
                value={collaborator.assignedInspector ? 'Affecté' : 'Non affecté'} 
              />
              {collaborator.assignedInspector && (
                <ProfileField 
                  label="Inspecteur assigné" 
                  value={
                    <Chip 
                      label={collaborator.assignedInspector.name} 
                      component={Link} 
                      to={`/details/user/${collaborator.assignedInspector._id}`} 
                      clickable 
                    />
                  } 
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CollaboratorProfile;