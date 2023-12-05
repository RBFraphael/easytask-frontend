import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from "axios";

const WebApi: AxiosInstance = axios.create({
    headers: {
        'Content-Type': "application/json",
        'Accept': "application/json",
    }
});

const PublicApi: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': "application/json",
        'Accept': "application/json",
    }
});

const PrivateApi: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': "application/json",
        'Accept': "application/json",
    }
});

PrivateApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if(token){
            config.headers = {
                ...config.headers,
                'Authorization': `Bearer ${token}`
            };
        }
        return config;
    }
);

PrivateApi.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    async (error: AxiosError) => {
        const originalRequest = error.config! as any;
        const token = localStorage.getItem("access_token");
        console.log(error);
        if(error.response!.status == 401 && !originalRequest._retry && token){
            originalRequest._retry = true;
            
            const newToken: any = await refreshToken();

            if(newToken!.access_token){
                localStorage.setItem("access_token", newToken.access_token);
                originalRequest.headers = {
                    ...originalRequest.headers,
                    'Authorization': `Bearer ${newToken.access_token}`
                };
            }

            return axios(originalRequest);
        }

        return Promise.reject(error);
    }
);

async function refreshToken()
{
    const token = localStorage.getItem("access_token");
    const headers = {
        'Content-Type': "application/json",
        'Accept': "application/json",
        'Authorization': `Bearer ${token}`
    };

    let newToken = null;

    await PublicApi.post("/auth/refresh", {}, { headers }).then((res: AxiosResponse) => {
        const data = res.data;
        if(data.access_token){
            newToken = data;
        }
    }).catch(() => {
        localStorage.removeItem("access_token");
        window.location.href = "/";
    });

    return newToken;
}

export {
    WebApi,
    PublicApi,
    PrivateApi
};
