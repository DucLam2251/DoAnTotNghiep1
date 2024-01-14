import { combineReducers } from "@reduxjs/toolkit";
import authReducer, { setInfoUser, setEmail, setRole, userLogout } from "./authReducer";
import loadingReducer, { closeLoading, openLoading } from "./loadingReducer";
import toastReducer, { closeToastMessage, showToastMessage } from "./toastReducer";
import panelReducer, { closePanel, closePanelLoading, openPanel, openPanelLoading } from "./panelReducer";
import curentSelectedReducer, { setCurentId, setCurrentSidebar, setTableSelectedCount, setTableSelectedItem } from "./curentSelectedReducer";
import tableReducer, { tableRefresh } from "./tableReducer";
import departmentReducer, { setDepartmentCurrent } from "./departmentReducer";
import chartReducer from "./chartReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  loading: loadingReducer,
  toast: toastReducer,
  panel: panelReducer,
  currentSeleted: curentSelectedReducer,
  table: tableReducer,
  department: departmentReducer,
  chart: chartReducer
});

export default rootReducer;

export {
  setRole, setEmail, setInfoUser, userLogout,
  openLoading, closeLoading,
  showToastMessage, closeToastMessage,
  openPanel, closePanel, openPanelLoading, closePanelLoading,
  setCurentId, setCurrentSidebar, setTableSelectedCount, setTableSelectedItem,
  tableRefresh,
  setDepartmentCurrent
}