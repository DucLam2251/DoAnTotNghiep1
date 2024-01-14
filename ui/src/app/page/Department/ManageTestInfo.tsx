import { ICommandBarItemProps } from "@fluentui/react";
import { Flex, Select, DatePicker } from "antd";
import { AxiosResponse } from "axios";
import dayjs from "dayjs";
import UniformTable from "../components/table";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { departmentApi, TestingInfoApi, appointmentApi, TestAppointmentApi } from "../../../api";
import { RootState } from "../../../redux";
import { tableRefresh, openLoading, showToastMessage, closeLoading } from "../../../redux/reducers";
import { saveDepartment, saveTesting } from "../../../redux/reducers/tableReducer";
import { EnumStatus } from "../../common/enum/common";
import { Role } from "../../model/enum/auth";
import { toastType } from "../../model/enum/common";
import { routerString } from "../../model/router";
import { getStatusText, tooltipPlainText } from "../../../utils/basicRender";
import { Utils } from "../../../utils";
interface ISelectOption {
    value: string;
    label: string;
  }
  const column = [
    {
      key: "index",
      name: "STT",
      minWidth: 40,
      maxWidth: 40,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.index)}</span>;
      },
    },
    {
      key: "name",
      name: "Họ và tên",
      minWidth:150,
      maxWidth: 180,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.patientDetail?.lastName)}</span>;
      },
    },
    {
      key: "gender",
      name: "Giới tính",
      minWidth: 80,
      maxWidth: 80,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(Utils.getGenderText(item.patientDetail?.gender))}</span>;
      },
    },
    {
      key: "mainTestingInfo",
      name: "Phòng khám",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.testingInfo?.name)}</span>;
      },
    },
    {
      key: "yearOfBirth",
      name: "Năm sinh",
      minWidth: 80,
      maxWidth: 80,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.patientDetail?.yearOfBirth)}</span>;
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
            {tooltipPlainText(Utils.convertDateToString(item.dateCreate))}
          </span>
        );
      },
    },
  ];
function ManageTestInfo () {

    // const [mainTestIdList, setMainTestIdList] = useState<Selection[]>([]);
    const [departmentList, setDepartmentList] = useState<ISelectOption[]>([]);
    const { tableSelectedCount, tableSelectedItem } = useSelector(
      (state: RootState) => state.currentSeleted
    );
    const { department, testing } = useSelector(
      (state: RootState) => state.table
    );
  
    const { role } = useSelector((state: RootState) => state.auth);
    // const { Id } = useSelector((state: RootState) => state.auth.info?.id);
    const [testingInfor, setStestingInfor] = useState<ISelectOption[]>([]);
    const [_, setMainTestId] = useState<string>("");
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
      setMainTestId(testing || "");
  
      const getTestingList = async (id: string) => {
        const body = {
          departmentId: id,
          isExaminationService: false,
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
        // console.log(testingInfor)
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
  
    // const callApiMainTestId = () => {};
    const dateFormat = "DD/MM/YYYY";
    const integrateItems = (reqbody: any): Promise<AxiosResponse<any, any>> => {
      reqbody.pageSize = 11;
      const body = {
        ...reqbody,
        dateTime: datetime,
        TestInfoId: testing,
        // status: AppointmentType.waiting,
        isAssending: true,
      };
      return TestAppointmentApi.getList(body);
    };
  
    const handleChangeTesting = async (value: string) => {
      setMainTestId(value);
      dispatch(saveDepartment(value));
      // dispatch(tableRefresh());
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
      // console.log(testingInfor)
      setStestingInfor(testingInfor);
    };
    const handleChange = async (value: string) => {
      // setMainTestId(value);
      // reqbody.pageSize = 11;
      setMainTestId(value);
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
              `${routerString.TestingAppointmentDetail}/${tableSelectedItem[0]?.id}`
            );
          },
        });
        if (role === Role.Administrator || role === Role.Patient){
          command.push({
            key: "deleteItem",
            text: "Hủy",
            iconProps: { iconName: "RecycleBin" },
            onClick: OnReject,
          });
        }
      }
  
      return command;
    };
    const OnReject = () => {
      dispatch(openLoading());
      const req = {
        appointmentID :tableSelectedItem[0]?.id,
        newStatus: EnumStatus.Reject,
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
          columns={column}
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

export default ManageTestInfo;