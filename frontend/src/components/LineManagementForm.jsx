import React, { useState } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useGetCollaboratorsQuery } from '../slices/collaboratorsApiSlice';

const LineManagementForm = ({ line, onSubmit }) => {
  const [trainNumber, setTrainNumber] = useState(line?.trainNumber || '');
  const [firstStop, setFirstStop] = useState(line?.firstStop || '');
  const [lastStop, setLastStop] = useState(line?.lastStop || '');
  const [collaborator, setCollaborator] = useState(line?.collaborator || '');
  const [dateTime, setDateTime] = useState(line?.dateTime ? dayjs(line.dateTime) : dayjs());

  const { data: collaborators, isLoading: loadingCollaborators, isError } = useGetCollaboratorsQuery();

  const handleSubmit = () => {
    onSubmit({ 
      trainNumber, 
      dateTime: dateTime.toISOString(), 
      firstStop, 
      lastStop, 
      collaborator 
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 1, boxShadow: 3 }}>
        <TextField
          label="Train Number"
          value={trainNumber}
          onChange={(e) => setTrainNumber(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <DateTimePicker
          label="Date & Time"
          value={dateTime}
          onChange={(newDate) => setDateTime(newDate)}
          renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Collaborator</InputLabel>
          <Select
            value={collaborator}
            onChange={(e) => setCollaborator(e.target.value)}
            label="Collaborator"
          >
            {loadingCollaborators ? (
              <MenuItem value="" disabled>Loading...</MenuItem>
            ) : isError ? (
              <MenuItem value="" disabled>Error loading collaborators</MenuItem>
            ) : (
              collaborators?.map((collab) => (
                <MenuItem key={collab.id} value={collab.id}>
                  {collab.fullName}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        <TextField
          label="First Stop"
          value={firstStop}
          onChange={(e) => setFirstStop(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Last Stop"
          value={lastStop}
          onChange={(e) => setLastStop(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Submit
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default LineManagementForm;