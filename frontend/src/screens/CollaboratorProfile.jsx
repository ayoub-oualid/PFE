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
import { useGetCollaboratorQuery } from '../slices/collaboratorsApiSlice';

const ProfileField = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" sx={{ mt: 1 }}>
      {value || 'Not provided'}
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
          {error?.data?.message || error?.error || 'Failed to load collaborator profile'}
        </Alert>
      </Box>
    );
  }

  if (!collaborator) {
    return <Alert severity="info">Collaborator not found</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Collaborator Profile
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          ID: {collaboratorId}
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <ProfileField label="Full Name" value={collaborator.fullName} />
              <ProfileField label="Employee ID" value={collaborator.employeeId} />
              <ProfileField label="Department" value={collaborator.department} />
              <ProfileField label="Position" value={collaborator.position} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assignment Information
              </Typography>
              <ProfileField 
                label="Assignment Status" 
                value={collaborator.assignedInspector ? 'Assigned' : 'Unassigned'} 
              />
              {collaborator.assignedInspector && (
                <ProfileField 
                  label="Assigned Inspector" 
                  value={collaborator.assignedInspector.name} 
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