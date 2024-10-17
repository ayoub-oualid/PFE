import React, { useState } from 'react';
import {
  DataGrid,
  GridToolbar,
} from '@mui/x-data-grid';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCollaboratorTableRows, collaboratorColumns } from '../internals/data/gridData';
import { useCreateCollaboratorMutation, useUpdateCollaboratorMutation } from '../slices/collaboratorsApiSlice';
import CollaboratorManagementForm from './CollaboratorManagementForm';
import { 
  Add as AddIcon, 
  Edit as EditIcon,
  PersonOutline as PersonIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

function CollaboratorManagement() {
  const { collaboratorRows, isLoading, isError } = useCollaboratorTableRows();
  const [createCollaborator] = useCreateCollaboratorMutation();
  const [updateCollaborator] = useUpdateCollaboratorMutation();
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentCollaborator, setCurrentCollaborator] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleOpenModal = (mode, collaborator = null) => {
    setModalMode(mode);
    setCurrentCollaborator(collaborator);
    setError('');
    setOpenModal(true);
  };
  const navigateToDetails = (collaboratorId) => {
    navigate(`/details/collaborator/${collaboratorId}`);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentCollaborator(null);
    setError('');
  };

  const handleSubmit = async (collaboratorData) => {
    try {
      if (modalMode === 'create') {
        await createCollaborator(collaboratorData).unwrap();
      } else {
        await updateCollaborator({ id: currentCollaborator.id, ...collaboratorData }).unwrap();
      }
      handleCloseModal();
    } catch (err) {
      setError('Une erreur est survenue lors de l\'enregistrement');
    }
  };

  const actionColumn = {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    renderCell: (params) => (
      <Box display="flex" gap={1}>
        <Tooltip title="Modifier le collaborateur">
          <IconButton 
            size="small" 
            color="primary" 
            onClick={() => handleOpenModal('edit', params.row)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Voir les détails">
          <IconButton 
            size="small" 
            color="secondary" 
            onClick={(e) => {
              e.stopPropagation();
              navigateToDetails(params.row.id);

            }}
          >
            <PersonIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  };

  const enhancedColumns = [...collaboratorColumns, actionColumn];

  if (isLoading) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="400px">
      <Typography>Chargement des collaborateurs...</Typography>
    </Box>
  );

  if (isError) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="400px" gap={2}>
      <WarningIcon color="error" />
      <Typography color="error">Erreur de chargement des collaborateurs</Typography>
    </Box>
  );

  return (
    <Box sx={{ height: '80vh', width: '100%', p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          Gestion des collaborateurs
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal('create')}
        >
          Ajouter un collaborateur
        </Button>
      </Box>
      
      <DataGrid
        rows={collaboratorRows}
        columns={enhancedColumns}
        getRowId={(row) => row.id || `${row.email}`}
        components={{ 
          Toolbar: GridToolbar,
          NoRowsOverlay: () => (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography>Aucun collaborateur trouvé</Typography>
            </Box>
          ),
        }}
        componentsProps={{
          toolbar: { 
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: true },
          },
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize
        density="compact"
        autoHeight
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      />

      <CollaboratorFormDialog
        open={openModal}
        onClose={handleCloseModal}
        mode={modalMode}
        collaborator={currentCollaborator}
        onSubmit={handleSubmit}
        error={error}
      />
    </Box>
  );
}

function CollaboratorFormDialog({ open, onClose, mode, collaborator, onSubmit, error }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'create' ? 'Ajouter un nouveau collaborateur' : 'Modifier le collaborateur'}</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
         <CollaboratorManagementForm mode={mode} collaborator={collaborator} onSubmit={onSubmit} onClose={onClose}/>
      </DialogContent>
    </Dialog>
  );
}

export default CollaboratorManagement;