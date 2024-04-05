import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
//import Public from './components/Public'
import Login from './features/auth/Login';
import DashLayout from './components/dash/DashLayout'
import Welcome from './features/auth/Welcome'

import UsersList from './features/users/UsersList'
import EditUser from './features/users/EditUser'
import NewUser from './features/users/NewUser'

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
import useTitle from './hooks/useTitle'

import SiteLayout from './components/site/SiteLayout'
import SiteWelcome from './features/auth/SiteWelcome'

import FrmRecords from './features/records/FrmRecords'
import FrmRecord from './features/records/FrmRecord'
import FrmRecordsAll from './features/records/FrmRecordsAll'

import EditMasters from './features/masters/EditMasters'
import FrmAttends from './features/attendance/FrmAttends'
import FrmUsers from './features/users/FrmUsers'
import FrmTypes from './features/types/FrmTypes'


import CRLayout from './components/crview/CRLayout'
import CRWelcome from './features/crview/CRWelcome'
import CROverview from './features/crview/CROverview'
import CRManhour from './features/crview/CRManhour'
import CRConsumables from './features/crview/CRConsumables'
import CRExpenses from './features/crview/CRExpenses'
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
              <Route path="crview" element={<CRLayout />}>
                <Route index element={<CRWelcome />} />
                <Route path="overview" element={<CROverview />} />
                <Route path="manhour" element={<CRManhour />} />
                <Route path="consumables" element={<CRConsumables />} />
                <Route path="expenses" element={<CRExpenses />} />
              </Route>
              <Route path="site" element={<SiteLayout />}>
                <Route index element={<SiteWelcome />} />
                <Route path="attends" element={<FrmAttends />} />
                <Route path="users" element={<FrmUsers />} />
                <Route path="consumables" element={<EditMasters formType={`Consumables`} />} />
                <Route path="equipment" element={<EditMasters formType={`Equipment`} />} />
                <Route path="expenses" element={<EditMasters formType={`Expenses`} />} />
                <Route path="types" element={<FrmTypes />} />
                <Route path="records">
                  <Route path="consumables" element={<FrmRecords formType={`Consumables`} />} />
                  <Route path="equipment" element={<FrmRecords formType={`Equipment`} />} />
                  <Route path="expenses" element={<FrmRecords formType={`Expenses`} />} />
                  <Route path="consumable" element={<FrmRecord formType={`Consumables`} />} />
                  <Route path="equip" element={<FrmRecord formType={`Equipment`} />} />
                  <Route path="expense" element={<FrmRecord formType={`Expenses`} />} />
                </Route>
                <Route path="recordsall">
                  <Route path="consumables" element={<FrmRecordsAll formType={`Consumables`} />} />
                  <Route path="equipment" element={<FrmRecordsAll formType={`Equipment`} />} />
                  <Route path="expenses" element={<FrmRecordsAll formType={`Expenses`} />} />
                </Route>
                {/* <Route path="consumables">
                  <Route index element={<EditMasters formType={`Consumables`} />} />
                </Route>
                <Route path="equipment">
                  <Route index element={<EditMasters formType={`Equipment`} />} />
                </Route>
                <Route path="expenses">
                  <Route index element={<EditMasters formType={`Expenses`} />} />
                </Route> */}
                <Route path="files">
                  <Route index element={<FilesUpload />} />
                  <Route path="attendances" element={<AttendancesUpload />} />
                  <Route path="gpsdats" element={<GPSDatsUpload />} />
                </Route>
                <Route path="dailyReports">
                  <Route index element={<DailyReportsList />} />
                  <Route path=":id" element={<EditDailyReport />} />
                  <Route path="new" element={<NewDailyReport />} />
                  <Route path="new/:activityId" element={<NewDailyReport />} />
                </Route>
              </Route>

              <Route path="dash" element={<DashLayout />}>

                <Route index element={<Welcome />} />

                <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUser />} />
                  </Route>
                </Route>

                <Route path="projects">
                  <Route index element={<ProjectsList />} />
                  <Route path=":id" element={<EditProject forceRefresh={true} />} />
                  <Route path="new" element={<NewProject />} />
                </Route>

                <Route path="activities">
                  <Route index element={<ActivitiesList />} />
                  <Route path=":id" element={<EditActivity forceRefresh={true} />} />
                  <Route path="new" element={<NewActivity />} />
                </Route>

                <Route path="dailyReports">
                  <Route index element={<DailyReportsList />} />
                  <Route path=":id" element={<EditDailyReport forceRefresh={true} />} />
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
