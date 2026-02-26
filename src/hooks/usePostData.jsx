/* import axios from "axios";
import baseURL from "../API/baseURL";
const usePostDataWithDifferentFormat=async (url,params)=>{
    const config={
        headers:{"content-type":"multipart/form-data",Authorization:`Bearer ${localStorage.getItem('token_popeShounda')}`}
    }
    const res= await baseURL.post(url,params,config)
    return res;
}
const usePostData=async (url,params)=>{
    const config={
        headers:{Authorization:`Bearer ${localStorage.getItem('token_popeShounda')}`}
    }
    const res= await baseURL.post(url,params,config)
    return res;
}
export {usePostDataWithDifferentFormat,usePostData}; */

import baseURL from "../API/baseURL";
import { handleUnauthenticated } from "./handleUnauthenticated";

const usePostDataWithDifferentFormat = async (url, params) => {
  try {
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token_popeShounda")}`,
      },
    };
    const res = await baseURL.post(url, params, config);
    return res;
  } catch (error) {
    handleUnauthenticated(error);
  }
};

const usePostData = async (url, params) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token_popeShounda")}` },
    };
    const res = await baseURL.post(url, params, config);
    return res;
  } catch (error) {
    handleUnauthenticated(error);
  }
};

export { usePostDataWithDifferentFormat, usePostData };
