import AppProperty from "../../constants/AppProperty";
import axios from "axios";

const publicRequest = axios.create({
  baseURL: AppProperty.INLACO_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicRequest;
