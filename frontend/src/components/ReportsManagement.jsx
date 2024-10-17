import React, { useState } from 'react';
import { 
  DataGrid, 
  GridToolbar,
} from '@mui/x-data-grid';
import { 
  Box, 
  Typography,
  Dialog,
  IconButton,
  Chip,
  Card,
  Rating,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { 
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGetReportQuery } from '../slices/reportsApiSlice';
import { useReportTableRows } from '../internals/data/gridData';
import { render } from 'react-dom';

const questions = [
  { id: 'field1', question: "Le collaborateur respecte-t-il les procédures de sécurité sur le train?" },
  { id: 'field2', question: "Le collaborateur respecte-t-il les horaires et les délais des tâches assignées?" },
  { id: 'field3', question: "Le collaborateur interagit-il de manière professionnelle avec les passagers?" },
  { id: 'field4', question: "Le collaborateur montre-t-il des compétences techniques adéquates pour les tâches demandées?" },
  { id: 'field5', question: "Le collaborateur prend-il des initiatives pour résoudre les problèmes sur le train?" },
  { id: 'field6', question: "Le collaborateur garde-t-il le matériel et l'équipement en bon état?" },
  { id: 'field7', question: "Le collaborateur respecte-t-il les consignes de sécurité lors de l'utilisation de l'équipement?" },
  { id: 'field8', question: "Le collaborateur travaille-t-il efficacement en équipe avec ses collègues?" },
  { id: 'field9', question: "Le collaborateur est-il ponctuel au début de son service?" },
  { id: 'field10', question: "Le collaborateur fournit-il un service client de qualité aux passagers?" },
  { id: 'field11', question: "Le collaborateur est-il attentif aux besoins des passagers et répond-il efficacement à leurs demandes?" },
  { id: 'field12', question: "Le collaborateur respecte-t-il les protocoles en cas d'urgence?" },
  { id: 'field13', question: "Le collaborateur fait-il preuve de responsabilité dans l'exécution de ses tâches?" },
  { id: 'field14', question: "Le collaborateur communique-t-il clairement et efficacement avec les autres membres de l'équipe?" },
  { id: 'field15', question: "Le collaborateur fait-il preuve d’une bonne gestion du temps pour l'accomplissement de ses tâches?" },
];

function ReportsManagement( {canEdit = true , inspectorId}) {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const inspectorIdString = inspectorId ? inspectorId.toString() : null;
  console.log('inspectorId rp management', inspectorIdString);
  const { reportRows, isLoading, isError } =  useReportTableRows({ inspectorId: inspectorIdString });
  

  const {
    data: selectedReport,
    isLoading: isLoadingReport,
  } = useGetReportQuery(selectedReportId, {
    skip: !selectedReportId,
  });

  const handleOpenModal = (report) => {
    setSelectedReportId(report.id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedReportId(null);
  };

  const navigateToDetails = (type, id) => {
    navigate(`/details/${type}/${id}`);
  };

  const columns = [
    ...(!inspectorId ? [{
      field: 'inspector',
      headerName: 'Inspecteur',
      width: 200,
      valueGetter: (params) => params?.row?.inspection?.inspector?.name || '',
      renderCell: (params) => (
        params?.row?.inspection?.inspector?.name ? (
          <Chip
            label={params.row.inspection.inspector.name}
            onClick={() => navigateToDetails('user', params.row.inspection.inspector._id)}
            color="primary"
            variant="outlined"
            clickable
          />
        ) : null
      ),
    }] : []),
    {
      field: 'collaborator',
      headerName: 'Collaborateur',
      width: 200,
      flex: 1,
      valueGetter: (params) => params?.row?.inspection?.collaborator?.fullName || '',
      renderCell: (params) => (
        params?.row?.inspection?.collaborator?.fullName ? (
          <Chip
            label={params.row.inspection.collaborator.fullName}
            onClick={() => navigateToDetails('collaborator', params.row.inspection.collaborator._id)}
            color="secondary"
            variant="outlined"
            clickable
          />
        ) : null
      ),
    },
    {
      field: 'trainNumber',
      headerName: 'Numéro du Train',
      width: 150,
      flex: 1,
      valueGetter: (params) => params?.row?.inspection?.line?.trainNumber || '',
      renderCell: (params) => (
        params?.row?.inspection?.line?.trainNumber ? (
          <Chip
            label={params.row.inspection.line.trainNumber}
            color="info"
            variant="outlined"
          />
        ) : null
      ),
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      flex: 1,
      valueGetter: (params) => params?.row?.inspection?.plannedDateTime || '',
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : '',
      renderCell: (params) => (
        params?.row?.inspection?.plannedDateTime ? (
          new Date(params.row.inspection.plannedDateTime).toLocaleDateString()
        ) : <CircularProgress size={24} />
      ),
    },
/*     {
      field: 'rating',
      headerName: 'Note moyenne',
      width: 130,
      valueGetter: (params) => params?.row?.inspection?.rating || 0,
      renderCell: (params) => (
        params?.row?.inspection?.rating ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating value={params.value} readOnly size="small" precision={0.1} />
          <Typography variant="body2">
            {params.value.toFixed(1)}
          </Typography>
        </Box>
        ) : <CircularProgress size={24} />
      ),
    }, */
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      align: 'right',
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Tooltip title="Voir les détails">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleOpenModal(params.row)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          {canEdit && (
            <Tooltip title="Modifier le rapport">
              <IconButton
                size="small"
                color="secondary"
                onClick={() => navigate(`/details/inspection/${params.row.inspection._id}`)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          Une erreur s'est produite lors du chargement des rapports.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '80%', width: '100%', mt: 2, mb: 2, p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" component="h1">
          Rapports d'inspection
        </Typography>
      </Box>
      
      <DataGrid
        rows={reportRows}
        columns={columns}
        components={{ 
          Toolbar: GridToolbar,
          NoRowsOverlay: () => (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography>Aucun rapport trouvé</Typography>
            </Box>
          ),
        }}
        componentsProps={{
          toolbar: { 
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
          sorting: {
            sortModel: [{ field: 'date', sort: 'desc' }],
          },
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

      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        {isLoadingReport ? (
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : selectedReport && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Détails du rapport
            </Typography>
            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Inspecteur: {selectedReport.inspection.inspector.name}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Collaborateur: {selectedReport.inspection.collaborator.fullName}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Train: {selectedReport.inspection.line.trainNumber}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Date: {new Date(selectedReport.inspection.plannedDateTime).toLocaleDateString()}
              </Typography>
            </Card>
            
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Note moyenne: {selectedReport.inspection.rating.toFixed(1)}/5
              </Typography>
              {questions.map((q) => (
                <Box key={q.id} sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {q.question}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={selectedReport[q.id]} readOnly size="small" />
                    <Typography variant="body2">
                      {selectedReport[q.id]}/5
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Card>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}

export default ReportsManagement;