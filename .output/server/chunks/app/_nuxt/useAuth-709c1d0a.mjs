import { a as useLocale, g as useNuxtApp, n as navigateTo } from '../server.mjs';
import { ref } from 'vue';
import { u as useChat, E as ElLoading } from './useChat-5060e158.mjs';
import { a as ElMessage } from './index-97682a6c.mjs';

const email = ref("");
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
    email.value = "";
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
  const login = async (usernameOrEmail, password) => {
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
      navigateTo("/c/");
      await checkIsLoggedIn(true);
      ElMessage.success("Logged in.");
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
    email,
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
//# sourceMappingURL=useAuth-709c1d0a.mjs.map
