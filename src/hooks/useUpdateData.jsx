/* import axios from "axios";

import baseURL from "../API/baseURL";
const usePutDataWithDifferentFormat=async (url,params)=>{
    const config={
        headers:{"content-type":"multipart/form-data",Authorization:`Bearer ${localStorage.getItem('token_popeShounda')}`}
    }
    const res= await baseURL.put(url,params,config)
    return res;
}
const usePutDate=async (url,params)=>{
    const config={
        headers:{Authorization:`Bearer ${localStorage.getItem('token_popeShounda')}`}
    }
    const res= await baseURL.put(url,params,config)
    return res;
}
export {usePutDataWithDifferentFormat,usePutDate}; */

import baseURL from "../API/baseURL";
import { handleUnauthenticated } from "./handleUnauthenticated";

const usePutDataWithDifferentFormat = async (url, params) => {
  try {
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token_popeShounda")}`,
      },
    };
    const res = await baseURL.put(url, params, config);
    return res;
  } catch (error) {
    handleUnauthenticated(error);
  }
};

const usePutDate = async (url, params) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token_popeShounda")}` },
    };
    const res = await baseURL.put(url, params, config);
    return res;
  } catch (error) {
    handleUnauthenticated(error);
  }
};

export { usePutDataWithDifferentFormat, usePutDate };
