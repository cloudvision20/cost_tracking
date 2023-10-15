import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
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
            //     const loadedEquipment = responseData.map(equip => {
            //         equip.id = equip._id
            //         return equip
            //     });
            //     return equipmentAdapter.setAll(initialState, loadedEquipment)
            // },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Equip', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Equip', id }))
                    ]
                } else return [{ type: 'Equip', id: 'LIST' }]
            }
        }),
        getEquipById: builder.query({
            query: (id) => ({
                url: `/equipment/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            })
        }),
        addNewEquip: builder.mutation({
            query: initialEquipData => ({
                url: '/equipment',
                method: 'POST',
                body: {
                    ...initialEquipData,
                }
            }),
            invalidatesTags: [
                { type: 'Equip', id: "LIST" }
            ]
        }),
        updateEquipment: builder.mutation({
            query: initialEquipData => ({
                url: '/equipment',
                method: 'PATCH',
                body: {
                    ...initialEquipData,
                }
            }),
            invalidatesTags: [
                { type: 'Equip', id: "LIST" }
            ]
        }),
        deleteEquip: builder.mutation({
            query: ({ id }) => ({
                url: `/equipment`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Equip', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetEquipmentQuery,
    useGetEquipByIdQuery,
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
    selectById: selectEquipById,
    selectIds: selectEquipIds
    // Pass in a selector that returns the equipment slice of state
} = equipmentAdapter.getSelectors(state => selectEquipmentData(state) ?? initialState)