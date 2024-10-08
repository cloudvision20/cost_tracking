import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'
let baseURL = 'http://localhost:3500'
//const baseURL = 'https://zxd72s15-3500.asse.devtunnels.ms'
// const baseURL = 'http://192.168.56.1:3500'
baseURL = 'https://ubiquitous-disco-7xr5j67qprxhpx7x-3500.app.github.dev'
baseURL = 'https://ubiquitous-disco-7xr5j67qprxhpx7x-3500.preview.app.github.dev'
baseURL = 'https://dk8qlj1g-3500.asse.devtunnels.ms'
// baseURL = 'https://zxd72s15-3500.asse.devtunnels.ms'
// baseURL = 'http://192.168.0.109:3500'
baseURL = 'http://localhost:3500'
const baseQuery = fetchBaseQuery({
    baseUrl: baseURL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token

        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    // console.log(args) // request url, method, body
    // console.log(api) // signal, dispatch, getState()
    // console.log(extraOptions) //custom like {shout: true}

    let result = await baseQuery(args, api, extraOptions)

    // If you want, handle other status codes, too
    if (result?.error?.status === 403) {
        console.log('sending refresh token')

        // send refresh token to get new access token 
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if (refreshResult?.data) {

            // store the new token 
            api.dispatch(setCredentials({ ...refreshResult.data }))

            // retry original query with new access token
            result = await baseQuery(args, api, extraOptions)
        } else {

            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Your login has expired."
            }
            return refreshResult
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Activity', 'DailyReport', 'Project', 'User', 'Record', 'Master', 'Attend'],
    endpoints: builder => ({})
})