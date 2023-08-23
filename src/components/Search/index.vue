<template>
  <div class="min-h-[100vh] mt-6 px-6 max-w-6xl mx-auto text-black">
    <template v-for="item in searchResult" :key="item.url">
      <template v-if="item.type === 'stream'">
        <div class="flex cursor-pointer" @click="router.push(item.url)">
          <div class="max-w-full">
            <div class="w-[360px] h-52 overflow-hidden relative">
              <div class="inline-flex max-w-full max-h-full">
                <img :src="item.thumbnail" alt="" width="360" />
                <span
                  class="absolute bottom-[15px] right-[10px] text-white bg-black"
                  >{{ convertTimer(item.duration) }}</span
                >
              </div>
            </div>
          </div>
          <div class="flex flex-col ml-6">
            <h3 class="font-semibold text-lg">{{ item.title }}</h3>

            <div>
              <span>{{ formatViews(item.views) }} views • </span>
              <span>{{ item.uploadedDate }} </span>
            </div>

            <div class="mt-2">
              <div class="max-w-full flex">
                <div class="w-7 h-7 rounded-full overflow-hidden">
                  <img :src="item.uploaderAvatar" alt="" />
                </div>
                <span class="ml-2">
                  {{ item.uploaderName }}
                </span>
              </div>
            </div>

            <div class="lg:mt-2">
              <span>{{ item.shortDescription }}</span>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
<script setup>
import axios from "axios";
import { useLoadingBar } from "naive-ui";
import { onMounted, ref, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getNextData } from "../../utils/getNextData";
import { formatViews } from "../../utils/formatViews";
import { convertTimer } from "../../utils/convertTime";

const searchResult = ref([]);
const route = useRoute();
const router = useRouter();

const loadingBar = useLoadingBar();
const isLoading = ref(false);
const nextPageData = ref();
const filter = ref("all");
const getData = async (q) => {
  try {
    loadingBar.start();
    const { data } = await axios.get(`/search?q=${q}&filter=${filter.value}`);
    searchResult.value = data.items;
    document.title = `${q} || VueTube`;
    loadingBar.finish();
  } catch (error) {
    console.log(error);
    loadingBar.error();
  }
};

const handleUpdateResult = () => getData(route.query.q);

const handleScroll = async () => {
  const endOfPage =
    window.scrollY + window.innerHeight >= document.body.offsetHeight;
  if (!endOfPage || !nextPageData.value) return;
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    const res = await getNextData({
      type: "search",
      nextpage: nextPageData.value,
      options: {
        filter: filter.value,
        q: route.query.q,
      },
    });
    nextPageData.value = res.nextpage;
    searchResult.value = [...searchResult.value, ...res.items];
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getData(route.query.q);
  window.addEventListener("scroll", handleScroll);
  window.scrollTo(0, 0);
});

onBeforeUnmount(() => window.removeEventListener("scroll", handleScroll));

watch(route, ({ query }) => {
  searchResult.value = [];
  window.scrollTo(0, 0);
  getData(query.q);
});
</script>
