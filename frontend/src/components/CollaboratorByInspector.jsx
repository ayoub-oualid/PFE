import React, { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  MenuItem, 
  IconButton, 
  Typography, 
  Box,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon,
  PersonOutline as PersonIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCollaboratorsByInspectorTableRows, collaboratorByInspectorColumns } from '../internals/data/gridData';
import { useRegisterMutation, useUpdateUserMutation } from '../slices/usersApiSlice';
import { useSelector } from 'react-redux';
import { useCreateInspectionMutation } from '../slices/inspectionsApiSlice';
import { useGetLinesByCollaboratorQuery } from '../slices/linesApiSlice';

function CollaboratorByInspector() {
  const navigate = useNavigate();
  const { _id: inspectorId } = useSelector((state) => state.auth.userInfo);
  const { collaboratorRows, isLoading, isError } = useCollaboratorsByInspectorTableRows(inspectorId);
  const [createUser] = useRegisterMutation();
  const [updateUser] = useUpdateUserMutation();

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);
  const [error, setError] = useState('');

  const handleOpenModal = (mode, collaborator = null) => {
    setModalMode(mode);
    setSelectedCollaborator(collaborator);
    setError('');
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCollaborator(null);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    
    try {
      const formData = new FormData(event.target);
      const userData = Object.fromEntries(formData.entries());

      if (modalMode === 'create') {
        await createUser(userData).unwrap();
      } else {
        await updateUser({ id: selectedCollaborator.id, ...userData }).unwrap();
      }

      handleCloseModal();
    } catch (err) {
      setError(err.data?.message || 'An error occurred while saving');
      console.error('Failed to save collaborator:', err);
    }
  };

  const navigateToDetails = (collaboratorId) => {
    navigate(`/details/collaborator/${collaboratorId}`);
  };

  const actionColumn = {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <Box display="flex" gap={1}>
        <Tooltip title="Edit Collaborator">
          <IconButton 
            size="small" 
            color="primary" 
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal('edit', params.row);
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="View Details">
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

  const enhancedColumns = [...collaboratorByInspectorColumns, actionColumn];

  if (isLoading) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="400px">
      <Typography>Loading collaborators...</Typography>
    </Box>
  );

  if (isError) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="400px" gap={2}>
      <WarningIcon color="error" />
      <Typography color="error">Error loading collaborators</Typography>
    </Box>
  );

  return (
    <Box sx={{ height: '80vh', width: '100%', p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          Collaborators Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal('create')}
        >
          Add Collaborator
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
              <Typography>No collaborators found</Typography>
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
          sorting: {
            sortModel: [{ field: 'name', sort: 'asc' }],
          },
        }}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize
        density="compact"
        autoHeight
        onRowClick={(params) => navigateToDetails(params.row.id)}
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
        inspectorId={inspectorId}
        collaborator={selectedCollaborator}
        onSubmit={handleSubmit}
        error={error}
      />
    </Box>
  );
}

function CollaboratorFormDialog({ open, onClose, mode, inspectorId, collaborator, onSubmit, error }) {
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: lines = [], isLoading: isLoadingLines } = useGetLinesByCollaboratorQuery(
    collaborator?.id || '',
    { skip: !collaborator?.id }
  );
  const [createInspection] = useCreateInspectionMutation();

  const handleSubmit = async () => {
    if (!selectedLine || !selectedDateTime) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createInspection({
        inspector: inspectorId,
        collaborator: collaborator?.id,
        line: selectedLine,
        plannedDateTime: new Date(selectedDateTime).toISOString(),
      }).unwrap();
      
      onClose();
    } catch (error) {
      console.error('Failed to create inspection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setSelectedLine('');
      setSelectedDateTime('');
      setIsSubmitting(false);
    }
  }, [open]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { overflow: 'visible' }
      }}
    >
      <DialogTitle>
        {mode === 'create' ? 'Add New Collaborator' : 'Edit Collaborator'}
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        <TextField
          select
          fullWidth
          label="Line"
          value={selectedLine}
          onChange={(e) => setSelectedLine(e.target.value)}
          margin="normal"
          disabled={isLoadingLines || isSubmitting}
          helperText={isLoadingLines ? 'Loading lines...' : ''}
        >
          {lines.map((line) => (
            <MenuItem key={line._id} value={line._id}>
              {line.name}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          fullWidth
          label="Planned Date and Time"
          type="datetime-local"
          value={selectedDateTime}
          onChange={(e) => setSelectedDateTime(e.target.value)}
          margin="normal"
          disabled={isSubmitting}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: new Date().toISOString().slice(0, 16),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={isSubmitting || !selectedLine || !selectedDateTime}
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Add' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CollaboratorByInspector;