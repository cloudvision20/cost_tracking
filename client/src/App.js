import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login';
import DashLayout from './components/dash/DashLayout'
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

import AttendancesUpload from './features/files/AttendancesUpload'
import GPSDatsUpload from './features/files/GPSDatsUpload'
import FilesUpload from './features/files/FilesUpload'
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import { ROLES } from './config/roles'
import useTitle from './hooks/useTitle';


import EditEquip from './features/equipment/EditEquip'
import EditConsumable from './features/consumables/EditConsumable'
import EditExpense from './features/expenses/EditExpense'

import SiteLayout from './components/site/SiteLayout'
import SiteWelcome from './features/auth/SiteWelcome'

function App() {
  useTitle('Cost Tracking')

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        {/* <Route index element={<Public />} /> */}
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route element={<Prefetch />}>
              <Route path="files">
                <Route index element={<FilesUpload />} />
                <Route path="attendances" element={<AttendancesUpload />} />
                <Route path="gpsdats" element={<GPSDatsUpload />} />
              </Route>

              <Route path="site" element={<SiteLayout />}>
                <Route index element={<SiteWelcome />} />
                <Route path="consumables">
                  <Route index element={<EditConsumable />} />
                </Route>
                <Route path="equipment">
                  <Route index element={<EditEquip />} />
                </Route>
                <Route path="expenses">
                  <Route index element={<EditExpense />} />
                </Route>
                <Route path="files">
                  <Route index element={<FilesUpload />} />
                  <Route path="attendances" element={<AttendancesUpload />} />
                  <Route path="gpsdats" element={<GPSDatsUpload />} />
                </Route>
              </Route>

              <Route path="dash" element={<DashLayout />}>

                <Route index element={<Welcome />} />

                <Route path="consumables">
                  <Route index element={<EditConsumable />} />
                </Route>

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
                  <Route path="new/:activityId" element={<NewDailyReport />} />
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
