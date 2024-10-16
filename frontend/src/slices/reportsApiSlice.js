// reportsApiSlice.js
import { get } from 'mongoose';
import { apiSlice } from './apiSlice';
const REPORTS_URL = '/api/reports';

export const reportsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: () => ({
        url: REPORTS_URL,
        method: 'GET',
      }),
    }),
    createReport: builder.mutation({
      query: (data) => ({
        url: REPORTS_URL,
        method: 'POST',
        body: data,
      }),
    }),
    updateReport: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${REPORTS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteReport: builder.mutation({
      query: (id) => ({
        url: `${REPORTS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    getReportsByInspector: builder.query({
      query: (inspectorId) => ({
        url: `${REPORTS_URL}/inspector?inspectorId=${inspectorId}`,
        method: 'GET',
      }),
    }),
    getReportsByCollaborator: builder.query({
      query: (collaboratorId) => ({
        url: `${REPORTS_URL}/collaborator?collaboratorId=${collaboratorId}`,
        method: 'GET',
      }),
    }),
    getReportsByInspection: builder.query({
      query: (inspectionId) => ({
        url: `${REPORTS_URL}/inspection?inspectionId=${inspectionId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetReportsQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
  useDeleteReportMutation,
  useGetReportsByInspectorQuery,
    useGetReportsByCollaboratorQuery,
    useGetReportsByInspectionQuery,
    useLazyGetReportsByInspectionQuery
} = reportsApiSlice;
