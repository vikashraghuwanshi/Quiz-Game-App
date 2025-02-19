// auth_service.js
const SERVER_TYPE = "rest"; // change this to "rest" if needed
const BASE_URL = "http://192.168.1.3:9000";

export const loginUser = async (username, password) => {
  return SERVER_TYPE === "rest"
    ? loginWithRest(username, password)
    : loginWithGraphQL(username, password);
};

export const registerUser = async (username, password) => {
  return SERVER_TYPE === "rest"
    ? registerWithRest(username, password)
    : registerWithGraphQL(username, password);
};

// REST API Login
const loginWithRest = async (username, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Login failed.");
  return data.token;
};

// GraphQL Login
const loginWithGraphQL = async (username, password) => {
  const response = await fetch(`${BASE_URL}/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        mutation Login($username: String!, $password: String!) {
          login(username: $username, password: $password)
        }
      `,
      variables: { username, password },
    }),
  });

  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0]?.message || "Login failed.");
  return data.login;
};

// REST API Register
const registerWithRest = async (username, password) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Registration failed.");
  return data;
};

// GraphQL Register
const registerWithGraphQL = async (username, password) => {
  const response = await fetch(`${BASE_URL}/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        mutation Register($username: String!, $password: String!) {
          register(username: $username, password: $password) {
            id
            username
          }
        }
      `,
      variables: { username, password },
    }),
  });

  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0]?.message || "Registration failed.");
  return data.register;
};
