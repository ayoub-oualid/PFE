import React, { useState, useMemo } from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import moment from 'moment';
import 'moment/locale/fr';
import { 
  Box, 
  Typography, 
  IconButton, 
  Tooltip, 
  Dialog, 
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  TextField,
  Alert
} from '@mui/material';
import { 
  Visibility as VisibilityIcon,
  Event as EventIcon,
  Warning as WarningIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCreateInspectionMutation } from '../slices/inspectionsApiSlice';
import { useGetLinesByCollaboratorQuery } from '../slices/linesApiSlice';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useCollaboratorsByInspectorTableRows, collaboratorByInspectorColumns } from '../internals/data/gridData';

import { Calendar, momentLocalizer } from 'react-big-calendar';
const localizer = momentLocalizer(moment);

// Base columns definition
const baseColumns = [
  { field: 'fullName', headerName: 'Nom Complet', flex: 1.5, minWidth: 120 },
  { field: 'employeeId', headerName: 'ID Employé', flex: 1, minWidth: 100 },
  { field: 'department', headerName: 'Département', flex: 1.5, minWidth: 150 },
  { field: 'position', headerName: 'Poste', flex: 1, minWidth: 120 },
  {
    field: 'LastInspection',
    headerName: 'Dernière Inspection',
    flex: 1.5,
    minWidth: 150,
    renderCell: (params) => {
      return <span>{params.value}</span>;
    },
    valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
  }
];

function CollaboratorByInspector() {
  const navigate = useNavigate();
  const { _id: inspectorId } = useSelector((state) => state.auth.userInfo);
  const { collaboratorRows, isLoading, isError } = useCollaboratorsByInspectorTableRows(inspectorId);
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);
  const [openScheduler, setOpenScheduler] = useState(false);

  const handleOpenScheduler = (collaborator) => {
    setSelectedCollaborator(collaborator);
    setOpenScheduler(true);
  };

  const actionColumn = {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <Box display="flex" gap={1}>
        <Tooltip title="Voir les détails">
          <IconButton 
            size="small" 
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/details/collaborator/${params.row.id}`);
            }}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Planifier une inspection">
          <IconButton 
            size="small" 
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenScheduler(params.row);
            }}
          >
            <EventIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  };

  const columns = [...collaboratorByInspectorColumns, actionColumn];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Typography>Chargement des collaborateurs...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px" gap={2}>
        <WarningIcon color="error" />
        <Typography color="error">Erreur de chargement des collaborateurs</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '80vh', width: '100%', p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <CalendarIcon sx={{ mr: 1 }} />
        <Typography variant="h5" component="h1">
          Gestion des Inspections
        </Typography>
      </Box>
      
      <DataGrid
        rows={collaboratorRows}
        columns={columns}
        getRowId={(row) => row.id}
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
          sorting: { sortModel: [{ field: 'fullName', sort: 'asc' }] },
        }}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize={false}
        density="compact"
        autoHeight
        sx={{
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      />

      {selectedCollaborator && (
        <InspectionScheduler
          open={openScheduler}
          onClose={() => setOpenScheduler(false)}
          collaborator={selectedCollaborator}
          inspectorId={inspectorId}
        />
      )}
    </Box>
  );
}

function InspectionScheduler({ open, onClose, collaborator, inspectorId }) {
  const [selectedLine, setSelectedLine] = useState(null);
  const [error, setError] = useState('');
  const [createInspection, { isLoading: isCreating }] = useCreateInspectionMutation();

  const { data: lines = [], isLoading: isLoadingLines } = useGetLinesByCollaboratorQuery(
    collaborator?.id,
    { skip: !collaborator?.id }
  );

  const handleScheduleInspection = async () => {
    if (!selectedLine) return;
    const selectedDateTime = selectedLine?.dateTime;
    console.log(selectedDateTime);

    try {
      setError('');
      await createInspection({
        collaborator: collaborator.id,
        line: selectedLine._id,
        plannedDateTime: selectedDateTime,
        inspector: inspectorId
      }).unwrap();

      onClose();
    } catch (err) {
      setError(err.data?.message || 'Erreur lors de la planification de l\'inspection');
    }
  };

  const events = useMemo(() => {
    return lines.map(line => ({
      title: line.trainNumber,
      start: new Date(line.dateTime),
      end: new Date(line.dateTime),
      resource: line
    }));
  }, [lines]);

  const handleSelectEvent = (event) => {
    setSelectedLine(event.resource);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ 
        sx: { 
          height: '80vh',
          maxHeight: '900px'
        } 
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <EventIcon color="primary" />
          <Typography>
            Planifier une inspection pour {collaborator?.fullName}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Sélectionnez une ligne
          </Typography>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 400 }}
            onSelectEvent={handleSelectEvent}
          />
        </Box>

        
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose}
          disabled={isCreating}
        >
          Annuler
        </Button>
        <Button 
          variant="contained" 
          onClick={handleScheduleInspection}
          disabled={!selectedLine || isCreating}
          startIcon={<TimeIcon />}
        >
          {isCreating ? 'Planification...' : 'Planifier l\'inspection'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CollaboratorByInspector;