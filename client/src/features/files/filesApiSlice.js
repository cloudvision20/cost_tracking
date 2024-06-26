
import { apiSlice } from "../../app/api/apiSlice"


export const filesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getFiles: builder.query({
            query: () => ({
                url: '/files',
            })
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
            })
        }),
        uploadAttendances: builder.mutation({
            query: (file) => {
                const body = new FormData();
                body.append('Content-Type', file.type);
                body.append('file', file);
                body.append('userid', file.userid);
                body.append('activityid', file.activityid);

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
            })
        }),
        uploadGPSDats: builder.mutation({
            query: file => {
                const body = new FormData();
                body.append('Content-Type', file.type);
                body.append('file', file);
                body.append('userid', file.userid)
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
    useUploadMutation,
    useGetAttendancesQuery,
    useUploadAttendancesMutation,
    useGetGPSDatsQuery,
    useUploadGPSDatsMutation,
} = filesApiSlice