import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const mastersAdapter = createEntityAdapter({})
const initialState = mastersAdapter.getInitialState()

export const mastersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMasters: builder.query({
            query: () => ({
                url: '/masters',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            // transformResponse: responseData => {
            //     const loadedMasters = responseData.map(master => {
            //         master.id = master._id
            //         return master
            //     });
            //     return mastersAdapter.setAll(initialState, loadedMasters)
            // },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Master', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Master', id }))
                    ]
                } else return [{ type: 'Master', id: 'LIST' }]
            }
        }),
        getMasterById: builder.query({
            query: (id) => ({
                url: `/masters/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            })
        }),
        getAllMastersByType: builder.query({
            query: (formType) => ({
                url: `/masters/${formType}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            })
        }),
        addNewMaster: builder.mutation({
            query: initialMasterData => ({
                url: '/masters',
                method: 'POST',
                body: {
                    ...initialMasterData,
                }
            }),
            invalidatesTags: [
                { type: 'Master', id: "LIST" }
            ]
        }),
        updateMasters: builder.mutation({
            query: initialMasterData => ({
                url: '/masters',
                method: 'PATCH',
                body: {
                    ...initialMasterData,
                }
            }),
            invalidatesTags: [
                { type: 'Master', id: "LIST" }
            ]
        }),
        deleteMaster: builder.mutation({
            query: (del) => ({
                url: `/masters`,
                method: 'DELETE',
                body: { del }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Master', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetAllMastersByTypeQuery,
    useLazyGetAllMastersByTypeQuery,
    useGetMasterByIdQuery,
    useAddNewMasterMutation,
    useUpdateMastersMutation,
    useDeleteMasterMutation,
} = mastersApiSlice

// returns the query result object
export const selectMastersResult = mastersApiSlice.endpoints.getMasters.select()

// creates memoized selector
const selectMastersData = createSelector(
    selectMastersResult,
    mastersResult => mastersResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllMasters,
    selectById: selectMasterById,
    selectIds: selectMasterIds
    // Pass in a selector that returns the masters slice of state
} = mastersAdapter.getSelectors(state => selectMastersData(state) ?? initialState)