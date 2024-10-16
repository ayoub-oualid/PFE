import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard from './StatCard';
import { useGetAllUsersQuery } from '../slices/usersApiSlice';
import { useGetInspectionsQuery, useGetInspectionsByStatusQuery, } from '../slices/inspectionsApiSlice';
import { useGetCollaboratorsQuery, useGetUnassignedCollaboratorsQuery } from '../slices/collaboratorsApiSlice';
import { useGetLinesQuery } from '../slices/linesApiSlice';
import { useGetReportsQuery } from '../slices/reportsApiSlice';



export default function MainGrid() {

  const { data: usersData, isLoading: isLoadingUsers, isError: isErrorUsers } = useGetAllUsersQuery();
  const { data: inspectionsData, isLoading: isLoadingInspections, isError: isErrorInspections } = useGetInspectionsQuery();
  const { data: inspectionsDoneData, isLoading: isLoadingInspectionsDone, isError: isErrorInspectionsDone } = useGetInspectionsByStatusQuery('done');
  const { data: inspectionsScheduledData, isLoading: isLoadingInspectionsScheduled, isError: isErrorInspectionsScheduled } = useGetInspectionsByStatusQuery('scheduled');
  const { data: collaboratorsData, isLoading: isLoadingCollaborators, isError: isErrorCollaborators } = useGetCollaboratorsQuery();
  const { data: unassignedCollaboratorsData, isLoading: isLoadingUnassignedCollaborators, isError: isErrorUnassignedCollaborators } = useGetUnassignedCollaboratorsQuery();
  const { data: linesData, isLoading: isLoadingLines, isError: isErrorLines } = useGetLinesQuery();
  const { data: reportsData, isLoading: isLoadingReports, isError: isErrorReports } = useGetReportsQuery();

  const dataList = [
    {
      title: 'Utilisateurs',
      value: isLoadingUsers ? '...' : isErrorUsers ? 'Erreur' : usersData.length.toString(),
    },
    {
      title: 'Inspections',
      value: isLoadingInspections ? '...' : isErrorInspections ? 'Erreur' : inspectionsData.length.toString(),
    },
    {
      title: 'Inspections Terminées',
      value: isLoadingInspectionsDone ? '...' : isErrorInspectionsDone ? 'Erreur' : inspectionsDoneData.length.toString(),
    },
    {
      title: 'Inspections Programmées',
      value: isLoadingInspectionsScheduled ? '...' : isErrorInspectionsScheduled ? 'Erreur' : inspectionsScheduledData.length.toString(),
    },
    {
      title: 'Collaborateurs',
      value: isLoadingCollaborators ? '...' : isErrorCollaborators ? 'Erreur' : collaboratorsData.length.toString(),
    },
    {
      title: 'Collaborateurs Non Assignés',
      value: isLoadingUnassignedCollaborators ? '...' : isErrorUnassignedCollaborators ? 'Erreur' : unassignedCollaboratorsData.length.toString(),
    },
    {
      title: 'Lignes',
      value: isLoadingLines ? '...' : isErrorLines ? 'Erreur' : linesData.length.toString(),
    },
    {
      title: 'Rapports',
      value: isLoadingReports ? '...' : isErrorReports ? 'Erreur' : reportsData.length.toString(),
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
{/*         <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid> */}
{/*         <Grid size={{ sm: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid> */}
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ md: 12, lg: 9 }}>
          <CustomizedDataGrid />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <ChartUserByCountry />
          </Stack>
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
