import axios from "axios";
import AuthHeader from "./AuthHeader";
import { MIDDLEWARE_ULR } from "../config/constant";

class ProductService {
  getProducts(id) {
    return axios.get(MIDDLEWARE_ULR + "/product/" + id, {
      headers: AuthHeader(),
    });
  }

  addProduct(formData, id) {
    return axios.post(
      MIDDLEWARE_ULR + "/product/create/" + id,
      { formData },
      { headers: AuthHeader() }
    );
  }

  updateProduct(formData, id) {
    return axios.put(
      MIDDLEWARE_ULR + "/product/" + id,
      { formData },
      { headers: AuthHeader() }
    );
  }

  deleteProduct(userId, id) {
    return axios.delete(MIDDLEWARE_ULR + "/product/" + userId + "/" + id, {
      headers: AuthHeader(),
    });
  }
}

export default new ProductService();
