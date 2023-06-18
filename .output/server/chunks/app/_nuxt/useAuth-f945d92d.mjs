import { h as useLocale, g as useNuxtApp, n as navigateTo } from '../server.mjs';
import { ref } from 'vue';
import { E as ElLoading, u as useChat } from './useChat-d48ae5aa.mjs';
import { E as ElMessage } from './index-e055d37d.mjs';

const isLoading = ref(false);
const isLoggedIn = ref(false);
const logout = async () => {
  isLoading.value = true;
  try {
    await $fetch("/api/auth/logout", {
      method: "POST"
    });
    isLoggedIn.value = false;
    ElMessage.success("Logged out.");
    useChat().clear();
  } catch {
    ElMessage.error("Log out failed.");
  } finally {
    isLoading.value = false;
  }
};
let lastChecked = 0;
const checkIsLoggedIn = async () => {
  const now = Date.now();
  if (now - lastChecked < 6e4) {
    return isLoggedIn.value;
  }
  isLoading.value = true;
  try {
    const _isLoggedIn = (await $fetch("/api/auth/check", {
      method: "POST"
    })).isLoggedIn;
    lastChecked = now;
    isLoggedIn.value = _isLoggedIn;
    isLoading.value = false;
    return _isLoggedIn;
  } catch {
    isLoading.value = false;
  }
};
(async () => {
  const loading = ElLoading.service();
  try {
    await checkIsLoggedIn();
  } finally {
    loading.close();
  }
})();
function useAuth() {
  const _t = useLocale().t;
  const login = (usernameOrEmail, password) => {
    const loading = ElLoading.service({
      text: _t("auth.loggingIn")
    });
    isLoading.value = true;
    $fetch("/api/auth/login", {
      method: "POST",
      body: { usernameOrEmail, password }
    }).then((_res) => {
      const res = _res;
      if (res == null ? void 0 : res.error) {
        ElMessage.error(res == null ? void 0 : res.error);
      } else {
        ElMessage.success("Logged in.");
        navigateTo("/c/");
        isLoggedIn.value = true;
      }
    }).catch(() => {
      ElMessage.error("Oops! Something went wrong.");
    }).finally(() => {
      loading.close();
      isLoading.value = false;
    });
  };
  return {
    isLoading,
    isLoggedIn,
    login,
    logout,
    checkIsLoggedIn,
    setIsLoggedIn(value) {
      isLoggedIn.value = value;
    },
    goToHome() {
      useNuxtApp().$router.replace("/");
    },
    goToNewChat() {
      useNuxtApp().$router.replace("/c/");
    }
  };
}

export { useAuth as u };
//# sourceMappingURL=useAuth-f945d92d.mjs.map
