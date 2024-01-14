import React, { useEffect, useState } from 'react';
import { AlertOutlined, ApartmentOutlined, AppstoreOutlined, CalendarOutlined, FileProtectOutlined, GoldOutlined, HomeOutlined, MedicineBoxOutlined, ReconciliationOutlined, SolutionOutlined, TeamOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { mappingRouter, routerString } from '../model/router';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogoSidebar } from '../../asset/images/images';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { Role } from '../model/enum/auth';
import { FaUserDoctor } from "react-icons/fa6";
import { MdOutlineMedication } from 'react-icons/md';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items = (role: Role) => {
  switch(role) {
    case Role.Administrator:
      return [
        getItem(mappingRouter[routerString.home], `${routerString.home}`, <HomeOutlined />),
        getItem("Quản lý tài khoản", `${routerString.manageaccount}`, <SolutionOutlined />, [
          getItem("Quản lý bác sĩ", `${routerString.manageaccountdoctor}`, <FaUserDoctor/>),
          getItem("Quản lý tài khoản", `${routerString.manageaccountuser}`, <TeamOutlined />),
          getItem("Quản lý bệnh nhân", `${routerString.managePatientByAdmin}`, <TeamOutlined />),
        ]),
        getItem("Khám bệnh", `${routerString.appointmentroom}`, <MedicineBoxOutlined />, [
          getItem("Lịch hẹn", `${routerString.appointmentroom1}`, <CalendarOutlined  />),
          getItem("Cận lâm sàn", `${routerString.appointmentroom2}`, <FileProtectOutlined />),
        ]),
        getItem("Danh sách phòng", `${routerString.room}`, <AppstoreOutlined />, [
          getItem("Phòng khám bệnh", `${routerString.room1}`, <MdOutlineMedication />),
          getItem("Phòng cận lâm sàn", `${routerString.room2}`, <ReconciliationOutlined />),
        ]),
        getItem("Quản lý khoa", `${routerString.managedepartments}`, <ApartmentOutlined/>),
        getItem("Quản lý thuốc", `${routerString.managemedication}`, <MdOutlineMedication />),
        getItem("Thống kê", `${routerString.chart}`, <MdOutlineMedication />),
      ];
    case Role.Doctor:
    case Role.Nurse:
      return [
        getItem(mappingRouter[routerString.home], `${routerString.home}`, <HomeOutlined />),
        getItem("Khám bệnh", `${routerString.appointmentroom}`, <MedicineBoxOutlined />, [
          getItem("Lịch hẹn", `${routerString.appointmentroom1}`, <CalendarOutlined  />),
          getItem("Cận lâm sàn", `${routerString.appointmentroom2}`, <FileProtectOutlined />),
        ]),
        getItem("Danh sách phòng", `${routerString.room}`, <AppstoreOutlined />, [
          getItem("Phòng khám bệnh", `${routerString.room1}`, <MdOutlineMedication />),
          getItem("Phòng cận lâm sàn", `${routerString.room2}`, <ReconciliationOutlined />),
        ]),
        getItem("Danh sách bác sĩ", `${routerString.manageaccountdoctor}`, <FaUserDoctor/>),
        getItem("Danh sách bệnh nhân", `${routerString.managePatientByAdmin}`, <TeamOutlined />),
        getItem("Danh sách khoa", `${routerString.managedepartments}`, <ApartmentOutlined/>),
        getItem("Quản lý thuốc", `${routerString.managemedication}`, <MdOutlineMedication />),
      ];
    default:
      return [
        getItem(mappingRouter[routerString.home], `${routerString.home}`, <HomeOutlined />),
        getItem("Danh sách bệnh nhân", `${routerString.managepatient}`, <GoldOutlined />),
        getItem("Đặt lịch khám bệnh", `${routerString.requestschedule}`, <ReconciliationOutlined />),
        getItem("Danh sách khám bệnh", `${routerString.appointmentroom1}`, <CalendarOutlined  />),
        getItem("Danh sách bác sĩ", `${routerString.manageaccountdoctor}`, <FaUserDoctor/>),
        getItem("Danh sách phòng khám", `${routerString.room1}`, <GoldOutlined />),
        getItem("Danh sách dịch vụ", `${routerString.room2}`, <AlertOutlined />),
        getItem("Danh sách thuốc", `${routerString.managemedication}`, <MdOutlineMedication />),
      ];
  }
}

const sideBarKeys = [
  routerString.home,
  routerString.histories,
  routerString.appointment,
  routerString.schedule,
  routerString.manageaccountdoctor,
  routerString.manageaccountuser,
  routerString.managedepartments,
  routerString.managemedication,
  routerString.manageservice,
  routerString.manageappointmentroom,
  routerString.managetestingroom,
  routerString.managepatient,
  routerString.managePatientByAdmin,
  routerString.requestschedule,
  routerString.room1,
  routerString.room2,
  routerString.appointmentroom1,
  routerString.appointmentroom2,
  routerString.chart
]

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useSelector((state: RootState) => state.auth);

  const [current, setCurrent] = useState<string>(location.pathname);

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location.pathname])

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
    setCurrent(e.key);
  };

  const getSelectedKey = (currentPath: string): string[] => {
    const arr = currentPath.split("/");
    let key = arr.join("/");
    let currentItem = sideBarKeys.includes(key);
    while(!currentItem) {
      arr.pop();
      key = arr.join("/");
      currentItem = sideBarKeys.includes(key);
    }
    return [key]
  }

  const arrpath = location.pathname.split('/').filter((i) => i);

  return (
    <div id="main-sidebar" key={location.pathname}>
      <div style={{ height: "60px", backgroundColor: "#001529", color: "#fff", display: "flex", alignItems: "center"}}>
        <img alt="" src={LogoSidebar} style={{ width: "110px", height: "52px", marginLeft: "32px", marginTop: "8px" }} />
      </div>
      <Menu
        key={role}
        theme={'dark'}
        onClick={onClick}
        style={{ width: 256, height: "calc(100% - 60px)", paddingTop: "8px" }}
        defaultOpenKeys={[`/${arrpath[0]}`]}
        selectedKeys={getSelectedKey(current)}
        mode="inline"
        items={items(role!)}
        className='sidebar-menu'
      />
    </div>
  );
};

export default Sidebar;