import axios from "axios";
import AuthHeader from "./AuthHeader";
import { MIDDLEWARE_ULR } from "../config/constant";

class PdfService {
  insertPdfData(formData, id) {
    return axios.post(
      MIDDLEWARE_ULR + "/pdf/" + id,
      { formData },
      { headers: AuthHeader() }
    );
  }

  createInvoice(formData, id) {
    return axios.post(
      MIDDLEWARE_ULR + "/pdf/create/" + id,
      { formData },
      { headers: AuthHeader(), responseType: "blob" }
    );
  }

  cancelInvoice(id, mark) {
    return axios.get(MIDDLEWARE_ULR + "/pdf/cancelInvoice/" + id + "/" + mark, {
      headers: AuthHeader(),
    });
  }

  updatePdfData(formData, id) {
    return axios.put(
      MIDDLEWARE_ULR + "/pdf/" + id,
      { formData },
      { headers: AuthHeader() }
    );
  }

  getPdfData(id) {
    return axios.get(MIDDLEWARE_ULR + "/pdf/" + id, { headers: AuthHeader() });
  }

  getInvoices(id) {
    return axios.get(MIDDLEWARE_ULR + "/pdf/invoices/" + id, {
      headers: AuthHeader(),
    });
  }

  getSeries(id) {
    return axios.get(MIDDLEWARE_ULR + "/pdf/series/" + id, {
      headers: AuthHeader(),
    });
  }

  getMarks(id) {
    return axios.get(MIDDLEWARE_ULR + "/pdf/getMarks/" + id, {
      headers: AuthHeader(),
    });
  }

  getCustomerByMark(mark) {
    return axios.get(MIDDLEWARE_ULR + "/pdf/getCustomerByMark/" + mark, {
      headers: AuthHeader(),
    });
  }

  getMaxSerialNumber(serie, id) {
    return axios.post(MIDDLEWARE_ULR + "/pdf/getMaxSerialNumber/" + id, serie, {
      headers: AuthHeader(),
    });
  }

  getDocument(userId, documentId) {
    return axios.get(
      MIDDLEWARE_ULR + "/pdf/document/" + userId + "/" + documentId,
      {
        headers: AuthHeader(),
        responseType: "blob",
      }
    );
  }
}

export default new PdfService();
