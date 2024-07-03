import axios from "axios";
import AuthHeader from "./AuthHeader";
import { MIDDLEWARE_ULR } from "../config/constant";

class PdfService {

    insertPdfData(formData,id) {
        return axios.post(MIDDLEWARE_ULR + "/pdf/"+id, { formData }, { headers: AuthHeader() });
    }
}

export default new PdfService();