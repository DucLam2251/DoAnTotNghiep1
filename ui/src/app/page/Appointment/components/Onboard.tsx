import { AxiosResponse } from "axios";
import { TestingInfoApi, appointmentApi, departmentApi } from "../../../../api";
import UniformTable from "../../components/table";
import { Flex, Select } from "antd";
import { useEffect, useState } from "react";
import { tableRefresh } from "../../../../redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import { ICommandBarItemProps } from "@fluentui/react";
import { RootState } from "../../../../redux";
import { useNavigate } from "react-router-dom";
import { routerString } from "../../../model/router";
import {
  saveDepartment,
  saveTesting,
} from "../../../../redux/reducers/tableReducer";
import { EnumStatus } from "../../../common/enum/common";
import { appointmentColumn } from "./Waiting";
interface ISelectOption {
  value: string;
  label: string;
}

function OnBoard() {
  const [departmentList, setDepartmentList] = useState<ISelectOption[]>([]);
  const { tableSelectedCount, tableSelectedItem } = useSelector(
    (state: RootState) => state.currentSeleted
  );
  const { department, testing } = useSelector(
    (state: RootState) => state.table
  );

  const [testingInfor, setStestingInfor] = useState<ISelectOption[]>([]);
  const [datetime, _] = useState<Date>(new Date());
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const callApiDepartment = () => {
    departmentApi
      .getList({ pageNumber: 1, pageSize: 50, searchKey: "" })
      .then((response) => {
        const result = response?.data?.values.map((item: any) => {
          return {
            value: item?.id,
            label: item?.name,
          };
        });
        setDepartmentList(result);
      });

    const getTestingList = async (id: string) => {
      const body = {
        departmentId: id,
        isExaminationService: true,
        pageNumber: 1,
        pageSize: 50,
        searchKey: "",
      };
      const testingData = await TestingInfoApi.getList(body);
      const testingInfor = testingData.data.values.map((item: any) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setStestingInfor(testingInfor);
    };
    if (department) {
      getTestingList(department);
    } else getTestingList("");

    dispatch(tableRefresh());
  };

  useEffect(() => {
    callApiDepartment();
  }, []);

  // const dateFormat = "DD/MM/YYYY";
  const integrateItems = (reqbody: any): Promise<AxiosResponse<any, any>> => {
    reqbody.pageSize = 11;
    const body = {
      ...reqbody,
      dateTime: datetime,
      mainTestId: testing,
      status: EnumStatus.OnBoard,
      isAssending: true,
    };
    return appointmentApi.getList(body);
  };

  const handleChangeTesting = async (value: string) => {
    dispatch(saveDepartment(value));
    const body = {
      departmentId: value,
      isExaminationService: true,
      pageNumber: 1,
      pageSize: 50,
      searchKey: "",
    };
    const testingData = await TestingInfoApi.getList(body);
    const testingInfor = testingData.data.values.map((item: any) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
    setStestingInfor(testingInfor);
  };
  const handleChange = async (value: string) => {
    dispatch(saveTesting(value));
    dispatch(tableRefresh());
  };

  const commandBar = () => {
    const command: ICommandBarItemProps[] = [];
    if (tableSelectedCount > 0) {
      command.push({
        key: "detail",
        text: "Xem chi tiết",
        iconProps: { iconName: "ComplianceAudit" },
        onClick: () => {
          navigate(
            `${routerString.appointmentDetail}/${tableSelectedItem[0]?.id}`
          );
        },
      });
    }

    return command;
  };

  return (
    <>
      <Flex>
        <div className="dropdown-department">
          <p>Chọn khoa: </p>
          <Select
            defaultValue=""
            value={department || ""}
            style={{ width: 250 }}
            onChange={handleChangeTesting}
            options={[{ value: "", label: "Tất cả" }, ...departmentList]}
          />
        </div>
        <div className="dropdown-department">
          <p>Chọn phòng khám: </p>
          <Select
            defaultValue=""
            value={testing || ""}
            style={{ width: 250 }}
            onChange={handleChange}
            options={[{ value: "", label: "Tất cả" }, ...testingInfor]}
          />
        </div>
        {/* {role !== "Patient" && (
          <div className="dropdown-department">
            <p>Chọn ngày: </p>
            <DatePicker
              defaultValue={dayjs()}
              format={dateFormat}
              onChange={(date, _) => {
                SetDatetime(date?.toDate() || new Date());
                dispatch(tableRefresh());
              }}
            />
          </div>
        )} */}
      </Flex>

      <UniformTable
        columns={appointmentColumn}
        commandBarItems={commandBar()}
        integrateItems={integrateItems}
        searchByColumn={"fullName"}
        searchPlaceholder={"tên"}
        sortable={true}
        tableContainerClassName="table-with-filter"
      />
    </>
  );
}

export default OnBoard;