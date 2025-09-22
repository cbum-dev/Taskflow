import axios, { AxiosResponse } from "axios";
import { useAuthStore } from "@/store/authStore";

export interface AITaskResponse {
  success: boolean;
  count: number;
  message?: string;
  tasks: Array<{
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    projectId: string;
    workspaceId: string;
    reporterId: string;
    assigneeId: string;
    createdAt: string;
    updatedAt: string;
  }>;
  error?: string;
  details?: string;
}

export interface AIHealthResponse {
  success: boolean;
  message: string;
  model: string;
  error?: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://taskflow-backend-dkwh.onrender.com/api",
  timeout: 45000, // Increased timeout for AI operations
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const { access_token } = useAuthStore.getState();
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with improved error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle network errors
    if (!error.response) {
      error.code = 'NETWORK_ERROR';
      return Promise.reject(error);
    }
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {

        const { refreshToken } = useAuthStore.getState();
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'https://taskflow-backend-dkwh.onrender.com/api'}/auth/refresh-token`,
            { refreshToken }
          );
          
          const { access_token: newAccessToken, refresh_token: newRefreshToken } = response.data;
          useAuthStore.setState({
            access_token: newAccessToken,
            refreshToken: newRefreshToken
          });
          
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, log the user out
        useAuthStore.getState().clearUser();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// AI Service
const aiService = {
  generateTasks: async (data: {
    prompt: string;
    projectId: string;
    workspaceId: string;
  }): Promise<AxiosResponse<AITaskResponse>> => {
    return api.post('/ai/generate-tasks', data);
  },

  checkHealth: async (): Promise<AxiosResponse<AIHealthResponse>> => {
    return api.get('/ai/health');
  },
  // Update issue status is now a standalone function
};

// Function to update issue status
export const updateIssueStatus = async (id: string, status: string, token: string) => {
  const response = await api.put(
    `/issues/${id}`, 
    { status },
    { 
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

export { aiService };
export default api;