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
    headerName: 'Role',
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
    headerName: 'inspections',
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
  { field: 'fullName', headerName: 'Full Name', flex: 1.5, minWidth: 120 },
  { field: 'employeeId', headerName: 'Employee ID', flex: 1, minWidth: 100 },
  { field: 'department', headerName: 'Department', flex: 1.5, minWidth: 150 },
  { field: 'position', headerName: 'Position', flex: 1, minWidth: 120 },
  {
    field: 'assignedInspector',
    headerName: 'Assigned Inspector',
    flex: 1.5,
    minWidth: 150,
    renderCell: (params) => params.value.name,
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
      assignedInspector: collaborator.assignedInspector,
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
//     trainNumber,
//dateTime,
//firstStop,
//lastStop,
//collaborators, this one is an array of objects
export const lineColumns = [
  { field: 'trainNumber', headerName: 'Train Number', flex: 1, minWidth: 120 },
  { field: 'dateTime', headerName: 'Date Time', flex: 1, minWidth: 120 },
  { field: 'firstStop', headerName: 'First Stop', flex: 1, minWidth: 120 },
  { field: 'lastStop', headerName: 'Last Stop', flex: 1, minWidth: 120 },
  /* {
    field: 'collaborators',
    headerName: 'Collaborators',
    flex: 1.5,
    minWidth: 150,
    renderCell: (params) => (
      <Box>
        <List dense>
          {params.value.map((collaborator, index) => (
            <ListItem key={index}>
              <ListItemText primary={collaborator.fullName} />
            </ListItem>
          ))}
        </List>
      </Box>)
  }, */
];

export const useLineTableRows = () => {
  const { data: linesData, isLoading: isLoadingLines, isError: isErrorLines } = useGetLinesQuery();

  const lineRows = useMemo(() => {
    if (!linesData) return [];

    return linesData.map((line) => ({
      id: line._id,
      trainNumber: line.trainNumber,
      dateTime: line.dateTime,
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
  { field: 'inspection', headerName: 'Inspection', flex: 1, minWidth: 120 },
  { field: 'field1', headerName: 'Field 1', flex: 1, minWidth: 120 },
  { field: 'field2', headerName: 'Field 2', flex: 1, minWidth: 120 },
  { field: 'field3', headerName: 'Field 3', flex: 1, minWidth: 120 },
];

export const useReportTableRows = () => {
  const { data: reportsData, isLoading: isLoadingReports, isError: isErrorReports } = useGetReportsQuery();

  const reportRows = useMemo(() => {
    if (!reportsData) return [];

    return reportsData.map((report) => ({
      id: report._id,
      inspection: report.inspection,
      field1: report.field1,
      field2: report.field2,
      field3: report.field3,
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
  { field: 'inspector', headerName: 'Inspector', flex: 1, minWidth: 120 },
  { field: 'collaborator', headerName: 'Collaborator', flex: 1, minWidth: 120 },
  { field: 'line', headerName: 'Line', flex: 1, minWidth: 120 },
  { field: 'dateTime', headerName: 'Date Time', flex: 1, minWidth: 120 },
  { field: 'status', headerName: 'Status', flex: 1, minWidth: 120 },
  {
    field: 'report',
    headerName: 'Report',
    flex: 1,
    minWidth: 120,
    renderCell: renderSparklineCell,
  },
];

//the report can be retrieved with useLazyGetReportsByInspectionQuery with the inspection id

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
    headerName: 'Role',
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
  { field: 'fullName', headerName: 'Full Name', flex: 1.5, minWidth: 120 },
  { field: 'employeeId', headerName: 'Employee ID', flex: 1, minWidth: 100 },
  { field: 'department', headerName: 'Department', flex: 1.5, minWidth: 150 },
  { field: 'position', headerName: 'Position', flex: 1, minWidth: 120 },
  {
    field: 'LastInspection',
    headerName: 'Last Inspection',
    flex: 1.5,
    minWidth: 150,
    // the last inspection can be retrieved with useLazyGetInspectionsByCollaboratorQuery with the collaborator id and take the last one from the array plannedDateTime
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
              [collaborator._id]: sortedInspections[0]?.plannedDateTime || 'No inspections',
            }));
          }
        } catch (error) {
          console.error(`Error fetching inspections for collaborator ${collaborator._id}:`, error);
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
      LastInspection: new Date(inspectionsData[collaborator._id]).toLocaleDateString() || 'Loading...',
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