import axios from "axios";
import Cookies from "js-cookie";

// Create axios instance
const api = axios.create({
	baseURL: "http://localhost:3000/auth",
	withCredentials: true,
});

// //Request interceptor to add the token
api.interceptors.request.use(
	(config) => {
		const headers = config.headers ?? {};
		const token = Cookies.get("token");
		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}
		config.headers = headers;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);
//Creates a type that will serve as the basis for failed requests
type FailedRequestQueue = {
	onSuccess: (newToken: string) => void;
	onFailure: () => void;
};

let failedRequestsQueue: FailedRequestQueue[] = [];
let isRefreshing = false;

//Interceptor to check if token has expired
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			if (!isRefreshing) {
				isRefreshing = true;
				try {
					const res = await generateRefreshToken();
					Cookies.set("token", res.token);
          for (const request of failedRequestsQueue) {
            request.onSuccess(res.token);
          }
				} catch {
					Cookies.remove("token");
					Cookies.remove("refreshToken");
          for (const request of failedRequestsQueue) {
						request.onFailure();
					};
				} finally {
					failedRequestsQueue = [];
					isRefreshing = false;
				}
			}
			return new Promise((resolve, reject) => {
				failedRequestsQueue.push({
					onSuccess: (newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = newToken;
            } else {
              originalRequest.headers = { Authorization: newToken };
            }
						resolve(api(originalRequest));
					},
					onFailure: () => {
						reject(error);
					},
				});
			});
		}
		return Promise.reject(error);
	},
);

const generateRefreshToken = async () => {
	try {
		const response = await api.get("/refresh");
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export { api };
