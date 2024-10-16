import React, { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, Typography, Box } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useCollaboratorsByInspectorTableRows, collaboratorByInspectorColumns } from '../internals/data/gridData';
import { useRegisterMutation, useUpdateUserMutation } from '../slices/usersApiSlice';
import { useSelector } from 'react-redux';
import { useCreateInspectionMutation } from '../slices/inspectionsApiSlice';
import { useGetLinesByCollaboratorQuery } from '../slices/linesApiSlice';

function CollaboratorByInspector() {
  const { _id: inspectorId } = useSelector((state) => state.auth.userInfo);
  const { collaboratorRows, isLoading, isError } = useCollaboratorsByInspectorTableRows(inspectorId);
  const [createUser] = useRegisterMutation();
  const [updateUser] = useUpdateUserMutation();

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);

  const handleOpenModal = (mode, collaborator = null) => {
    setModalMode(mode);
    setSelectedCollaborator(collaborator);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCollaborator(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData.entries());

    if (modalMode === 'create') {
      await createUser(userData);
    } else {
      await updateUser({ id: selectedCollaborator.id, ...userData });
    }

    handleCloseModal();
  };

  const actionColumn = {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    renderCell: (params) => (
      <Box>
        <IconButton onClick={() => handleOpenModal('edit', params.row)}>
          <EditIcon />
        </IconButton>
      </Box>
    ),
  };

  const enhancedColumns = [...collaboratorByInspectorColumns, actionColumn];

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error loading collaborators</Typography>;

  return (
    <Box sx={{ height: '80%', width: '100%' }}>
      <Button
        startIcon={<AddIcon />}
        onClick={() => handleOpenModal('create')}
        sx={{ mb: 2 }}
      >
        Add Collaborator
      </Button>
      <DataGrid
        rows={collaboratorRows}
        columns={enhancedColumns}
        getRowId={(row) => row.id || `${row.email}`}
        checkboxSelection
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          toolbar: { showQuickFilter: true },
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize
        density="compact"
      />
      <CollaboratorFormDialog
        open={openModal}
        onClose={handleCloseModal}
        mode={modalMode}
        inspectorId={inspectorId}
        collaboratorId={selectedCollaborator?.id}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}

function CollaboratorFormDialog({ open, onClose, mode, inspectorId, collaboratorId, onSubmit }) {
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  
  const { data: lines = [], isLoading: isLoadingLines } = useGetLinesByCollaboratorQuery(collaboratorId);
  const [createInspection, { isLoading: isCreating }] = useCreateInspectionMutation();

  const handleSubmit = async () => {
    if (selectedLine && selectedDateTime) {
      try {
        await createInspection({
          inspector: inspectorId,
          collaborator: collaboratorId,
          line: selectedLine,
          plannedDateTime: selectedDateTime.toISOString(),
        });
        onSubmit();
        onClose();
      } catch (error) {
        console.error('Failed to create inspection:', error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{mode === 'create' ? 'Add Collaborator' : 'Edit Collaborator'}</DialogTitle>
      <DialogContent>
        {/* Add form fields here */}
        <TextField
          label="Line"
          select
          fullWidth
          value={selectedLine}
          onChange={(e) => setSelectedLine(e.target.value)}
          margin="normal"
        >
          {lines.map((line) => (
            <MenuItem key={line._id} value={line._id}>
              {line.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Planned Date and Time"
          type="datetime-local"
          fullWidth
          value={selectedDateTime}
          onChange={(e) => setSelectedDateTime(e.target.value)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isCreating}>
          {mode === 'create' ? 'Add' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CollaboratorByInspector;