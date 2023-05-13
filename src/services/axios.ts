import axios, { AxiosRequestConfig } from "axios";

export async function callApiAxios(httpMethod:string,url:string,data:{})
{
  let json = {
    httpMethod,
    url,
    data,

  };

  try {
    let axiosConfig: AxiosRequestConfig = {
      method: httpMethod,
      url: url,
    };

    if (httpMethod.toLowerCase() === "get") {
      axiosConfig.params = data;
    } else {
      axiosConfig.data = data;
    }

    const axiosResponse = await axios(axiosConfig);
    return axiosResponse;
  } catch (error) {
    console.log(error);
    throw error;
  }
};