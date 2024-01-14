import { AxiosResponse } from "axios";
import UniformTable from "../components/table";
import { patientApi } from "../../../api";
import { tooltipPlainText } from "../../../utils/basicRender";
import { Utils } from "../../../utils";
import { RootState } from "../../../redux";
import { useDispatch, useSelector } from "react-redux";
import { ICommandBarItemProps } from "@fluentui/react";
import { useEffect, useState } from "react";
import { closeLoading, openLoading, showToastMessage, tableRefresh } from "../../../redux/reducers";
import { genderList, toastType } from "../../model/enum/common";
import { Button, Col, Drawer, Form, Input, Row, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { routerString } from "../../model/router";

type FieldType = {
  lastName?: string,
  allergies?: string,
  medicalhistory?: string,
  healthinsurance?: string,
  height?: number,
  weight?: number,
  yearOfBirth?: number,
  gender?: boolean,
};

export const patientColumn = [
  {
    key: "name",
    name: "Họ và tên",
    minWidth: 150,
    maxWidth: 200,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.lastName)}</span>;
    },
  },
  {
    key: "gender",
    name: "Giới tính",
    minWidth: 80,
    maxWidth: 100,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{Utils.getGenderText(item.gender)}</span>;
    },
  },
  {
    key: "yearOfBirth",
    name: "Năm sinh",
    minWidth: 60,
    maxWidth: 100,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.yearOfBirth)}</span>;
    },
  },
  {
    key: "healthinsurance",
    name: "Bảo hiểm y tế",
    minWidth: 100,
    maxWidth: 150,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.healthinsurance)}</span>;
    },
  },
  {
    key: "medicalhistory",
    name: "Tiền sử bệnh tật",
    minWidth: 120,
    maxWidth: 180,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.medicalhistory)}</span>;
    },
  },
  {
    key: "allergies",
    name: "Dị ứng",
    minWidth: 120,
    maxWidth: 180,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.allergies)}</span>;
    },
  },
  {
    key: "height",
    name: "Chiều cao",
    minWidth: 60,
    maxWidth: 100,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(`${item.height}`)}</span>;
    },
  },
  {
    key: "weight",
    name: "Cân nặng",
    minWidth: 60,
    maxWidth: 100,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(`${item.weight}`)}</span>;
    },
  },
];

function ManagePatient() {

  const { tableSelectedCount, tableSelectedItem } = useSelector(
    (state: RootState) => state.currentSeleted
  );

  const [isOpen, setOpen] = useState<boolean>(false);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [values, setValues] = useState<any>({});

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onDelete = () => {
    dispatch(openLoading());
    patientApi
    .delete(tableSelectedItem[0]?.id)
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
      text: "Thêm mới bệnh nhân",
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
        onClick: () => navigate(`${routerString.patientdetail}/${tableSelectedItem[0]?.id}`),
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
            yearOfBirth: tableSelectedItem[0]?.yearOfBirth,
            weight: tableSelectedItem[0]?.weight,
            height: tableSelectedItem[0]?.height,
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
    };
    return patientApi.getList(body);
  };

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
    let api = patientApi.create;
    let body = {
      ...values
    };
    if (isEdit) {
      api = patientApi.update;
      body = {
        ...values,
        id: tableSelectedItem[0]?.id
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

  const checkValidateInput = (key: string) => (_: any, value: any) => {
    let verify: boolean = false;
    let label: string = "";
    switch(key) {
      case "yearOfBirth":
        verify = new RegExp("^(19\\d{2}|20\\d{2})$").test(value);
        label = "Năm sinh";
        break;
      case "height":
        verify = !!Number(value);
        label = "Chiều cao";
        break;
      case "weight":
        verify = !!Number(value);
        label = "Cân nặng";
        break;
      case "healthinsurance":
        if(value)
        {
          verify = new RegExp("^\\d{10}$").test(value);
          label = "Số bảo hiểm y tế";
        }
        else{
          verify = true
        }
        break;
    }
    if (verify) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(`${label} không hợp lệ!`));
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
                <Input placeholder="Nhập họ và tên"/>
              </Form.Item>
            </Col>
            <Row style={{ gap: "40px" }}>
              <Col span={12} style={{ flex: 1 }}>
                <Form.Item<FieldType>
                  label="Giới tính"
                  name="gender"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={genderList}
                    placeholder="Chọn giới tính"
                  
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={12} style={{ flex: 1 }}>
                <Form.Item<FieldType>
                  label="Năm sinh"
                  name="yearOfBirth"
                  rules={[{ validator: checkValidateInput("yearOfBirth"), required: true }]}
                >
                  <Input placeholder="Nhập cân nặng" />
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ gap: "40px" }}>
              <Col 
                span={12} 
                style={{ 
                    display: "flex", 
                    flex: 1, 
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }
                }>
                <Col span={18} style={{ flex: 1 }}>
                  <Form.Item<FieldType>
                    label="Chiều cao"
                    name="height"
                    rules={[{ validator: checkValidateInput("height"), required: true }]}
                  >
                    <Input placeholder="Nhập chiều cao" />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <span style={{ fontSize: 16 }}>cm</span>
                </Col>
              </Col>
              <Col 
                span={12} 
                style={{ 
                    display: "flex", 
                    flex: 1, 
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }
                }>
                <Col span={18} style={{ flex: 1 }}>
                  <Form.Item<FieldType>
                    label="Cân nặng"
                    name="weight"
                    rules={[{ validator: checkValidateInput("weight"), required: true }]}
                  >
                    <Input placeholder="Nhập cân nặng" />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <span style={{ fontSize: 16 }}>kg</span>
                </Col>
              </Col>
            </Row>
              <Col span={24} style={{ flex: 1 }}>
                <Form.Item<FieldType>
                  label="Bảo hiểm y tế"
                  name="healthinsurance"
                  rules={[{ validator: checkValidateInput("healthinsurance") }]}
                >
                  <Input placeholder="Nhập số bảo hiểm y tế"/>
                </Form.Item>
              </Col>
              <Col span={24} style={{ flex: 1 }}>
                <Form.Item<FieldType>
                  label="Tiền sử bệnh"
                  name="medicalhistory"
                  rules={[{ required: false }]}
                >
                  <Input.TextArea style={{ height: 120 }} />
                </Form.Item>
              </Col>
              <Col span={24} style={{ flex: 1 }}>
                <Form.Item<FieldType>
                  label="Dị ứng"
                  name="allergies"
                  rules={[{ required: false }]}
                >
                  <Input.TextArea style={{ height: 120 }} />
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

  return (
    <>
      <UniformTable
        columns={patientColumn}
        commandBarItems={commandBar()}
        integrateItems={integrateItems}
        searchByColumn={"fullName"}
        searchPlaceholder={"tên"}
      />
      <Drawer
          title={isEdit ? "Cập nhật" : "Thêm bênh nhân mới"}
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

export default ManagePatient;