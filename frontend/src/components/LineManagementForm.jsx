import React, { useState } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, MenuItem, Select, Chip, Typography, Grid } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useGetCollaboratorsQuery } from '../slices/collaboratorsApiSlice';

const LineManagementForm = ({ mode, line, onSubmit, onClose }) => {
  const [trainNumber, setTrainNumber] = useState(line?.trainNumber || '');
  const [firstStop, setFirstStop] = useState(line?.firstStop || '');
  const [lastStop, setLastStop] = useState(line?.lastStop || '');
  const [collaborators, setCollaborators] = useState(line?.collaborators.map(c => c._id) || []);
  const [dateTime, setDateTime] = useState(line?.dateTime ? dayjs(line.dateTime) : dayjs());

  const { data: collaboratorOptions, isLoading: loadingCollaborators, isError } = useGetCollaboratorsQuery();

  const handleSubmit = () => {
    onSubmit({ 
      trainNumber, 
      dateTime: dateTime.toISOString(), 
      firstStop, 
      lastStop, 
      collaborators,
    });
  };

  const handleCollaboratorChange = (event) => {
    const {
      target: { value },
    } = event;
    setCollaborators(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {mode === 'create' ? 'Create New Line' : 'Edit Line'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Train Number"
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DateTimePicker
              label="Date & Time"
              value={dateTime}
              onChange={(newDate) => setDateTime(newDate)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Collaborators</InputLabel>
              <Select
                multiple
                value={collaborators}
                onChange={handleCollaboratorChange}
                label="Collaborators"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const collaborator = collaboratorOptions?.find(c => c._id === value);
                      return <Chip key={value} label={collaborator ? collaborator.fullName : value} />;
                    })}
                  </Box>
                )}
              >
                {loadingCollaborators ? (
                  <MenuItem value="" disabled>Loading...</MenuItem>
                ) : isError ? (
                  <MenuItem value="" disabled>Error loading collaborators</MenuItem>
                ) : (
                  collaboratorOptions?.map((collab) => (
                    <MenuItem key={collab._id} value={collab._id}>
                      {collab.fullName}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Stop"
              value={firstStop}
              onChange={(e) => setFirstStop(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Stop"
              value={lastStop}
              onChange={(e) => setLastStop(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                {mode === 'create' ? 'Create' : 'Update'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default LineManagementForm;