import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  closeLoading,
  openLoading,
  showToastMessage,
} from "../../../redux/reducers";
import { doctorApi, patientApi } from "../../../api";
import { toastType } from "../../model/enum/common";
import { Descriptions, Table } from "antd";
import { Utils } from "../../../utils";
import "./index.scss";
import {
  getDoctorPositionText,
  getDoctorRankText,
  getStatusText,
} from "../../../utils/basicRender";
import { ColumnsType } from "antd/es/table";
import { routerString } from "../../model/router";

interface IPropDetailAccount {
  type: "Doctor" | "Patient" | "User";
}

function DetailAccount({ ...props }: IPropDetailAccount) {
  const { id: param } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [value, setValue] = useState<any>({});

  useEffect(() => {
    dispatch(openLoading());
    let api;
    switch (props.type) {
      case "Doctor":
        api = doctorApi.getById(param);
        break;
      case "Patient":
        api = patientApi.getById(param);
        break;
      case "User":
        break;
    }
    api!
      .then((result: any) => {
        if (result.success) {
          setValue(result.data);
        } else {
          dispatch(
            showToastMessage({
              message: "Có lỗi, hãy thử lại",
              type: toastType.error,
            })
          );
          navigate(-1);
        }
      })
      .catch(() => {
        dispatch(
          showToastMessage({
            message: "Có lỗi, hãy thử lại",
            type: toastType.error,
          })
        );
        navigate(-1);
      })
      .finally(() => {
        dispatch(closeLoading());
      });
  }, []);

  const renderDoctorContent = (): JSX.Element => {
    return (
      <>
        {value.avatar && (
          <div>
            <Descriptions bordered title="Ảnh đại diện">
              <div>
              <img src={value.avatar} alt="avatar" style={{ width: "20%" }} />
              </div>
            </Descriptions>
          </div>
        )}
        <Descriptions bordered title="Thông tin cá nhân">
          <Descriptions.Item label="Họ và tên">
            {value.lastName || "--"}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {Utils.getGenderText(value.gender)}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">Bác sĩ</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {value.phoneNumber || "--"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {Utils.convertDateToString(value.dateOfBirth)}
          </Descriptions.Item>
          <Descriptions.Item span={12} label="Địa chỉ">
            {value.address || "--"}
          </Descriptions.Item>
        </Descriptions>
        <div style={{ marginTop: "10px" }}>
          <Descriptions bordered title="Thông tin bác sĩ">
            <Descriptions.Item label="Khoa">
              {value?.doctorInfor?.departmentName || "--"}
            </Descriptions.Item>
            <Descriptions.Item label="Chức vụ">
              {getDoctorPositionText(value?.doctorInfor?.position)}
            </Descriptions.Item>
            <Descriptions.Item label="Học vị">
              {getDoctorRankText(value?.doctorInfor?.rank)}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </>
    );
  };

  interface DataType {
    key?: string;
    nameOfMainTestingInfo?: string;
    nameDepartment?: string;
    apointmentDate?: string;
    status?: number;
    description?: string;
    paymentTotal?: number;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Khám",
      dataIndex: "nameOfMainTestingInfo",
      render: (text, record) => (
        <div
          className="name-column"
          onClick={() => {
            navigate(`${routerString.appointmentDetail}/${record.key}`);
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Khoa",
      dataIndex: "nameDepartment",
    },
    {
      title: "Ngày khám",
      dataIndex: "apointmentDate",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (info) => getStatusText(info),
    },
    {
      title: "Triệu chứng",
      dataIndex: "description",
    },
    {
      title: "Đơn giá",
      dataIndex: "paymentTotal",
    },
  ];

  const getData = () => {
    const result: DataType[] = [];
    if (value.appointmentListDTOs?.length > 0) {
      value.appointmentListDTOs.forEach((appt: any) => {
        result.push({
          key: appt.id,
          nameOfMainTestingInfo: appt.nameOfMainTestingInfo,
          nameDepartment: appt?.nameDepartment || "--",
          apointmentDate: Utils.convertDateToString(appt.apointmentDate),
          status: appt.status,
          description: appt?.description || "--",
          paymentTotal: appt?.paymentTotal || "--",
        });
      });
    }
    return result;
  };

  const renderPatientContent = (): JSX.Element => {
    return (
      <div>
        <Descriptions
          title="Thông tin cá nhân"
          bordered
          style={{ width: "100%", margin: "10px 0" }}
        >
          <Descriptions.Item label="Họ và tên" span={12}>
            {value?.lastName || "--"}
          </Descriptions.Item>
          <Descriptions.Item label="Năm sinh">
            {value?.yearOfBirth || "--"}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính" span={12}>
            {`${Utils.getGenderText(value?.gender)}` || "--"}
          </Descriptions.Item>
          <Descriptions.Item label="Bảo hiểm y tế" span={12}>
            {value?.healthinsurance || "--"}
          </Descriptions.Item>
          <Descriptions.Item label="Chiều cao" span={12}>
            {`${value?.height} cm` || "--"}
          </Descriptions.Item>
          <Descriptions.Item label="Cân nặng" span={12}>
            {`${value?.weight} kg` || "--"}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          title="Người quản lý"
          bordered
          style={{ width: "100%", margin: "10px 0" }}
        >
          <Descriptions.Item label="Họ và tên" span={12}>
            {value?.userManager?.lastName || "--"}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại" span={12}>
            {value?.userManager?.phoneNumber || "--"}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={12}>
            {value?.userManager?.email || "--"}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          title="Thông tin khám bệnh"
          bordered
          style={{ width: "100%", margin: "10px 0" }}
        >
          <Descriptions.Item>
            <Table columns={columns} dataSource={getData()} bordered />
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  };

  return (
    <div className="detail-account-wrapper">
      {props.type === "Doctor" ? renderDoctorContent() : renderPatientContent()}
    </div>
  );
}

export default DetailAccount;
