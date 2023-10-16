import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const dailyReportsAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})

const initialState = dailyReportsAdapter.getInitialState()

export const dailyReportsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getDailyReports: builder.query({
            query: () => ({
                url: '/dailyReports',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedDailyReports = responseData.map(dailyReport => {
                    dailyReport.id = dailyReport._id
                    return dailyReport
                });
                return dailyReportsAdapter.setAll(initialState, loadedDailyReports)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'DailyReport', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'DailyReport', id }))
                    ]
                } else return [{ type: 'DailyReport', id: 'LIST' }]
            }
        }),
        getDailyReportById: builder.query({
            query: (id) => ({
                url: `/dailyReports/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            })
        }),
        addNewDailyReport: builder.mutation({
            query: initialDailyReport => ({
                url: '/dailyReports',
                method: 'POST',
                body: {
                    ...initialDailyReport,
                }
            }),
            invalidatesTags: [
                { type: 'DailyReport', id: "LIST" }
            ]
        }),
        updateDailyReport: builder.mutation({
            query: initialDailyReport => ({
                url: '/dailyReports',
                method: 'PATCH',
                body: {
                    ...initialDailyReport,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'DailyReport', id: arg.id }
            ]
        }),
        deleteDailyReport: builder.mutation({
            query: ({ id }) => ({
                url: `/dailyReports`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'DailyReport', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetDailyReportsQuery,
    useGetDailyReportByIdQuery,
    useGetDailyReportNewQuery,
    useAddNewDailyReportMutation,
    useUpdateDailyReportMutation,
    useDeleteDailyReportMutation,
} = dailyReportsApiSlice

// returns the query result object
export const selectDailyReportsResult = dailyReportsApiSlice.endpoints.getDailyReports.select()

// creates memoized selector
const selectDailyReportsData = createSelector(
    selectDailyReportsResult,
    dailyReportsResult => dailyReportsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllDailyReports,
    selectById: selectDailyReportById,
    selectIds: selectDailyReportIds
    // Pass in a selector that returns the dailyReports slice of state
} = dailyReportsAdapter.getSelectors(state => selectDailyReportsData(state) ?? initialState)