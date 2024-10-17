import { apiSlice } from './apiSlice';
const REPORTS_URL = '/api/reports';

export const reportsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: () => ({
        url: REPORTS_URL,
        method: 'GET',
      }),
      providesTags: ['Report'],
    }),
    getReport: builder.query({
      query: (id) => ({
        url: `${REPORTS_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: ['Report'],
    }),
    createReport: builder.mutation({
      query: (data) => ({
        url: REPORTS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Report'],
    }),
    updateReport: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${REPORTS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Report'],
    }),
    deleteReport: builder.mutation({
      query: (id) => ({
        url: `${REPORTS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Report'],
    }),
    getReportsByInspector: builder.query({
      query: (inspectorId) => ({
        url: `${REPORTS_URL}/inspector?inspectorId=${inspectorId}`,
        method: 'GET',
      }),
      providesTags: ['Report'],
    }),
    getReportsByCollaborator: builder.query({
      query: (collaboratorId) => ({
        url: `${REPORTS_URL}/collaborator?collaboratorId=${collaboratorId}`,
        method: 'GET',
      }),
      providesTags: ['Report'],
    }),
    getReportsByInspection: builder.query({
      query: (inspectionId) => ({
        url: `${REPORTS_URL}/inspection?inspectionId=${inspectionId}`,
        method: 'GET',
      }),
      providesTags: ['Report'],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGetReportQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
  useDeleteReportMutation,
  useGetReportsByInspectorQuery,
  useGetReportsByCollaboratorQuery,
  useGetReportsByInspectionQuery,
  useLazyGetReportsByInspectionQuery,
} = reportsApiSlice;