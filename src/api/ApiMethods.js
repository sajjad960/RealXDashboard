import autoBind from "auto-bind";
import ApiBase from "./Abstractions/ApiBase";

export default class ApiMethods extends ApiBase {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  async register(data) {
    const passingData = {
      url: "/users/signup",
      data,
      fullResponse: false,
      others: undefined,
    };
    const resultData = await this.post(passingData);
    return resultData;
  }

  async login(data) {
    const passingData = {
      url: "/users/login",
      data,
      fullResponse: false,
      others: undefined,
    };
    const resultData = await this.post(passingData);
    return resultData;
  }

  async userProfile() {
    const passingData = {
      url: "/users/me",
      params: {},
      fullResponse: false,
      others: undefined,
    };
    const resultData = await this.get(passingData);
    return resultData;
  }

  async getDashboardData() {
    const passingData = {
      url: "/products/dashboard-details",
      params: {},
      fullResponse: false,
      others: undefined,
    };
    const resultData = await this.get(passingData);
    return resultData;
  }

  async createProduct(data) {
    const formData = new FormData();

    Object.keys(data).forEach((item) => {
      formData.append(item, data[item]);
    })

    console.log("maked Data", formData);
  
    const passingData = {
      url: `/products?url=${data?.url}`,
      data: formData,
      fullResponse: false,
      others: undefined,
    };
    const resultData = await this.post(passingData);
    return resultData;
  }

  async getProducts(filters) {
    const passingData = {
      url: "/products",
      params: filters,
      fullResponse: false,
      others: undefined,
    };
    const resultData = await this.get(passingData);
    return resultData;
  }

  async getComments(postId) {
    const passingData = {
      url: `/comments/${postId}`,
      params: {},
      fullResponse: false,
      others: undefined,
    };
    const resultData = await this.get(passingData);
    return resultData;
  }

  async createComments(data) {
    const passingData = {
      url: "/comments",
      data,
      fullResponse: false,
      others: undefined,
    };
    const resultData = await this.post(passingData);
    return resultData;
  }
}
