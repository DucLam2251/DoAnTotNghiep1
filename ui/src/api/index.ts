import axios from "axios";
import api from "./axios";
import { IBodyChart } from "../utils";

const path = {
  login: 'accounts/Login',
  getAuth: '/accounts/getAu',
  userRegister: '/accounts/creataccountpatient',
  getUserDetail: '/accounts/getuserdetail',
  changePassword: '/accounts/changepassword',
  updateUserDetail: '/accounts/updateuserdetail',
  getAccounts: "/accounts/getListAccount",
  deleteAccounts: "/accounts/DeleteAccount",

  //doctor
  getDoctor: '/doctorcontroller/getlist',
  createDoctor: '/doctorcontroller/Create',
  updateDoctor: '/doctorcontroller/UpdateByAdmin',
  getDoctorById: '/doctorcontroller/GetDoctorInfo',

  //patient
  getPatient: '/patientcontroller/GetListPatient',
  createPatient: '/patientcontroller/AddPatientDetail',
  updatePatient: '/patientcontroller/Update',
  deletePatient: '/patientcontroller/delete',
  getPatientById: '/patientcontroller/GetPatientDetail',
  getListPatientByAdmin: '/patientcontroller/GetListPatientByAdmin',
  //medication
  getListMedication: '/medicine/GetList',
  createMedication: '/medicine/Create',
  updateMedication: '/medicine/Update',
  deleteMedication: '/medicine/delete',

  //department
  getListDepartment: '/Department/GetList',
  createDepartment: '/Department/Create',
  deleteDepartment: '/Department/delete',
  updateDepartment: '/Department/Update',
  
  //testingInfo
  createTestingInfo: '/TestingInfo/Create',
  getListTestingInfo: '/TestingInfo/GetList',
  updateTestingInfo: '/TestingInfo/Update',
  deleteTestingInfo: '/TestingInfo/delete',

  //appointment
  getListAppointment: '/appointment/getList',
  CreateAppointment: '/appointment/Create',
  GetAppointmentById: '/appointment/Get',
  UpdateStatusApointment: '/appointment/updateStatus',
  UpdateApointment: '/appointment/update',
  AddTestAppointment: '/appointment/AddTestAppointment',

  //TestingApointment
  SubmitTestAppointment: '/TestApointment/Submit',
  GetTestAppointmentById: '/TestApointment/Get',
  GetListTestAppointment: '/TestApointment/GetList',
  UpdateTestAppointment: '/TestApointment/updateStatus',

}
const apiUrl = import.meta.env.VITE_APP_BASE_URL;

const authApi = {
  login: (reqbody: any) => axios.post(`${apiUrl}${path.login}`, reqbody),
  getCheckCurrentUser: () => api.get(path.getAuth),
  getInfoCurrentUser: () => api.get(path.getUserDetail),
  changepassword: (reqbody: any) => api.post(path.changePassword, reqbody),
  register: (reqbody: any) => api.post(path.userRegister, reqbody),
  updateInfo: (reqbody: any) => api.post(path.updateUserDetail, reqbody),
  getList: (reqbody: any) => api.post(path.getAccounts, reqbody),
  delete: (id: any) => api.delete(`${path.deleteAccounts}/${id}`)
}

const doctorApi = {
  getList: (reqbody: any) => api.post(path.getDoctor, reqbody),
  create: (reqbody: any) => api.post(path.createDoctor, reqbody),
  update: (reqbody: any) => api.post(path.updateDoctor, reqbody),
  delete: (reqbody: any) => api.post("", reqbody),
  getById: (id: any) => api.get(`${path.getDoctorById}/${id}`)
}

const patientApi = {
  getList: (reqbody: any) => api.post(path.getPatient, reqbody),
  create: (reqbody: any) => api.post(path.createPatient, reqbody),
  update: (reqbody: any) => api.post(path.updatePatient, reqbody),
  delete: (id: any) => api.delete(`${path.deletePatient}/${id}`),
  getById: (id: any) => api.get(`${path.getPatientById}/${id}`),
  getlistByadmin: (reqbody: any) => api.post(path.getListPatientByAdmin, reqbody),
}

const medicineApi = {
  getList: (reqbody: any) => api.post(path.getListMedication, reqbody),
  create: (reqbody: any) => api.post(path.createMedication, reqbody),
  update: (reqbody: any) => api.post(path.updateMedication, reqbody),
  delete: (id: any) => api.delete(`${path.deleteMedication}/${id}`),
}

const departmentApi = {
  getList: (reqbody: any) => api.post(path.getListDepartment, reqbody),
  create: (reqbody: any) => api.post(path.createDepartment, reqbody),
  delete: (id: any) => api.delete(`${path.deleteDepartment}/${id}`),
  update: (reqbody: any) => api.post(path.updateDepartment, reqbody),
}

const TestingInfoApi = {
  getList: (reqbody: any) => api.post(path.getListTestingInfo, reqbody),
  create: (reqbody: any) => api.post(path.createTestingInfo, reqbody),
  update: (reqbody: any) => api.post(path.updateTestingInfo, reqbody),
  delete: (id: any) => api.delete(`${path.deleteTestingInfo}/${id}`),
}

const appointmentApi = {
  getList: (reqbody: any) => api.post(path.getListAppointment, reqbody),
  create: (reqbody: any) => api.post(path.CreateAppointment, reqbody),
  getById: (id: any) => api.get(`${path.GetAppointmentById}/${id}`),
  updateStatus: (reqbody: any) => api.post(path.UpdateStatusApointment, reqbody),
  update: (reqbody: any) => api.post(path.UpdateApointment, reqbody),
  addTestAppointment: (reqbody: any) => api.post(path.AddTestAppointment, reqbody),
}
const TestAppointmentApi = {
  getById: (id: any) => api.get(`${path.GetTestAppointmentById}/${id}`),
  getList: (reqbody: any) => api.post(path.GetListTestAppointment, reqbody),
  Update: (reqbody: any) => api.post(path.UpdateTestAppointment, reqbody),
  Submit: (reqbody: any) => api.post(path.SubmitTestAppointment, reqbody),
}

const ChartApi = {
  getChartPayment: (body: IBodyChart) => api.post(`/TestingInfo/ChartPayment`, body),
  getChartNumberAppointment: (body: IBodyChart) => api.post(`/TestingInfo/GetNumberOfAppointment`, body),
  getChartNumberDepartment: (body: any) => api.post(`/TestingInfo/GetNumberOfAppointmentOnDepartment`, body),
}
export {
  authApi,
  doctorApi,
  medicineApi,
  departmentApi,
  TestingInfoApi,
  patientApi,
  appointmentApi,
  TestAppointmentApi,
  ChartApi
};
