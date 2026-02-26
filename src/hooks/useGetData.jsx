/* 
import axios from "axios";
import baseURL from "../API/baseURL";
const useGetData=async (url,params)=>{
    const res= await baseURL.get(url,params)
    return res.data;
}

const useGetDataWithToken=async (url,params)=>{
    const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token_popeShounda")}` }
    }
    const res= await baseURL.get(url,config)
    return res.data;
}
export { useGetData,useGetDataWithToken} 
*/

import baseURL from "../API/baseURL";
import { handleUnauthenticated } from "./handleUnauthenticated";

const useGetData = async (url, params) => {
  try {
    const res = await baseURL.get(url, params);
    return res.data;
  } catch (error) {
    handleUnauthenticated(error);
  }
};

const useGetDataWithToken = async (url, params) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token_popeShounda")}` },
    };
    const res = await baseURL.get(url, config);
    return res.data;
  } catch (error) {
    handleUnauthenticated(error);
  }
};

export { useGetData, useGetDataWithToken };
