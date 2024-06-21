import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
  } from "./types";
  
  import AuthService from "../services/AuthService";
  
  export const register = (formData) => (dispatch) => {
    return AuthService.register(formData).then(
      (response) => {
        dispatch({
          type: REGISTER_SUCCESS,
        });
        return response;
      }
    ).catch((error) => {
        dispatch({
          type: REGISTER_FAIL,
        });
        return Promise.reject(error);  // Reject the promise here
    });    
  };
  
  export const login = (formData) => (dispatch) => {
    return AuthService.login(formData).then(
      ({ data, status }) => {  // Destructure to get status and data separately
        dispatch({
          type: LOGIN_SUCCESS,
          payload: { user: data },
        });
        return { data, status };  // Pass along status for further handling
      },
      (error) => {
        const message = (error.response && error.response.data && error.response.data.message) ||
          error.message || error.toString();
        console.log("Error", message);
        console.log("Status Code", error.response ? error.response.status : "No response status");
  
        return Promise.reject(error);
      }
    );
  };
  
  
  export const logout = () => (dispatch) => {
    AuthService.logout();
  
    dispatch({
      type: LOGOUT,
    });
  };
  