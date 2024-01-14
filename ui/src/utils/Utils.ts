import { Role } from "../app/model/enum/auth";
import { Gender } from "../app/model/enum/common";

export default class Utils {
  public static convertDateToString = (date: string) => {
    if (date) {
      const parsedDate = new Date(date);
      const day = parsedDate.getDate().toString().padStart(2, '0');
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
      const year = parsedDate.getFullYear();

      return `${day}/${month}/${year}`;
    } else {
      return "--";
    }
  }
  public static deepCopy = (object: any) => {
    try {
      return Object.assign({}, object)
    } catch {
      return JSON.parse(JSON.stringify(object))
    }
  }
  public static getGenderText = (gender: Gender) => {
    switch (gender) {
      case Gender.Male:
        return "Nam";
      case Gender.Female:
        return "Nữ";
      default:
        return "";
    }
  };

  public static renderAccountRole = (role: Role | null) => {
    switch (role) {
      case Role.Administrator:
        return "Quản trị viên";
      case Role.Doctor:
        return "Bác sĩ";
      case Role.Patient:
        return "Người dùng";
      case Role.Nurse:
        return "Y tá";
      default:
        return "--";
    }
  };

  public static convertDDmmyyyTommDDyyyy = (value: string): string => {
    if (!value) return "";
    const arr = value.split("/");
    return `${arr[1]}/${arr[0]}/${arr[2]}`
  }

  public static convertmmDDyyyyToDDmmyyyy = (value: string) => {
    if (!value) return "";
    const datearray = value.split("/");
    const newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
    return newdate
  }

  public static formatCurrency(value: number): string {
    return value.toLocaleString();
  }

  // Function to convert a file path to UploadFile
  public static convertToUploadFile = (filePath: string) => {
    // Use the File constructor to create a File object
    const file = new File([filePath], filePath);

    // Create an UploadFile object with required properties
    const uploadFile = {
        uid: Date.now(),
        name: file.name,
        status: 'done',
        url: filePath,
    };

    return uploadFile;
  };
}