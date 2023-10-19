import { b as useLocale, g as useNuxtApp, n as navigateTo } from '../server.mjs';
import { ref } from 'vue';
import { E as ElMessage } from './index-b5dcb285.mjs';
import { E as ElLoading } from './index-87837fbe.mjs';

var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _target;
class CustomEventTarget {
  constructor() {
    __privateAdd(this, _target, void 0);
    __privateSet(this, _target, new EventTarget());
  }
  addListener(type, callback) {
    try {
      __privateGet(this, _target).addEventListener(type, callback);
    } catch {
    }
  }
  removeListener(type, callback) {
    try {
      __privateGet(this, _target).removeEventListener(type, callback);
    } catch {
    }
  }
  dispatchEvent(type) {
    __privateGet(this, _target).dispatchEvent(new Event(type));
  }
}
_target = /* @__PURE__ */ new WeakMap();
const authEventTarget = new CustomEventTarget();
const email = ref("");
const username = ref("");
const authlvl = ref(0);
const authIsLoading = ref(false);
const isLoggedIn = ref(false);
function setIsLoggedIn(value) {
  isLoggedIn.value = value;
}
const logout = async () => {
  authIsLoading.value = true;
  try {
    await $fetch("/api/auth/logout", {
      method: "POST"
    });
    email.value = "";
    username.value = "";
    authlvl.value = 0;
    setIsLoggedIn(false);
    authEventTarget.dispatchEvent("logout");
    ElMessage.success("Logged out.");
  } catch {
    ElMessage.error("Log out failed.");
  } finally {
    authIsLoading.value = false;
  }
};
let lastChecked = 0;
const checkIsLoggedIn = async (force = false) => {
  const now = Date.now();
  if (!force && now - lastChecked < 6e4) {
    return isLoggedIn.value;
  }
  authIsLoading.value = true;
  try {
    const { isLoggedIn: _isLoggedIn, user } = await $fetch("/api/auth/check", {
      method: "POST"
    });
    lastChecked = now;
    email.value = (user == null ? void 0 : user.email) || "";
    username.value = (user == null ? void 0 : user.username) || "";
    authlvl.value = (user == null ? void 0 : user.authlvl) || 0;
    authIsLoading.value = false;
    setTimeout(() => setIsLoggedIn(_isLoggedIn), 0);
    return _isLoggedIn;
  } catch {
    authIsLoading.value = false;
  }
};
const changeUsername = async (newUsername) => {
  try {
    const { error } = await $fetch("/api/auth/username", {
      method: "PUT",
      body: { username: newUsername }
    });
    if (error) {
      throw error;
    }
    await checkIsLoggedIn(true);
    ElMessage.success("The username has been changed.");
    return true;
  } catch (err) {
    ElMessage.error(typeof err === "string" ? err : "Oops! Something went wrong.");
    return false;
  }
};
function useAuth() {
  const _t = useLocale().t;
  async function login(usernameOrEmail, password) {
    const loading = ElLoading.service({ text: _t("auth.loggingIn") });
    authIsLoading.value = true;
    try {
      const res = await $fetch("/api/auth/login", {
        method: "POST",
        body: { usernameOrEmail, password }
      });
      const { error } = res;
      if (error) {
        throw error;
      }
      authEventTarget.dispatchEvent("login");
      await navigateTo("/");
      await checkIsLoggedIn(true);
      ElMessage.success("Logged in.");
    } catch (err) {
      ElMessage.error(typeof err === "string" ? err : "Oops! Something went wrong.");
    } finally {
      loading.close();
      authIsLoading.value = false;
    }
  }
  return {
    authEventTarget,
    authIsLoading,
    isLoggedIn,
    email,
    username,
    authlvl,
    login,
    logout,
    checkIsLoggedIn,
    setIsLoggedIn,
    changeUsername,
    goToHome() {
      useNuxtApp().$router.replace("/");
    },
    goToNewChat() {
      useNuxtApp().$router.replace("/c/");
    }
  };
}

export { useAuth as u };
//# sourceMappingURL=useAuth-70a427e4.mjs.map
