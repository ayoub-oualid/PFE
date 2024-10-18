import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Container, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';
import { useGetAllUsersQuery } from '../slices/usersApiSlice';
import { useUnassignCollaboratorMutation } from '../slices/collaboratorsApiSlice';
import Loader from './Loader';

const CollaboratorManagementForm = ({ collaborator, mode, onClose, onSubmit }) => {
  const [fullName, setFullName] = useState(collaborator?.fullName || '');
  const [employeeId, setEmployeeId] = useState(collaborator?.employeeId || '');
  const [department, setDepartment] = useState(collaborator?.department || '');
  const [position, setPosition] = useState(collaborator?.position || '');
  const [assignedInspector, setAssignedInspector] = useState(collaborator?.assignedInspector || '');
  const users = useGetAllUsersQuery().data || [];
  const [unassignCollaborator] = useUnassignCollaboratorMutation();

  useEffect(() => {
    if (collaborator) {
      setFullName(collaborator.fullName);
      setEmployeeId(collaborator.employeeId);
      setDepartment(collaborator.department);
      setPosition(collaborator.position);
      setAssignedInspector(collaborator.assignedInspector || '');
    }
  }, [collaborator]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const collaboratorData = { fullName, employeeId, department, position };
      if (assignedInspector == "") {
        console.log('unassigning collaborator', collaborator.id);
        await onSubmit(collaboratorData);
        await unassignCollaborator({  id: collaborator.id, ...collaboratorData  });
      } else {

        collaboratorData.assignedInspector = assignedInspector;
        await onSubmit(collaboratorData);
      }
      toast.success(`Collaborateur ${mode === 'create' ? 'créé' : 'mis à jour'} avec succès`);
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="fullName"
            label="Nom Complet"
            name="fullName"
            autoComplete="name"
            autoFocus
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="employeeId"
            label="ID Employé"
            name="employeeId"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="department"
            label="Département"
            name="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="position"
            label="Poste"
            name="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="assigned-inspector-label">Inspecteur Assigné</InputLabel>
            <Select
              labelId="assigned-inspector-label"
              id="assignedInspector"
              value={assignedInspector}
              label="Inspecteur Assigné"
              onChange={(e) => setAssignedInspector(e.target.value === "" ? "" : e.target.value)}
            >
              <MenuItem value="">
                <em>Aucun</em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {mode === 'create' ? 'Créer' : 'Mettre à jour'}
          </Button>
        </Box>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Button onClick={onClose} variant="text">
              Annuler
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CollaboratorManagementForm;