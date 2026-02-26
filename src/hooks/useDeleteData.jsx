/* import axios from "axios";
import baseURL from "../API/baseURL";
const useDeleteData=async (url,params)=>{
    const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token_popeShounda")}` }
    }
    const res = await baseURL.delete(url,config);
    return res;
}
export default useDeleteData;
 */

import baseURL from "../API/baseURL";
import { handleUnauthenticated } from "./handleUnauthenticated";

const useDeleteData = async (url, params) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token_popeShounda")}` },
    };
    const res = await baseURL.delete(url, config);
    return res;
  } catch (error) {
    handleUnauthenticated(error);
  }
};

export default useDeleteData;
