export const host = "https://provinces.open-api.vn/api/";

export enum toastType {
  succes,
  error,
  info,
  warning
}

export enum ErrorPageEnum {
  Unauthorized,
  Forbidden,
  ServerError
}

export enum Gender {
  Male = 0,
  Female = 1,
}

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

export enum patientRelationship{
  wifeHusband,
  parentChild,
  grandParentChild,
  other
}

export enum OrderChart {
  Day, 
  Month,
  Quarter,
  Year
}

export enum PromiseStatus {
  None,
  Loading,
  Idle,
  Failed
}