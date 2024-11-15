export function authHeader() {
  // Retrieve token from local storage
  const token = localStorage.getItem('token');

  if (token) {
    // Return authorization header with JWT token
    return { 'Authorization': 'Bearer ' + token };
  } else {
    // Return empty object if no token
    return {};
  }
}