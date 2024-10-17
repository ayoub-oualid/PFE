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
      {value || 'Not provided'}
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
          {error?.data?.message || error?.error || 'Failed to load user profile'}
        </Alert>
      </Box>
    );
  }

  if (!user) {
    return <Alert severity="info">User not found</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          ID: {userId}
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <ProfileField label="Name" value={user.name} />
              <ProfileField label="Email" value={user.email} />
              <ProfileField label="Role" value={user.role} />
              <ProfileField 
                label="Member Since" 
                value={new Date(user.createdAt).toLocaleDateString()} 
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Status
              </Typography>
              <ProfileField 
                label="Account Type" 
                value={user.role === 'admin' ? 'Administrator' : 'Regular User'} 
              />
              <ProfileField 
                label="Last Updated" 
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