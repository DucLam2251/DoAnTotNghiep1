import { ICommandBarItemProps } from "@fluentui/react";
import { Utils } from "../../../utils";
import { getDoctorPositionText, getDoctorRankText, tooltipPlainText } from "../../../utils/basicRender";
import UniformTable from "../components/table";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { departmentApi, doctorApi } from "../../../api";
import { Button, Col, Drawer, Flex, Form, Input, Row, Select } from "antd";
import { closeLoading, openLoading, showToastMessage, tableRefresh } from "../../../redux/reducers";
import { genderList, toastType } from "../../model/enum/common";
import { PositionDoctorList, RankDoctorList } from "../../common/enum/common";
import "./index.scss"
import { useNavigate } from "react-router-dom";
import { routerString } from "../../model/router";

type FieldType = {
  "lastName"?: string,
  "gender"?: boolean,
  "rank"?: string,
  "position"?: string,
  "departmentId"?: string,
  "email"?: string,
};

interface ISelectOption {
  value: string;
  label: string;
}

function ManageDoctor() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [values, setValues] = useState<any>({});
  const [departmentList, setDepartmentList] = useState<ISelectOption[]>([]);
  const [departmentId, setDepartmentId] = useState<string>("");
  const [position, SetPosition] = useState<any>();
  const [rank, SetRank] = useState<any>();
  const { tableSelectedCount, tableSelectedItem } = useSelector(
    (state: RootState) => state.currentSeleted
  );
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const column = [
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
      maxWidth: 150,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{Utils.getGenderText(item.gender)}</span>;
      },
    },
    {
      key: "departmentName",
      name: "Khoa",
      minWidth: 80,
      maxWidth: 150,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.departmentName)}</span>;
      },
    },
    {
      key: "position",
      name: "Chức vụ",
      minWidth: 80,
      maxWidth: 150,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{getDoctorPositionText(item.position)}</span>;
      },
    },
    {
      key: "rank",
      name: "Học vị",
      minWidth: 80,
      maxWidth: 150,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{getDoctorRankText(item.rank)}</span>;
      },
    },
    {
      key: "email",
      name: "Email",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.email)}</span>;
      },
    },
  ];
  const onDelete = () => {
    dispatch(openLoading());
    doctorApi
    .delete(tableSelectedItem[0]?.userId)
    .then((result: any) => {
      if (result.success) {
        dispatch(
          showToastMessage({
            message: "Thành công",
            type: toastType.succes,
          })
        );
      } else {
        dispatch(
          showToastMessage({
            message: "Có lỗi, hãy thử lại",
            type: toastType.error,
          })
        )
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
  const commandBar = () => {
    const command: ICommandBarItemProps[] = [];
    command.push({
      key: "newItem",
      text: "Thêm mới bác sĩ",
      iconProps: { iconName: "Add" },
      onClick: () => {
        setEdit(false); 
        setOpen(true);
        setValues({});
      },
    });
    if (tableSelectedCount > 0) {
      command.push({
        key: "detail",
        text: "Thông tin chi tiết",
        iconProps: { iconName: "ComplianceAudit" },
        onClick: () => navigate(`${routerString.doctordetail}/${tableSelectedItem[0]?.userId}`),
      });
      command.push({
        key: "edit",
        text: "Cập nhật thông tin",
        iconProps: { iconName: "Edit" },
        onClick: () => {
          setEdit(true);
          setOpen(true);
          setValues({
            lastName: tableSelectedItem[0]?.lastName,
            gender: tableSelectedItem[0]?.gender,
            rank: tableSelectedItem[0]?.rank,
            position: tableSelectedItem[0]?.position,
            departmentId: tableSelectedItem[0]?.departmentId,
            email: tableSelectedItem[0]?.email,
          })
        },
      });
      command.push({
        key: "deleteItem",
        text: "Xóa",
        iconProps: { iconName: "RecycleBin" },
        onClick: onDelete,
      });
    }
    return command;
  };

  const integrateItems = (reqbody: any): Promise<AxiosResponse<any, any>> => {
    const body = {
      ...reqbody,
      departmentId: departmentId,
      position: position,
      rank: rank
    };
    return doctorApi.getList(body);
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

  const onClosePanel = () => {
    setOpen(false)
  }

  useEffect(() => {
    form.resetFields();
  }, [values])

  const onFinishFailed = (_: any) => {
    dispatch(
      showToastMessage({
        message: "Hãy điền các trường còn trống",
        type: toastType.error,
      })
    );
  };

  const onFinish = (values: any) => {
    let api = doctorApi.create;
    let body;
    if (isEdit) {
      api = doctorApi.update;
      body = {
        id: tableSelectedItem[0]?.userId,
        rank: values.rank,
        position: values.position,
        departmentId: values.departmentId
      }
    } else {
      body = {
        ...values,
        password: "1234567",
        confirmPassword: "1234567",
        avatar: "",
        firstName: "",
        phoneNumber: "",
        dateOfBirth: new Date,
        address: "",
      }
    }
    dispatch(openLoading());
    api(body)
      .then((result: any) => {
        if (result.success) {
          dispatch(
            showToastMessage({
              message: "Thành công",
              type: toastType.succes,
            })
          );
          onClosePanel();
          dispatch(tableRefresh());
        } else {
          dispatch(
          showToastMessage({
            message: "Có lỗi, hãy thử lại",
            type: toastType.error,
          }))
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
  }

  const renderPanel = () => {
    return (
      <Form
          id="doctor-form"
          form={form}
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          layout={"vertical"}
          style={{ maxWidth: 800 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          validateMessages={{
            required: 'Hãy nhập ${label}!',
            types: {
              number: '${label} phải là số!',
            }
          }}
          initialValues={values}
        >
          <div>
            <Col span={24} style={{ flex: 1 }}>
              <Form.Item<FieldType>
                label="Họ và tên"
                name="lastName"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập họ và tên" disabled={isEdit}/>
              </Form.Item>
            </Col>
            <Row style={{ gap: "40px" }}>
              <Col span={12} style={{ flex: 1 }}>
                <Form.Item<FieldType>
                  label="Giới tính"
                  name="gender"
                  rules={[{ required: true, message: "Hãy chọn giới tính!" }]}
                >
                  <Select
                    options={genderList}
                    placeholder="Chọn giới tính"
                    disabled={isEdit}
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={12} style={{ flex: 1 }}>
                <Form.Item<FieldType>
                  label="Email"
                  name="email"
                  rules={[{ type: "email", required: true }]}
                >
                  <Input placeholder="Nhập email" disabled={isEdit} />
                </Form.Item>
              </Col>
            </Row>
              <Row style={{ gap: "40px" }}>
              <Col span={12} style={{ flex: 1 }}>
                <Form.Item<FieldType>
                  label="Học vị"
                  name="rank"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Chọn học vị"
                    options={RankDoctorList}
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={12} style={{ flex: 1 }}>
                  <Form.Item<FieldType>
                    label="Chức vụ"
                    name="position"
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="Chọn chức vụ"
                      options={PositionDoctorList}
                    ></Select>
                  </Form.Item>
              </Col>
            </Row>
            <Col span={18} style={{ flex: 1 }}>
              <Form.Item<FieldType>
                label="Khoa"
                name="departmentId"
                rules={[{ required: true, message: "Hãy chọn khoa!" }]}
              >
                <Select
                  placeholder="Chọn khoa"
                  options={departmentList}
                ></Select>
              </Form.Item>
            </Col>
          </div>
          <div>
            <Form.Item className="button">
              <Button onClick={onClosePanel}>Hủy</Button>
              <Button htmlType="submit" type="primary" style={{ marginLeft: 12 }}>
                {!isEdit ? "Thêm" : "Cập nhật"}
              </Button>
            </Form.Item>
          </div>
      </Form>
    )
  }
  const handleChange = (value: string) => {
    setDepartmentId(value);
    dispatch(tableRefresh());
  }
  const handleChangePosition = (value: any) => {
    SetPosition(value);
    dispatch(tableRefresh());
  }
  const handleChangeRank = (value: any) => {
    SetRank(value);
    dispatch(tableRefresh());
  }
  return (  
    <>
      <Flex>
      <div className="dropdown-department">
          <p>Khoa: </p>
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
        <div className="dropdown-department">
          <p>Chức vụ: </p>
          <Select
            defaultValue=""
            style={{ width: 250 }}
            onChange={handleChangePosition}
            options={[
              { value: '', label: 'Tất cả' },
              ...PositionDoctorList
            ]}
          />
        </div>
        <div className="dropdown-department">
          <p>Học vị: </p>
          <Select
            defaultValue=""
            style={{ width: 250 }}
            onChange={handleChangeRank}
            options={[
              { value: '', label: 'Tất cả' },
              ...RankDoctorList
            ]}
          />
        </div>
      </Flex>
      <UniformTable
        columns={column}
        commandBarItems={commandBar()}
        integrateItems={integrateItems}
        searchByColumn={"fullName"}
        searchPlaceholder={"tên"}
      />
      <Drawer
        title={isEdit ? "Cập nhật" : "Thêm bác sĩ mới"}
        width={520}
        closable={false}
        destroyOnClose={true}
        onClose={onClosePanel}
        maskClosable={false}
        open={isOpen}
      >{renderPanel()}</Drawer>
    </>
  );
}

export default ManageDoctor;