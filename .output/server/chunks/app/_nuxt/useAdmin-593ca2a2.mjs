import { ref, reactive } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { E as ElMessage } from './el-input-45f4404e.mjs';

let adminStorage;
const haveAccess = ref(false);
const adminPassword = ref("");
const adminStorageName = "m";
const adminSettings = reactive({
  dcBotConnected: false
});
function savePassword() {
  adminStorage.value.k = adminPassword.value;
}
function packAdminApiData(data = {}) {
  savePassword();
  return {
    passwd: adminPassword.value,
    ...data
  };
}
function saveSettings(settings) {
  for (const key in settings) {
    adminSettings[key] = settings[key];
  }
}
async function checkAdminLogin() {
  const res = await $fetch("/api/admin/check", {
    method: "POST",
    body: packAdminApiData()
  });
  if (res === null) {
    haveAccess.value = false;
    ElMessage.error("Password incorrect");
  } else {
    haveAccess.value = true;
    saveSettings(res);
    ElMessage.success("Logged in");
  }
}
async function changeSetting(name, value, loadingReactive) {
  if (loadingReactive) {
    loadingReactive[name] = true;
  }
  saveSettings(await $fetch("/api/admin/setting", {
    method: "POST",
    body: packAdminApiData({ name, value })
  }));
  console.log(loadingReactive);
  if (loadingReactive) {
    loadingReactive[name] = false;
  }
}
const curvaUsageList = reactive([]);
async function updateCurvaUsageList() {
  const lastestList = await $fetch("/api/admin/data/curva-record", {
    method: "POST",
    body: packAdminApiData()
  });
  if (!lastestList) {
    ElMessage.error("Curva usage record update failed");
    return;
  }
  curvaUsageList.splice(0, curvaUsageList.length);
  curvaUsageList.push(...lastestList);
}
function useAdmin() {
  adminStorage = useLocalStorage(adminStorageName, {});
  return {
    haveAccess,
    adminPassword,
    adminSettings,
    checkAdminLogin,
    changeSetting,
    curvaUsageList,
    updateCurvaUsageList
  };
}

export { useAdmin as u };
//# sourceMappingURL=useAdmin-593ca2a2.mjs.map
