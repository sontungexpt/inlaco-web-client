import Env from "@/config/env.config";
import axios from "axios";

const publicRequest = axios.create({
  baseURL: Env.BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicRequest;
