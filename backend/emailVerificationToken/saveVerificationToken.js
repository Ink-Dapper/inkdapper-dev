const tokenStore = new Map();

export const saveVerificationToken = async (email, token) => {
  tokenStore.set(email, token);
};

export const getVerificationToken = async (email) => {
  return tokenStore.get(email);
};