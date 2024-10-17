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
          {error?.data?.message || error?.error || 'Failed to load inspection profile'}
        </Alert>
      </Box>
    );
  }

  if (!inspection) {
    return <Alert severity="info">Inspection not found</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Inspection Profile
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
                Inspection Details
              </Typography>
              <ProfileField label="Inspector" value={inspection.inspector?.name} />
              <ProfileField label="Collaborator" value={inspection.collaborator?.fullName} />
              <ProfileField label="Line" value={inspection.line?.trainNumber} />
              <ProfileField 
                label="Planned Date and Time" 
                value={new Date(inspection.plannedDateTime).toLocaleString()} 
              />
              <ProfileField label="Status" value={inspection.status} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Additional Information
              </Typography>
              <ProfileField 
                label="Rating" 
                value={inspection.rating ? `${inspection.rating} / 5` : 'Not rated'} 
              />
              <ProfileField 
                label="Last Updated" 
                value={new Date(inspection.updatedAt).toLocaleDateString()} 
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InspectionProfile;
