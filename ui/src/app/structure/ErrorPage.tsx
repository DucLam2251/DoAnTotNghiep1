import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { routerString } from "../model/router";
import { ErrorPageEnum } from "../model/enum/common";
import { LoadingDot } from "./Loading";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { closeToastMessage } from "../../redux/reducers";

interface IErrorPageProps {
  pageType: ErrorPageEnum;
}

function ErrorPage(props: IErrorPageProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(closeToastMessage());
    let url: string = `${routerString.home}`;
    if (props.pageType === ErrorPageEnum.Unauthorized) {
      localStorage.clear();
      url = "/login";
    }
    const loading = setTimeout(() => {
      setLoading(true);
    }, 3000)
    const timeout = setTimeout(() => {
      setLoading(false);
      navigate(url);
    }, 5000);
    return () => {clearTimeout(timeout); clearTimeout(loading)}
  }, [])

  const content = () => {
    let content: JSX.Element = <></>;
    switch(props.pageType) {
      case ErrorPageEnum.Unauthorized:
        content = (
          <Result
            status="404"
            title="404"
            subTitle="Không có quyền truy cập, vui lòng trở lại trang chủ"
            extra={<Button type="primary" onClick={() => navigate("/")}>Quay về trang chủ</Button>}
          />
        )
        break;
      case ErrorPageEnum.Forbidden:
        content = (
          <Result
            status="403"
            title="403"
            subTitle="Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại để sử dụng dịch vụ"
            extra={<Button type="primary" onClick={() => navigate("/")}>Quay về trang chủ</Button>}
          />
        )
        break;
      case ErrorPageEnum.ServerError:
        content = (
          <Result
            status="500"
            title="500"
            subTitle="Có lỗi xảy ra!"
            extra={<Button type="primary" onClick={() => navigate(`${routerString.home}`)}>Quay về trang chủ</Button>}
          />
        )
        break;
    }
    return content;
  }
  return isLoading ? <LoadingDot/> : content();
}

export default ErrorPage;