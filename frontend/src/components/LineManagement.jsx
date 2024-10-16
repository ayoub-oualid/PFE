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
import { useLineTableRows, lineColumns } from '../internals/data/gridData';
import { useCreateLineMutation, useUpdateLineMutation } from '../slices/linesApiSlice';
import LineManagementForm from './LineManagementForm';

function LineManagement() {
  const { lineRows, isLoading, isError } = useLineTableRows();
  const [createLine] = useCreateLineMutation();
  const [updateLine] = useUpdateLineMutation();
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentLine, setCurrentLine] = useState(null);

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

  const enhancedColumns = [...lineColumns, actionColumn];

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error loading lines</Typography>;

  return (
    <Box sx={{ height: '80%', width: '100%' }}>
      <Button
        startIcon={<AddIcon />}
        onClick={() => handleOpenModal('create')}
        sx={{ mb: 2 }}
      >
        Add Line
      </Button>
      <DataGrid
        rows={lineRows}
        columns={enhancedColumns}
        getRowId={(row) => row.id || `${row.lineNumber}`}
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
    <Dialog open={open} onClose={onClose}>
      <LineManagementForm mode={mode} line={line} onSubmit={onSubmit} onClose={onClose}/>
    </Dialog>
  );
}

export default LineManagement;