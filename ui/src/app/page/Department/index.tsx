import { useEffect, useState } from "react";
import { tooltipPlainText } from "../../../utils/basicRender";
import UniformTable from "../components/table";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { Button, Col, Drawer, Form, Input, Switch } from "antd";
import { ICommandBarItemProps } from "@fluentui/react";
import { Role } from "../../model/enum/auth";
import { departmentApi } from "../../../api";
import { closeLoading, openLoading, showToastMessage, tableRefresh } from "../../../redux/reducers";
import { toastType } from "../../model/enum/common";

type FieldType = {
  name?: string;
  isActive?: boolean;
};

function Department() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [values, setValues] = useState<any>({});

  const { role } = useSelector((state: RootState) => state.auth);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { tableSelectedCount, tableSelectedItem } = useSelector(
    (state: RootState) => state.currentSeleted
  );
  
  const Column = [
    {
      key: "name",
      name: "Tên khoa",
      minWidth: 120,
      maxWidth: 250,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.name)}</span>;
      },
    },
    {
      key: "isActive",
      name: "Trạng thái",
      minWidth: 80,
      maxWidth: 150,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.isActive ? "Đang hoạt động" : "Ngừng hoạt động")}</span>;
      },
    },
  ];

  const commandBar = () => {
    const command: ICommandBarItemProps[] = [];
    if (role === Role.Administrator) {
      command.push({
        key: "newItem",
        text: "Thêm khoa mới",
        iconProps: { iconName: "Add" },
        onClick: () => { 
          setEdit(false); 
          setOpen(true);
          setValues({})
        },
      });
      if (tableSelectedCount > 0) {
        //
        if (role === Role.Administrator){
          // command.push({
          //   key: "deleteItem",
          //   text: "Xóa",
          //   iconProps: { iconName: "RecycleBin" },
          //   onClick: onDelete,
          // });
          command.push({
            key: "updateItem",
            text: "Cập nhập thông tin",
            iconProps: { iconName: "Edit" },
            onClick: () => {
              setEdit(true); 
              setOpen(true);
              setValues({name: tableSelectedItem[0].name,
                isActive : tableSelectedItem[0].isActive
              })
            },
          });
        }
        
      }
    }
    return command;
  };

  // const onDelete = () => {
  //   dispatch(openLoading());
  //   departmentApi.delete(tableSelectedItem[0]?.id)
  //   .then((result: any) => {
  //     if (result.success) {
  //       dispatch(
  //         showToastMessage({
  //           message: "Thành công",
  //           type: toastType.succes,
  //         })
  //       );
  //     } else {
  //       showToastMessage({
  //         message: "Có lỗi, hãy thử lại",
  //         type: toastType.error,
  //       })
  //     }
  //     onClosePanel();
  //     dispatch(tableRefresh());
  //   })
  //   .catch(() => {
  //     dispatch(
  //       showToastMessage({
  //         message: "Có lỗi, hãy thử lại",
  //         type: toastType.error,
  //       })
  //     );
  //   })
  //   .finally(() => {
  //     dispatch(closeLoading());
  //   });
  // }

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
    dispatch(openLoading());
    if(!isEdit){
      departmentApi.create(values)
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
    }
    else{
      values.id = tableSelectedItem[0].id;
      departmentApi.update(values)
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
    }
 
    dispatch(closeLoading());
      
  }

  useEffect(() => {
    form.resetFields();
  }, [values])

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
                label="Tên khoa"
                name="name"
                rules={[{ required: true }]}
              >
                <Input.TextArea size="middle" />
              </Form.Item>
            </Col>
            <Col span={24} style={{ flex: 1 }}>
              <Form.Item<FieldType>
                label="Trạng thái"
                name="isActive"
                rules={[{ required: true }]}
              >
                <Switch checked={values?.isActive} />
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
        columns={Column}
        commandBarItems={commandBar()}
        integrateItems={departmentApi.getList}
        searchByColumn={""}
        searchPlaceholder={""}
      />
      <Drawer
        title={isEdit ? "Cập nhật" : "Thêm khoa mới"}
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

export default Department;