import axios from "axios";
import { MIDDLEWARE_ULR } from "../config/constant";

const API_URL = MIDDLEWARE_ULR;

class AuthService {
  login(formData) {
    return axios
      .post(API_URL + "/user/login", { formData })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return { data: response.data, status: response.status };
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(formData) {
    return axios.post(API_URL + "/user/register", formData);
  }
}

export default new AuthService();
