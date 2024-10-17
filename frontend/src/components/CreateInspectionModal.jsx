import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import { useCreateInspectionMutation } from '../slices/inspectionsApiSlice';
import { useGetLinesByCollaboratorQuery } from '../slices/linesApiSlice';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const CreateInspectionModal = ({ open, onClose, collaboratorId }) => {
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  
  const { data: lines = [] } = useGetLinesByCollaboratorQuery(collaboratorId);
  const [createInspection] = useCreateInspectionMutation();
  
  const handleSubmit = async () => {
    if (selectedLine && selectedDateTime) {
      try {
        await createInspection({
          inspector: userInfo._id,
          collaborator: collaboratorId,
          line: selectedLine,
          plannedDateTime: selectedDateTime,
        });
        
        onClose();
      } catch (error) {
        console.error('Failed to create inspection:', error);
      }
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Créer une Inspection</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Sélectionner la Ligne"
          fullWidth
          margin="normal"
          value={selectedLine}
          onChange={(e) => setSelectedLine(e.target.value)}
        >
          {lines.map((line) => (
            <MenuItem key={line._id} value={line._id}>
              {line.trainNumber}
            </MenuItem>
          ))}
        </TextField>
        <DateTimePicker
          label="Sélectionner la Date et l'Heure"
          value={selectedDateTime}
          onChange={setSelectedDateTime}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Créer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateInspectionModal;