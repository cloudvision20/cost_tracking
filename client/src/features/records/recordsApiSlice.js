import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const recordsAdapter = createEntityAdapter({})
const initialState = recordsAdapter.getInitialState()

export const recordsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getRecords: builder.query({
            query: () => ({
                url: '/records',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            // transformResponse: responseData => {
            //     const loadedRecords = responseData.map(record => {
            //         record.id = record._id
            //         return record
            //     });
            //     return recordsAdapter.setAll(initialState, loadedRecords)
            // },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Record', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Record', id }))
                    ]
                } else return [{ type: 'Record', id: 'LIST' }]
            }
        }),
        // getRecordsByType: builder.query({
        //     query: (formType) => ({
        //         url: `/records/${formType}`,
        //         validateStatus: (response, result) => {
        //             return response.status === 200 && !result.isError
        //         },
        //     })
        // }),
        getRecordsByType: builder.query({
            query: (formType) => ({
                // url: `/records/${formType}`,
                url: `/records/type/${formType}/activityid/`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            })
        }),
        getRecordsByTypeActId: builder.query({
            query: (typeactid) => ({
                url: `/records/type/${typeactid.formType}/activityid/${typeactid.activityId}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            })
        }),
        getRecordById: builder.query({
            query: (id) => ({
                url: `/records/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            })
        }),
        // getRecordsByEIdSE: builder.query({
        //     query: (params) => ({
        //         url: `/records/formtype/${params.formtype}/eid/${params.eid}/start/${params.start}/end/${params.end}`,
        //         validateStatus: (response, result) => {
        //             return response.status === 200 && !result.isError
        //         },
        //     })
        // }),
        postRecordsByTypeRIdSE:builder.query({
            query: (req) => ({
                url: `/records/recordsSE`,
                method: 'POST',
                body:{
                    ...req,
                },
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            })
        }),
        addNewRecord: builder.mutation({
            query: initialRecordData => ({
                url: '/records',
                method: 'POST',
                body: {
                    ...initialRecordData,
                }
            }),
            invalidatesTags: [
                { type: 'Record', id: "LIST" }
            ]
        }),
        updateRecords: builder.mutation({
            query: initialRecordData => ({
                url: '/records',
                method: 'PATCH',
                body: {
                    ...initialRecordData,
                }
            }),
            invalidatesTags: [
                { type: 'Record', id: "LIST" }
            ]
        }),
        deleteRecord: builder.mutation({
            query: (del) => ({
                url: `/records`,
                method: 'DELETE',
                body: { del }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Record', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetRecordsQuery,
    useGetRecordsByTypeQuery,
    useGetRecordsByTypeActIdQuery,
    useGetRecordByIdQuery,
    usePostRecordsByTypeEIdSEQuery,
    useAddNewRecordMutation,
    useUpdateRecordsMutation,
    useDeleteRecordMutation,
} = recordsApiSlice

// returns the query result object
export const selectRecordsResult = recordsApiSlice.endpoints.getRecords.select()

// creates memoized selector
const selectRecordsData = createSelector(
    selectRecordsResult,
    recordsResult => recordsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllRecords,
    selectById: selectRecordById,
    selectIds: selectRecordIds
    // Pass in a selector that returns the records slice of state
} = recordsAdapter.getSelectors(state => selectRecordsData(state) ?? initialState)