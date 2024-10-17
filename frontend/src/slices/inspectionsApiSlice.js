import { apiSlice } from './apiSlice';
const INSPECTIONS_URL = '/api/inspections';

export const inspectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInspections: builder.query({
      query: () => ({
        url: INSPECTIONS_URL,
        method: 'GET',
      }),
      providesTags: ['Inspection'],
    }),
    getInspection: builder.query({
      query: (id) => ({
        url: `${INSPECTIONS_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: ['Inspection'],
    }),
    createInspection: builder.mutation({
      query: (data) => ({
        url: INSPECTIONS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Inspection'],
    }),
    updateInspection: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${INSPECTIONS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Inspection'],
    }),
    deleteInspection: builder.mutation({
      query: (id) => ({
        url: `${INSPECTIONS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Inspection'],
    }),
    getInspectionsByInspector: builder.query({
      query: (inspectorId) => ({
        url: `${INSPECTIONS_URL}/inspector?inspectorId=${String(inspectorId)}`,
        method: 'GET',
      }),
      providesTags: ['Inspection'],
    }),
    getInspectionsByCollaborator: builder.query({
      query: (collaboratorId) => ({
        url: `${INSPECTIONS_URL}/collaborator?collaboratorId=${String(collaboratorId)}`,
        method: 'GET',
      }),
      providesTags: ['Inspection'],
    }),
    getInspectionsByStatus: builder.query({
      query: (status) => ({
        url: `${INSPECTIONS_URL}/status?status=${status}`,
        method: 'GET',
      }),
      providesTags: ['Inspection'],
    }),
  }),
});

export const {
  useGetInspectionsQuery,
  useCreateInspectionMutation,
  useGetInspectionQuery,
  useUpdateInspectionMutation,
  useDeleteInspectionMutation,
  useGetInspectionsByInspectorQuery,
  useGetInspectionsByCollaboratorQuery,
  useGetInspectionsByStatusQuery,
  useLazyGetInspectionsByInspectorQuery,
  useLazyGetInspectionsByCollaboratorQuery,
} = inspectionsApiSlice;