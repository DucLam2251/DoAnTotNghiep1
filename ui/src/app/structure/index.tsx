import { useEffect, useState } from "react";
import Avatar from "antd/es/avatar";
import UniformBreadcrumb from "./Breadcrumb";
import { LoadingDot, LoadingInComing } from "./Loading";
import Sidebar from "./Sidebar";
import "./index.scss";
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { routerString } from "../model/router";
import {
  Button,
  Col,
  Form,
  Input,
  Dropdown,
  Modal,
} from "antd";
import React from "react";
import { Toast } from "./Toast";
import { RootState } from "../../redux";
import {  values } from "@fluentui/react";
import {
  MdLogout,
  MdOutlineChangeCircle,
} from "react-icons/md";
import {
  closeLoading,
  openLoading,
  setEmail,
  setInfoUser,
  setRole,
  showToastMessage,
  tableRefresh,
  userLogout,
} from "../../redux/reducers";
import { authApi } from "../../api";
import { toastType } from "../model/enum/common";
import { Role } from "../model/enum/auth";

interface IUniformLayoutProps {
  page: JSX.Element;
  permission?: any;
  noBackground?: any;
}

function UniformLayout({ ...props }: IUniformLayoutProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { email, role } = useSelector((state: RootState) => state.auth);
  const { isLoading } = useSelector((state: RootState) => state.loading);
  const { isShow } = useSelector((state: RootState) => state.toast);

  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setOpenChange] = useState<boolean>(false);
  const {info} = useSelector((state: RootState) => state.auth)

  type FieldType = {
    CurrentPass?: string;
    Password?: string;
    ConfirmPassword?: string;
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      localStorage.clear();
      navigate(`${routerString.login}`);
    } else {
      const auth = authApi.getCheckCurrentUser();
      const user = authApi.getInfoCurrentUser();

      Promise.all([auth, user])
        .then((result: any) => {
          dispatch(setEmail(result[0].data?.email));
          dispatch(setRole(result[0].data?.role));
          const info = result[1].data;
          const addressArr: any[] = (info?.address || "").split(",");
          const city = addressArr.pop();
          let district, commune, address;
          if (addressArr.length) {
            district = addressArr.pop();
          }
          if (addressArr.length) {
            commune = addressArr.pop();
          }
          if (addressArr.length) {
            address = addressArr.pop();
          }
          dispatch(
            setInfoUser({
              ...info,
              fullName: info?.lastName,
              city,
              district,
              commune,
              address,
              dateOfBirth: info?.dateOfBirth
                ? new Date(info?.dateOfBirth).toLocaleDateString()
                : "",
              email,
              avatar: info?.avatar || "",
            })
          );
        })
        .catch(() => {
          localStorage.clear();
          navigate(`${routerString.Forbidden}`);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const logOut = () => {
    dispatch(userLogout());
    navigate(`${routerString.login}`);
    localStorage.clear();
  };

  const changePasswork = () => {
    setOpenChange(true);
  };

  const renderContent = () => {
    const { page, permission, noBackground } = props;
    const items = [
      {
        key: "accountinformation",
        label: (
          <Link to={routerString.home}>
            {" "}
            <UserOutlined /> &nbsp; Thông tin cá nhân
          </Link>
        ),
      },
      {
        key: "changepassword",
        label: (
          <div
            style={{ display: "flex", alignItems: "center" }}
            onClick={changePasswork}
          >
            <MdOutlineChangeCircle /> &ensp; Đổi mật khẩu
          </div>
        ),
      },
      {
        key: "accountlogout",
        label: (
          <div
            style={{ display: "flex", alignItems: "center" }}
            onClick={logOut}
          >
            <MdLogout /> &ensp; Đăng xuất
          </div>
        ),
      },
    ];

    if (permission && permission.includes(role!)) {
      return <Navigate to={`${routerString.login}`} replace />;
    }

    const styleMainWrapper = {
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    };

    let roleDisplay: any = role!;
    if (role === Role.Patient) {
      roleDisplay = "User";
    }

    return (
      <div className="content">
        <div className="main-header">
          <UniformBreadcrumb />
          <div style={{ paddingRight: "24px" }}>
            <Dropdown menu={{ items }} placement="bottomLeft" arrow>
              <Avatar
                shape="square"
                style={{
                  backgroundColor: `#002244`,
                  verticalAlign: "middle",
                  cursor: "pointer",
                  marginTop: "8px",
                }}
                size="large"
                src={<img src={info?.avatar} alt="avatar"/>} 
              >
                {roleDisplay! || "AD"}
              </Avatar>
            </Dropdown>
          </div>
        </div>
        <div className="layout-wrapper">
          <div
            className="main-wrapper"
            style={noBackground ? {} : styleMainWrapper}
          >
            {page}
          </div>
        </div>
      </div>
    );
  };

  const handleCancel = () => {
    setOpenChange(false);
    form.resetFields();
  };

  const onFinish = (values: any) => {
    values.Email = email;
    dispatch(openLoading());
    authApi
      .changepassword(values)
      .then((result: any) => {
        if (result.success) {
          dispatch(
            showToastMessage({
              message: "Thành công",
              type: toastType.succes,
            })
          );
          form.resetFields();
        } else {
          showToastMessage({
            message: "Có lỗi, hãy thử lại",
            type: toastType.error,
          });
        }
        onClosePanel();
        dispatch(tableRefresh());
      })
      .catch(() => {
        dispatch(
          showToastMessage({
            message: "Có lỗi, hãy thử lại",
            type: toastType.error,
          })
        );
        dispatch(closeLoading());
      })
      .finally(() => {
        handleCancel();
        dispatch(
          showToastMessage({
            message: "Thành công",
            type: toastType.succes,
          })
        );
        dispatch(closeLoading());
      });
  };

  const renderPopupChangePw = () => {
    return (
      <Modal
        title="Đội mật khẩu"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[]}
      >
        <Form
          id="department-form"
          form={form}
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          layout={"vertical"}
          style={{ maxWidth: 800 }}
          onFinish={onFinish}
          autoComplete="off"
          validateMessages={{
            required: "Hãy nhập ${label}!",
            types: {
              number: "${label} phải là số!",
            },
          }}
          initialValues={values}
        >
          <div>
            <Col span={24} style={{ flex: 1 }}>
              <Form.Item<FieldType>
                label="Mật khẩu cũ"
                name="CurrentPass"
                rules={[{ required: true }]}
              >
                <Input.Password
                  size="middle"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
            </Col>
            <Col span={24} style={{ flex: 1 }}>
              <Form.Item<FieldType>
                label="Mật khẩu mới"
                name="Password"
                rules={[{ required: true }]}
              >
                <Input.Password
                  size="middle"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
            </Col>
            <Col span={24} style={{ flex: 1 }}>
              <Form.Item<FieldType>
                label="Nhập lại mật Khẩu"
                name="ConfirmPassword"
                rules={[{ required: true }]}
              >
                <Input.Password
                  size="middle"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
            </Col>
          </div>
          <div>
            <Form.Item className="button">
              <Button htmlType="submit">Xác nhận</Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    );
  };

  const onClosePanel = () => {
    form.resetFields();
  };
  if (loading) {
    return <LoadingInComing />;
  } else {
    return (
      <div id="main" key={email}>
        {isLoading ? <LoadingDot /> : <React.Fragment />}
        <Sidebar />
        {renderContent()}
        {renderPopupChangePw()}
        {isShow && <Toast />}
      </div>
    );
  }
}

export default UniformLayout;
