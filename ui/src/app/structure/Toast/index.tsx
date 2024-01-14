import "./index.scss";
import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toastType } from "../../model/enum/common";
import { RootState } from "../../../redux";
import { closeToastMessage } from "../../../redux/reducers";
import { error, info, success, warning } from "../../../asset/images/images";
import { CloseOutlined } from "@ant-design/icons";

export interface IToastProps{
    message: string;
    type: any;
    isShow: boolean;
}

const toastTypes = {
  [toastType.succes]: {
    icon: success,
    backgroundColor: '#DFF6DD'
  },
  [toastType.warning]: {
    icon: warning,
    backgroundColor: '#FFF4CE'
  },
  [toastType.info]: {
    icon: info,
    backgroundColor: '#bee5ff'
  },
  [toastType.error]: {
    icon: error,
    backgroundColor: '#FDE7E9'
  }
};

export const Toast = () => {
  const { message, type } = useSelector((state: RootState) => state.toast);
  const dispatch = useDispatch();
  const { icon } = toastTypes[type];

  const timerID = useRef<number | null>(null);
  const handleDismiss = useCallback(() => dispatch(closeToastMessage()), [dispatch]);

  useEffect(() => {
    timerID.current = window.setTimeout(() => handleDismiss(), 5000);
    return () => {
      if (timerID.current) {
        clearTimeout(timerID.current);
      }
    };
  }, [handleDismiss]);

  return (
    <div className="toast">
      <img alt='' src={icon} className='toast-icon' />
      <p className="toast-message">{message}</p>
      <CloseOutlined onClick={handleDismiss} className="toast-cancel"  />
    </div>
  )
}