import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"


const filesAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})

const initialState = filesAdapter.getInitialState()
export const filesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getFiles: builder.query({
            query: () => ({
                url: '/files',
                // validateStatus: (response, result) => {
                //     return response.status === 200 && !result.isError
                // },
            })
        }),

        addNewFile: builder.mutation({
            query: initialFile => ({
                url: '/files',
                method: 'POST',
                body: {
                    ...initialFile,
                },
                formData: true,
            }),
            invalidatesTags: [
                { type: 'File', id: "LIST" }
            ]
        }),
        upload: builder.mutation({
            query: file => {
                const body = new FormData();
                body.append('Content-Type', file.type);
                body.append('file', file);

                return {
                    url: '/files',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data;'
                    },
                    body,
                    formData: true,
                }
            },
        }),
        getAttendances: builder.query({
            query: () => ({
                url: '/files/attendances',
                // validateStatus: (response, result) => {
                //     return response.status === 200 && !result.isError
                // },
            })
        }),
        uploadAttendances: builder.mutation({
            query: (file) => {
                const body = new FormData();
                body.append('Content-Type', file.type);
                body.append('file', file);
                body.append('userid', file.userid)

                return {
                    url: '/files/attendances',
                    method: 'POST',
                    body,
                }
            },
        }),
        getGPSDats: builder.query({
            query: () => ({
                url: '/files/gpsdats',
                // validateStatus: (response, result) => {
                //     return response.status === 200 && !result.isError
                // },
            })
        }),
        uploadGPSDats: builder.mutation({
            query: file => {
                const body = new FormData();
                body.append('Content-Type', file.type);
                body.append('file', file);

                return {
                    url: '/files/gpsdats',
                    method: 'POST',
                    body,
                }
            },
        }),
    }),
})

export const {
    useGetFilesQuery,
    useAddNewFileMutation,
    useUploadMutation,
    useGetAttendancesQuery,
    useUploadAttendancesMutation,
    useGetGPSDatsQuery,
    useUploadGPSDatsMutation,
} = filesApiSlice