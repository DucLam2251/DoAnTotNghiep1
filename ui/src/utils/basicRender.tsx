import { TooltipHost, TooltipOverflowMode } from "@fluentui/react"
import { EnumPosition, EnumRank, EnumStatus } from "../app/common/enum/common"

export const tooltipPlainText = (content: string, extraClassName?: string, id?: string) => {
  if (!content) {
    return <div>--</div>
  }
  return (
    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      <TooltipHost
        content={content}
        closeDelay={200}
        overflowMode={TooltipOverflowMode.Parent}
        hostClassName={extraClassName}
      >
        <span id={id}>{content}</span>
      </TooltipHost>
    </div>
  )
}

export const getDoctorRankText = (rank: EnumRank) => {
  switch (rank) {
    case EnumRank.CuNhan:
      return "Cử nhân";
    case EnumRank.TienSi:
      return "Tiến sĩ";
      case EnumRank.ThacSi:
      return "Thạc sĩ";
      case EnumRank.PhoGiaoSu:
      return "Phó giáo sư";
      case EnumRank.GiaoSu:
      return "Giáo sư";
    default:
      return "";
  }
}

export const getDoctorPositionText = (position: EnumPosition) => {
  switch (position) {
    case EnumPosition.TruongKhoa:
      return "Trưởng khoa";
    case EnumPosition.PhoKhoa:
      return "Phó khoa";
    case EnumPosition.GiamDoc:
      return "Giám đốc";
    case EnumPosition.BacSi:
      return "Bác sĩ";
    default:
      return "";
  }
}
export const getStatusText = (position: EnumStatus) => {
  switch (position) {
    case EnumStatus.PendingConfirm:
      return "Chờ xác nhận";
    case EnumStatus.New:
      return "Xác nhận";
    case EnumStatus.Reject:
      return "Đã hủy";
    case EnumStatus.Inprogress:
      return "Đang khám";
    case EnumStatus.OnBoard:
      return "Nhập viện";
    default:
      return "Hoàn thành";
  }
}