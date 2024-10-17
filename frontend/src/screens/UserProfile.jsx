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
import { useGetUserQuery } from '../slices/usersApiSlice';

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

const UserProfile = ({ userId }) => {
  const {
    data: user,
    isLoading,
    error,
  } = useGetUserQuery(userId);

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
          {error?.data?.message || error?.error || 'Échec du chargement du profil utilisateur'}
        </Alert>
      </Box>
    );
  }

  if (!user) {
    return <Alert severity="info">Utilisateur non trouvé</Alert>;
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Profil Utilisateur
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          ID: {userId}
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informations de Base
              </Typography>
              <ProfileField label="Nom" value={user.name} />
              <ProfileField label="Email" value={user.email} />
              <ProfileField label="Rôle" value={user.role} />
              <ProfileField 
                label="Membre Depuis" 
                value={new Date(user.createdAt).toLocaleDateString()} 
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Statut du Compte
              </Typography>
              <ProfileField 
                label="Type de Compte" 
                value={user.role === 'admin' ? 'Administrateur' : 'Inspecteur'} 
              />
              <ProfileField 
                label="Dernière Mise à Jour" 
                value={new Date(user.updatedAt).toLocaleDateString()} 
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfile;