<script setup>
import { RouterView } from "vue-router";
import { localDB } from "./utils/localDB";
import NavBar from "./components/NavBar.vue";

import { NLoadingBarProvider, NConfigProvider } from "naive-ui";
import { onMounted, ref } from "vue";

const themeOverrides = {
  Collapse: {
    textColor: "#000",
  },
};

onMounted(() => {
  const { init } = localDB();
  init();
});
</script>

<template>
  <div>
    <n-config-provider :theme-overrides="themeOverrides">
      <n-loading-bar-provider>
        <nav-bar @toggle-theme="handleToggleTheme"></nav-bar>
        <div id="">
          <RouterView />
        </div>
      </n-loading-bar-provider>
    </n-config-provider>
  </div>
</template>
