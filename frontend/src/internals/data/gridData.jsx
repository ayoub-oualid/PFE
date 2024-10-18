import { useMemo } from "react";
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { useEffect, useState } from 'react';
import { Box, IconButton, Typography, Collapse, List, ListItem, ListItemText } from '@mui/material';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { useGetAllUsersQuery } from "../../slices/usersApiSlice";
import { useLazyGetCollaboratorsByInspectorQuery, } from "../../slices/collaboratorsApiSlice";
import { useLazyGetInspectionsByInspectorQuery, } from "../../slices/inspectionsApiSlice";
import { useGetCollaboratorsQuery } from "../../slices/collaboratorsApiSlice";
import { useGetLinesQuery } from "../../slices/linesApiSlice";
import { useGetReportsQuery } from "../../slices/reportsApiSlice";
import { useLazyGetReportsByInspectionQuery } from "../../slices/reportsApiSlice";
import { useLazyGetInspectionsByCollaboratorQuery } from "../../slices/inspectionsApiSlice";
import { useGetCollaboratorsByInspectorQuery } from "../../slices/collaboratorsApiSlice";
import { useGetReportsByInspectorQuery } from "../../slices/reportsApiSlice";
import { useNavigate } from "react-router-dom";

function getDaysInMonth(month, year) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', {
    month: 'short',
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

function renderSparklineCell(params) {
  const data = getDaysInMonth(4, 2024);
  const { value, colDef } = params;

  if (!value || value.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <SparkLineChart
        data={value}
        width={colDef.computedWidth || 100}
        height={32}
        plotType="bar"
        showHighlight
        showTooltip
        colors={['hsl(210, 98%, 42%)']}
        xAxis={{
          scaleType: 'band',
          data,
        }}
      />
    </div>
  );
}

function renderStatus(status) {
  const colors = {
    admin: 'success',
    inspector: 'default',
  };

  return <Chip label={status} color={colors[status]} size="small" />;
}

export function renderAvatar(params) {
  if (params.value == null) {
    return '';
  }

  return (
    <Avatar
      sx={{
        backgroundColor: params.value.color,
        width: '24px',
        height: '24px',
        fontSize: '0.85rem',
      }}
    >
      {params.value.name.toUpperCase().substring(0, 1)}
    </Avatar>
  );
}

export const userColumns = [
  { field: 'name', headerName: 'Nom', flex: 1.5, minWidth: 120 },
  {
    field: 'role',
    headerName: 'Rôle',
    flex: 0.5,
    minWidth: 80,
    renderCell: (params) => renderStatus(params.value),
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1.5,
    minWidth: 200,
  },
  {
    field: 'inspectionCount',
    headerName: 'Inspections',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 80,
  },
  {
    field: 'colabboratorCount',
    headerName: 'Collaborateurs',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 80,
  },
];

export const useTableRows = () => {
  const { data: usersData, isLoading: isLoadingUsers, isError: isErrorUsers } = useGetAllUsersQuery();
  const [getInspections, { isLoading: isLoadingInspections }] = useLazyGetInspectionsByInspectorQuery();
  const [getCollaborators, { isLoading: isLoadingCollaborators }] = useLazyGetCollaboratorsByInspectorQuery();

  const [inspectionsData, setInspectionsData] = React.useState({});
  const [collaboratorsData, setCollaboratorsData] = React.useState({});

  useEffect(() => {
    if (usersData) {
      usersData.forEach(async (user) => {
        console.log(user);
        const inspectionsResult = await getInspections(user._id).unwrap();
        setInspectionsData(prev => ({ ...prev, [user._id]: inspectionsResult }));

        const collaboratorsResult = await getCollaborators(user._id).unwrap();
        setCollaboratorsData(prev => ({ ...prev, [user._id]: collaboratorsResult }));
      });
    }
  }, [usersData, getInspections, getCollaborators]);

  const userRows = useMemo(() => {
    if (!usersData) return [];

    return usersData.map((user) => {
      const userInspections = inspectionsData[user._id] || [];
      const userCollaborators = collaboratorsData[user._id] || [];

      return {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        inspectionCount: userInspections.length,
        colabboratorCount: userCollaborators.length,
      };
    });
  }, [usersData, inspectionsData, collaboratorsData]);

  const isLoading = isLoadingUsers || isLoadingInspections || isLoadingCollaborators;
  const isError = isErrorUsers;

  return {
    userRows,
    isLoading,
    isError,
  };
};

