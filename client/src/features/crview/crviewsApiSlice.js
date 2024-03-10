import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const attendsAdapter = createEntityAdapter({})
const initialState = attendsAdapter.getInitialState()

export const crviewsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // getAttends: builder.query({
        //     query: () => ({
        //         url: '/attends',
        //         validateStatus: (response, result) => {
        //             return response.status === 200 && !result.isError
        //         },
        //     }),
        //     // transformResponse: responseData => {
        //     //     const loadedAttends = responseData.map(attend => {
        //     //         attend.id = attend._id
        //     //         return attend
        //     //     });
        //     //     return attendsAdapter.setAll(initialState, loadedAttends)
        //     // },
        //     providesTags: (result, error, arg) => {
        //         if (result?.ids) {
        //             return [
        //                 { type: 'Attend', id: 'LIST' },
        //                 ...result.ids.map(id => ({ type: 'Attend', id }))
        //             ]
        //         } else return [{ type: 'Attend', id: 'LIST' }]
        //     }
        // }),
        // getAttendsByEId: builder.query({
        //     query: (employeeid) => ({
        //         url: `/attends/employee/${employeeid}`,
        //         validateStatus: (response, result) => {
        //             return response.status === 200 && !result.isError
        //         },
        //     })
        // }),

        getActsGBProjs: builder.query({
            query: (req) => ({
                url: `/crviews/actsbyprojs/${req.start}/${req.end}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            })
            // ,
            // providesTags: (result, error, arg) => {
            //     if (result?) {
            //         return [
            //             { type: 'Activity', id: 'PRJ' },
            //             ...result
            //         ]
            //     } else return [{ type: 'Activity', id: 'PRJ' }]
            // }
        }),
        // postHrsByEIdSE: builder.query({
        //     query: (req) => ({
        //         url: `/crviews/actbyprojsSE`,
        //         method: 'POST',
        //         body: {
        //             ...req,
        //         },
        //         validateStatus: (response, result) => {
        //             return response.status === 200 && !result.isError
        //         },
        //     })
        // }),
        postHrsByEIdSE: builder.query({
            query: (req) => ({
                url: `/crviews/recordsSE`,
                method: 'POST',
                body: {
                    ...req,
                },
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            })
        }),
        // getAttendById: builder.query({
        //     query: (id) => ({
        //         url: `/attends/${id}`,
        //         validateStatus: (response, result) => {
        //             return response.status === 200 && !result.isError
        //         },
        //     })
        // }),
        // addNewAttend: builder.mutation({
        //     query: initialAttendData => ({
        //         url: '/attends',
        //         method: 'POST',
        //         body: {
        //             ...initialAttendData,
        //         }
        //     }),
        //     invalidatesTags: [
        //         { type: 'Attend', id: "LIST" }
        //     ]
        // }),
        // updateAttends: builder.mutation({
        //     query: initialAttendData => ({
        //         url: '/attends',
        //         method: 'PATCH',
        //         body: {
        //             ...initialAttendData,
        //         }
        //     }),
        //     invalidatesTags: [
        //         { type: 'Attend', id: "LIST" }
        //     ]
        // }),
        // deleteAttend: builder.mutation({
        //     query: (del) => ({
        //         url: `/attends`,
        //         method: 'DELETE',
        //         body: { del }
        //     }),
        //     invalidatesTags: (result, error, arg) => [
        //         { type: 'Attend', id: arg.id }
        //     ]
        // }),
    }),
})

export const {
    useGetAttendsQuery,
    // useGetAttendsByTypeQuery,
    // useGetAttendByIdQuery,
    // useAddNewAttendMutation,
    useGetActsGBProjsQuery,
    // usePostActivitiesGBProjsQuery,
    usePostHrsByEIdSEQuery,
    // useGetAttendsByEIdQuery,
    // useUpdateAttendsMutation,
    // useDeleteAttendMutation,
} = crviewsApiSlice

// returns the query result object
// export const selectAttendsResult = crviewsApiSlice.endpoints.getAttends.select()

// // creates memoized selector
// const selectAttendsData = createSelector(
//     selectAttendsResult,
//     attendsResult => attendsResult.data // normalized state object with ids & entities
// )

// //getSelectors creates these selectors and we rename them with aliases using destructuring
// export const {
//     selectAll: selectAllAttends,
//     selectById: selectAttendById,
//     selectIds: selectAttendIds
//     // Pass in a selector that returns the attends slice of state
// } = attendsAdapter.getSelectors(state => selectAttendsData(state) ?? initialState)