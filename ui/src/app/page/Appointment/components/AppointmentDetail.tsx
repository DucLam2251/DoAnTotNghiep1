import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  closeLoading,
  openLoading,
  showToastMessage,
  tableRefresh,
} from "../../../../redux/reducers";
import { toastType } from "../../../model/enum/common";
import UniformTable from "../../components/table";
import {
  TestingInfoApi,
  appointmentApi,
  departmentApi,
  medicineApi,
} from "../../../../api";
import { Button, Descriptions, Input, Modal, Select } from "antd";
import { Utils } from "../../../../utils";
import "./index.scss";
import { RootState } from "../../../../redux";
import { Role } from "../../../model/enum/auth";
import TextArea from "antd/es/input/TextArea";
import { EnumStatus } from "../../../common/enum/common";
import { medicinesColumn } from "../../Medication";
import { serviceColumn } from "../../Department/ManageService";
import { AxiosResponse } from "axios";
import {
  getDoctorPositionText,
  getDoctorRankText,
  getStatusText,
} from "../../../../utils/basicRender";
import { routerString } from "../../../model/router";

interface IHealthIndicator {
  bloodPressureDiatolic?: any;
  bloodPressureSystolic?: any;
  temperature?: any;
  heartRate?: any;
  glucozo?: any;
}

const HealthIndicatorErrorDefault = {
  bloodPressureDiatolic: "",
  bloodPressureSystolic: "",
  temperature: "",
  heartRate: "",
  glucozo: "",
};

