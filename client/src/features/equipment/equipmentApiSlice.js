import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const equipmentAdapter = createEntityAdapter({})

const initialState = equipmentAdapter.getInitialState()

export const equipmentApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getEquipment: builder.query({
            query: () => ({
                url: '/equipment',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            // transformResponse: responseData => {
            //     const loadedEquipment = responseData.map(equipment => {
            //         equipment.id = equipment._id
            //         return equipment
            //     });
            //     return equipmentAdapter.setAll(initialState, loadedEquipment)
            // },
            // providesTags: (result, error, arg) => {
            //     if (result?.ids) {
            //         return [
            //             { type: 'Equipment', id: 'LIST' },
            //             ...result.ids.map(id => ({ type: 'Equipment', id }))
            //         ]
            //     } else return [{ type: 'Equipment', id: 'LIST' }]
            // }
        }),
        getEquipmentById: builder.query({
            query: (id) => ({
                url: `/equipment/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            })
        }),
        addNewEquip: builder.mutation({
            query: initialEquipmentData => ({
                url: '/equipment',
                method: 'POST',
                body: {
                    ...initialEquipmentData,
                }
            }),
            invalidatesTags: [
                { type: 'Equipment', id: "LIST" }
            ]
        }),
        updateEquipment: builder.mutation({
            query: initialEquipmentData => ({
                url: '/equipment',
                method: 'PATCH',
                body: {
                    ...initialEquipmentData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Equipment', id: arg.id }
            ]
        }),
        deleteEquip: builder.mutation({
            query: ({ id }) => ({
                url: `/equipment`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Equipment', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetEquipmentQuery,
    useGetEquipmentByIdQuery,
    useAddNewEquipMutation,
    useUpdateEquipmentMutation,
    useDeleteEquipMutation,
} = equipmentApiSlice

// returns the query result object
export const selectEquipmentResult = equipmentApiSlice.endpoints.getEquipment.select()

// creates memoized selector
const selectEquipmentData = createSelector(
    selectEquipmentResult,
    equipmentResult => equipmentResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllEquipment,
    selectById: selectEquipmentById,
    selectIds: selectEquipmentIds
    // Pass in a selector that returns the equipment slice of state
} = equipmentAdapter.getSelectors(state => selectEquipmentData(state) ?? initialState)