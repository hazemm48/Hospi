/* const baseApi = "https://graceful-jay-cowboy-hat.cyclic.app/api/v1";*/
const baseApi = "https://hospi-server.onrender.com/api/v1";
//const baseApi = "http://localhost:3000/api/v1";
const api = `${baseApi}/admin`;

const headers = {
  Accept: "application/json",
  Authorization: `SIM ${localStorage.token}`,
  "Content-Type": "application/json",
};

export const login = async (body) =>
  await fetch(`${baseApi}/signIn`, {
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
    headers,
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const changePass = async (body) => {
  let data = await fetch(`${api}/changePass`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers,
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const updateUser = async (body) => {
  let data = await fetch(`${api}/updateUser`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers,
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};
export const deleteUser = async (body) => {
  let data = await fetch(`${api}/deleteUser`, {
    method: "Delete",
    body: JSON.stringify(body),
    headers,
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const addUser = async (body) => {
  let data = await fetch(`${api}/addUser`, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const reserve = async (body) => {
  let data = await fetch(`${api}/reserve/${body.oper}`, {
    method: "POST",
    body: JSON.stringify(body.data),
    headers,
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const note = async (body) => {
  let data = await fetch(`${api}/note?${body.query}`, {
    ...body.data,
    headers,
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const getGeneral = async (body) => {
  let data = await fetch(`${api}/getGeneral`, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const rooms = async (body, method, url) => {
  let data = await fetch(`${api}/room/${url ? url : ""}`, {
    method: method,
    body: JSON.stringify(body),
    headers,
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const resetPassword = async (body) => {
  let data = await fetch(`${api}/resetPassword`, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const uploadFile = async (body, url) => {
  let data = await fetch(`${baseApi}/fileUpload/${url}`, {
    method: "POST",
    body: body,
    headers: {
      Accept: "application/json",
      Authorization: `SIM ${localStorage.token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const removeFile = async (body, url) => {
  let data = await fetch(`${baseApi}/fileUpload/${url}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const medicalRecord = async (body, method, url) => {
  let data = await fetch(`${baseApi}/medicalRecord/${url ? url : ""}`, {
    method: method,
    body: JSON.stringify(body),
    headers,
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const generatePresc = async (body) => {
  let data = await fetch(`${api}/generatePresc`, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const firstAids = async (body, method, url) => {
  let data = await fetch(`${api}/firstAid/${url ? url : ""}`, {
    method: method,
    body: JSON.stringify(body),
    headers,
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};
