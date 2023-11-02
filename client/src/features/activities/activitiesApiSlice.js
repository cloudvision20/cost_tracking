import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const activitiesAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})
const initialState = activitiesAdapter.getInitialState()

export const activitiesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getActivities: builder.query({
            query: () => ({
                url: '/activities',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedActivities = responseData.map(activity => {
                    activity.id = activity._id
                    return activity
                });
                return activitiesAdapter.setAll(initialState, loadedActivities)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Activity', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Activity', id }))
                    ]
                } else return [{ type: 'Activity', id: 'LIST' }]
            }
        }),
        getActivityById: builder.query({
            query: (id) => ({
                url: `/activities/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            })
        }),

        // getActivityByType: builder.query({
        //     query: (formType) => ({
        //         url: `/activities/forms/${formType}`,
        //         validateStatus: (response, result) => {
        //             return response.status === 200 && !result.isError
        //         },
        //     })
        // }),
        getActivitiesByUserId: builder.query({
            query: (id) => ({
                url: `/activities/userid/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            })
            // transformResponse: responseData => {
            //     const activities = responseData.map((activity) => {
            //         return {
            //             ...activity,
            //             resources: activity.resources.filter((res) => res.type === 'Labour')
            //         }
            //     });
            //     return activities
            // },
        }),
        addNewActivity: builder.mutation({
            query: initialActivity => ({
                url: '/activities',
                method: 'POST',
                body: {
                    ...initialActivity,
                }
            }),
            invalidatesTags: [
                { type: 'Activity', id: "LIST" }
            ]
        }),
        updateActivity: builder.mutation({
            query: initialActivity => ({
                url: '/activities',
                method: 'PATCH',
                body: {
                    ...initialActivity,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Activity', id: arg.id }
            ]
        }),
        deleteActivity: builder.mutation({
            query: ({ id }) => ({
                url: `/activities`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Activity', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetActivitiesQuery,
    useGetActivityByIdQuery,
    // useGetActivityByTypeQuery,
    // useLazyGetActivityByTypeQuery,
    useGetActivitiesByUserIdQuery,
    useAddNewActivityMutation,
    useUpdateActivityMutation,
    useDeleteActivityMutation,
} = activitiesApiSlice

// returns the query result object
export const selectActivitiesResult = activitiesApiSlice.endpoints.getActivities.select()

// creates memoized selector
const selectActivitiesData = createSelector(
    selectActivitiesResult,
    activitiesResult => activitiesResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllActivities,
    selectById: selectActivityById,
    selectIds: selectActivityIds
    // Pass in a selector that returns the activities slice of state
} = activitiesAdapter.getSelectors(state => selectActivitiesData(state) ?? initialState)