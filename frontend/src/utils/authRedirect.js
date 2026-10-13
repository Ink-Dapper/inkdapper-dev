import { toast } from 'react-toastify';

/**
 * Post-login redirect helpers.
 *
 * When a guest tries to do something that needs an account (add to cart, buy now,
 * wishlist, checkout, view orders…) we remember where they were — and what they
 * were trying to do — send them to /login, and bring them straight back once
 * they're signed in. The pending action is then completed automatically.
 *
 * The target is kept in sessionStorage (per-tab, survives a full reload such as the
 * 401 interceptor's hard redirect) and mirrored into router state as a fallback.
 */

const STORAGE_KEY = 'inkdapper:postLoginRedirect';
const MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes — anything older is stale
const LOGIN_PATH = '/login';

export const PENDING_ACTIONS = Object.freeze({
  ADD_TO_CART: 'addToCart',
  BUY_NOW: 'buyNow',
  ADD_COMBO: 'addCombo',
  WISHLIST: 'wishlist',
});

/** Only allow same-origin, non-login paths so we never bounce to an external URL. */
export const isSafeRedirectPath = (path) =>
  typeof path === 'string' &&
  path.startsWith('/') &&
  !path.startsWith('//') &&
  path !== LOGIN_PATH &&
  !path.startsWith(`${LOGIN_PATH}?`) &&
  !path.startsWith(`${LOGIN_PATH}/`);

/** Current URL (path + query + hash) — the "exact" page the user is on. */
export const buildCurrentPath = () => {
  if (typeof window === 'undefined') return '/';
  const { pathname, search, hash } = window.location;
  return `${pathname}${search}${hash}`;
};

export const savePostLoginRedirect = (path = buildCurrentPath(), resume = null) => {
  if (!isSafeRedirectPath(path)) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ path, resume, savedAt: Date.now() }));
  } catch (error) {
    console.warn('Unable to save post-login redirect:', error);
  }
};

export const clearPostLoginRedirect = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
};

/** Read the pending redirect without clearing it. Returns null if none / stale / unsafe. */
export const peekPostLoginRedirect = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const isFresh = typeof parsed?.savedAt === 'number' && Date.now() - parsed.savedAt <= MAX_AGE_MS;
    if (!isFresh || !isSafeRedirectPath(parsed.path)) {
      clearPostLoginRedirect();
      return null;
    }
    return { path: parsed.path, resume: parsed.resume ?? null };
  } catch {
    clearPostLoginRedirect();
    return null;
  }
};

/** Read and clear the pending redirect in one go. */
export const consumePostLoginRedirect = () => {
  const pending = peekPostLoginRedirect();
  clearPostLoginRedirect();
  return pending;
};

/**
 * Send a guest to the login page, remembering where to bring them back to.
 *
 * @param {Function} navigate  react-router navigate()
 * @param {Object}   options
 * @param {string}   [options.path]    Where to return to. Defaults to the current URL.
 * @param {Object}   [options.resume]  Action to complete after login (see PENDING_ACTIONS).
 * @param {string|null} [options.message] Toast shown before redirecting. Pass null to skip.
 */
export const redirectToLogin = (navigate, { path = buildCurrentPath(), resume = null, message = 'Please login to continue' } = {}) => {
  savePostLoginRedirect(path, resume);

  if (message) {
    toast.info(message, { autoClose: 1800, pauseOnHover: false, toastId: 'login-required' });
  }

  if (typeof navigate === 'function') {
    navigate(LOGIN_PATH, { state: { from: path, resume } });
  } else if (typeof window !== 'undefined') {
    window.location.assign(LOGIN_PATH);
  }

  try {
    window.scrollTo(0, 0);
  } catch {
    /* ignore */
  }
};
