import axios from "axios";
import autoBind from "auto-bind";

export default class ApiBase {
  axiosClient;

  constructor({ baseURL, formData, commonHeaders, timeout = 4000 }) {
    this.axiosClient = axios.create({
      baseURL,
      timeout,
      headers: {
        Accept: "application/json",
        "Content-Type": formData ? "multipart/form-data" : "application/json",
        ...commonHeaders,
      },
    });

    this.axiosClient.interceptors.response.use(
      (response) => response,
      (error) => {
        const errorData = error.response?.data ?? {};
        console.log("this is an error", error);

        if (error.response) {
          const statusCode = error.response.status;
          console.log("error area");
          switch (statusCode) {
            case 400:
              errorData.message = "Bad Request: " + errorData.message;
              break;
            case 401:
              errorData.message = "Unauthorized: " + errorData.message;
              break;
            case 403:
              errorData.message = "Forbidden: " + errorData.message;
              break;
            case 404:
              errorData.message = "Not Found: " + errorData.message;
              break;
            default:
              errorData.message = "Unhandled Error: " + errorData.message;
          }
        } else {
          errorData.message = "Network Error: Unable to reach the server.";
        }

        throw errorData;
      }
    );
    autoBind(this);
  }

  async request({ options, fullResponse }) {
    console.log(options);
    const response = await this.axiosClient.request(options);
    if (fullResponse) return fullResponse;
    return response?.data;
  }

  async get({ url, params, fullResponse = false, others }) {
    const options = {
      url,
      method: "get",
      params,
      ...others,
    };
    return this.request({ options, fullResponse });
  }

  async post({ url, data, fullResponse = false, others }) {
    const options = {
      url,
      method: "post",
      data,
      ...others,
    };
    return this.request({ options, fullResponse });
  }

  async put({ url, data, fullResponse = false, others }) {
    const options = {
      url,
      method: "put",
      data,
      ...others,
    };
    return this.request({ options, fullResponse });
  }

  async delete({ url, params, fullResponse = false, others }) {
    const options = {
      url,
      method: "delete",
      params,
      ...others,
    };
    return this.request({ options, fullResponse });
  }
}
