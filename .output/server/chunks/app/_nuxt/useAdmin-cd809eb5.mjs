import { ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';

const haveAccess = ref(false);
const adminPassword = ref("");
const adminStorageName = "m";
const dcBotConnected = ref(false);
const mdbConnectMethod = ref("");
function useAdmin() {
  const adminStorage = useLocalStorage(adminStorageName, {});
  const savePassword = () => {
    adminStorage.value.k = adminPassword.value;
  };
  const adminAction = (action, loading) => {
    if (loading) {
      loading.value = true;
    }
    savePassword();
    $fetch("/api/admin", {
      method: "POST",
      body: {
        passwd: adminPassword.value,
        action
      }
    }).then((res) => {
      haveAccess.value = Boolean(res == null ? void 0 : res.pass);
      if (res === null) {
        return;
      }
      dcBotConnected.value = res.dcBotConnected;
      mdbConnectMethod.value = res.mdbConnectMethod;
    }).finally(() => {
      if (loading) {
        loading.value = false;
      }
    });
  };
  return {
    haveAccess,
    dcBotConnected,
    mdbConnectMethod,
    adminAction,
    password: adminPassword
  };
}

export { useAdmin as u };
//# sourceMappingURL=useAdmin-cd809eb5.mjs.map
