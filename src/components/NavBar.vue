<template>
  <div
    class="fixed h-14 bg-bg-nav w-full flex items-center justify-between py-[10px] px-[32px] z-[99]"
  >
    <div class="flex hover:cursor-pointer" @click="router.push('/')">
      <font-awesome-icon
        :icon="['fas', 'bars']"
        class="text-[#40aa7f] text-2xl"
        @click="activate('left')"
      />
      <div class="text-xl flex items-center pl-6">
        <img src="/favicon.ico" alt="logo" class="w-7" />
        <span class="text-[#40aa7f] font-semibold">ueTube</span>
      </div>
    </div>

    <div class="lg:flex justify-between items-center">
      <form action="" @submit.prevent="handleRedirectSearch(queryString)">
        <div class="h-[34px] bg-white px-4 rounded w-[300px] flex items-center">
          <label for="search">
            <input
              type="text"
              placeholder="Search"
              class="text-black border-none outline-none"
              v-model="queryString"
              @input="handleQuerreSuggest"
              @focus="handleQuerreSuggest"
              @blur="isShowsuggest = false"
            />
            <span class="icon-search pl-20">
              <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
            </span>
          </label>

          <ul
            class="absolute top-14 left-[50%] py-3 text-sm bg-white translate-x-[-58%]"
            v-show="isShowsuggest && suggestOptions.length"
          >
            <li
              class="px-[10px] py-[8px] flex justify-start w-[300px] hover:bg-slate-300 hover:cursor-pointer"
              v-for="suggest in suggestOptions"
              :key="suggest"
              @mousedown="handleRedirectSearch(suggest)"
            >
              <span class="icon-search mr-4">
                <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
              </span>
              <span>{{ suggest }}</span>
            </li>
          </ul>
        </div>
      </form>
    </div>
    <div class="flex items-center justify-center">
      <template v-if="user">
        <div
          class="relative flex items-center cursor-pointer"
          @click="isShowAccount = !isShowAccount"
        >
          <img :src="user.user_metadata.avatar_url" alt="" class="avaImg" />
        </div>

        <template v-if="isShowAccount">
          <div
            class="absolute top-16 right-5 rounded-lg max-w-max bg-white p-4 border-black border"
          >
            <div class="flex flex-col items-center">
              <h6 class="font-semibold mb-2">
                {{ user.user_metadata.full_name }}
              </h6>
              <h6 class="font-semibold mb-2">{{ user.email }}</h6>

              <button
                @click="handleSignOut"
                class="py-2 px-3 text-white bg-[#3b9873]"
              >
                Logout
              </button>
            </div>
          </div>
        </template>
      </template>
      <template v-else>
        <button
          @click="handleSignInWithGoogle"
          class="py-2 px-3 text-white bg-[#3b9873]"
        >
          Login
        </button>
      </template>
    </div>
    <n-drawer v-model:show="active" :width="502" :placement="placement">
      <n-drawer-content>
        <div class="flex text-2xl">
          <img src="/favicon.ico" alt="logo" class="w-7" />
          <span class="text-[#40aa7f] font-semibold">ueTube</span>
        </div>
        <div class="flex text-xl flex-col mt-3 ml-6 justify-center">
          <div class="flex p-2">
            <font-awesome-icon
              :icon="['fas', 'house']"
              class="pr-2 text-[#40aa7f]"
            />
            <h1>Home</h1>
          </div>

          <div class="flex p-2">
            <font-awesome-icon
              :icon="['fas', 'clock-rotate-left']"
              class="pr-2 text-[#40aa7f]"
            />
            <h1>History</h1>
          </div>

          <div class="flex p-2">
            <font-awesome-icon
              :icon="['fas', 'gear']"
              class="pr-2 text-[#40aa7f]"
            />
            <h1>Settings</h1>
          </div>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
  <div class="pt-[54px]"></div>
</template>

<script setup>
import { NDrawer, NSpace, NSwitch, NDrawerContent, NCard } from "naive-ui";
import { onMounted, ref } from "vue";

import { useRouter } from "vue-router";
import { supabase } from "../constants/supabase";
import { getUser, signIn, signOut } from "../composables/AuthProvider";
import axios from "axios";

const user = ref();
const isDark = localStorage.theme === "dark";
const emit = defineEmits(["toggle-theme"]);
const active = ref(false);
const activeSwitch = ref(false);
const isShowAccount = ref(false);
const router = useRouter();
const queryString = ref("");
const isShowsuggest = ref(false);
const suggestOptions = ref([]);
const inputRef = ref();
const placement = ref("left");
const activate = (place) => {
  active.value = true;
  placement.value = place;
};

const handleSignInWithGoogle = async () => {
  user.value = await signIn();
};

const handleSignOut = async () => {
  user.value = await signOut();
};

const handleQuerreSuggest = (querry) => {
  isShowsuggest.value = true;
  const queryString = querry.type ? querry.target.value.trim() : querry.trim();
  if (!queryString) {
    isShowsuggest.value = false;
    return;
  }
  axios.get(`opensearch/suggestions?query=${queryString}`).then(({ data }) => {
    suggestOptions.value = data[1];
  });
};
const handleRedirectSearch = (suggest) => {
  if (!suggest.trim()) return;
  isShowsuggest.value = false;
  queryString.value = suggest.trim();
  router.push(`/search?q=${suggest.trim().split(" ").join("+")}`);
};

onMounted(async () => {
  user.value = await getUser();
  console.log(user.value);
});
</script>

<style lang="css" scope>
.avaImg {
  width: 34px;
  height: 34px;
  border-radius: 50%;
}
</style>
