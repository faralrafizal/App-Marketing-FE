import axios from "axios";
import { redirect } from "next/navigation";
import { Fetch } from "./Api";

export const AddStructure = async (data,token) => {
    try {
      const response = await Fetch({
        method: "POST",
        url: `/add-structur-organ`,
        data: data,
        token: token
      })

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.status;
      } else {
        return error;
      }
    }
} 
