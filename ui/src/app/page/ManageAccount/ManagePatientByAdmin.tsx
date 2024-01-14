import { ICommandBarItemProps } from "@fluentui/react";
import {  patientApi } from "../../../api";
import { closeLoading, openLoading, showToastMessage, tableRefresh } from "../../../redux/reducers";
import { Utils } from "../../../utils";
import { tooltipPlainText } from "../../../utils/basicRender";
import { Role } from "../../model/enum/auth";
import { routerString } from "../../model/router";
import UniformTable from "../components/table";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { toastType } from "../../model/enum/common";
import { useNavigate } from "react-router-dom";

function managePatientByAdmin() {
  const { role } = useSelector((state: RootState) => state.auth);
  const { tableSelectedCount, tableSelectedItem } = useSelector(
    (state: RootState) => state.currentSeleted
  );
  const navigate = useNavigate();
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
      maxWidth: 80,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{Utils.getGenderText(item.gender)}</span>;
      },
    },
    {
      key: "dateOfBirth",
      name: "Năm sinh",
      minWidth: 80,
      maxWidth: 80,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{item.yearOfBirth}</span>;
      },
    },
    {
      key: "Managename",
      name: "Tên người quản lý",
      minWidth: 80,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.nameManage)}</span>;
      },
    },
    {
      key: "PhoneNumber",
      name: "Số điện thoại người quản lý",
      minWidth: 80,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.phoneNumber)}</span>;
      },
    },
    {
      key: "Email",
      name: "Email người quản lý",
      minWidth: 80,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => {
        return <span>{tooltipPlainText(item.email)}</span>;
      },
    },
  ];

  const onDelete = () => {
    dispatch(openLoading());
    patientApi.delete(tableSelectedItem[0]?.id)
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
    if (role === Role.Administrator || role === Role.Doctor) {
      if (tableSelectedCount > 0) {
        if(role === Role.Administrator){
          command.push({
            key: "deleteItem",
            text: "Xóa",
            iconProps: { iconName: "RecycleBin" },
            onClick: onDelete,
          });
        }
        command.push({
          key: "detail",
          text: "Thông tin chi tiết",
          iconProps: { iconName: "ComplianceAudit" },
          onClick: () => navigate(`${routerString.patientdetailByAdmin}/${tableSelectedItem[0]?.id}`),
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
        integrateItems={patientApi.getlistByadmin}
        searchByColumn={""}
        searchPlaceholder={"tên"}
      />
    </>
  );
}

export default managePatientByAdmin;


