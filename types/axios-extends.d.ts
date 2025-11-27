import { AxiosRequestConfig } from "axios";

export type AxiosRequestConfigExtends = AxiosRequestConfig<any> & {
  _skip_no_network_retry?: boolean;
  _navigate_to_login_if_unauthorized?: boolean;
  _optional_jwt_auth?: boolean;
};
