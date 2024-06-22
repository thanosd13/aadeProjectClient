import axios from "axios";
import AuthHeader from "./AuthHeader";
import { MIDDLEWARE_ULR } from "../config/constant";

class CustomerService {

    getByAfm(afm) {
        return axios.get(MIDDLEWARE_ULR +"/customer/getDataByAfm/"+afm, { headers: AuthHeader() });
    }

    getByUserId(id) {
        return axios.get(MIDDLEWARE_ULR +"/customer/getCustomers/"+id, { headers: AuthHeader() });
    }
    
    addCustomer(formData,id) {
        return axios.post(MIDDLEWARE_ULR + "/customer/create/"+id, { formData }, { headers: AuthHeader() });
    }

    updateCustomer(formData, id) {
        return axios.put(MIDDLEWARE_ULR + "/customer/"+id, { formData }, { headers: AuthHeader() });
    }

    deleteCustomer(userId, id) {
        return axios.delete(MIDDLEWARE_ULR + "/customer/"+userId +"/"+id, { headers: AuthHeader() });
    } 
}

export default new CustomerService();