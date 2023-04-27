import axios from "axios";

export async function callApiAxios(httpMethod:string,url:string,data:{})
{
  let json = {
    httpMethod,
    url,
    data

  }
  try{
 const axiosResponse = await axios({
  method: httpMethod,
  url: url,
  data:data
})
  return axiosResponse
}catch(error){
console.log(error)
throw error
}
};

