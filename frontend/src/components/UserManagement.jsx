import React, { useState } from 'react';
import { 
  DataGrid, 
  GridToolbar,
} from '@mui/x-data-grid';
import { 
  Button, 
  Dialog, 
  IconButton, 
  Box, 
  Typography,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUsersTableRows, usersColumns } from '../internals/data/gridData';
import { useRegisterMutation, useUpdateUserMutation } from '../slices/usersApiSlice';
import UserManagementForm from './UserManagementForm';

function UserManagement() {
  const navigate = useNavigate();
  const { userRows, isLoading, isError } = useUsersTableRows();
  const [createUser] = useRegisterMutation();
  const [updateUser] = useUpdateUserMutation();

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentUser, setCurrentUser] = useState(null);

  const handleOpenModal = (mode, user = null) => {
    setModalMode(mode);
    setCurrentUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentUser(null);
  };

  const navigateToDetails = (userId) => {
    navigate(`/details/user/${userId}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData.entries());

    if (modalMode === 'create') {
      await createUser(userData);
    } else {
      await updateUser({ id: currentUser.id, ...userData });
    }

    handleCloseModal();
  };

  const actionColumn = {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => (
<Box display="flex" gap={1}>
        <Tooltip title="Edit Collaborator">
          <IconButton 
            size="small" 
            color="primary" 
            onClick={() => handleOpenModal('edit', params.row)}
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

  const enhancedColumns = [...usersColumns, actionColumn];

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error loading users</Typography>;

  return (
    <Box sx={{ height: '80%', width: '100%', mt: 2, mb: 2, p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          User Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal('create')}
        >
          Add User
        </Button>
      </Box>
      
      <DataGrid
        rows={userRows}
        columns={enhancedColumns}
        getRowId={(row) => row.id || `${row.email}`}
        components={{ 
          Toolbar: GridToolbar,
          NoRowsOverlay: () => (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography>No users found</Typography>
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
      <UserFormDialog
        open={openModal}
        onClose={handleCloseModal}
        mode={modalMode}
        user={currentUser}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}

function UserFormDialog({ open, onClose, mode, user, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <UserManagementForm mode={mode} user={user} onSubmit={onSubmit} onClose={onClose} />
    </Dialog>
  );
}

export default UserManagement;
