const sessionMap = new Map();

export function setSession(token, data) {
  sessionMap.set(token, data);
}

export function getSession(token) {
  return sessionMap.get(token);
}

export function clearSession(token) {
  sessionMap.delete(token);
}