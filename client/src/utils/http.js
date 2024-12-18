import axios from "axios";

const BASEURL = "http://localhost:4001/api";
const timeoutmsg = "waiting for too long...Request aborted!";

const config = {
  baseURL: BASEURL,
  timeout: 20000,
  timeoutErrorMessage: timeoutmsg,
};

const axiosInstance = axios.create(config);

export default axiosInstance;
