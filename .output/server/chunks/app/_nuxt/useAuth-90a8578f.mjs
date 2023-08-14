import { b as useLocale, e as useNuxtApp, n as navigateTo } from '../server.mjs';
import { ref } from 'vue';
import { u as useChat, E as ElLoading } from './useChat-b3932e96.mjs';
import { E as ElMessage } from './index-a6b52926.mjs';

const username = ref("");
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
    username.value = "";
    setIsLoggedIn(false);
    ElMessage.success("Logged out.");
    useChat().clear();
  } catch {
    ElMessage.error("Log out failed.");
  } finally {
    authIsLoading.value = false;
  }
};
let lastChecked = 0;
const checkIsLoggedIn = async () => {
  const now = Date.now();
  if (now - lastChecked < 6e4) {
    return isLoggedIn.value;
  }
  authIsLoading.value = true;
  try {
    const { isLoggedIn: _isLoggedIn, user } = await $fetch("/api/auth/check", {
      method: "POST"
    });
    lastChecked = now;
    username.value = (user == null ? void 0 : user.username) || "";
    authIsLoading.value = false;
    setTimeout(() => setIsLoggedIn(_isLoggedIn), 0);
    return _isLoggedIn;
  } catch {
    authIsLoading.value = false;
  }
};
const changeUsername = async (newUsername) => {
  try {
    const { error, username: _username } = await $fetch("/api/auth/username", {
      method: "PUT",
      body: { username: newUsername }
    });
    if (error) {
      throw error;
    }
    if (_username) {
      username.value = _username;
    }
    ElMessage.success("The username has been changed.");
    return true;
  } catch (err) {
    ElMessage.error(typeof err === "string" ? err : "Oops! Something went wrong.");
    return false;
  }
};
function useAuth() {
  const _t = useLocale().t;
  const login = async (usernameOrEmail, password) => {
    const loading = ElLoading.service({ text: _t("auth.loggingIn") });
    authIsLoading.value = true;
    try {
      const res = await $fetch("/api/auth/login", {
        method: "POST",
        body: { usernameOrEmail, password }
      });
      const { error, isLoggedIn: _isLoggedIn = false, user } = res;
      if (error) {
        throw error;
      }
      ElMessage.success("Logged in.");
      navigateTo("/c/");
      username.value = (user == null ? void 0 : user.username) || "";
      setTimeout(() => setIsLoggedIn(_isLoggedIn), 0);
    } catch (err) {
      ElMessage.error(typeof err === "string" ? err : "Oops! Something went wrong.");
    } finally {
      loading.close();
      authIsLoading.value = false;
    }
  };
  return {
    authIsLoading,
    isLoggedIn,
    username,
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
//# sourceMappingURL=useAuth-90a8578f.mjs.map
