import { apiSlice } from './apiSlice';
const COLLABORATORS_URL = '/api/collaborators';

export const collaboratorsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCollaborators: builder.query({
      query: () => ({ url: COLLABORATORS_URL }),
      providesTags: ['Collaborator'],
    }),
    createCollaborator: builder.mutation({
      query: (data) => ({
        url: COLLABORATORS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Collaborator'],
    }),
    getCollaborator: builder.query({
      query: (id) => ({ url: `${COLLABORATORS_URL}/${id}` }),
      providesTags: ['Collaborator'],
    }),
    assignCollaborator: builder.mutation({
      query: (data) => ({
        url: `${COLLABORATORS_URL}/assign`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Collaborator'],
    }),
    unassignCollaborator: builder.mutation({
      query: (data) => ({
        url: `${COLLABORATORS_URL}/unassign`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Collaborator'],
    }),
    getCollaboratorsByInspector: builder.query({
      query: (inspectorId) => ({
        url: `${COLLABORATORS_URL}/inspector/${inspectorId}`,
        method: 'GET',
      }),
      providesTags: ['Collaborator'],
    }),
    getUnassignedCollaborators: builder.query({
      query: () => ({
        url: `${COLLABORATORS_URL}/unassigned`,
        method: 'GET',
      }),
      providesTags: ['Collaborator'],
    }),
    updateCollaborator: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${COLLABORATORS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Collaborator'],
    }),
    deleteCollaborator: builder.mutation({
      query: (id) => ({
        url: `${COLLABORATORS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Collaborator'],
    }),
  }),
});

export const {
  useGetCollaboratorsQuery,
  useCreateCollaboratorMutation,
  useGetCollaboratorQuery,
  useUpdateCollaboratorMutation,
  useDeleteCollaboratorMutation,
  useAssignCollaboratorMutation,
  useUnassignCollaboratorMutation,
  useGetCollaboratorsByInspectorQuery,
  useGetUnassignedCollaboratorsQuery,
  useLazyGetCollaboratorsByInspectorQuery,
} = collaboratorsApiSlice;