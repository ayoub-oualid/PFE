import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Container, Grid, MenuItem } from '@mui/material';
import { useRegisterMutation, useUpdateUserMutation } from '../slices/usersApiSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from './Loader';

const UserManagementForm = ({ user, mode, onClose }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(user?.role || 'inspector');

  const dispatch = useDispatch();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [updateUser, { isLoading: isUpdateLoading }] = useUpdateUserMutation();

  const isLoading = isRegisterLoading || isUpdateLoading;

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (mode === 'create') {
      try {
        await register({ name, email, password, role }).unwrap();
        toast.success('User created successfully');
        onClose();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    } else {
      try {
        const res = await updateUser({ id: user.id, name, email, password, role }).unwrap();
        toast.success('User updated successfully');
        onClose();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {mode === 'create' ? 'Create User' : 'Update User'}
        </Typography>
        <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="role"
            label="Role"
            select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="inspector">Inspector</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {mode === 'create' ? 'Create' : 'Update'}
          </Button>
          {isLoading && <Loader />}
        </Box>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Button onClick={onClose} variant="text">
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default UserManagementForm;