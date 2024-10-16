// linesApiSlice.js
import { apiSlice } from './apiSlice';
const LINES_URL = '/api/lines';

export const linesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getLines: builder.query({
            query: () => ({ url: LINES_URL }),
        }),
        createLine: builder.mutation({
            query: (data) => ({
                url: LINES_URL,
                method: 'POST',
                body: data,
            }),
        }),
        updateLine: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${LINES_URL}/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteLine: builder.mutation({
            query: (id) => ({
                url: `${LINES_URL}/${id}`,
                method: 'DELETE',
            }),
        }),
        assignCollaboratorToLine: builder.mutation({
            query: (data) => ({
                url: `${LINES_URL}/assign`,
                method: 'POST',
                body: data,
            }),
        }),
        getLinesByCollaborator: builder.query({
            query: (collaboratorId) => ({
                url: `${LINES_URL}/collaborator/${collaboratorId}`,
                method: 'GET',
            }),
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
