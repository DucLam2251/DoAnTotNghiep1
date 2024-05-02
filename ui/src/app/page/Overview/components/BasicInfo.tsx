import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { closeLoading, openLoading, setInfoUser, showToastMessage } from "../../../../redux/reducers";
import { genderList, toastType } from "../../../model/enum/common";
import { authApi } from "../../../../api";
import { Utils } from "../../../../utils";


interface IBasicInfoProps {
  dismissForm: () => void;
  value?: any;
  form: any;
}

type FieldType = {
  fullName?: string;
  gender?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  city?: string;
  district?: string;
  commune?: string;
  address?: string;
};

interface ISelectOption {
  value: string;
  label: string;
}

const _initialValues = (value: any) => {
  const _value = Utils.deepCopy(value);
  return {
    ..._value,
    dateOfBirth: _value.dateOfBirth
      ? dayjs(Utils.convertDDmmyyyTommDDyyyy(_value.dateOfBirth))
      : undefined,
    city: _value.city
      ? {
          value: "",
          label: _value.city,
        }
      : undefined,
    district: _value.district
      ? {
          value: "",
          label: _value.district,
        }
      : undefined,
    commune: _value.commune
      ? {
          value: "",
          label: _value.commune,
        }
      : undefined,
  };
};

const defaultSelectOption: ISelectOption = {
  value: "",
  label: "",
};
const selectStyle = {
  width: "100%",
};
const host = "https://provinces.open-api.vn/api/";

