/* 
import axios from "axios";
import baseURL from "../API/baseURL";
const usePatchDataWithDifferentFormat=async (url,params)=>{
    const config={
        headers:{"content-type":"multipart/form-data",Authorization:`Bearer ${localStorage.getItem('token_popeShounda')}`}
    }
    const res= await baseURL.patch(url,params,config)
    return res;
}
const usePatchData=async (url,params)=>{
    const config={
        headers:{Authorization:`Bearer ${localStorage.getItem('token_popeShounda')}`}
    }
    const res= await baseURL.patch(url,params,config)
    return res;
}
export {usePatchDataWithDifferentFormat,usePatchData}; */


import baseURL from "../API/baseURL";
import { handleUnauthenticated } from "./handleUnauthenticated";

const usePatchDataWithDifferentFormat = async (url, params) => {
  try {
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token_popeShounda")}`,
      },
    };
    const res = await baseURL.patch(url, params, config);
    return res;
  } catch (error) {
    handleUnauthenticated(error);
  }
};

const usePatchData = async (url, params) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token_popeShounda")}` },
    };
    const res = await baseURL.patch(url, params, config);
    return res;
  } catch (error) {
    handleUnauthenticated(error);
  }
};

export { usePatchDataWithDifferentFormat, usePatchData };
