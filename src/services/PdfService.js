import axios from "axios";
import AuthHeader from "./AuthHeader";
import { MIDDLEWARE_ULR } from "../config/constant";

class PdfService {

    insertPdfData(formData,id) {
        return axios.post(MIDDLEWARE_ULR + "/pdf/"+id, { formData }, { headers: AuthHeader() });
    }

    createInvoice(formData,id) {
        return axios.post(MIDDLEWARE_ULR + "/pdf/create/"+id, { formData }, { headers: AuthHeader(), responseType: 'blob' });
    }

    updatePdfData(formData,id) {
        return axios.put(MIDDLEWARE_ULR + "/pdf/"+id, { formData }, { headers: AuthHeader() });
    }

    getPdfData(id) {
        return axios.get(MIDDLEWARE_ULR + "/pdf/"+id, { headers: AuthHeader() });
    }
}

export default new PdfService();
