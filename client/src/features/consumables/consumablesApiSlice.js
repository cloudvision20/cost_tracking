import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const consumablesAdapter = createEntityAdapter({})

const initialState = consumablesAdapter.getInitialState()

export const consumablesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getConsumables: builder.query({
            query: () => ({
                url: '/consumables',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            // transformResponse: responseData => {
            //     const loadedConsumables = responseData.map(consumable => {
            //         consumable.id = consumable._id
            //         return consumable
            //     });
            //     return consumablesAdapter.setAll(initialState, loadedConsumables)
            // },
            // providesTags: (result, error, arg) => {
            //     if (result?.ids) {
            //         return [
            //             { type: 'Consumable', id: 'LIST' },
            //             ...result.ids.map(id => ({ type: 'Consumable', id }))
            //         ]
            //     } else return [{ type: 'Consumable', id: 'LIST' }]
            // }
        }),
        getConsumableById: builder.query({
            query: (id) => ({
                url: `/consumables/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            })
        }),
        addNewConsumable: builder.mutation({
            query: initialConsumableData => ({
                url: '/consumables',
                method: 'POST',
                body: {
                    ...initialConsumableData,
                }
            }),
            invalidatesTags: [
                { type: 'Consumable', id: "LIST" }
            ]
        }),
        updateConsumables: builder.mutation({
            query: initialConsumableData => ({
                url: '/consumables',
                method: 'PATCH',
                body: {
                    ...initialConsumableData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Consumable', id: arg.id }
            ]
        }),
        deleteConsumable: builder.mutation({
            query: ({ id }) => ({
                url: `/consumables`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Consumable', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetConsumablesQuery,
    useGetConsumableByIdQuery,
    useAddNewConsumableMutation,
    useUpdateConsumablesMutation,
    useDeleteConsumableMutation,
} = consumablesApiSlice

// returns the query result object
export const selectConsumablesResult = consumablesApiSlice.endpoints.getConsumables.select()

// creates memoized selector
const selectConsumablesData = createSelector(
    selectConsumablesResult,
    consumablesResult => consumablesResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllConsumables,
    selectById: selectConsumableById,
    selectIds: selectConsumableIds
    // Pass in a selector that returns the consumables slice of state
} = consumablesAdapter.getSelectors(state => selectConsumablesData(state) ?? initialState)