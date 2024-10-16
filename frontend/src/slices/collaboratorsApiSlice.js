// collaboratorsApiSlice.js
import { apiSlice } from './apiSlice';
const COLLABORATORS_URL = '/api/collaborators';

export const collaboratorsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCollaborators: builder.query({
      query: () => ({ url: COLLABORATORS_URL }),
    }),
    createCollaborator: builder.mutation({
      query: (data) => ({
        url: COLLABORATORS_URL,
        method: 'POST',
        body: data,
      }),
    }),
    
    assignCollaborator: builder.mutation({
      query: (data) => ({
        url: `${COLLABORATORS_URL}/assign`,
        method: 'POST',
        body: data,
      }),
    }),
    unassignCollaborator: builder.mutation({
      query: (data) => ({
        url: `${COLLABORATORS_URL}/unassign`,
        method: 'POST',
        body: data,
      }),
    }),
    getCollaboratorsByInspector: builder.query({
      query: (inspectorId) => ({
        url: `${COLLABORATORS_URL}/inspector/${inspectorId}`,
        method: 'GET',
      }),
    }),
    getUnassignedCollaborators: builder.query({
      query: () => ({
        url: `${COLLABORATORS_URL}/unassigned`,
        method: 'GET',
      }),
    }),
    updateCollaborator: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${COLLABORATORS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteCollaborator: builder.mutation({
      query: (id) => ({
        url: `${COLLABORATORS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCollaboratorsQuery,
  useCreateCollaboratorMutation,
  useUpdateCollaboratorMutation,
  useDeleteCollaboratorMutation,
  useAssignCollaboratorMutation,
  useUnassignCollaboratorMutation,
  useGetCollaboratorsByInspectorQuery,
  useGetUnassignedCollaboratorsQuery,
  useLazyGetCollaboratorsByInspectorQuery
} = collaboratorsApiSlice;
