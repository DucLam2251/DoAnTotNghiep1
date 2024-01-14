import { Tabs, TabsProps } from "antd";
import "./index.scss";
import Waiting from "./components/Waiting";
import Medical from "./components/Medical";
import { useState } from "react";
import OnBoard from "./components/Onboard";
import Success from "./components/Success";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { Role } from "../../model/enum/auth";

function Appointment() {
  const [key, setKey] = useState<string>("1");
  const onChange = (key: string) => {
    setKey(key)
  };
  const { role } = useSelector((state: RootState) => state.auth);
  
  let items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Chờ xác nhận',
      children: <Waiting/>
    },
    {
      key: '2',
      label: 'Khám bệnh',
      children: <Medical/>
    },
    {
      key: '3',
      label: 'Nhập viện',
      children: <OnBoard/>
    },
    {
      key: '4',
      label: 'Hoàn thành',
      children: <Success/>
    },
  ];
  if(role === Role.Patient){
    items = items.slice(0,2);
  }
  return (
    <div>
      <Tabs
        activeKey={key}
        items={items}
        onChange={onChange}
        className="appointment-tabs"
        destroyInactiveTabPane={true}
      />
    </div>
  );
}

export default Appointment;