export const collaboratorColumns = [
  { field: 'fullName', headerName: 'Nom Complet', flex: 1.5, minWidth: 120 },
  { field: 'employeeId', headerName: 'ID Employé', flex: 1, minWidth: 100 },
  { field: 'department', headerName: 'Département', flex: 1.5, minWidth: 150 },
  { field: 'position', headerName: 'Poste', flex: 1, minWidth: 120 },
  {
    field: 'assignedInspector',
    headerName: 'Inspecteur Assigné',
    flex: 1.5,
    minWidth: 150,
    renderCell: (params) => {
      const navigate = useNavigate();
      const handleClick = () => {
        navigate(`/details/user/${params.value._id}`);
      };
  
      return (
        <Chip
          label={params.value.name}
          onClick={params.value._id ? handleClick : undefined}
          clickable={!!params.value._id}
          color={params.value._id ? 'default' : 'error'}
        />
      );
    },
    sortComparator: (v1, v2) => {
      const name1 = v1.name === 'Non assigné' ? '' : v1.name;
      const name2 = v2.name === 'Non assigné' ? '' : v2.name;
      return name1.localeCompare(name2);
    },
  },
];

export const useCollaboratorTableRows = () => {
  const { data: collaboratorsData, isLoading: isLoadingCollaborators, isError: isErrorCollaborators } = useGetCollaboratorsQuery();

  const collaboratorRows = useMemo(() => {
    if (!collaboratorsData) return [];

    return collaboratorsData.map((collaborator) => ({
      id: collaborator._id,
      fullName: collaborator.fullName,
      employeeId: collaborator.employeeId,
      department: collaborator.department,
      position: collaborator.position,
      assignedInspector: collaborator.assignedInspector?.name ? collaborator.assignedInspector : { name: 'Non assigné', _id: null },
    }));
  }, [collaboratorsData]);

  const isLoading = isLoadingCollaborators;
  const isError = isErrorCollaborators;

  return {
    collaboratorRows,
    isLoading,
    isError,
  };
};

export const lineColumns = [
  { field: 'trainNumber', headerName: 'Numéro de Train', flex: 1, minWidth: 120 },
  { field: 'dateTime', headerName: 'Date', flex: 1, minWidth: 120 },
  { field: 'firstStop', headerName: 'Premier Arrêt', flex: 1, minWidth: 120 },
  { field: 'lastStop', headerName: 'Dernier Arrêt', flex: 1, minWidth: 120 },
];

export const useLineTableRows = () => {
  const { data: linesData, isLoading: isLoadingLines, isError: isErrorLines } = useGetLinesQuery();

  const lineRows = useMemo(() => {
    if (!linesData) return [];

    return linesData.map((line) => ({
      id: line._id,
      trainNumber: line.trainNumber,
      dateTime: new Date(line.dateTime).toLocaleDateString(),
      firstStop: line.firstStop,
      lastStop: line.lastStop,
      collaborators: line.collaborators,
    }));
  }, [linesData]);

  const isLoading = isLoadingLines;
  const isError = isErrorLines;

  return {
    lineRows,
    isLoading,
    isError,
  };
};

export const reportColumns = [
  {
    field: 'inspector',
    headerName: 'Inspecteur',
    flex: 1,
    minWidth: 200,
    valueGetter: (params) => params.row.inspection.inspector.name,
  },
  {
    field: 'collaborator',
    headerName: 'Collaborateur',
    flex: 1,
    minWidth: 200,
    valueGetter: (params) => params.row.inspection.collaborator.fullName,
  },
  {
    field: 'trainNumber',
    headerName: 'Numéro du Train',
    flex: 1,
    minWidth: 150,
    valueGetter: (params) => params.row.inspection.line.trainNumber,
  },
  {
    field: 'date',
    headerName: 'Date',
    flex: 1,
    minWidth: 150,
    valueGetter: (params) => params.row.inspection.plannedDateTime,
    valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
  },
  {
    field: 'rating',
    headerName: 'Note moyenne',
    flex: 1,
    minWidth: 130,
    valueGetter: (params) => params.row.inspection.rating,
  },
];

export const useReportTableRows = ({inspectorId}) => {
  const { data: reportsData, isLoading: isLoadingReports, isError: isErrorReports } = (inspectorId) ? useGetReportsByInspectorQuery(inspectorId) : useGetReportsQuery();
  console.log('inspectorId rp tab row:', inspectorId);
  const reportRows = useMemo(() => {
    if (!reportsData) return [];

    return reportsData.map((report) => ({
      id: report._id,
      inspection: report.inspection,
      field1: report.field1,
      field2: report.field2,
      field3: report.field3,
      field4: report.field4,
      field5: report.field5,
      field6: report.field6,
      field7: report.field7,
      field8: report.field8,
      field9: report.field9,
      field10: report.field10,
      field11: report.field11,
      field12: report.field12,
      field13: report.field13,
      field14: report.field14,
      field15: report.field15,
    }));
  }, [reportsData]);

  const isLoading = isLoadingReports;
  const isError = isErrorReports;

  return {
    reportRows,
    isLoading,
    isError,
  };
};

export const inspectionColumns = [
  { field: 'inspector', headerName: 'Inspecteur', flex: 1, minWidth: 120 },
  { field: 'collaborator', headerName: 'Collaborateur', flex: 1, minWidth: 120 },
  { field: 'line', headerName: 'Ligne', flex: 1, minWidth: 120 },
  { field: 'dateTime', headerName: 'Date et Heure', flex: 1, minWidth: 120 },
  { field: 'status', headerName: 'Statut', flex: 1, minWidth: 120 },
  {
    field: 'report',
    headerName: 'Rapport',
    flex: 1,
    minWidth: 120,
    renderCell: renderSparklineCell,
  },
];

