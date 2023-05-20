 const api = "https://graceful-jay-cowboy-hat.cyclic.app/api/v1/admin";
const loginApi = "https://graceful-jay-cowboy-hat.cyclic.app/api/v1/adminLogin"; 
/*const api = "http://localhost:3000/api/v1/admin";
const loginApi = "http://localhost:3000/api/v1/adminLogin";*/

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
  return data;
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
export const deleteUser = async (body) => {
  let data = await fetch(`${api}/deleteUser`, {
    method: "Delete",
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

export const reserve = async (body) => {
  let data = await fetch(`${api}/reserve/${body.oper}`, {
    method: "POST",
    body: JSON.stringify(body.data),
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

export const note = async (body) => {
  let data = await fetch(`${api}/note`, {
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
  return data;
};

export const getGeneral = async (body) => {
  let data = await fetch(`${api}/getGeneral`, {
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
  return data;
};

export const rooms = async (body, method, url) => {
  let data = await fetch(`${api}/room/${url}`, {
    method: method,
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

export const uploadFile = async (body) => {
  let data = await fetch(`${api}/uptest`, {
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
