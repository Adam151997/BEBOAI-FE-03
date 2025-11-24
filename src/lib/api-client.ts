import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

// FastAPI v2 base URL - all routes now target /api/v2
const API_BASE_URL = "https://beboai-03-production.up.railway.app/api/v2";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");
    // FastAPI v2 requires org header to be the organization UUID (org.id), not the API key
    const orgId = localStorage.getItem("org_id");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (orgId) {
      config.headers.org = orgId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          // Token refresh now uses FastAPI v2 endpoint
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh-token/`,
            { refresh: refreshToken }
          );

          const { access } = response.data;
          localStorage.setItem("access_token", access);

          // Retry the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };
