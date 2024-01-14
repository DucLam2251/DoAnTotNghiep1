import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { closeLoading, openLoading, showToastMessage } from "../../../../redux/reducers";
import { toastType } from "../../../model/enum/common";
import { appointmentApi } from "../../../../api";
import { Descriptions } from "antd";
import { Utils } from "../../../../utils";
import "./index.scss"
import { routerString } from "../../../model/router";


// interface IHealthIndicator {
//   bloodPressureDiatolic?: any;
//   bloodPressureSystolic?: any;
//   temperature?: any;
//   heartRate?: any;
//   glucozo?: any;
// }

// const HealthIndicatorErrorDefault = {
//   bloodPressureDiatolic: "",
//   bloodPressureSystolic: "",
//   temperature: "",
//   heartRate: "",
//   glucozo: "",
// }

const WaitingDetail = () => {
  const { id: param } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [value, setValue] = useState<any>({});
  useEffect(() => {
    dispatch(openLoading());

    appointmentApi.getById(param)
      .then((result: any) => {
        if (result.success) {
          setValue(result.data);

        } else {
          dispatch(
            showToastMessage({
              message: "Có lỗi, hãy thử lại",
              type: toastType.error,
            })
          )
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
  }, [])


  return <div className="appointment-detail">
    <Descriptions title="Thông tin khám cơ bản" bordered style={{ width: "100%", margin: "10px 0" }} column={2}>
      <Descriptions.Item label="Khoa" span={12}>
        {value?.mainTestingInfo?.department?.name || "--"}
      </Descriptions.Item>
      <Descriptions.Item label="Khám" span={12}>
        {value?.mainTestingInfo?.name || "--"}
      </Descriptions.Item>
      <Descriptions.Item label="Phòng" span={12}>
        {value?.mainTestingInfo?.description || "--"}
      </Descriptions.Item>
      <Descriptions.Item label="Giá tiền">
        {value?.mainTestingInfo?.price || "--"}
      </Descriptions.Item>
      <Descriptions.Item label="Chi trả bảo hiểm y tế">
        {`${value?.mainTestingInfo?.healthInsurancePayments}%` || "--"}
      </Descriptions.Item>
    </Descriptions>
    <Descriptions title="Bệnh nhân" bordered style={{ width: "100%", margin: "10px 0" }}>
    <Descriptions.Item label="Họ và tên" span={12}>
          <div
            className="link-text"
            onClick={() => {
              navigate(
                `${routerString.patientdetailByAdmin}/${value.patient.id}`
              );
            }}
          >
            {value?.patient?.lastName || "--"}
          </div>
        </Descriptions.Item>
      <Descriptions.Item label="Năm sinh">
        {value?.patient?.yearOfBirth || "--"}
      </Descriptions.Item>
      <Descriptions.Item label="Giới tính" span={12}>
        {`${Utils.getGenderText(value?.patient?.gender)}` || "--"}
      </Descriptions.Item>
      <Descriptions.Item label="Bảo hiểm y tế" span={12}>
        {value?.patient?.healthinsurance || "--"}
      </Descriptions.Item>
      <Descriptions.Item label="Triệu chứng" span={12}>
        {value?.description || "--"}
      </Descriptions.Item>
    </Descriptions>

  </div>
}

export default WaitingDetail;