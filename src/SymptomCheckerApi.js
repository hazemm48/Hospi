import CryptoJS from "crypto-js";

const api_key = "hazem1abc@gmail.com";
const secret_key = "r2Y6Cfw7W4ZtEi53N";
const BASE_URL = "https://sandbox-authservice.priaid.ch/login";
const priaid_url = "https://sandbox-healthservice.priaid.ch";
const language = "en-gb";

let computedHash = CryptoJS.HmacMD5(BASE_URL, secret_key);
let computedHashString = computedHash.toString(CryptoJS.enc.Base64);

let uri = api_key + ":" + computedHashString;

const headers = {
  Accept: "application/json",
  Authorization: `Bearer ${localStorage.apiMedicToken}`,
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": " GET, POST, PATCH, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": " Origin, Content-Type, X-Auth-Token",
};

export const login = async () => {
  let data = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer" + " " + uri,
    },
  })
    .then((res) => res.json())
    .then((data) => data);
  data.Token && (localStorage.apiMedicToken = data.Token);
  return data;
};

export const mainAPi = async (url,body) => {
  let data = await fetch(
    `${priaid_url}/${url}?token=${localStorage.apiMedicToken}&language=${language}${body?body:""}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => data);
  return data;
};
