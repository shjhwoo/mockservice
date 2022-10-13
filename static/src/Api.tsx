import axios from "axios";
import { token } from "./GlobalState";

type header = { [k: string]: string | boolean };

interface option {
  method: string;
  url: string;
  data?: any;
  headers?: header;
}

interface token {
  accessToken: string;
  refreshToken: string;
}

class Api {
  constructor() {}
  //권한을 필요로 하는 공통 요청:: withCredentials: true
  async requestWithCookies(option: option) {
    try {
      option.data.accToken = token.accessToken;
      option.headers = { withCredentials: true };
      const response = await axios(option);

      if (response.status === 401) {
        //가지고 있는 리프레시 쿠키로 액세스 토큰 요청
        option.method = "POST";
        option.url = "http://localhost:5001/refreshaccesstoken";
        option.data = { accessToken: "accessToken string" };
        option.headers = { withCredentials: true };
        const refreshTokenResponse = await axios(option);

        if (refreshTokenResponse.status === 401) {
          //리프레시 토큰마저도 무쓸모.. SSO가 있는지 확인하러 가야함
          option.method = "GET";
          option.url = "http://localhost:5001/checksso";
          option.data = null;
          const SSOresponse = await axios(option);

          const ssoCheckRedirectionURL = SSOresponse.data.redirectionURL;
          return ssoCheckRedirectionURL;
        }

        if (refreshTokenResponse.status === 200) {
          //가지고 있는 액세스 토큰으로 요청 한번 더 보낸다.
          option.data.accessToken = refreshTokenResponse.data.accessToken;
          option.headers = { withCredentials: true };
          const response = await axios(option);
          return response;
        }
      } else {
        //서비스 토큰이 정상인 경우
        return response;
      }
    } catch (e) {
      console.error(e);
    }
  }

  //서비스 토큰의 유효성을 확인하는 요청
  async checkServiceToken(token: token) {
    try {
      const { accessToken, refreshToken } = token;
      const option = {
        method: "POST",
        url: "http://localhost:5001/checkservicetkn",
        data: { accessToken, refreshToken },
        headers: { withCredentials: true }, //액세스 토큰과 리프레시 토큰 모두 한꺼번에 보내서 검증한다.
      };
      const response = await axios(option);
      return response;
    } catch (e) {
      console.error(e);
    }
  }
}

const api = new Api();

export default api;
