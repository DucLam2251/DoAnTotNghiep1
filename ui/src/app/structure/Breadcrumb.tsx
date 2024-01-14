import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { mappingRouter, routerString } from '../model/router';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { Role } from '../model/enum/auth';

const breadcrumbNameMap: Record<string, string> = {
  [routerString.home]: mappingRouter[routerString.home],
  [routerString.histories]: mappingRouter[routerString.histories],
  [routerString.appointment]: mappingRouter[routerString.appointment],
  [routerString.schedule]: mappingRouter[routerString.schedule],
  [routerString.manageaccount]: mappingRouter[routerString.manageaccount],
  [routerString.manageaccountdoctor]: mappingRouter[routerString.manageaccountdoctor],
  [routerString.manageaccountuser]: mappingRouter[routerString.manageaccountuser],
  [routerString.accountdetail]: mappingRouter[routerString.accountdetail],
  [routerString.doctordetail]: mappingRouter[routerString.doctordetail],
  [routerString.managemedication]: mappingRouter[routerString.managemedication],
  [routerString.managedepartments]: mappingRouter[routerString.managedepartments],
  [routerString.manageroom]: mappingRouter[routerString.manageroom],
  [routerString.manageappointmentroom]: mappingRouter[routerString.manageappointmentroom],
  [routerString.managetestingroom]: mappingRouter[routerString.managetestingroom],
  [routerString.manageservice]: mappingRouter[routerString.manageservice],
  [routerString.managepatient]: mappingRouter[routerString.managepatient],
  [routerString.patientdetail]: mappingRouter[routerString.patientdetail],
  [routerString.patientdetailByAdmin]: mappingRouter[routerString.patientdetailByAdmin],
  [routerString.managePatientByAdmin]: mappingRouter[routerString.managePatientByAdmin],
  [routerString.requestschedule]: mappingRouter[routerString.requestschedule],
  [routerString.appointmentDetail]: mappingRouter[routerString.appointmentDetail],
  [routerString.appointmentWaitingDetail]: mappingRouter[routerString.appointmentWaitingDetail],
  [routerString.TestingAppointmentDetail]: mappingRouter[routerString.TestingAppointmentDetail],
  [routerString.appointmentroom]: mappingRouter[routerString.appointmentroom],
  [routerString.appointmentroom1]: mappingRouter[routerString.appointmentroom1],
  [routerString.appointmentroom2]: mappingRouter[routerString.appointmentroom2],
  [routerString.room]: mappingRouter[routerString.room],
  [routerString.room1]: mappingRouter[routerString.room1],
  [routerString.room2]: mappingRouter[routerString.room2],
  [routerString.chart]: mappingRouter[routerString.chart],
};

const firstMenu = [
  mappingRouter[routerString.manageaccount],
  mappingRouter[routerString.room],
  mappingRouter[routerString.appointmentroom],
]

const UniformBreadcrumb = () => {
  const location = useLocation();
  const {role} = useSelector((state: RootState) => state.auth)
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    let _title = <Link to={url}>{breadcrumbNameMap[url]}</Link>;
    if (firstMenu.includes(breadcrumbNameMap[url]) || location.pathname === url) {
      _title = <>{breadcrumbNameMap[url]}</>
    }
    return {
      key: breadcrumbNameMap[url],
      title: _title,
    };
  });
  const _extraBreadcrumbItems = extraBreadcrumbItems.filter(i => i.key);
  _extraBreadcrumbItems[_extraBreadcrumbItems.length - 1].title = _extraBreadcrumbItems[_extraBreadcrumbItems.length - 1].key as any;

  // disable routerstring.appointmentroom2 in patient site
  
  const outputBreadCrumb = _extraBreadcrumbItems.filter((item) => {
    if(role === Role.Patient && item.key === "Khám dịch vụ") return false;
    return true;
  })

  return (
    <Breadcrumb items={outputBreadCrumb} style={{ height: 60, padding: 20, fontSize: 16 }} />
  );
};

export default UniformBreadcrumb;