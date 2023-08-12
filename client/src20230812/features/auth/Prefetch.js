import { store } from '../../app/store'
import { dailyReportsApiSlice } from '../dailyReports/dailyReportsApiSlice'
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {

    useEffect(() => {
        store.dispatch(dailyReportsApiSlice.util.prefetch('getDailyReports', 'dailyReportsList', { force: true }))
        store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
    }, [])

    return <Outlet />
}
export default Prefetch
