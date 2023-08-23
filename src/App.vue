<script setup>
import { RouterView } from "vue-router";
import { localDB } from "./utils/localDB";
import NavBar from "./components/NavBar.vue";
import { supabase } from "./constants/supabase";
import {
  NLoadingBarProvider,
  darkTheme,
  lightTheme,
  NConfigProvider,
} from "naive-ui";
import { onMounted, ref } from "vue";

const theme = ref(localStorage.theme === "dark" ? darkTheme : lightTheme);

const handleToggleTheme = () => {
  const currentTheme = theme.value.name;
  theme.value = currentTheme === "light" ? darkTheme : lightTheme;
  localStorage.theme = theme.value.name;
};

const themeOverrides = {
  Collapse: {
    textColor: "#000",
  },
};

onMounted(() => {
  const { init } = localDB();
  init();
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
  });

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session;
  });
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
