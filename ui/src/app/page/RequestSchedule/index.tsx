import { Button, DatePicker, Descriptions, Empty, Modal, Select } from "antd";
import "./index.scss"
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { RangePickerProps } from "antd/es/date-picker";
import { Utils } from "../../../utils";
import TextArea from "antd/es/input/TextArea";
import { TestingInfoApi, appointmentApi, departmentApi, patientApi } from "../../../api";
import UniformTable from "../components/table";
import { patientColumn } from "../ManageAccount/ManagePatient";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { roomColumn } from "../Department/ManageRoom";
import { AxiosResponse } from "axios";
import { closeLoading, openLoading, showToastMessage, tableRefresh } from "../../../redux/reducers";
import { toastType } from "../../model/enum/common";
import { useNavigate } from "react-router-dom";
import { routerString } from "../../model/router";

function RequestSechedule() {
  const [patient, setPatient] = useState<any>();
  const [room, setRoom] = useState<any>(null);
  const [description, setDescription] = useState<string>("");
  const [requestDate, setRequestDate] = useState(new Date());
  const [isOpenModal, setOpenModal] = useState<{ open: boolean, forPatient: boolean }>({ open: false, forPatient: true });
  const [departmentId, setDepartmentId] = useState<string>("");
  const [departmentList, setDepartmentList] = useState<Selection[]>([]);

  const { tableSelectedCount, tableSelectedItem } = useSelector(
    (state: RootState) => state.currentSeleted
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = () => {
    const body = {
      apointmentDate: requestDate,
      description,
      patientId: patient.id,
      mainTestingInfoId: room.id
    }
    dispatch(openLoading());
    appointmentApi.create(body)
    .then((result: any) => {
      if (result.success) {
        dispatch(
          showToastMessage({
            message: "Thành công",
            type: toastType.succes,
          })
        );
        navigate(routerString.appointmentroom1);
      } else {
        showToastMessage({
          message: "Có lỗi, hãy thử lại",
          type: toastType.error,
        })
      }
    })
    .catch(() => {
      dispatch(
        showToastMessage({
          message: "Có lỗi, hãy thử lại",
          type: toastType.error,
        })
      );
    })
    .finally(() => dispatch(closeLoading()))
  }

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().endOf("day");
  };

  const callApiDepartment = () => {
    return departmentApi.getList({ pageNumber: 1, pageSize: 50, searchKey: "" }).then((response) => {
      const result = response?.data?.values.map((item: any) => {
        return {
          value: item?.id,
          label: item?.name,
        };
      });
      setDepartmentList(result);
    });
  };

  useEffect(() => {
    callApiDepartment();
  }, []);

  const integrateItems = (reqbody: any): Promise<AxiosResponse<any, any>> => {
    const body = {
      ...reqbody,
      isExaminationService: true,
      departmentId: departmentId
    };
    return TestingInfoApi.getList(body);
  };

  const handleChange = (value: string) => {
    setDepartmentId(value);
    dispatch(tableRefresh());
  }

  const renderModelContent = () => {
    if (isOpenModal.forPatient) {
      return <UniformTable
        columns={patientColumn}
        commandBarItems={[]}
        integrateItems={patientApi.getList}
        searchByColumn={"fullName"}
        searchPlaceholder={"tên"}
      />
    } else {
      return (<>
          <div className="dropdown-department">
            <p>Chọn khoa: </p>
            <Select
              defaultValue=""
              style={{ width: 250 }}
              onChange={handleChange}
              options={[
                { value: '', label: 'Tất cả' },
                ...departmentList
              ]}
            />
          </div>
          <UniformTable
            columns={roomColumn}
            commandBarItems={[]}
            integrateItems={integrateItems}
            searchByColumn={"fullName"}
            searchPlaceholder={"tên"}
            sortable={true}
          />
        </>)
    }
  }

  const handleConfirmModal = () => {
    if (isOpenModal.forPatient) {
      setPatient(tableSelectedItem[0]);
    } else {
      setRoom(tableSelectedItem[0]);
    }
    setOpenModal({ open: false, forPatient: true });
  }
  
  return (
    <>
      <div className="request-schedule">
        <div className="title">Thông tin đặt lịch khám bệnh</div>
        <div className="request-schedule-content">
          <div className="request-schedule-date">
            <div className="request-schedule-date-title">Chọn ngày hẹn khám: </div>
            <DatePicker
              key={JSON.stringify(requestDate)}
              defaultValue={dayjs()}
              format={'DD/MM/YYYY'}
              disabledDate={disabledDate}
              onChange={(_, date) => {
                setRequestDate(new Date(Utils.convertDDmmyyyTommDDyyyy(date)));
              }}
            />
          </div>
          <div className="request-schedule-section">
            <div className="request-schedule-title">
              <div className="request-schedule-title-text">Bệnh nhân: </div>
              <div className="request-schedule-title-btn">
                <Button onClick={() => setOpenModal({ open: true, forPatient: true })}>
                  <span>{!!patient ? "Đổi bệnh nhân" : "Thêm bệnh nhân"}</span>
                </Button>
              </div>
            </div>
            <div className="request-schedule-content">
              {
                !!patient ? 
                <Descriptions bordered style={{ width: "100%" }}>
                  <Descriptions.Item label="Họ và tên" span={12}>
                    {patient?.lastName || "--"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Năm sinh">
                    {patient?.yearOfBirth || "--"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giới tính">
                    {Utils.getGenderText(patient?.gender)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tiền sử bệnh tật">
                    {patient?.medicalhistory || "--"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Dị ứng">
                    {patient?.allergies || "--"}
                  </Descriptions.Item>
                </Descriptions>
                : <Empty 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Chưa chọn bệnh nhân"
                />
              }
            </div>
          </div>
          {/*  */}
          <div className="request-schedule-section">
            <div className="request-schedule-title">
              <div className="request-schedule-title-text">Phòng khám: </div>
              <div className="request-schedule-title-btn">
                <Button onClick={() => setOpenModal({ open: true, forPatient: false })}>
                  <span>{!!room ? "Đổi phòng khám" : "Thêm phòng khám"}</span>
                </Button>
              </div>
            </div>
            <div className="request-schedule-content">
              {
                !!room ? 
                <Descriptions bordered style={{ width: "100%" }}>
                  <Descriptions.Item label="Tên phòng khám" span={12}>
                    {room?.name || "--"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Khoa">
                    {room?.departmentName || "--"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mô tả">
                    {room?.description || "--"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giá tiền">
                    {`${Utils.formatCurrency(room?.price)} vnđ` || "--"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Chi trả bảo hiểm">
                    {`${room?.healthInsurancePayments} %` || "--"}
                  </Descriptions.Item>
                </Descriptions>
                : <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Chưa chọn phòng khám"
                  />
              }
            </div>
          </div>
          <div className="request-schedule-section">
            <div className="request-schedule-title">
              <div className="request-schedule-title-text">Lý do: </div>
            </div>
            <div className="request-schedule-content">
              <TextArea 
                rows={4} 
                placeholder="Lý do hẹn lịch khám bệnh"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="footer">
          <Button type="primary" onClick={onSubmit}>
            <span>Hẹn lịch</span>
          </Button>
        </div>
      </div>
      <Modal
        title={isOpenModal.forPatient ? "Chỉ định bác sĩ" : "Chỉ định phòng khám"}
        footer={
          <Button 
            type="primary"
            disabled={tableSelectedCount === 0}
            onClick={handleConfirmModal}
          >
            <span>Xác nhận</span>
          </Button>
        }
        open={isOpenModal.open}
        onOk={() => {}}
        onCancel={() => setOpenModal({ open: false, forPatient: true })}
        width={900}
        maskClosable={false}
        className="request-schedule-modal"
      >
        {renderModelContent()}
      </Modal>
    </>  
  );
}

export default RequestSechedule;