import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'

import UsersList from './features/users/UsersList'
import EditUser from './features/users/EditUser'
import NewUserForm from './features/users/NewUserForm'

import ProjectsList from './features/projects/ProjectsList'
import EditProject from './features/projects/EditProject'
import NewProject from './features/projects/NewProject'

import ActivitiesList from './features/activities/ActivitiesList';
import NewActivity from './features/activities/NewActivity';
import EditActivity from './features/activities/EditActivity';

import DailyReportsList from './features/dailyReports/DailyReportsList'
import EditDailyReport from './features/dailyReports/EditDailyReport'
import NewDailyReport from './features/dailyReports/NewDailyReport'

import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import { ROLES } from './config/roles'
import useTitle from './hooks/useTitle';


function App() {
  useTitle('Cost Tracking')

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>

                <Route index element={<Welcome />} />

                <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

                <Route path="projects">
                  <Route index element={<ProjectsList />} />
                  <Route path=":id" element={<EditProject />} />
                  <Route path="new" element={<NewProject />} />
                </Route>

                <Route path="activities">
                  <Route index element={<ActivitiesList />} />
                  <Route path=":id" element={<EditActivity />} />
                  <Route path="new" element={<NewActivity />} />
                </Route>

                <Route path="dailyReports">
                  <Route index element={<DailyReportsList />} />
                  <Route path=":id" element={<EditDailyReport />} />
                  <Route path="new" element={<NewDailyReport />} />
                </Route>

              </Route>{/* End Dash */}
            </Route>
          </Route>
        </Route>{/* End Protected Routes */}

      </Route>
    </Routes >
  );
}

export default App;
