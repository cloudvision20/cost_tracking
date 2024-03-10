import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const typesAdapter = createEntityAdapter({})
const initialState = typesAdapter.getInitialState()

export const typesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTypes: builder.query({
            query: () => ({
                url: '/types',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            // providesTags: (result, error, arg) => {
            //     if (result?.ids) {
            //         return [
            //             { type: 'Type', id: 'LIST' },
            //             ...result.ids.map(id => ({ type: 'Type', id }))
            //         ]
            //     } else return [{ type: 'Type', id: 'LIST' }]
            // }
        }),
        getTypesByCat: builder.query({
            query: (category) => ({
                url: `/types/${category}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            })
        }),
        // getTypeById: builder.query({
        //     query: (id) => ({
        //         url: `/types/${id}`,
        //         validateStatus: (response, result) => {
        //             return response.status === 200 && !result.isError
        //         },
        //     })
        // }),
        updateTypes: builder.mutation({
            query: initialTypeData => ({
                url: '/types',
                method: 'PATCH',
                body: {
                    ...initialTypeData,
                }
            }),
            // invalidatesTags: [
            //     { type: 'Type', id: "LIST" }
            // ]
        }),
        deleteType: builder.mutation({
            query: (del) => ({
                url: `/types`,
                method: 'DELETE',
                body: { del }
            }),
            // invalidatesTags: (result, error, arg) => [
            //     { type: 'Type', id: arg.id }
            // ]
        }),
    }),
})

export const {
    useGetTypesQuery,
    useGetTypesByCatQuery,
    useUpdateTypesMutation,
    useDeleteTypeMutation,
} = typesApiSlice

// returns the query result object
export const selectTypesResult = typesApiSlice.endpoints.getTypes.select()

// creates memoized selector
const selectTypesData = createSelector(
    selectTypesResult,
    typesResult => typesResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllTypes,
    selectById: selectTypeById,
    selectIds: selectTypeIds
    // Pass in a selector that returns the types slice of state
} = typesAdapter.getSelectors(state => selectTypesData(state) ?? initialState)