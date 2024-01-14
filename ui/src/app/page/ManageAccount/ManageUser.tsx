import { ICommandBarItemProps } from "@fluentui/react";
import { authApi } from "../../../api";
import { closeLoading, openLoading, showToastMessage, tableRefresh } from "../../../redux/reducers";
import { Utils } from "../../../utils";
import { tooltipPlainText } from "../../../utils/basicRender";
import { Role } from "../../model/enum/auth";
// import { routerString } from "../../model/router";
import UniformTable from "../components/table";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { toastType } from "../../model/enum/common";

function ManageUser() {
  const { role } = useSelector((state: RootState) => state.auth);
  const { tableSelectedCount, tableSelectedItem } = useSelector(
    (state: RootState) => state.currentSeleted
  );
  const dispatch = useDispatch();
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
      maxWidth: 100,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{Utils.getGenderText(item.gender)}</span>;
      },
    },
    {
      key: "dateOfBirth",
      name: "Ngày sinh",
      minWidth: 80,
      maxWidth: 110,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{Utils.convertDateToString(item.dateOfBirth)}</span>;
      },
    },
    {
      key: "phoneNumber",
      name: "Giới tính",
      minWidth: 80,
      maxWidth: 150,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.phoneNumber)}</span>;
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
    {
      key: "address",
      name: "Địa chỉ",
      minWidth: 80,
      maxWidth: 150,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.address)}</span>;
      },
    },
  ];

  const onDelete = () => {
    dispatch(openLoading());
    authApi.delete(tableSelectedItem[0]?.id)
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
    if (role === Role.Administrator) {
      if (tableSelectedCount > 0) {
        //
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
  return (  
    <>
      <UniformTable
        columns={column}
        commandBarItems={commandBar()}
        integrateItems={authApi.getList}
        searchByColumn={""}
        searchPlaceholder={"tên"}
      />
    </>
  );
}

export default ManageUser;


