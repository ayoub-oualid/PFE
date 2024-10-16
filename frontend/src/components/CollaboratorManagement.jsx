import React, { useState } from 'react';
import {
  DataGrid,
  GridToolbar,
} from '@mui/x-data-grid';
import {
  Button,
  Dialog,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { useCollaboratorTableRows, collaboratorColumns } from '../internals/data/gridData';
import { useCreateCollaboratorMutation, useUpdateCollaboratorMutation } from '../slices/collaboratorsApiSlice';
import CollaboratorManagementForm from './CollaboratorManagementForm';

function CollaboratorManagement() {
  const { collaboratorRows, isLoading, isError } = useCollaboratorTableRows();
  const [createCollaborator] = useCreateCollaboratorMutation();
  const [updateCollaborator] = useUpdateCollaboratorMutation();
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentCollaborator, setCurrentCollaborator] = useState(null);

  const handleOpenModal = (mode, collaborator = null) => {
    setModalMode(mode);
    setCurrentCollaborator(collaborator);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentCollaborator(null);
  };

  const handleSubmit = async (collaboratorData) => {
    if (modalMode === 'create') {
      await createCollaborator(collaboratorData);
    } else {
      await updateCollaborator({ id: currentCollaborator.id, ...collaboratorData });
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

  const enhancedColumns = [...collaboratorColumns, actionColumn];

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
        collaborator={currentCollaborator}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}

function CollaboratorFormDialog({ open, onClose, mode, collaborator, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <CollaboratorManagementForm mode={mode} collaborator={collaborator} onSubmit={onSubmit} onClose={onClose}/>
    </Dialog>
  );
}

export default CollaboratorManagement;