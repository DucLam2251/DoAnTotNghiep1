import {
  Button,
  Col,
  Descriptions,
  Form,
  Modal,
  Row,
  UploadFile,
  UploadProps,
  message,
  Upload,
} from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";
import "./index.scss";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { RcFile, UploadChangeParam } from "antd/es/upload";
import BasicInfoForm from "./components/BasicInfo";
import { Utils } from "../../../utils";
import { authApi } from "../../../api";
// import { openLoading, showToastMessage, setInfoUser, closeLoading } from "../../../redux/reducers";
// import { toastType } from "../../model/enum/common";
import { getDoctorPositionText, getDoctorRankText } from "../../../utils/basicRender";
import { Role } from "../../model/enum/auth";


function Overview() {
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const [isOpen, setOpen] = useState<boolean>(false);
  const [closable, setClosable] = useState<boolean>(true);
  const [form] = Form.useForm();

  const { role, info, email } = useSelector((state: RootState) => state.auth);

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_APP_BASE_URL;
  const URL = `${apiUrl}filecontroller/Upload`
  useEffect(() => {
    if (info.avatar.length > 0){
      setImageUrl(info.avatar)
    }
    if (!info?.fullName) {
      setOpen(true);
      setClosable(false);
    } else {
      setClosable(true);
    }
  }, [info?.fullName, info?.avatar]);

  const getInfoAddress = () => {
    const list = [];
    if (info.address) list.push(info.address);
    list.push(info.commune, info.district, info.city);

    return list.join(", ");
  };

  const onCloseModel = () => {
    setOpen(false);
    form.resetFields();
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  //   const reader = new FileReader();
  //   reader.addEventListener("load", () => callback(reader.result as string));
  //   reader.readAsDataURL(img);
  // };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      // getBase64(info.file.originFileObj as RcFile, (url) => {        
      // });
      setLoading(false);
      setImageUrl(info.file.response.data); 
      callApiUpdateAvt(info.file.response.data);
    }
  };

  const callApiUpdateAvt = (value: string) => {
    const body = {
      "avatar": value
    }
    authApi
      .updateInfo(body)
      .then(() => {
        
      })
      .catch(() => {
        
      })
      .finally(() => {
        
      });
  };
  return (
    <>
      <div id="overview-wrapper">
        <Col className="personalInfo-container">
          <Row className="avatar-container">
            <Row className="left-container">
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action = {URL}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                headers={{ Authorization: `Bearer ${token}` }}                
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                ) : (
                  uploadButton
                )}
              </Upload>
              {/* <Avatar shape="square" size={132} src={info.avatar} /> */}

              <Descriptions style={{ flex: 1 }}>
                <Descriptions.Item label="Họ và tên" span={12}>
                  {info.fullName || "--"}
                </Descriptions.Item>
                <Descriptions.Item label="Giới tính">
                  {Utils.getGenderText(info.gender)}
                </Descriptions.Item>
                <Descriptions.Item label="Vai trò">
                  {Utils.renderAccountRole(role)}
                </Descriptions.Item>
              </Descriptions>
            </Row>
            <Button onClick={() => setOpen(true)}>Cập nhật</Button>
          </Row>
          <Col className="info-container">
            <Descriptions bordered title="Thông tin cá nhân">
              <Descriptions.Item label="Ngày sinh">
                {info.dateOfBirth || "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {info.phoneNumber || "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {email || "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={24}>
                {getInfoAddress() || "--"}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          {
            role === Role.Doctor && 
            <Col className="info-container">
            <Descriptions bordered title="Thông tin bác sĩ">
              <Descriptions.Item label="Khoa làm việc" span={12}>
                {info.doctorDTO?.departmentName || "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Chức vụ">
                {getDoctorPositionText(info.doctorDTO?.position) || "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Học vị">
                {getDoctorRankText(info.doctorDTO?.rank) || "--"}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          }

        </Col>
      </div>
      <Modal
        centered
        width={800}
        open={isOpen}
        onOk={onCloseModel}
        onCancel={onCloseModel}
        closable={closable}
        keyboard={false}
        maskClosable={false}
        footer={null}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Title level={4}>Cập nhật thông tin cá nhân</Title>
        </div>
        <div>
          <BasicInfoForm form={form} value={info} dismissForm={onCloseModel} />
        </div>
      </Modal>
    </>
  );
}

export default Overview;
