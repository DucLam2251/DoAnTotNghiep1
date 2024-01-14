import { Gender } from "../../model/enum/common";

export const genderList = [
  {
    value: Gender.Male,
    label: "Nam",
  },
  {
    value: Gender.Female,
    label: "Nữ",
  },
];

export enum EnumRank
{
    CuNhan,
    ThacSi,
    TienSi,
    PhoGiaoSu,
    GiaoSu
}
export enum EnumStatus {
  PendingConfirm, // đợi xác nhận từ quản trị
  New, // đã được xác nhận
  Reject, // từ chối 
  Inprogress, // thao tác
  OnBoard, // nhập viện
  Success // thành công
}
export enum EnumPosition
{
    BacSi,
    PhoKhoa,
    TruongKhoa,
    GiamDoc
}
export const StatusList = [
  {
    value: EnumStatus.PendingConfirm,
    label: "Chờ xác nhận"
  },
  {
    value: EnumStatus.New,
    label: "Xác nhận"
  },
  {
    value: EnumStatus.Reject,
    label: "Hủy"
  },
  {
    value: EnumStatus.Inprogress,
    label: "Đang khám"
  },
  {
    value: EnumStatus.OnBoard,
    label: "Nhập viện"
  },
  {
    value: EnumStatus.Success,
    label: "Hoàn thành"
  }
]
export const RankDoctorList = [
  {
    value: EnumRank.CuNhan,
    label: "Cử nhân"
  },
  {
    value: EnumRank.ThacSi,
    label: "Thạc sĩ"
  },
  {
    value: EnumRank.TienSi,
    label: "Tiến sĩ"
  },
  {
    value: EnumRank.PhoGiaoSu,
    label: "Phó giáo sư"
  },
  {
    value: EnumRank.GiaoSu,
    label: "Giáo sư"
  },
]

export const PositionDoctorList = [
  {
    value: EnumPosition.BacSi,
    label: "Bác sĩ"
  },
  {
    value: EnumPosition.PhoKhoa,
    label: "Phó khoa"
  },
  {
    value: EnumPosition.TruongKhoa,
    label: "Trưởng khoa"
  },
  {
    value: EnumPosition.GiamDoc,
    label: "Giám đốc"
  },
]

export enum EnumAppointmentStatus {
  PendingConfirm, // đợi xác nhận từ quản trị
  New, // đã được xác nhận
  Reject, // từ chối 
  Inprogress, // thao tác
  OnBoard, // nhập viện
  Success // thành công
}