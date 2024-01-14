import { AxiosResponse } from "axios";
import { TestingInfoApi, appointmentApi, departmentApi } from "../../../../api";
import UniformTable from "../../components/table";
import { getStatusText, tooltipPlainText } from "../../../../utils/basicRender";
import { DatePicker, Flex, Select } from "antd";
import { useEffect, useState } from "react";
import { closeLoading, openLoading, showToastMessage, tableRefresh } from "../../../../redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import { Utils } from "../../../../utils";
import dayjs from "dayjs";
import { ICommandBarItemProps } from "@fluentui/react";
import { RootState } from "../../../../redux";
import { useNavigate } from "react-router-dom";
import { routerString } from "../../../model/router";
import {
  saveDepartment,
  saveTesting,
} from "../../../../redux/reducers/tableReducer";
import { Role } from "../../../model/enum/auth";
import { toastType } from "../../../model/enum/common";
import { EnumStatus } from "../../../common/enum/common";
interface ISelectOption {
  value: string;
  label: string;
}
export const appointmentColumn = [
  {
    key: "index",
    name: "STT",
    minWidth: 40,
    maxWidth: 60,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.index)}</span>;
    },
  },
  {
    key: "name",
    name: "Họ và tên",
    minWidth: 80,
    maxWidth: 180,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.lastName)}</span>;
    },
  },
  {
    key: "gender",
    name: "Giới tính",
    minWidth: 80,
    maxWidth: 80,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(Utils.getGenderText(item.gender))}</span>;
    },
  },
  {
    key: "mainTestingInfo",
    name: "Phòng khám",
    minWidth: 80,
    maxWidth: 150,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.nameOfMainTestingInfo)}</span>;
    },
  },
  {
    key: "yearOfBirth",
    name: "Năm sinh",
    minWidth: 80,
    maxWidth: 80,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.yearOfBirth)}</span>;
    },
  },
  {
    key: "status",
    name: "Trạng thái",
    minWidth: 150,
    maxWidth: 200,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(getStatusText(item.status))}</span>;
    },
  },
  {
    key: "date",
    name: "Ngày khám",
    minWidth: 150,
    maxWidth: 200,
    isResizable: true,
    onRender: (item: any) => {
      return (
        <span>
          {tooltipPlainText(Utils.convertDateToString(item.apointmentDate))}
        </span>
      );
    },
  },
];

function Waiting() {
  const [departmentList, setDepartmentList] = useState<ISelectOption[]>([]);
  const { tableSelectedCount, tableSelectedItem } = useSelector(
    (state: RootState) => state.currentSeleted
  );
  const { department, testing } = useSelector(
    (state: RootState) => state.table
  );

  const { role } = useSelector((state: RootState) => state.auth);
  const [testingInfor, setStestingInfor] = useState<ISelectOption[]>([]);
  const [datetime, SetDatetime] = useState<Date>(new Date());
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
  };

  useEffect(() => {
    dispatch(tableRefresh());
  }, [department, testing])

  useEffect(() => {
    callApiDepartment();
  }, []);

  const dateFormat = "DD/MM/YYYY";
  const integrateItems = (reqbody: any): Promise<AxiosResponse<any, any>> => {
    reqbody.pageSize = 11;
    const body = {
      ...reqbody,
      dateTime: datetime,
      mainTestId: testing,
      status: EnumStatus.PendingConfirm,
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
            `${routerString.appointmentWaitingDetail}/${tableSelectedItem[0]?.id}`
          );
        },
      });
      if (role === Role.Nurse) {
        command.push({
          key: "confirm",
          text: "Xác nhận lịch hẹn",
          iconProps: { iconName: "ForwardEvent" },
          onClick: OnConfirmOrReject(EnumStatus.New),
        });
      }
      if (role === Role.Nurse || role === Role.Patient) {
        command.push({
          key: "deleteItem",
          text: "Hủy lịch hẹn",
          iconProps: { iconName: "RemoveEvent" },
          onClick: OnConfirmOrReject(EnumStatus.Reject),
        });
      }
    }

    return command;
  };
  const OnConfirmOrReject = (status: EnumStatus) => () => {
    dispatch(openLoading());
    const req = {
      appointmentID: tableSelectedItem[0]?.id,
      newStatus: status,
      HealthInsurance: false
    }
    appointmentApi.updateStatus(req)
      .then((result: any) => {
        if (result.success) {
          dispatch(
            showToastMessage({
              message: "Thành công",
              type: toastType.succes,
            })
          );
        } else {
          showToastMessage({
            message: "Có lỗi, hãy thử lại",
            type: toastType.error,
          })
        }
        dispatch(tableRefresh());
      })
      .catch(() => {
        dispatch(
          showToastMessage({
            message: "Có lỗi, hãy thử lại",
            type: toastType.error,
          })
        );
      })
      .finally(() => {
        dispatch(closeLoading());
      });
  }

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
        {role !== "Patient" && (
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
        )}
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

export default Waiting;
