const api = "https://hospi-server-m0iq3cj9x-hazemm48.vercel.app/api/v1/admin";
const loginApi = "https://hospi-server-m0iq3cj9x-hazemm48.vercel.app/api/v1/adminLogin";

export const login = async (body) =>
  await fetch(loginApi, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data);

export const users = async (body) => {
  let data = await fetch(`${api}/getAllUsers`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Accept: "application/json",
      Authorization: `SIM ${localStorage.token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data);
  return data.users;
};

export const changePass = async (body) => {
  let data = await fetch(`${api}/changePass`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      Accept: "application/json",
      Authorization: `SIM ${localStorage.token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const updateUser = async (body) => {
  let data = await fetch(`${api}/updateUser`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      Accept: "application/json",
      Authorization: `SIM ${localStorage.token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const addUser = async (body) => {
  let data = await fetch(`${api}/addUser`, {
    method: "POST",
    body: JSON.stringify(body.details),
    headers: {
      Accept: "application/json",
      Authorization: `SIM ${localStorage.token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const reserve = async (body) => {
  let data = await fetch(`${api}/reserve/${body.oper}`, {
    method: "POST",
    body: JSON.stringify(body.body),
    headers: {
      Accept: "application/json",
      Authorization: `SIM ${localStorage.token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data);
  return data.reservations;
};