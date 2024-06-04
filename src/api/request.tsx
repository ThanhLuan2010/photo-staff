import { store } from "../store/store.tsx";
export function objectToFormData(obj: any) {
  let formData = new FormData();
  for (let key in obj) {
    formData.append(key, obj[key]);
  }
  return formData;
}
export const BASE_URL = "https://membershipbe.phototimevn.com/v1/";
// export const BASE_URL = "http://localhost:3000/v1/";

type optionType = {
  method?: string;
  params?: any;
  headers: any;
  body?: any;
};

export const request = async (
  url: string,
  body?: any,
  method?: string,
  params?: any,
  isFormData?: boolean
) => {
  // const state = store.getState();
  // const auth = state.auth;
  const { auth } = store.getState("auth");
  let option: optionType = {
    method: method ? method : "GET",
    params: params ? params : {},
    headers: {
      Accept: isFormData ? "multipart/form-data" : "application/json",
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      Authorization: `Bearer ${auth.token}`,
      "Access-Control-Allow-Origin": "*",
    },
  };
  let _query = "";
  for (const key in params) {
    _query += `&${key}=${params[key]}`;
  }
  const reqbody = isFormData ? objectToFormData(body) : JSON.stringify(body);
  if (body) {
    option["body"] = reqbody;
  }
  try {
    const response = await fetch(
      `${BASE_URL}${url}${_query?.replace("&", "?")} `,
      // `http://phototimesrv.duckdns.org:3000/v1/${url}${_query?.replace('&', '?')} `,
      { ...option, mode: "cors" }
    );
    if (response.status === 401) {
      // xử lý trở về login
    }
    const resJson = await response.json();

    return resJson;
  } catch (e) {
    console.log("=====e====", e);
  }
};
