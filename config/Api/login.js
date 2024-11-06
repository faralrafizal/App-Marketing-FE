// 'use client'
import axios from "axios";
// import { signIn } from "next-auth/react";
// import { redirect } from 'next/navigation'
// import { cookies } from 'next/headers';
// axios.interceptors.response.use(((res)=>{
//     return res
// }, (err)=>{
//     if(err.status == 401) {
//         redirect('/login')
//     }
//     return err
// }))

// axios.interceptors.request.use(((req) => {
//     const token =  cookies().get("token")
//     req.headers["Authorization"] = `Bearer ${token}`
//     return req
// }))

let url = process.env.NEXT_PUBLIC_DEVELOPMENT;
// let url = "http://localhost:8033"; //local

const Login = async (payload) => {
  try {
    const response = await axios.post(url + `/login`, {
      username: payload.username,
      password: payload.password,
      system: "web",
    });

    // const req = await signIn('credentials', {
    //   redirect: true,
    //   callbackUrl: '/dashboard',
    //   username: payload.username,
    //   password: payload.password
    // })
    if (typeof window !== 'undefined') {
      sessionStorage.setItem("token", response.data.responseResult.token);
      sessionStorage.setItem("id_role", response.data.responseResult.id_role);
      sessionStorage.setItem("username", response.data.responseResult.username);
      sessionStorage.setItem("position", response.data.responseResult.position);
      sessionStorage.setItem("role", JSON.stringify(response.data.responseResult.role_access));
      let dataUser = response.data.responseResult
      delete dataUser.role_access
      delete dataUser.token
      sessionStorage.setItem("user", JSON.stringify(dataUser));
    }
    return response

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.status;
    } else {
      return error;
    }
  }
};

const ForgotPassword = async (payload) => {
  try {
    const response = await axios.post(url + `/forget-password`, {
      email: payload,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.status;
    } else {
      return error;
    }
  }
};

const ConfirmPassword = async (payload) => {
  try {
    const response = await axios.post(url + `/confirm-password`, {
      token: payload.token,
      password: payload.password,
      confirmPassword: payload.confirmPassword,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.status;
    } else {
      return error;
    }
  }
};

export { Login, ForgotPassword, ConfirmPassword };
