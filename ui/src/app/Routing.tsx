import { Navigate, Route, HashRouter as Router, Routes } from "react-router-dom";
import UniformLayout from "./structure";
import { Appointment, Histories, Overview } from "./page";
import { routerString } from "./model/router";
import Login from "./Login";
import ErrorPage from "./structure/ErrorPage";
import { ErrorPageEnum } from "./model/enum/common";
import ManageDoctor from "./page/ManageAccount/ManageDoctor";
import ManageUser from "./page/ManageAccount/ManageUser";
import Department from "./page/Department";
import Medications from "./page/Medication";
import ManageRoom from "./page/Department/ManageRoom";
import ManageSerivce from "./page/Department/ManageService";
import ManagePatient from "./page/ManageAccount/ManagePatient";
import DetailAccount from "./page/ManageAccount/DetailAccount";
import RequestSechedule from "./page/RequestSchedule";
import ManagePatientByAdmin from "./page/ManageAccount/ManagePatientByAdmin";
import AppointmentDetail from "./page/Appointment/components/AppointmentDetail";
import ManageTestInfo from "./page/Department/ManageTestInfo";
import TestingAppointmentDetail from "./page/Department/testingAppointmentDetail";
import WaitingDetail from "./page/Appointment/components/WaitingDetail";
import Chart from "./page/Chart/Chart";

function Routing() {
  return (
    <Router basename="/">
      <Routes>
        <Route path={`${routerString.login}`} element={<Login/>} />
        <Route path="/" element={<Navigate to={`${routerString.login}`} replace />} />
        <Route path={`${routerString.home}`} element={<UniformLayout page={<Overview/>}/>} />
        <Route path={`${routerString.histories}`} element={<UniformLayout page={<Histories/>}/>} />
        <Route path={`${routerString.appointmentroom1}`} element={<UniformLayout page={<Appointment/>}/>} />
        <Route path={`${routerString.appointmentDetail}/:id`} element={<UniformLayout page={<AppointmentDetail/>}/>} />
        <Route path={`${routerString.appointmentWaitingDetail}/:id`} element={<UniformLayout page={<WaitingDetail/>}/>} />
        <Route path={`${routerString.requestschedule}`} element={<UniformLayout page={<RequestSechedule/>}/>} />
        <Route path={`${routerString.manageaccountdoctor}`} element={<UniformLayout page={<ManageDoctor/>}/>} />
        <Route path={`${routerString.doctordetail}/:id`} element={<UniformLayout page={<DetailAccount type="Doctor" />}/>} />
        <Route path={`${routerString.manageaccountuser}`} element={<UniformLayout page={<ManageUser/>}/>} />
        <Route path={`${routerString.managePatientByAdmin}`} element={<UniformLayout page={<ManagePatientByAdmin/>}/>} />
        <Route path={`${routerString.accountdetail}/:id`} element={<UniformLayout page={<DetailAccount type="User" />}/>} />
        <Route path={`${routerString.managedepartments}`} element={<UniformLayout page={<Department/>}/>} />
        <Route path={`${routerString.chart}`} element={<UniformLayout page={<Chart/>}/>} />
        <Route path={`${routerString.room1}`} element={<UniformLayout page={<ManageRoom/>}/>} />
        <Route path={`${routerString.appointmentroom2}`} element={<UniformLayout page={<ManageTestInfo/>}/>} /> 
        <Route path={`${routerString.TestingAppointmentDetail}/:id`} element={<UniformLayout page={<TestingAppointmentDetail/>}/>} />
        <Route path={`${routerString.room2}`} element={<UniformLayout page={<ManageSerivce/>}/>} />
        <Route path={`${routerString.managemedication}`} element={<UniformLayout page={<Medications/>}/>} />
        <Route path={`${routerString.managepatient}`} element={<UniformLayout page={<ManagePatient/>}/>} />
        <Route path={`${routerString.patientdetail}/:id`} element={<UniformLayout page={<DetailAccount type="Patient" />}/>} />
        <Route path={`${routerString.patientdetailByAdmin}/:id`} element={<UniformLayout page={<DetailAccount type="Patient" />}/>} />
        {/*  */}
        <Route path={`${routerString.Forbidden}`} element={<ErrorPage pageType={ErrorPageEnum.Forbidden}/>}/>
        <Route path={`${routerString.ServerError}`} element={<ErrorPage pageType={ErrorPageEnum.ServerError}/>}/>
        <Route path="*" element={<Navigate to={`${routerString.Forbidden}`} replace />} />
      </Routes>
    </Router>
  );
}

export default Routing;