const AppointmentDetail = () => {
  const { id: param } = useParams();
  const { role } = useSelector((state: RootState) => state.auth);
  const { tableSelectedCount, tableSelectedItem } = useSelector(
    (state: RootState) => state.currentSeleted
  );
  const { info } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [value, setValue] = useState<any>({});
  const [concusionFromDoctor, setConcusionFromDoctor] = useState<string>("");
  const [healthIndicator, setHealthIndicator] = useState<IHealthIndicator>();
  const [healthIndicatorError, setHealthIndicatorError] =
    useState<IHealthIndicator>(HealthIndicatorErrorDefault);
  const [isOpenModal, setOpenModal] = useState<{
    open: boolean;
    forMedicine: boolean;
  }>({ open: false, forMedicine: true });
  const [medicines, setMedicines] = useState<any>([]);
  const isEnableStartBtn =
    role === Role.Doctor && value?.status === EnumStatus.New && value?.mainTestingInfo?.department?.name === info?.doctorDTO?.departmentName;
  const isEnable =
    role === Role.Doctor &&
    (value?.status === EnumStatus.Inprogress ||
      value?.status === EnumStatus.OnBoard);
  const [departmentList, setDepartmentList] = useState<Selection[]>([]);
  const [departmentId, setDepartmentId] = useState<string>("");
  const [isOpenModelService, SetIsOpenModelService] = useState<boolean>(false);
  const [descriptionService, SetDescriptionService] = useState<string>("");

  const callApiDepartment = () => {
    return departmentApi
      .getList({ pageNumber: 1, pageSize: 50, searchKey: "" })
      .then((response) => {
        const result = response?.data?.values.map((item: any) => {
          return {
            value: item?.id,
            label: item?.name,
          };
        });
        setDepartmentList(result);
      });
  };

  const loadData = () => {
    dispatch(openLoading());
    appointmentApi
      .getById(param)
      .then((result: any) => {
        if (result.success) {
          setValue(result.data);
          setConcusionFromDoctor(result.data.concusionFromDoctor);
          setMedicines(result.data.medicineDTO || []);
          setHealthIndicator({
            bloodPressureDiatolic: result.data.bloodPressureDiatolic,
            bloodPressureSystolic: result.data.bloodPressureSystolic,
            temperature: result.data.temperature,
            heartRate: result.data.heartRate,
            glucozo: result.data.glucozo,
          });
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
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!isOpenModal.forMedicine) {
      callApiDepartment();
    }
  }, [isOpenModal]);

  const onChangeHealthIndicator = (field: string) => (e: any) => {
    const newValue = e.target.value;
    let mserr: string;
    if (!Number(newValue) || Number(newValue) < 0) {
      mserr = "Giá trị phải là số lớn hơn 0!";
    } else {
      mserr = "";
    }
    setHealthIndicatorError({
      ...healthIndicatorError,
      [field]: mserr,
    });
    setHealthIndicator({
      ...healthIndicator,
      [field]: newValue,
    });
  };

  const updateDetail = (func?: () => void) => () => {
    const body = {
      id: value?.id,
      heartRate: healthIndicator?.heartRate,
      glucozo: healthIndicator?.glucozo,
      bloodPressureDiatolic: healthIndicator?.bloodPressureDiatolic,
      bloodPressureSystolic: healthIndicator?.bloodPressureSystolic,
      temperature: healthIndicator?.temperature,
      concusionFromDoctor: concusionFromDoctor,
      medicines: medicines.map((e: any) => {
        return {
          id: e?.id,
          title: e?.title,
          description: e?.description,
          numberOfMedicine: e?.numberOfMedicine,
          HealthInsurancePayments: e?.healthInsurancePayments,
          Price: e?.price,
        };
      }),
    };
    dispatch(openLoading());
    appointmentApi
      .update(body)
      .then(async (result: any) => {
        if (result.success) {
          dispatch(
            showToastMessage({
              message: "Cập nhật thành công",
              type: toastType.succes,
            })
          );
          func && (await func());
          loadData();
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
  };

  const changeStatusOfAppointment = (status: EnumStatus) => () => {
    const body = {
      appointmentID: value?.id,
      newStatus: status,
      healthInsurance: !!value?.patient?.healthinsurance,
    };
    dispatch(openLoading());
    appointmentApi
      .updateStatus(body)
      .then((result: any) => {
        if (result.success) {
          dispatch(
            showToastMessage({
              message: "Cập nhật thành công",
              type: toastType.succes,
            })
          );
          loadData();
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
  };

  const onOkModalService = () => {
    const body = {
      id: value?.id,
      testAppointmentCreate: {
        description: descriptionService,
        testingInfoId: tableSelectedItem[0]?.id,
        patientId: value?.patient?.id,
      },
    };
    dispatch(openLoading());
    appointmentApi
      .addTestAppointment(body)
      .then((result: any) => {
        if (result.success) {
          dispatch(
            showToastMessage({
              message: "Cập nhật thành công",
              type: toastType.succes,
            })
          );
          SetDescriptionService("");
          SetIsOpenModelService(false);
          setOpenModal({ open: false, forMedicine: true });
          loadData();
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
  };

  const renderModelContent = () => {
    if (isOpenModal.forMedicine) {
      return (
        <UniformTable
          columns={medicinesColumn}
          commandBarItems={[]}
          integrateItems={medicineApi.getList}
          searchByColumn={"fullName"}
          searchPlaceholder={"tên"}
          sortable={true}
          tableContainerClassName="table-no-shadow"
        />
      );
    } else {
      const integrateItems = (
        reqbody: any
      ): Promise<AxiosResponse<any, any>> => {
        const body = {
          ...reqbody,
          isExaminationService: false,
          departmentId: departmentId,
        };
        return TestingInfoApi.getList(body);
      };
      const handleChange = (value: string) => {
        setDepartmentId(value);
        dispatch(tableRefresh());
      };
      return (
        <>
          <div className="dropdown-department">
            <p>Chọn khoa: </p>
            <Select
              defaultValue=""
              style={{ width: 250 }}
              onChange={handleChange}
              options={[{ value: "", label: "Tất cả" }, ...departmentList]}
            />
          </div>
          <UniformTable
            columns={serviceColumn}
            commandBarItems={[]}
            integrateItems={integrateItems}
            searchByColumn={"fullName"}
            searchPlaceholder={"tên"}
            sortable={true}
            tableContainerClassName="table-with-filter"
          />
          <Modal
            centered
            open={isOpenModelService}
            onOk={onOkModalService}
            onCancel={() => {
              SetDescriptionService("");
              SetIsOpenModelService(false);
            }}
          >
            <Descriptions title="Thông tin dịch vụ" style={{ width: "100%" }}>
              <Descriptions.Item label="Tên phòng khám" span={12}>
                {tableSelectedItem[0]?.name || "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Khoa" span={12}>
                {tableSelectedItem[0]?.departmentName || "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={12}>
                {tableSelectedItem[0]?.description || "--"}
              </Descriptions.Item>
              <Descriptions.Item label="Chi tiết" span={12}>
                <TextArea
                  style={{ height: "60px", resize: "none" }}
                  value={descriptionService}
                  onChange={(e) => SetDescriptionService(e.target.value)}
                />
              </Descriptions.Item>
            </Descriptions>
          </Modal>
        </>
      );
    }
  };

  const handleConfirmModal = () => {
    if (isOpenModal.forMedicine) {
      const newMedicines: any[] = Array.from(medicines);
      newMedicines.push(tableSelectedItem[0]);
      setMedicines(newMedicines);
      setOpenModal({ open: false, forMedicine: true });
    } else {
      SetIsOpenModelService(true);
    }
  };

  const onChangeMedicine = (id: any, key: string, value: any) => {
    let err: string;
    if (key === "numberOfMedicine") {
      if (!!Number(value) && Number(value) > 0) {
        err = "";
      } else {
        err = "Giá trị phải là số lớn hơn 0!";
      }
    }
    const newMedicines = Array.from(medicines).map((e: any) => {
      if (e.id === id) {
        return {
          ...e,
          [key]: value,
          numberOfMedicineErr: !!err ? err : undefined,
        };
      } else return e;
    });
    setMedicines(newMedicines);
  };

  return (
    <div className="appointment-detail">
      {isEnableStartBtn ? (
        <Button
          type="primary"
          className="update-btn"
          onClick={changeStatusOfAppointment(EnumStatus.Inprogress)}
        >
          Bắt đầu khám
        </Button>
      ) : (
        <></>
      )}
      <Descriptions
        title="Thông tin khám bệnh"
        bordered
        style={{ width: "100%" }}
      >
        <Descriptions.Item label="Khám">
          {value?.mainTestingInfo?.name || "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái" span={12}>
          {getStatusText(value?.status) || "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Bác sĩ" span={12}>
          <div
            className="link-text"
            onClick={() => {
              navigate(`${routerString.doctordetail}/${value.doctor.userId}`);
            }}
          >
            {value?.doctor?.lastName || "--"}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Chức vụ">
          {getDoctorRankText(value?.doctor?.doctorInfor?.rank) || "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Học vị" span={12}>
          {getDoctorPositionText(value?.doctor?.doctorInfor?.position) || "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Giá tiền">
          {Utils.formatCurrency(value?.mainTestingInfo?.price || 0) || "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Bảo hiểm y tế" span={12}>
          {`${Utils.formatCurrency(
            value?.mainTestingInfo?.healthInsurancePayments || 0
          )}%` || "--"}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions
        title="Bệnh nhân"
        bordered
        style={{ width: "100%", margin: "20px 0" }}
      >
        <Descriptions.Item label="Họ và tên" span={12}>
          <div
            className="link-text"
            onClick={() => {
              navigate(
                `${routerString.patientdetailByAdmin}/${value.patient.id}`
              );
            }}
          >
            {value?.patient?.lastName || "--"}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Năm sinh">
          {value?.patient?.yearOfBirth || "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Giới tính" span={12}>
          {`${Utils.getGenderText(value?.patient?.gender)}` || "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Bảo hiểm y tế" span={12}>
          {value?.patient?.healthinsurance || "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Triệu chứng" span={12}>
          {value?.description || "--"}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions
        title="Thông tin khám cơ bản"
        bordered
        style={{ width: "100%", margin: "20px 0" }}
        column={2}
      >
        <Descriptions.Item label="Khoa" span={12}>
          {value?.mainTestingInfo?.department?.name || "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Nội dung" span={12}>
          {value?.mainTestingInfo?.name || "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Đường huyết">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "6px" }}>
              {isEnable ? (
                <>
                  <Input
                    style={{ width: "60px" }}
                    value={healthIndicator?.glucozo}
                    role=""
                    onChange={onChangeHealthIndicator("glucozo")}
                    status={healthIndicatorError?.glucozo ? "error" : undefined}
                  ></Input>
                </>
              ) : (
                <>{healthIndicator?.glucozo || "--"}</>
              )}
              &nbsp; mg/dl
            </div>
            {isEnable && (
              <span style={{ color: "red", fontSize: "14px" }}>
                {healthIndicatorError?.glucozo}
              </span>
            )}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Nhịp tim">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "6px" }}>
              {isEnable ? (
                <>
                  <Input
                    style={{ width: "60px" }}
                    value={healthIndicator?.heartRate}
                    role=""
                    onChange={onChangeHealthIndicator("heartRate")}
                    status={
                      healthIndicatorError?.heartRate ? "error" : undefined
                    }
                  ></Input>
                </>
              ) : (
                <>{healthIndicator?.heartRate || "--"}</>
              )}
              &nbsp; bpm
            </div>
            {isEnable && (
              <span style={{ color: "red", fontSize: "14px" }}>
                {healthIndicatorError?.heartRate}
              </span>
            )}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Nhiệt độ">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "6px" }}>
              {isEnable ? (
                <>
                  <Input
                    style={{ width: "60px" }}
                    value={healthIndicator?.temperature}
                    role=""
                    onChange={onChangeHealthIndicator("temperature")}
                    status={
                      healthIndicatorError?.temperature ? "error" : undefined
                    }
                  ></Input>
                </>
              ) : (
                <>{healthIndicator?.temperature || "--"}</>
              )}
              &nbsp; °C
            </div>
            {isEnable && (
              <span style={{ color: "red", fontSize: "14px" }}>
                {healthIndicatorError?.temperature}
              </span>
            )}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Huyết áp">
          {/* {value?.patient?.temperature || "--"} &nbsp; mmHg */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "6px" }}>
              {isEnable ? (
                <>
                  <Input
                    style={{ width: "60px" }}
                    value={healthIndicator?.bloodPressureDiatolic}
                    role=""
                    onChange={onChangeHealthIndicator("bloodPressureDiatolic")}
                    status={
                      healthIndicatorError?.bloodPressureDiatolic
                        ? "error"
                        : undefined
                    }
                  ></Input>
                  &nbsp; / &nbsp;
                  <Input
                    style={{ width: "60px" }}
                    value={healthIndicator?.bloodPressureSystolic}
                    role=""
                    onChange={onChangeHealthIndicator("bloodPressureSystolic")}
                    status={
                      healthIndicatorError?.bloodPressureSystolic
                        ? "error"
                        : undefined
                    }
                  ></Input>
                </>
              ) : (
                <>
                  {`${healthIndicator?.bloodPressureDiatolic || "--"} / ${
                    healthIndicator?.bloodPressureSystolic || "--"
                  }` || "--"}
                </>
              )}
              &nbsp; mg/dl
            </div>
            {isEnable && (
              <span style={{ color: "red", fontSize: "14px" }}>
                {healthIndicatorError?.bloodPressureDiatolic ||
                healthIndicatorError?.bloodPressureSystolic
                  ? "Giá trị phải là số lớn hơn 0!"
                  : ""}
              </span>
            )}
          </div>
        </Descriptions.Item>
      </Descriptions>
      <div style={{ position: "relative", width: "100%", margin: "40px 0" }}>
        {isEnable ? (
          <Button
            className="add-btn-appointment-detail"
            onClick={() => setOpenModal({ open: true, forMedicine: false })}
          >
            Thêm dịch vụ
          </Button>
        ) : (
          <></>
        )}
        <Descriptions
          title="Thông tin xét nghiệm"
          bordered
          style={{ width: "100%", margin: "10px 0" }}
          column={1}
        >
          {value?.testingAppointmens?.map((item: any, index: any) => {
            return (
              <div key={index}>
                <Descriptions
                  column={3}
                  style={{ width: "100%", margin: "10px 0" }}
                  title={
                    <div
                      className="link-text"
                      onClick={() => {
                        navigate(
                          `${routerString.TestingAppointmentDetail}/${item?.id}`
                        );
                      }}
                    >
                      {item?.testingInfo?.name || "--"}
                    </div>
                  }
                  size={"small"}
                  items={[
                    {
                      key: "1",
                      label: "Ngày khám",
                      children: Utils.convertDateToString(item?.dateCreate),
                    },
                    {
                      key: "2",
                      label: "Trạng thái",
                      children: getStatusText(item?.status),
                      style: {
                        color: item?.status === 5 ? "green" : "inherit",
                      },
                    },
                    {
                      key: "3",
                      label: "Chi tiết",
                      children: item?.description,
                    },
                    {
                      key: "4",
                      label: "Kết luận",
                      children: item?.concusionFromDoctor,
                    },
                    {
                      key: "5",
                      label: "Giá tiền",
                      children:
                        item?.testingInfo?.price?.toLocaleString() + " VNĐ",
                    },
                    {
                      key: "6",
                      label: "Bảo hiểm chi trả",
                      children:
                        item?.testingInfo?.healthInsurancePayments + " %",
                    },
                    {
                      key: "6",
                      label: "Phòng",
                      children:
                        item?.testingInfo?.description,
                    },
                  ]}
                />
              </div>
            );
          })}
        </Descriptions>
      </div>
      <div style={{ position: "relative", width: "100%", margin: "40px 0" }}>
        {isEnable ? (
          <Button
            className="add-btn-appointment-detail"
            onClick={() => setOpenModal({ open: true, forMedicine: true })}
          >
            Thêm thuốc
          </Button>
        ) : (
          <></>
        )}
        <Descriptions
          title="Thông tin đơn thuốc"
          bordered
          style={{ width: "100%", margin: "10px 0" }}
          column={1}
        >
          {medicines.map((item: any, index: any) => {
            return (
              <div key={index}>
                <Descriptions
                  style={{ width: "100%", margin: "10px 0" }}
                  title={item?.title}
                  size={"small"}
                  extra={
                    isEnable ? (
                      <Button
                        onClick={() => {
                          const newMedicines: any[] = Array.from(
                            medicines
                          ).filter((e: any) => e.id !== item.id);
                          setMedicines(newMedicines);
                        }}
                      >
                        Xóa
                      </Button>
                    ) : (
                      <></>
                    )
                  }
                  items={[
                    {
                      key: "1",
                      label: "Ghi chú",
                      span: 2,
                      children: (
                        <>
                          {isEnable ? (
                            <TextArea
                              rows={4}
                              value={item?.description}
                              onChange={(e) =>
                                onChangeMedicine(
                                  item.id,
                                  "description",
                                  e?.target?.value
                                )
                              }
                              style={{
                                height: 60,
                                resize: "none",
                                marginRight: 20,
                              }}
                            />
                          ) : (
                            <>{item?.description}</>
                          )}
                        </>
                      ),
                    },
                    {
                      key: "2",
                      label: "Số lượng",
                      span: 1,
                      children: (
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          {isEnable ? (
                            <>
                              <Input
                                value={item?.numberOfMedicine}
                                onChange={(e) =>
                                  onChangeMedicine(
                                    item.id,
                                    "numberOfMedicine",
                                    e?.target?.value
                                  )
                                }
                                style={{ width: 80 }}
                              />
                            </>
                          ) : (
                            <>{item?.numberOfMedicine}</>
                          )}
                          <span style={{ fontSize: 14, color: "red" }}>
                            {item?.numberOfMedicineErr}
                          </span>
                        </div>
                      ),
                    },
                    {
                      key: "3",
                      label: "Giá tiền",
                      span: 2,
                      children: (
                        <div>
                          {Utils.formatCurrency(item?.price || "--") || "--"}

                          <span style={{ fontSize: 14, color: "red" }}>
                            {item?.numberOfMedicineErr}
                          </span>
                        </div>
                      ),
                    },
                    {
                      key: "4",
                      label: "Bảo hiểm y tế",
                      span: 1,
                      children: (
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          {`${item?.healthInsurancePayments}%` || "--"}
                          <span style={{ fontSize: 14, color: "red" }}>
                            {item?.numberOfMedicineErr}
                          </span>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            );
          })}
        </Descriptions>
      </div>
      <Descriptions
        title="Kết luận"
        bordered
        style={{ width: "100%", margin: "10px 0" }}
      >
        {isEnable ? (
          <Descriptions.Item style={{ padding: 0 }}>
            <TextArea
              rows={4}
              value={concusionFromDoctor}
              onChange={(e) => setConcusionFromDoctor(e?.target?.value)}
              style={{ height: 120, resize: "none" }}
            />
          </Descriptions.Item>
        ) : (
          <Descriptions.Item>{concusionFromDoctor || "--"}</Descriptions.Item>
        )}
      </Descriptions>
      {value.status === EnumStatus.Success && (
        <div
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            display: "flex",
            color: "rgba(0, 0, 0, 0.88)",
            fontWeight: "600",
            fontSize: "16px",
            justifyContent: "flex-end",
          }}
        >
          <span>{`Tổng thanh toán: ${Utils.formatCurrency(
            value.paymentTotal || "--"
          )}`}</span>
        </div>
      )}

      {isEnable ? (
        <div className="appointment-detail-complete-btn">
          {value.status === EnumStatus.Inprogress && (
            <Button
              style={{ marginRight: "10px", marginTop: 10 }}
              onClick={changeStatusOfAppointment(EnumStatus.OnBoard)}
            >
              Nhập viện
            </Button>
          )}

          <Button
            style={{ marginRight: "10px", marginTop: 10 }}
            onClick={updateDetail()}
            disabled={!medicines.every((e: any) => !e?.numberOfMedicineErr)}
          >
            Cập nhật
          </Button>
          <Button
            type="primary"
            style={{ marginRight: "10px", marginTop: 10 }}
            onClick={updateDetail(
              changeStatusOfAppointment(EnumStatus.Success)
            )}
            disabled={!medicines.every((e: any) => !e?.numberOfMedicineErr)}
          >
            Hoàn thành
          </Button>
        </div>
      ) : (
        <></>
      )}
      <Modal
        key={JSON.stringify(isOpenModal.open)}
        title={isOpenModal.forMedicine ? "Chỉ định thuốc" : "Chỉ định dịch vụ"}
        footer={
          <Button
            type="primary"
            disabled={tableSelectedCount === 0}
            onClick={handleConfirmModal}
          >
            <span>Xác nhận</span>
          </Button>
        }
        open={isOpenModal.open}
        onOk={() => {}}
        onCancel={() => setOpenModal({ open: false, forMedicine: true })}
        width={900}
        maskClosable={false}
        className="request-schedule-modal"
      >
        {renderModelContent()}
      </Modal>
    </div>
  );
};

export default AppointmentDetail;
