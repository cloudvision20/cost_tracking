import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
//import Public from './components/Public'
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


// import EditEquip from './features/equipment/EditEquip'
// import EditConsumable from './features/consumables/EditConsumable'
// import EditExpense from './features/expenses/EditExpense'

import SiteLayout from './components/site/SiteLayout'
import SiteWelcome from './features/auth/SiteWelcome'

// import FrmExpense from './features/expenses/FrmExpense';
// import FrmConsumable from './features/consumables/FrmConsumable';
// import FrmEquip from './features/equipment/FrmEquip';

import FrmRecords from './features/records/FrmRecords';
import FrmRecord from './features/records/FrmRecord';
import EditMasters from './features/masters/EditMasters'

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
                <Route path="records">
                  <Route path="consumables" element={<FrmRecords formType={`Consumables`} />} />
                  <Route path="equipment" element={<FrmRecords formType={`Equipment`} />} />
                  <Route path="expenses" element={<FrmRecords formType={`Expenses`} />} />
                  <Route path="consumable" element={<FrmRecord formType={`Consumables`} />} />
                  <Route path="equip" element={<FrmRecord formType={`Equipment`} />} />
                  <Route path="expense" element={<FrmRecord formType={`Expenses`} />} />
                </Route>
                {/* <Route path="forms">
                  <Route path="consumables" element={<FrmConsumable />} />
                  <Route path="Equipment" element={<FrmEquip />} />
                  <Route path="Expenses" element={<FrmExpense />} />
                </Route> */}
                <Route path="consumables">
                  <Route index element={<EditMasters formType={`Consumables`} />} />
                </Route>
                <Route path="equipment">
                  <Route index element={<EditMasters formType={`Equipment`} />} />
                </Route>
                <Route path="expenses">
                  <Route index element={<EditMasters formType={`Expenses`} />} />
                </Route>
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

                {/* <Route path="consumables">
                  <Route index element={<EditConsumable />} />
                </Route> */}

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
