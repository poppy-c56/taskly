import axios from "axios";

axios.defaults.baseURL =
  import.meta.env.REACT_APP_API_URL || "http://localhost:5000";

axios.defaults.headers.post["Content-Type"] = "application/json";

const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
    return Promise.reject(error);
  }
);

export default axios;
