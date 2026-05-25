import api from "../axios/axiosConfig";
import type { AxiosResponse } from "axios";
import type { User, Job } from "../types";

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

export class ApiService {
  baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  registerUser = (
    user: User,
  ): Promise<AxiosResponse<AuthResponse>> => {
    return api.post(`${this.baseURL}/auth/register`, user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  loginUser = (credentials: {
    email: string;
    password: string;
  }): Promise<AxiosResponse<AuthResponse>> => {
    return api.post(`${this.baseURL}/auth/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  getMe = (): Promise<AxiosResponse<User>> => {
    return api.get(`${this.baseURL}/auth/me`);
  };

  forgotPassword = (email: string): Promise<AxiosResponse<void>> => {
    return api.post(`${this.baseURL}/auth/forgot-password`, { email });
  };

  resetPassword = (
    payload: ResetPasswordPayload,
  ): Promise<AxiosResponse<void>> => {
    return api.post(`${this.baseURL}/auth/reset-password`, payload);
  };

  getAllUsers = (): Promise<AxiosResponse<User[]>> => {
    return api.get(`${this.baseURL}/users`);
  };

  getUserById = (userId: string | number): Promise<AxiosResponse<User>> => {
    return api.get(`${this.baseURL}/users/${userId}`);
  };

  updateUser = (
    userId: string | number,
    updatedUser: Partial<User>,
  ): Promise<AxiosResponse<User>> => {
    return api.put(`${this.baseURL}/users/${userId}`, { ...updatedUser });
  };

  deleteUser = (userId: string | number): Promise<AxiosResponse<void>> => {
    return api.delete(`${this.baseURL}/users/${userId}`);
  };

  getAllJobs = (): Promise<AxiosResponse<Job[]>> => {
    return api.get(`${this.baseURL}/jobs`);
  };

  getJobById = (jobId: string | number): Promise<AxiosResponse<Job>> => {
    return api.get(`${this.baseURL}/jobs/${jobId}`);
  };

  deleteJob = (jobId: string | number): Promise<AxiosResponse<void>> => {
    return api.delete(`${this.baseURL}/jobs/${jobId}`);
  };
  updateJob = (
    jobId: string | number,
    updatedJob: Partial<Job>,
  ): Promise<AxiosResponse<Job>> => {
    return api.put(`${this.baseURL}/jobs/${jobId}`, { ...updatedJob });
  };

  postJob = (newJob: Job): Promise<AxiosResponse<Job>> => {
    return api.post(`${this.baseURL}/jobs`, newJob, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
}
