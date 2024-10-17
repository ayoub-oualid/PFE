// inspectionsApiSlice.js
import { get } from 'mongoose';
import { apiSlice } from './apiSlice';
import { getInspectionsByCollaborator, getInspectionsByStatus } from '../../../backend/controllers/inspectionController';
const INSPECTIONS_URL = '/api/inspections';

export const inspectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInspections: builder.query({
      query: () => ({
        url: INSPECTIONS_URL,
        method: 'GET',
      }),
    }),
    getInspection: builder.query({
      query: (id) => ({
        url: `${INSPECTIONS_URL}/${id}`,
        method: 'GET',
      }),
    }),
    createInspection: builder.mutation({
      query: (data) => ({
        url: INSPECTIONS_URL,
        method: 'POST',
        body: data,
      }),
    }),
    updateInspection: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${INSPECTIONS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteInspection: builder.mutation({
      query: (id) => ({
        url: `${INSPECTIONS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    getInspectionsByInspector: builder.query({
      query: (inspectorId) => ({
        url: `${INSPECTIONS_URL}/inspector?inspectorId=${String(inspectorId)}`,
        method: 'GET',
      }),
    }),
    getInspectionsByCollaborator: builder.query({
        query: (collaboratorId) => ({
            url: `${INSPECTIONS_URL}/collaborator?collaboratorId=${String(collaboratorId)}`,
            method: 'GET',
        }),
    }),
    getInspectionsByStatus: builder.query({
        query: (status) => ({
            url: `${INSPECTIONS_URL}/status?status=${status}`,
            method: 'GET',
        }),
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
    useLazyGetInspectionsByCollaboratorQuery
} = inspectionsApiSlice;