export const useInspectionTableRow = () => {
  const { data: usersData, isLoading: isLoadingUsers, isError: isErrorUsers } = useGetAllUsersQuery();
  const [getInspections, { isLoading: isLoadingInspections }] = useLazyGetInspectionsByInspectorQuery();
  const [getCollaborators, { isLoading: isLoadingCollaborators }] = useLazyGetCollaboratorsByInspectorQuery();
  const [getReports, { isLoading: isLoadingReports }] = useLazyGetReportsByInspectionQuery();

  const [inspectionsData, setInspectionsData] = React.useState({});
  const [collaboratorsData, setCollaboratorsData] = React.useState({});
  const [reportsData, setReportsData] = React.useState({});

  useEffect(() => {
    if (usersData) {
      usersData.forEach(async (user) => {
        console.log(user);
        const inspectionsResult = await getInspections(user._id).unwrap();
        setInspectionsData(prev => ({ ...prev, [user._id]: inspectionsResult }));

        const collaboratorsResult = await getCollaborators(user._id).unwrap();
        setCollaboratorsData(prev => ({ ...prev, [user._id]: collaboratorsResult }));

        inspectionsResult.forEach(async (inspection) => {
          const reportsResult = await getReports(inspection._id).unwrap();
          setReportsData(prev => ({ ...prev, [inspection._id]: reportsResult }));
        });
      });
    }
  }, [usersData, getInspections, getCollaborators, getReports]);

  const userRows = useMemo(() => {
    if (!usersData) return [];

    return usersData.map((user) => {
      const userInspections = inspectionsData[user._id] || [];
      const userCollaborators = collaboratorsData[user._id] || [];

      return {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        inspectionCount: userInspections.length,
        colabboratorCount: userCollaborators.length,
        reportsCount: userInspections.reduce((count, inspection) => count + (reportsData[inspection._id]?.length || 0), 0),
      };
    });
  }, [usersData, inspectionsData, collaboratorsData, reportsData]);

  const isLoading = isLoadingUsers || isLoadingInspections || isLoadingCollaborators || isLoadingReports;
  const isError = isErrorUsers;

  return {
    userRows,
    isLoading,
    isError,
  };
};

export const usersColumns = [
  { field: 'name', headerName: 'Nom', flex: 1.5, minWidth: 120 },
  {
    field: 'role',
    headerName: 'Rôle',
    flex: 0.5,
    minWidth: 80,
    renderCell: (params) => renderStatus(params.value),
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1.5,
    minWidth: 200,
  },
];

export const useUsersTableRows = () => {
  const { data: usersData, isLoading: isLoadingUsers, isError: isErrorUsers } = useGetAllUsersQuery();

  const userRows = useMemo(() => {
    if (!usersData) return [];

    return usersData.map((user) => ({
      id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
    }));
  }, [usersData]);

  const isLoading = isLoadingUsers;
  const isError = isErrorUsers;

  return {
    userRows,
    isLoading,
    isError,
  };
};

export const collaboratorByInspectorColumns = [
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
  },
];

export const useCollaboratorsByInspectorTableRows = (inspectorId) => {
  const { data: collaboratorsData, isLoading: isLoadingCollaborators, isError: isErrorCollaborators } = useGetCollaboratorsByInspectorQuery(inspectorId);
  const [getInspections] = useLazyGetInspectionsByCollaboratorQuery();
  const [inspectionsData, setInspectionsData] = useState({});

  useEffect(() => {
    if (collaboratorsData) {
      collaboratorsData.forEach(async (collaborator) => {
        try {
          const response = await getInspections(collaborator._id);
          if (response.data) {
            const sortedInspections = response.data.sort((a, b) => new Date(b.plannedDateTime) - new Date(a.plannedDateTime));
            setInspectionsData((prevData) => ({
              ...prevData,
              [collaborator._id]: sortedInspections[0]?.plannedDateTime || 'Pas d\'inspections',
            }));
          }
        } catch (error) {
          console.error(`Erreur lors de la récupération des inspections pour le collaborateur ${collaborator._id}:`, error);
        }
      });
    }
  }, [collaboratorsData, getInspections]);

  const collaboratorRows = useMemo(() => {
    if (!collaboratorsData) return [];

    return collaboratorsData.map((collaborator) => ({
      id: collaborator._id,
      fullName: collaborator.fullName,
      employeeId: collaborator.employeeId,
      department: collaborator.department,
      position: collaborator.position,
      LastInspection: new Date(inspectionsData[collaborator._id]).toLocaleDateString() || 'Chargement...',
    }));
  }, [collaboratorsData, inspectionsData]);

  const isLoading = isLoadingCollaborators;
  const isError = isErrorCollaborators;

  return {
    collaboratorRows,
    isLoading,
    isError,
  };
};