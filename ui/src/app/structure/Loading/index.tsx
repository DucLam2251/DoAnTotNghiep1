import "./index.scss"
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const LoadingLogin = () => {
    return (
        <div id="loadingLogin"> 
            <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
        </div>
    )
}

const LoadingDot = () => {
    return (
        <div id="loadingDot">
          <div className="content-loading" >
            <div className="text">Đang tải... </div>
            <div className="loading">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
    )
}

const LoadingInComing = () => {
  return (
    <div id="loadingincoming">
      <div className="content-loading">
        <div className="content-getdata-text" >Chúng tôi đang tiến hành đăng nhập cho bạn...</div>
        <div className="loading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  )
}

export  { LoadingLogin, LoadingDot, LoadingInComing };