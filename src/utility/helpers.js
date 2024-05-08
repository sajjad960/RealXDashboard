export const getToken = () => {
  const data = localStorage.getItem("jwt");
  const token = JSON.parse(data);

  if (!token) {
    return "";
  }
  return token;
};

export const setToken = (token) => {
  localStorage.setItem("jwt", JSON.stringify(token));
};


export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:6006/api/v1";
