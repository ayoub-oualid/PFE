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
  DialogActions, 
  TextField,
  MenuItem,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useUsersTableRows, usersColumns } from '../internals/data/gridData';
import { useRegisterMutation,useUpdateUserMutation } from '../slices/usersApiSlice';
import UserManagementForm from './UserManagementForm';

function UserManagement() {
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
    width: 120,
    renderCell: (params) => (
      <Box>
        <IconButton onClick={() => handleOpenModal('edit', params.row)}>
          <EditIcon />
        </IconButton>
      </Box>
    ),
  };

  const enhancedColumns = [...usersColumns, actionColumn];

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error loading users</Typography>;

  return (
    <Box sx={{ height: '80%', width: '100%' }}>
      <Button
        startIcon={<AddIcon />}
        onClick={() => handleOpenModal('create')}
        sx={{ mb: 2 }}
      >
        Add User
      </Button>
      <DataGrid
        rows={userRows}
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
      <UserManagementForm mode={mode} user={user} onSubmit={onSubmit} onClose={onClose}/>
    </Dialog>
  );
}

export default UserManagement;