import { createSlice } from '@reduxjs/toolkit'

const siteSlice = createSlice({
    name: 'site',
    initialState: { activity: null },
    reducers: {
        setActivity: (state, action) => {
            const { curActivity } = action.payload
            state.activity = curActivity
        },
        logOut: (state, action) => {
            state.activity = null
        }
    }
})

export const { setActivity, logOut } = siteSlice.actions

export default siteSlice.reducer

export const selectActivity = (state) => state.site.activity