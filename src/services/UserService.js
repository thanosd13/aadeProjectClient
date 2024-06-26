import axios from "axios";
import AuthHeader from "./AuthHeader";
import { MIDDLEWARE_ULR } from "../config/constant";

const API_URL = MIDDLEWARE_ULR;

class UserService {
 
findUserData(id) {
    return axios.get(API_URL + "/user/userData/"+id, { headers: AuthHeader() });
}    
    
createUserData(formData, id) {
    return axios.post(API_URL + "/user/createUserData/"+id, formData, { headers: AuthHeader() });
}

updateUserData(formData, id) {
    return axios.put(API_URL + "/user/userData/"+id, formData, { headers: AuthHeader() });
}


}

export default new UserService();
