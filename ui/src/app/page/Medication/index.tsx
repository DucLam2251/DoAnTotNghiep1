import { useEffect, useState } from "react";
import UniformTable from "../components/table";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { Button, Col, Drawer, Form, Input } from "antd";
import { ICommandBarItemProps } from "@fluentui/react";
import { Role } from "../../model/enum/auth";
import { medicineApi } from "../../../api";
import { closeLoading, openLoading, showToastMessage, tableRefresh } from "../../../redux/reducers";
import { toastType } from "../../model/enum/common";
import { tooltipPlainText } from "../../../utils/basicRender";

type FieldType = {
  title?: string;
  description?: string;
  healthInsurancePayments?: number;
  price?: number;
};

export const medicinesColumn = [
  {
    key: "Title",
    name: "Tên thuốc",
    minWidth: 120,
    maxWidth: 200,
    isResizable: true,
    onColumnClick: () => {

    },
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.title)}</span>;
    },
  },
  {
    key: "description",
    name: "Mô tả chi tiết",
    minWidth: 120,
    maxWidth: 250,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.description)}</span>;
    },
  },
  {
    key: "Price",
    name: "Đơn giá",
    minWidth: 100,
    maxWidth: 150,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(`${item.price.toLocaleString()} VNĐ`)} </span>;
    },
  },
  {
    key: "healthInsurancePayments",
    name: "BHYT chi trả",
    minWidth: 80,
    maxWidth: 100,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(`${item.healthInsurancePayments} %`)}</span>;
    },
  },
];

function Medications() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [values, setValues] = useState<any>({});

  const { role } = useSelector((state: RootState) => state.auth);

  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const { tableSelectedCount, tableSelectedItem } = useSelector(
    (state: RootState) => state.currentSeleted
  );
  
  const commandBar = () => {
    const command: ICommandBarItemProps[] = [];
    if (role === Role.Administrator) {
      command.push({
        key: "newItem",
        text: "Thêm mới thuốc",
        iconProps: { iconName: "Add" },
        onClick: () => { 
          setEdit(false); 
          setOpen(true);
          setValues({})
        },
      });
      if (tableSelectedCount > 0) {
        command.push({
          key: "editItem",
          text: "Cập nhật",
          iconProps: { iconName: "Edit" },
          onClick: () => { 
            setEdit(true); 
            setOpen(true);
            setValues({
              title: tableSelectedItem[0]?.title,
              description: tableSelectedItem[0]?.description,
              healthInsurancePayments: tableSelectedItem[0]?.healthInsurancePayments,
              price: tableSelectedItem[0]?.price
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
    }
    return command;
  };

  const onDelete = () => {
    dispatch(openLoading());
    medicineApi.delete(tableSelectedItem[0]?.id)
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
    })
    .finally(() => {
      dispatch(closeLoading());
    });
  }

  const onClosePanel = () => {
    setOpen(false)
  }

  const onFinishFailed = (_: any) => {
    dispatch(
      showToastMessage({
        message: "Hãy điền các trường còn trống",
        type: toastType.error,
      })
    );
  };

  const onFinish = (values: any) => {
    let api = medicineApi.create;
    let body;
    if (isEdit) {
      api = medicineApi.update;
      body = {
        ...values,
        id: tableSelectedItem[0]?.id
      }
    } else {
      body = values;
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
        } else {
          showToastMessage({
            message: "Có lỗi, hãy thử lại",
            type: toastType.error,
          })
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
      })
      .finally(() => {
        dispatch(closeLoading());
      });
  }

  const checkPrice = (_: any, value: any) => {
    if (value > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Giá tiền phải là số lớn hơn 0!'));
  }

  const checkPayments = (_: any, value: any) => {
    if (value >= 0 && value <= 100) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Tỉ lệ BHYT chi trả phải là số từ 0 đến 100'));
  }

  useEffect(() => {
    form.resetFields();
  }, [values])

  const renderPanel = () => {
    return (
      <Form
          id="medication-form"
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
                label="Tên thuốc"
                name="title"
                rules={[{ required: true }]}
              >
                <Input.TextArea size="middle" />
              </Form.Item>
            </Col>
            <Col span={24} style={{ flex: 1 }}>
              <Form.Item<FieldType>
                label="Mô tả chi tiết"
                name="description"
                rules={[{ required: true }]}
              >
                <Input.TextArea style={{ height: 120 }} />
              </Form.Item>
            </Col>
            <Col 
              span={24} 
              style={{ 
                  display: "flex", 
                  flex: 1, 
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center"
                }
              }>
                <Col span={18}>
                  <Form.Item<FieldType>
                    label="BHYT chi trả"
                    name="healthInsurancePayments"
                    rules={[{ required: true, validator: checkPayments }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <span style={{ fontSize: 16 }}>%</span>
                </Col>
              </Col>
            <Col 
              span={24} 
              style={{ 
                  display: "flex", 
                  flex: 1, 
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center"
                }
              }>
              <Col span={18}>
                <Form.Item<FieldType>
                  label="Giá tiền"
                  name="price"
                  rules={[{ required: true, validator: checkPrice }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={5}>
                <span style={{ fontSize: 16 }}>VNĐ</span>
              </Col>
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
        columns={medicinesColumn}
        commandBarItems={commandBar()}
        integrateItems={medicineApi.getList}
        searchByColumn={"fullName"}
        searchPlaceholder={"tên"}
        sortable={true}
      />
      <Drawer
        title={isEdit ? "Cập nhật" : "Thêm thuốc mới"}
        width={480}
        closable={false}
        destroyOnClose={true}
        onClose={onClosePanel}
        maskClosable={false}
        open={isOpen}
      >{renderPanel()}</Drawer>
    </>
  );
}

export default Medications;