import axios from "axios";
import AuthHeader from "./AuthHeader";
import { MIDDLEWARE_ULR } from "../config/constant";

class CustomerService {

    getByAfm(afm) {
        return axios.get(MIDDLEWARE_ULR +"/customer/getDataByAfm/"+afm, { headers: AuthHeader() });
    }
    
    addCustomer(formData,id) {
        return axios.post(MIDDLEWARE_ULR + "/customer/create/"+id, { formData }, { headers: AuthHeader() });
    }
}

export default new CustomerService();