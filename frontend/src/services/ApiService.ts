import api from "../axios/axiosConfig";
import type { AxiosResponse } from "axios";
import type { User, Job } from "../types";

export class ApiService {
  baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  registerUser = (
    user: User,
  ): Promise<AxiosResponse<{ user: User; accessToken: string }>> => {
    return api.post(`${this.baseURL}/auth/register`, user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  loginUser = (
    credentials: { email: string; password: string },
  ): Promise<AxiosResponse<{ user: User; accessToken: string }>> => {
    return api.post(`${this.baseURL}/auth/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  getMe = (): Promise<AxiosResponse<User>> => {
    return api.get(`${this.baseURL}/auth/me`);
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
