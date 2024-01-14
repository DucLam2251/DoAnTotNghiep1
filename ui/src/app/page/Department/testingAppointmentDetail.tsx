import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Descriptions,
  Upload,
  Button,
  UploadProps,
  UploadFile,
  Input,
  Modal,
  Row,
  Card,
} from "antd";
import "./index.scss";
import { TestAppointmentApi } from "../../../api";
import {
  openLoading,
  showToastMessage,
  closeLoading,
  tableRefresh,
} from "../../../redux/reducers";
import { Utils } from "../../../utils";
import { toastType } from "../../model/enum/common";
import { PlusOutlined } from "@ant-design/icons";
import {
  getDoctorPositionText,
  getDoctorRankText,
  getStatusText,
} from "../../../utils/basicRender";
import { RootState } from "../../../redux";
import { Role } from "../../model/enum/auth";
import "./index.scss";
import { routerString } from "../../model/router";

const { TextArea } = Input;

type SubmitTestAppointmentRequestBody = {
  id: string;
  LinkImage?: string;
  ConcusionFromDoctor?: string;
};
const apiUrl = import.meta.env.VITE_APP_BASE_URL;
const URL = `${apiUrl}filecontroller/Upload`
const TestingAppointmentDetail = () => {
  const { id: param } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [value, setValue] = useState<any>({});
  const [concusionFromDoctor, setConcusionFromDoctor] = useState<string>("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { role } = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(openLoading());
    setFileList([]);
    TestAppointmentApi.getById(param)
      .then((result: any) => {
        if (result.success) {
          setValue(result.data);
          setConcusionFromDoctor(result.data.concusionFromDoctor);
          if (result.data.image) {
            const files = result.data.image.split(";").map((item: string) => {
              return Utils.convertToUploadFile(item);
            });
            setFileList(files);
          }
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

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.response?.data || file.url);
    setPreviewOpen(true);
    setPreviewTitle(file.name);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const saveDetail = () => {
    const body: SubmitTestAppointmentRequestBody = {
      id: value.id,
      LinkImage: fileList?.map((s) => s.response?.data || s.url).join(";"),
      ConcusionFromDoctor: concusionFromDoctor,
    };
    TestAppointmentApi.Submit(body)
      .then((result: any) => {
        if (result.success) {
          dispatch(
            showToastMessage({
              message: "Thành công!",
              type: toastType.succes,
            })
          );
          navigate(-1);
        } else {
          dispatch(
            showToastMessage({
              message: "Có lỗi, hãy thử lại",
              type: toastType.error,
            })
          );
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
      .finally(() => {
        dispatch(closeLoading());
      });
    dispatch(tableRefresh());
  };

  return (
    <div className="appointment-detail">
      <Descriptions
        title={value.testingInfo?.name}
        bordered
        style={{ width: "100%" }}
      >
        <Descriptions.Item label="Bác sĩ" span={12}>
          <div
            className="link-text"
            onClick={() => {
              navigate(`${routerString.doctordetail}/${value.doctordetailDTO.userId}`);
            }}
          >
            {value?.doctordetailDTO?.lastName || "--"}
          </div>
          {/* {value?.doctordetailDTO?.lastName || "--"} */}
        </Descriptions.Item>
        <Descriptions.Item label="Chức vụ">
          {getDoctorPositionText(
            value?.doctordetailDTO?.doctorInfor?.position
          ) || "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Học vị" span={12}>
          {getDoctorRankText(value?.doctordetailDTO?.doctorInfor?.rank) || "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Phòng khám" span={12}>
          {value.testingInfo?.description || "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái" span={12}>
          {getStatusText(value.status) || "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày khám" span={12}>
          {Utils.convertDateToString(value.dateCreate) || "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Ghi chú bác sĩ chỉ định" span={12}>
          {value?.description || "--"}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions
        title="Bệnh nhân"
        bordered
        style={{ width: "100%", marginTop: "10px" }}
      >
        <Descriptions.Item label="Họ và tên" span={12}>
          <div
            className="link-text"
            onClick={() => {
              navigate(
                `${routerString.patientdetailByAdmin}/${value.patientDetail.id}`
              );
            }}
          >
            {value?.patientDetail?.lastName || "--"}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Năm sinh">
          {value?.patientDetail?.yearOfBirth || "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Giới tính" span={12}>
          {`${Utils.getGenderText(value?.patientDetail?.gender)}` || "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Triệu chứng" span={12}>
          {value?.description || "--"}
        </Descriptions.Item>
      </Descriptions>
      <Row></Row>

      <Card
        title="Hình ảnh"
        bordered={false}
        style={{ width: "100%", marginTop: "10px", boxShadow: "none" }}
        headStyle={{ paddingLeft: 0, border: "none" }}
      >
        <Upload
          action= {URL}
          listType="picture-card"
          fileList={fileList}
          name="avatar"
          onPreview={handlePreview}
          onChange={handleChange}
          headers={{ Authorization: `Bearer ${token}` }}
        >
          {fileList.length >= 8 || role !== Role.Doctor ? null : uploadButton}
        </Upload>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Card>

      <Descriptions
        title="Kết luận"
        bordered
        style={{ width: "100%", marginTop: "10px" }}
      >
        {role === Role.Doctor ? (
          <Descriptions.Item style={{ padding: 0 }}>
            <TextArea
              rows={4}
              value={concusionFromDoctor}
              onChange={(e) => setConcusionFromDoctor(e.target.value)}
              style={{ height: 120, resize: "none" }}
            ></TextArea>
          </Descriptions.Item>
        ) : (
          <Descriptions.Item>{concusionFromDoctor}</Descriptions.Item>
        )}
      </Descriptions>
      {role === Role.Doctor ? (
        <Button
          type="primary"
          style={{ marginRight: "10px", marginTop: 10 }}
          onClick={() => saveDetail()}
        >
          Hoàn thành
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default TestingAppointmentDetail;
