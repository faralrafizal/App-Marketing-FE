// 'use client'
import axios from "axios";
import { redirect } from "next/navigation";
import { log } from "next/dist/server/typescript/utils";
import { data } from "autoprefixer";
// import { useSession } from "next-auth/react";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../../config/auth";

// let basicUrl = "http://localhost:8033"; //local
let basicUrl = process.env.NEXT_PUBLIC_DEVELOPMENT; //server
let tokenHardcode = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9wcm9maWxlIjoxOSwibmFtZSI6IklkZWxpYSIsImVtYWlsIjoiaWRlbGlhQGlsY3MuY29tIiwidXNlcm5hbWUiOiJjaGFybGVzXzIiLCJwb3NpdGlvbiI6bnVsbCwicGhvbmVfbnVtYmVyIjoiMDg3ODEyMzQiLCJpZF9yb2xlIjoxMiwicm9sZV9uYW1lIjoiU3VwZXJhZG1pbiBBbGwiLCJjb21wYW55IjoiQ01DIiwiaWF0IjoxNzAzNzU0MTAyfQ.2qSnu0AQGBjMp2mWTfHJh6FfxDP1Ps7BG8WZY1TQDTY"
// const userSession = useSession();
// const token = userSession?.data?.user?.responseResult?.token;

// let userSession = await getServerSession(authOptions);
// let token
// let id_role

export const Fetch = async ({ Url = basicUrl, method, url, data, token = tokenHardcode }) => {
  // if (!token) {
  //   redirect("/login");
  // }
  return await axios({
    method: method,
    url: Url + url,
    data: data,
    cache: false,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const FetchData = async ({ methode, url, data = {}, token = tokenHardcode }) => {
  try {
    let result = await Fetch({
      method: methode,
      url: url,
      data: data,
      token: token
    });
    return { ...result.data, status: result.status, code: 1 };
  } catch (error) {
    return { code: 0, data: error.response }
  }
};

export const getAllKeyword = async (token) => {
  return await FetchData({
    methode: "POST",
    url: "/get-all-keyword",
    data: {},
    token: token
  });
};
export const locationWork = async (token) => {
  return await FetchData({
    methode: "Get",
    url: "/find-detail-location-work",
    data: {},
    token: token
  });
};
export const getCheckDocument = async (data) => {
  return await FetchData({
    methode: "GET",
    url: "/check-document?doc_name=" + data,
    data: {},
  });
};
export const miniDashboard = async (token) => {
  return await FetchData({
    methode: "POST",
    url: "/mini-dashboard",
    data: {},
    token: token
  });
};
export const EditProfile = async (data) => {
  return await FetchData({
    methode: "POST",
    url: "/edit-profile",
    data,
  });
};
export const UpdateProgresProject = async (data) => {
  return await FetchData({
    methode: "POST",
    url: "/add-status-bulk",
    data: data,
  });
};
export const cekProjectCode = async (data, token) => {
  return await FetchData({
    methode: "POST",
    url: "/check-project-code",
    data: data,
    token
  });
};
export const coordinatorByLocation = async (data, token, params) => {
  return await FetchData({
    methode: "POST",
    url: "/get-data-coordinator?id_location=" + params,
    data: data,
    token
  });
};

export const MarketirByCoordinator = async (data, token, params) => {
  return await FetchData({
    methode: "POST",
    url: "/get-data-marketing?id_leader=" + params,
    data: data,
    token
  });
};
export const ListDashboard = async (data = {}, token) => {
  let dataMiniDashboard = await FetchData({
    methode: "POST",
    url: "/data-dashboard",
    data: data,
    token: token
  });
  return dataMiniDashboard;
};
export const AddActivity = async (data = {}) => {
  return await FetchData({
    methode: "POST",
    url: "/add-daily-activity",
    data: data,
  });
};

export const getAllProcurement = async (token) => {
  return await FetchData({
    methode: "POST",
    url: "/get-all-procurement-type",
    data: {},
    token
  });
};
export const getAllStatus = async (token) => {
  return await FetchData({
    methode: "POST",
    url: "/get-all-status",
    data: {},
    token
  });
};

export const createProject = async (data) => {
  return await FetchData({
    methode: "POST",
    url: "/create-project",
    data: data,
  });
};

export const getAllLocation = async (token) => {
  return await FetchData({
    methode: "POST",
    url: "/get-all-location-city",
    data: {},
    token
  });
};

export const getAllMarketing = async () => {
  return await FetchData({
    methode: "POST",
    url: "/get-all-marketing",
    data: {},
  });
};

export const getAllMarketingCoordinator = async (token) => {
  return await FetchData({
    methode: "POST",
    url: "/get-marketing-coordinator",
    data: {},
    token: token
  });
};
export const getAllDaily = async ({ searchTerm, page, size, token }) => {
  return await FetchData({
    methode: "POST",
    url: "/get-all-daily-project",
    data: {
      status: "temp",
      "searchWord": searchTerm,
      "size": size,
      "page": page
    },
    token
  });
};
export const progressDetail = async (id) => {
  return await FetchData({
    methode: "GET",
    url: "/get-progress-detail?id_project=" + id,
  });
};

export const FetchRoleLevel = async () => {
  return await Fetch({
    method: "POST",
    url: `/get-role-level`,
  });
};
export const getOneStructureOrgan = async (id) => {
  return await FetchData({
    methode: "POST",
    url: `/get-data-coordinator?id_location=` + id,
  });
};
export const approveStatusProject = async (data) => {
  return await FetchData({
    methode: "POST",
    url: `/approve-status-project`,
    data: data
  });
};
export const getMarketingCoor = async (id) => {
  return await FetchData({
    methode: "POST",
    url: `/get-data-marketing?id_leader=` + id,
  });
};

export const getLocation = async (latitude, longitude) => {
  return await Fetch({
    method: "GET",
    Url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
    url: "",
  });
};

export const GetAllProject = async (data, token) => {
  try {
    const response = await Fetch({
      method: "POST",
      url: `/get-all-project-new`,
      data: data,
      token: token
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      return error;
    }
  }
};

export const GetAllMaster = async (data, token, url) => {
  try {
    const response = await Fetch({
      method: "POST",
      url: url,
      data: data,
      token: token
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      return error;
    }
  }
};

export const GetAllUser = async () => {
  try {
    const response = await Fetch({
      method: "POST",
      url: `/get-all-user`,
    });
    return response?.data?.responseResult?.rows;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.status;
    } else {
      return error;
    }
  }
};

export const GetStructureData = async (token) => {
  try {
    const response = await Fetch({
      method: "POST",
      url: `/get-hierarchy-structure`,
    });
    console.log(response);
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

export const DownloadTemplate = async () => {
  try {
    if (typeof window !== 'undefined') {
      window.open(basicUrl + '/template', '_blank');
    }
  } catch (error) {
    return error
  }
}
