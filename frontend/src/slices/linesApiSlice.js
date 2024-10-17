import { apiSlice } from './apiSlice';
const LINES_URL = '/api/lines';

export const linesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLines: builder.query({
      query: () => ({ url: LINES_URL }),
      providesTags: ['Line'],
    }),
    createLine: builder.mutation({
      query: (data) => ({
        url: LINES_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Line'],
    }),
    updateLine: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${LINES_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Line'],
    }),
    deleteLine: builder.mutation({
      query: (id) => ({
        url: `${LINES_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Line'],
    }),
    assignCollaboratorToLine: builder.mutation({
      query: (data) => ({
        url: `${LINES_URL}/assign`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Line'],
    }),
    getLinesByCollaborator: builder.query({
      query: (collaboratorId) => ({
        url: `${LINES_URL}/collaborator/${collaboratorId}`,
        method: 'GET',
      }),
      providesTags: ['Line'],
    }),
  }),
});

export const {
  useGetLinesQuery,
  useCreateLineMutation,
  useUpdateLineMutation,
  useDeleteLineMutation,
  useAssignCollaboratorToLineMutation,
  useGetLinesByCollaboratorQuery,
} = linesApiSlice;