import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import StatCard from './StatCard';
import { useGetAllUsersQuery } from '../slices/usersApiSlice';
import { useGetInspectionsQuery, useGetInspectionsByStatusQuery, } from '../slices/inspectionsApiSlice';
import { useGetCollaboratorsQuery, useGetUnassignedCollaboratorsQuery } from '../slices/collaboratorsApiSlice';
import { useGetLinesQuery } from '../slices/linesApiSlice';
import { useGetReportsQuery } from '../slices/reportsApiSlice';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';


export default function MainGrid() {

  const { data: usersData, isLoading: isLoadingUsers, isError: isErrorUsers } = useGetAllUsersQuery();
  const { data: inspectionsData, isLoading: isLoadingInspections, isError: isErrorInspections } = useGetInspectionsQuery();
  const { data: inspectionsDoneData, isLoading: isLoadingInspectionsDone, isError: isErrorInspectionsDone } = useGetInspectionsByStatusQuery('done');
  const { data: inspectionsScheduledData, isLoading: isLoadingInspectionsScheduled, isError: isErrorInspectionsScheduled } = useGetInspectionsByStatusQuery('scheduled');
  const { data: collaboratorsData, isLoading: isLoadingCollaborators, isError: isErrorCollaborators } = useGetCollaboratorsQuery();
  const { data: unassignedCollaboratorsData, isLoading: isLoadingUnassignedCollaborators, isError: isErrorUnassignedCollaborators } = useGetUnassignedCollaboratorsQuery();
  const { data: linesData, isLoading: isLoadingLines, isError: isErrorLines } = useGetLinesQuery();
  const { data: reportsData, isLoading: isLoadingReports, isError: isErrorReports } = useGetReportsQuery();
  const totalCollaborators = isLoadingCollaborators ? '...' : isErrorCollaborators ? 'Erreur' : collaboratorsData.length.toString();
  const totalInspections = isLoadingInspections ? '...' : isErrorInspections ? 'Erreur' : inspectionsData.length.toString();

  const dataList = [
    {
      title: 'Utilisateurs',
      value: isLoadingUsers ? '...' : isErrorUsers ? 'Erreur' : usersData.length.toString(),
      link: '/users',
    },
    {
      title: 'Lignes',
      value: isLoadingLines ? '...' : isErrorLines ? 'Erreur' : linesData.length.toString(),
      link: '/lines',
    },
  ];
  const collaboratorDataList = [
    {
      label: 'non assignés',
      value: isLoadingUnassignedCollaborators ? '...' : isErrorUnassignedCollaborators ? 'Erreur' : (unassignedCollaboratorsData.length),
    },
    {
      label: 'assignés',
      value: isLoadingUnassignedCollaborators ? '...' : isErrorUnassignedCollaborators ? 'Erreur' : (totalCollaborators - unassignedCollaboratorsData.length),
    },
  ];
  const inspectionDataList = [
    {
      label: 'programmées',
      value: isLoadingInspectionsScheduled ? '...' : isErrorInspectionsScheduled ? 'Erreur' : (inspectionsScheduledData.length ),
    },
    {
      label: 'terminées',
      value: isLoadingInspectionsDone ? '...' : isErrorInspectionsDone ? 'Erreur' : (inspectionsDoneData.length ),
    },
  ];
  const collaboratorFields = [
    {
      name: 'non assignés',
      value: isLoadingUnassignedCollaborators ? '...' : isErrorUnassignedCollaborators ? 'Erreur' : (unassignedCollaboratorsData.length / totalCollaborators * 100),
      icon: <ErrorRoundedIcon />,
      color: 'red',
    },
    {
      name: 'assignés',
      value: isLoadingUnassignedCollaborators ? '...' : isErrorUnassignedCollaborators ? 'Erreur' : (( totalCollaborators - unassignedCollaboratorsData.length ) / totalCollaborators * 100),
      icon: <CheckCircleRoundedIcon />,
      color: 'green',
    },
  ];
  const inspectionFields = [
    {
      name: 'programmées',
      value: isLoadingInspectionsScheduled ? '...' : isErrorInspectionsScheduled ? 'Erreur' : (inspectionsScheduledData.length / totalInspections * 100),
      icon: <HourglassBottomRoundedIcon />,
      color: 'red',
    },
    {
      name: 'terminées',
      value: isLoadingInspectionsDone ? '...' : isErrorInspectionsDone ? 'Erreur' : (inspectionsDoneData.length / totalInspections * 100),
      icon: <CheckCircleRoundedIcon />,
      color: 'green',
    },
  ];
  
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {dataList.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
                <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <ChartUserByCountry title="Colaborateurs" data={collaboratorDataList} fields={collaboratorFields} total={totalCollaborators} />
          </Stack>
        </Grid>
         <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <ChartUserByCountry title="Inspections" data={inspectionDataList} fields={inspectionFields} total={totalInspections} />
          </Stack>
        </Grid> 
      </Grid>

      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
