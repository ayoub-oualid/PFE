import React, { useState } from 'react';
import {
  DataGrid,
  GridToolbar,
  GridExpandMoreIcon,
} from '@mui/x-data-grid';
import {
  Button,
  Dialog,
  IconButton,
  Typography,
  Box,
  Chip,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { useLineTableRows, lineColumns } from '../internals/data/gridData';
import { useCreateLineMutation, useUpdateLineMutation } from '../slices/linesApiSlice';
import LineManagementForm from './LineManagementForm';
import { useNavigate } from 'react-router-dom';

function LineManagement() {
  const { lineRows, isLoading, isError } = useLineTableRows();
  const [createLine] = useCreateLineMutation();
  const [updateLine] = useUpdateLineMutation();
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentLine, setCurrentLine] = useState(null);
  const navigate = useNavigate();

  const handleOpenModal = (mode, line = null) => {
    setModalMode(mode);
    setCurrentLine(line);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentLine(null);
  };

  const handleSubmit = async (lineData) => {
    if (modalMode === 'create') {
      await createLine(lineData);
    } else {
      await updateLine({ id: currentLine.id, ...lineData });
    }
    handleCloseModal();
  };

  const navigateToDetails = (collaoratorId) => {
    navigate(`/details/collaborator/${collaoratorId}`);
  };

  const actionColumn = {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    renderCell: (params) => (
      <Box>
        <Tooltip title="Edit Line">
          <IconButton 
            size="small" 
            color="primary" 
            onClick={() => handleOpenModal('edit', params.row)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  };

  const collaboratorsColumn = {
    field: 'collaborators',
    headerName: 'Collaborators',
    width: 200,
    renderCell: (params) => (

    <Box>
      {params.value.map((collaborator, index) => (
        <Chip key={index} label={collaborator.fullName} onClick={() => navigateToDetails(collaborator._id)} />     ))}
    </Box>

    ),
  };

  const enhancedColumns = [...lineColumns, collaboratorsColumn, actionColumn];

  if (isLoading) return <Typography variant="h6">Loading...</Typography>;
  if (isError) return <Typography variant="h6" color="error">Error loading lines</Typography>;

  return (
    <Box sx={{ height: '80%', width: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          Line Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal('create')}
        >
          Add Line
        </Button>
      </Box>
      
      <DataGrid
        rows={lineRows}
        columns={enhancedColumns}
        getRowId={(row) => row.id || `${row.lineNumber}`}
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          toolbar: { showQuickFilter: true, densitySelector: false, columnsButton: false },
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize={false}
        density="comfortable"
      />
      <LineFormDialog
        open={openModal}
        onClose={handleCloseModal}
        mode={modalMode}
        line={currentLine}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}

function LineFormDialog({ open, onClose, mode, line, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <LineManagementForm mode={mode} line={line} onSubmit={onSubmit} onClose={onClose} />
    </Dialog>
  );
}

export default LineManagement;