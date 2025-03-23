export const host = "http://localhost:5000";
export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;
export const allUsersRoute = `${host}/api/auth/allUsersRoute`;
export const requestHandling = `${host}/api/auth/contact`;
export const getUserRequests = `${host}/api/auth/getUserRequests`;
export const requestStatus = `${host}/api/auth/requestStatus`;
export const getUserContact = `${host}/api/auth/getUserContact`;

export const allUsers = `${host}/api/auth/allUsers`;
export const userRoleStatue = `${host}/api/auth/userRoleStatue`;
export const deleteUser = `${host}/api/auth/deleteUser`;

export const sendMessageRoute = `${host}/api/messages/postmsg`;
export const recieveMessageRoute = `${host}/api/messages/getmsg`;
export const clearChat1Side = `${host}/api/messages/clearmsgs`;
export const deleteMessage = `${host}/api/messages/deletemsg`;

export const storePrekeyBundle = `${host}/api/auth/store-prekey-bundles`;
export const getPrekeyBundle = `${host}/api/auth/get-prekey-bundles`;
export const storeIdentityKeyPair = `${host}/api/auth/store-identityKeyPair`;
export const getIdentityKeyPair = `${host}/api/auth/get-identityKeyPair`;
export const storeSessionCipher = `${host}/api/auth/store-sessionCipher`;
export const getSessionCipher = `${host}/api/auth/get-sessionCipher`;