const BasicInfoForm = (props: IBasicInfoProps) => {
  const { dismissForm, value, form } = props;

  const dispatch = useDispatch();

  const [city, setCity] = useState<ISelectOption>({
    value: "",
    label: value.city || "",
  });
  const [district, setDistrict] = useState<ISelectOption>({
    value: "",
    label: value.district || "",
  });
  const [commune, setCommune] = useState<ISelectOption>({
    value: "",
    label: value.commune || "",
  });
  const [details, setDetails] = useState<string>(value.address || "");
  const [cityList, setCityList] = useState<ISelectOption[]>([]);
  const [districtList, setDistrictList] = useState<ISelectOption[]>([]);
  const [communeList, setComuneList] = useState<ISelectOption[]>([]);

  const callAPI = (api: any) => {
    return axios.get(api).then((response) => {
      const result = response.data.map((item: any) => {
        return {
          value: item.code,
          label: item.name,
        };
      });
      setCityList(result || []);
    });
  };

  const callApiDistrict = (api: any) => {
    return axios.get(api).then((response) => {
      const result = response.data.districts?.map((item: any) => {
        return {
          value: item.code,
          label: item.name,
        };
      });
      setDistrictList(result || []);
    });
  };

  const callApiWard = (api: any) => {
    return axios.get(api).then((response) => {
      const result = response.data.wards?.map((item: any) => {
        return {
          value: item.code,
          label: item.name,
        };
      });
      setComuneList(result || []);
    });
  };
  useEffect(() => {
    callAPI(host);
  }, []);

  useEffect(() => {
    callApiDistrict(`${host}p/${city.value}?depth=2`);
  }, [city]);

  useEffect(() => {
    callApiWard(`${host}d/${district.value}?depth=2`);
  }, [district]);

  useEffect(() => {
    form.resetFields();
  }, [value])

  const onFinish = (values: any) => {
    const addressArr: string[] = [];
      // if(values.address) addressArr.push(values.address?.trim());
      // if(values.commune.label) addressArr.push(values.commune.label?.trim());
      // if(values.district.label) addressArr.push(values.district.label?.trim());
      // if(values.city.label) addressArr.push(values.city.label?.trim());
    dispatch(openLoading());
    const body = {
      "firstName": "",
      "lastName": values.fullName,
      "phoneNumber": values.phoneNumber,
      "dateOfBirth": new Date(values.dateOfBirth.format("MM/DD/YYYY")).toLocaleString(),
      "avatar": "",
      "gender": values.gender,
      "address": addressArr.join(", ")
    }
    authApi
      .updateInfo(body)
      .then(() => {
        dispatch(
          showToastMessage({
            message: "Cập nhật thông tin thành công",
            type: toastType.succes,
          })
        );
        dispatch(
          setInfoUser({
            ...body,
            fullName: body.lastName,
            dateOfBirth: values.dateOfBirth.format("DD/MM/YYYY"),
            // city: values.city.label,
            // district: values.district.label,
            // commune: values.commune.label,
            // address: values.address,
          })
        );
        dismissForm();
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

  const onFinishFailed = (_: any) => {
    dispatch(
      showToastMessage({
        message: "Hãy điền các trường còn trống",
        type: toastType.error,
      })
    );
  };
  const validateDateOfBirth = (_ : any, value  : any) => {
    const age = calculateAge(value);
    if (age <= 18) {
      return Promise.reject('Ngày sinh phải lớn hơn 18 tuổi.');
    }
    if(age >= 100){
      return Promise.reject('Ngày sinh phải nhỏ hơn 100 tuổi.');
    }
    return Promise.resolve();
  };

  const calculateAge = (date : any) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  return (
    <div style={{ padding: "16px 64px 0 64px" }}>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout={"vertical"}
        style={{ maxWidth: 800 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        initialValues={_initialValues(value)}
      >
        <Row style={{ gap: "40px" }}>
          <Col span={12} style={{ flex: 1 }}>
            <Form.Item<FieldType>
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: "Hãy nhập họ và tên!" }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
          </Col>
          <Col span={12} style={{ flex: 1 }}>
            <Form.Item<FieldType>
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Hãy chọn giới tính!" }]}
            >
              <Select
                options={genderList}
                placeholder="Chọn giới tính"
              ></Select>
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ gap: "40px" }}>
          <Col span={12} style={{ flex: 1 }}>
            <Form.Item<FieldType>
              label="Ngày sinh"
              name="dateOfBirth"
              rules={[{ required: true, message: "Hãy chọn ngày sinh!" },
            {
              validator: validateDateOfBirth
            }]}
            >
              <DatePicker
                placeholder="Chọn Ngày sinh"
                style={{ width: "100%" }}
                format={"DD/MM/YYYY"}
              />
            </Form.Item>
          </Col>
          <Col span={12} style={{ flex: 1 }}>
            <Form.Item<FieldType>
              label="Số điện thoại"
              name="phoneNumber"
              rules={[{ required: true, message: "Hãy nhập số điện thoại!" }]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
        </Row>

        <Row style={{ gap: "40px" }}>
          <Col span={12} style={{ flex: 1 }}>
            <Form.Item<FieldType>
              label="Tỉnh/Thành phố"
              name="city"
              rules={[{ required: false, message: "Hãy chọn Tỉnh/Thành phố!" }]}
            >
              <Select
                labelInValue
                style={{
                  ...selectStyle,
                }}
                placeholder="Chọn Tỉnh/Thành phố"
                options={cityList}
                value={city}
                onChange={(value: { value: string; label: string }) => {
                  setCity({
                    value: value.value,
                    label: value.label,
                  });
                  form.setFieldsValue({
                    district: undefined,
                    commune: undefined,
                  });
                  setDistrict(defaultSelectOption);
                  setCommune(defaultSelectOption);
                }}
              ></Select>
            </Form.Item>
          </Col>

          <Col span={12} style={{ flex: 1 }}>
            <Form.Item<FieldType>
              label="Quận/Huyện"
              name="district"
              rules={[{ required: false, message: "Hãy chọn Quận/Huyện!" }]}
            >
              <Select
                labelInValue
                style={{
                  ...selectStyle,
                }}
                placeholder="Chọn Quận/Huyện"
                options={districtList}
                value={district}
                onChange={(value: { value: string; label: string }) => {
                  setDistrict({
                    value: value.value,
                    label: value.label,
                  });
                  form.setFieldsValue({
                    commune: undefined,
                  });
                  setCommune(defaultSelectOption);
                }}
                disabled={!city.label}
              ></Select>
            </Form.Item>
          </Col>
        </Row>

        <Row style={{ gap: "40px" }}>
          <Col span={12} style={{ flex: 1 }}>
            <Form.Item<FieldType>
              label="Phường/Xã"
              name="commune"
              rules={[{ required: false, message: "Hãy chọn Phường/Xã!" }]}
            >
              <Select
                labelInValue
                style={{
                  ...selectStyle,
                }}
                placeholder="Chọn Phường/Xã"
                options={communeList}
                value={commune}
                onChange={(value: { value: string; label: string }) => {
                  setCommune({
                    value: value.value,
                    label: value.label,
                  });
                }}
                disabled={!district.label}
              ></Select>
            </Form.Item>
          </Col>

          <Col span={12} style={{ marginBottom: "24px", flex: 1 }}>
            <Form.Item<FieldType> label="Địa chỉ" name="address">
              <Input
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                disabled={!commune.label}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button type="primary" htmlType="submit">
              <span>Xác nhận thông tin</span>
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
export default BasicInfoForm;