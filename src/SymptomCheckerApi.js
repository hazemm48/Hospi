import CryptoJS from "crypto-js";

let computedHash = CryptoJS.HmacMD5(
  process.env.REACT_APP_AM_BASE_URL,
  process.env.REACT_APP_AM_Secret_key
);
let computedHashString = computedHash.toString(CryptoJS.enc.Base64);

let uri = process.env.REACT_APP_AM_key + ":" + computedHashString;

export const apiMedicLogin = async () => {
  let data = await fetch(process.env.REACT_APP_AM_BASE_URL, {
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

export const mainAPi = async (url, body) => {
  let data = await fetch(
    `${process.env.REACT_APP_AM_Priaid_url}/${url}?token=${
      localStorage.apiMedicToken
    }&language=${process.env.REACT_APP_AM_Language}${body ? body : ""}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => data);
  return data;
};
