import { AxiosResponse } from "axios";
import { TestingInfoApi, departmentApi } from "../../../api";
import UniformTable from "../components/table";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { tooltipPlainText } from "../../../utils/basicRender";
import { ICommandBarItemProps, values } from "@fluentui/react";
import { closeLoading, openLoading, showToastMessage, tableRefresh } from "../../../redux/reducers";
import { Role } from "../../model/enum/auth";
import { useEffect, useState } from "react";
import { toastType } from "../../model/enum/common";
import { Button, Col, Drawer, Form, Input, InputNumber, Select } from "antd";
import "./index.scss"
type FieldType = {
  name?: string;
  description?: string;
  isActive?: boolean;
  price?: number;
  healthInsurancePayments?: number;
  departmentId?: string;
};

export const serviceColumn = [
  {
    key: "Name",
    name: "Tên phòng khám",
    minWidth: 80,
    maxWidth: 180,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.name)}</span>;
    },
  },
  {
    key: "departmentName",
    name: "Khoa",
    minWidth: 80,
    maxWidth: 180,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.departmentName)}</span>;
    },
  },
  {
    key: "description",
    name: "Mô tả",
    minWidth: 80,
    maxWidth: 180,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.description)}</span>;
    },
  },
  {
    key: "healthInsurancePayments",
    name: "Chi trả bảo hiểm",
    minWidth: 80,
    maxWidth: 180,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(`${item.healthInsurancePayments} %`)}</span>;
    },
  },
  {
    key: "Price",
    name: "Giá",
    minWidth: 80,
    maxWidth: 180,
    isResizable: true,
    onRender: (item: any) => {
      return <span>{tooltipPlainText(item.price.toLocaleString())}</span>;
    },
  }
];
function ManageSerivce() {
  const [departmentList, setDepartmentList] = useState<Selection[]>([]);
  const [departmentId, setDepartmentId] = useState<string>("");


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
      isExaminationService: false,
      departmentId: departmentId
    };
    return TestingInfoApi.getList(body);
  };
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isEdit, setEdit] = useState<boolean>(false);
  const { role } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onClosePanel = () => {
    form.resetFields();
    setOpen(false)
  }
  const onDelete = () => {
    dispatch(openLoading());   
    
    TestingInfoApi.delete(tableSelectedItem[0]?.id)
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
      // onClosePanel();
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

  const { tableSelectedCount, tableSelectedItem } = useSelector(
    (state: RootState) => state.currentSeleted
  );
  const commandBar = () => {
    const command: ICommandBarItemProps[] = [];
    if (role === Role.Administrator) {
      command.push({
        key: "newItem",
        text: "Thêm phòng dịch vụ",
        iconProps: { iconName: "Add" },
        onClick: () => { 
          setEdit(false); 
          setOpen(true);
          form.resetFields();
        },
      });
      if (tableSelectedCount > 0) {
        command.push({
          key: "updateItem",
          text: "Cập nhập thông tin",
          iconProps: { iconName: "Edit" },
          onClick: () => {
            setEdit(true); 
            setOpen(true);
            form.setFieldsValue({
              name: tableSelectedItem[0].name,
              description: tableSelectedItem[0].description,
              price: tableSelectedItem[0].price,
              healthInsurancePayments: tableSelectedItem[0].healthInsurancePayments,
              departmentId: tableSelectedItem[0].departmentId
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
  const onFinishFailed = (_: any) => {
    dispatch(
      showToastMessage({
        message: "Hãy điền các trường còn trống",
        type: toastType.error,
      })
    );
  };
  
  const onFinish = (values: any) => {
    values.isExaminationService = false;
    dispatch(openLoading());
    if(!isEdit)
    {
      TestingInfoApi.create(values)
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
      .finally(() => dispatch(closeLoading()))
    }
    else
    {
      const body = values;
      body.id = tableSelectedItem[0].id;
      TestingInfoApi.update(values)
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
      .finally(() => dispatch(closeLoading()))
    }
  }

  const renderPanel = () => {
    return (
      <Form
          id="department-form"
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
                label="Tên phòng khám"
                name="name"
                rules={[{ required: true }]}
              >
                <Input size="middle" />
              </Form.Item>
            </Col>
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
            <Col span={24} style={{ flex: 1 }}>
              <Form.Item<FieldType>
                label="Mô tả"
                name="description"
                rules={[{ required: !isEdit }]}
              >
                <Input.TextArea size="middle" />
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
              <Col span={18} style={{ flex: 1 }}>
                <Form.Item<FieldType>
                  label="Giá tiền"
                  name="price"
                  rules={[
                    { required: !isEdit },
                    {
                      type: 'number',
                      min : 0,
                      message: 'Giá trị phải chia hết cho 1000 và >=0',
                      transform: value => {
                        // Custom transform function to ensure the value is divisible by 1000
                        return Math.round(value / 1000) * 1000;
                      },
                    },
                  ]}
                >
                  <InputNumber 
                   style={{ width: '100%' }}
                   formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                   parser={(value) => value?.replace(/\$\s?|(,*)/g, '') || ''}
                  />
                </Form.Item>
              </Col>
              <Col span={5}>
                <span style={{ fontSize: 16 }}>VNĐ</span>
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
              <Col span={18} style={{ flex: 1 }}>
                <Form.Item<FieldType>
                  label="Chi trả bảo hiểm"
                  name="healthInsurancePayments"
                  rules={[
                    { required: !isEdit },
                    { 
                      type: 'number', min: 0, max: 100, message: 'Giá trị phải >= 0 và <= 100' 
                    },
                  ]}
                >
                  <InputNumber/>
                </Form.Item>
              </Col>
              <Col span={5}>
                <span style={{ fontSize: 16 }}>%</span>
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

  const handleChange = (value: string) => {
    setDepartmentId(value);
    dispatch(tableRefresh());
  }

  return (  
    <>
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
        columns={serviceColumn}
        commandBarItems={commandBar()}
        integrateItems={integrateItems}
        searchByColumn={"fullName"}
        searchPlaceholder={"tên"}
        sortable={true}
        tableContainerClassName="table-with-filter"
      />
      <Drawer
        title={isEdit ? "Cập nhật" : "Thêm khoa mới"}
        width={480}
        closable={false}
        destroyOnClose={true}
        onClose={onClosePanel}
        maskClosable={false}
        open={isOpen}
      >
        {renderPanel()}
      </Drawer>
    </>
  );
}

export default ManageSerivce;