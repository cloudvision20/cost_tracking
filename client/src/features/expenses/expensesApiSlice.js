import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const expensesAdapter = createEntityAdapter({})
const initialState = expensesAdapter.getInitialState()

export const expensesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getExpenses: builder.query({
            query: () => ({
                url: '/expenses',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            // transformResponse: responseData => {
            //     const loadedExpenses = responseData.map(expense => {
            //         expense.id = expense._id
            //         return expense
            //     });
            //     return expensesAdapter.setAll(initialState, loadedExpenses)
            // },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Expense', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Expense', id }))
                    ]
                } else return [{ type: 'Expense', id: 'LIST' }]
            }
        }),
        getExpenseById: builder.query({
            query: (id) => ({
                url: `/expenses/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            })
        }),
        addNewExpense: builder.mutation({
            query: initialExpenseData => ({
                url: '/expenses',
                method: 'POST',
                body: {
                    ...initialExpenseData,
                }
            }),
            invalidatesTags: [
                { type: 'Expense', id: "LIST" }
            ]
        }),
        updateExpenses: builder.mutation({
            query: initialExpenseData => ({
                url: '/expenses',
                method: 'PATCH',
                body: {
                    ...initialExpenseData,
                }
            }),
            invalidatesTags: [
                { type: 'Expense', id: "LIST" }
            ]
        }),
        deleteExpense: builder.mutation({
            query: ({ id }) => ({
                url: `/expenses`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Expense', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetExpensesQuery,
    useGetExpenseByIdQuery,
    useAddNewExpenseMutation,
    useUpdateExpensesMutation,
    useDeleteExpenseMutation,
} = expensesApiSlice

// returns the query result object
export const selectExpensesResult = expensesApiSlice.endpoints.getExpenses.select()

// creates memoized selector
const selectExpensesData = createSelector(
    selectExpensesResult,
    expensesResult => expensesResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllExpenses,
    selectById: selectExpenseById,
    selectIds: selectExpenseIds
    // Pass in a selector that returns the expenses slice of state
} = expensesAdapter.getSelectors(state => selectExpensesData(state) ?? initialState)