import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { LoginInputState, SignupInputState } from "@/schema/userSchema";
import { toast } from "sonner";

// const API_END_POINT = "http://localhost:5173/api/v1/user"
const API_END_POINT = "http://localhost:5173/api/v1/user";

axios.defaults.withCredentials = true;

type User = {
    fullname:string;
    email:string;
    contact:number;
    address:string;
    city:string;
    country:string;
    profilePicture:string;
    admin:boolean;
    isVerified:boolean;
}

type UserState = {
    user: User | null;
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    loading: boolean;
    signup: (input:SignupInputState) => Promise<void>;
    login: (input:LoginInputState) => Promise<void>;
    verifyEmail: (verificationCode: string) => Promise<void>;
    checkAuthentication: () => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email:string) => Promise<void>; 
    resetPassword: (token:string, newPassword:string) => Promise<void>; 
    updateProfile: (input:any) => Promise<void>; 
}

export const useUserStore = create<UserState>()(persist((set) => ({
    user: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    loading: false,
    // signup api implementation
    signup: async (input: SignupInputState) => { 
        try {
            // console.log("Starting signup process...");
            set({ loading: true });
    
            const response = await axios.post(`${API_END_POINT}/signup`, input, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // console.log("Signup response:", response.data);
    
            if (response.data.success) { 
                toast.success(response.data.message);
                set({ loading: false, user: response.data.user, isAuthenticated: true });
            } else {
                // console.log("Signup failed:", response.data.message);
                set({ loading: false });
            }
        } catch (error: any) {
            console.error("Signup error:", error);
            toast.error(error.response?.data?.message || "An error occurred during signup");
            set({ loading: false });
        }
    },
    login: async (input: LoginInputState) => {
        try {
        //   console.log("Starting login process...");
          set({ loading: true });
      
          const response = await axios.post(`${API_END_POINT}/login`, input, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        //   console.log("Login response:", response.data);
      
          if (response.data.success) { 
            toast.success(response.data.message);
            set({ loading: false, user: response.data.user, isAuthenticated: true });
          } else {
            // console.log("Login failed:", response.data.message);
            set({ loading: false });
          }
        } catch (error: any) {
          console.error("Login error:", error);
          toast.error(error.response?.data?.message || "An error occurred during login");
          set({ loading: false });
        }
      }
,
    verifyEmail: async (verificationCode: string) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/verify-email`, { verificationCode }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false, user: response.data.user, isAuthenticated: true });
            }
        } catch (error: any) {
            toast.success(error.response.data.message);
            set({ loading: false });
        }
    },
    checkAuthentication: async () => {
        try {
            // console.log("start")
            set({ isCheckingAuth: true });
            const response = await axios.get(`${API_END_POINT}/check-auth`);
            if (response.data.success) {
                set({user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
            }
            // console.log("end")
        } catch (error) {
            set({isAuthenticated: false, isCheckingAuth: false });
        }
    },
    logout: async () => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/logout`);
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false, user: null, isAuthenticated: false })
            }
        } catch (error:any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    forgotPassword: async (email: string) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/forgot-password`, { email });
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false });
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    resetPassword: async (token: string, newPassword: string) => {
        try {
            set({ loading: true });
            // console.log("start..")
            const response = await axios.post(`${API_END_POINT}/resetpassword/${token}`, { newPassword });
            // console.log("start2..")
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false });
            }
            // console.log("start3..")

        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    updateProfile: async (input:any) => {
        try { 
            const response = await axios.put(`${API_END_POINT}/profile/update`, input,{
                headers:{
                    'Content-Type':'application/json'
                }
            });
            if(response.data.success){
                toast.success(response.data.message);
                set({user:response.data.user, isAuthenticated:true});
            }
        } catch (error:any) { 
            toast.error(error.response.data.message);
        }
    }
}),
    {
        name: 'user-name',
        storage: createJSONStorage(() => localStorage),
    }
))