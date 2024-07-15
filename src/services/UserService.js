import axios from "axios";
import AuthHeader from "./AuthHeader";
import { MIDDLEWARE_ULR } from "../config/constant";
import { insert } from "formik";

const API_URL = MIDDLEWARE_ULR;

class UserService {
  findUserData(id) {
    return axios.get(API_URL + "/user/userData/" + id, {
      headers: AuthHeader(),
    });
  }

  createUserData(formData, id) {
    return axios.post(API_URL + "/user/createUserData/" + id, formData, {
      headers: AuthHeader(),
    });
  }

  updateUserData(formData, id) {
    return axios.put(API_URL + "/user/userData/" + id, formData, {
      headers: AuthHeader(),
    });
  }

  insertAadeData(formData, id) {
    return axios.post(API_URL + "/user/insertAadeData/" + id, formData, {
      headers: AuthHeader(),
    });
  }

  updateAadeData(formData, id) {
    return axios.put(API_URL + "/user/updateAadeData", formData, {
      headers: AuthHeader(),
    });
  }

  getAadeData(id) {
    return axios.get(API_URL + "/user/aadeData/" + id, {
      headers: AuthHeader(),
    });
  }

  getDailyTotalPrice(id) {
    return axios.get(API_URL + "/user/getDailyTotalPrice/" + id, {
      headers: AuthHeader(),
    });
  }
}

export default new UserService();
