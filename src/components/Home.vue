<template>
  <div
    class="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-x-2 gap-y-4 pt-2 hover:cursor-pointer mx-16"
  >
    <div v-for="video in videos" :key="video.url" class="p-2">
      <div
        class="max-w-full max-h-full aspect-video relative"
        @click="router.push(video.url)"
      >
        <img :src="video.thumbnail" alt="" class="object-fill h-full" />
        <span class="absolute bottom-[5px] right-[5px] text-white bg-black">
          {{ convertTimer(video.duration) }}</span
        >
      </div>
      <div class="flex mt-3">
        <div class="mt-3 mr-3 h-9">
          <div class="w-9 h-9 rounded-full overflow-hidden">
            <img :src="video.uploaderAvatar" alt="" />
          </div>
        </div>

        <div class="ml-4">
          <h5
            class="line-clamp-2 font-semibold my-2"
            @click="router.push(video.url)"
          >
            {{ video.title }}
          </h5>
          <span>{{ video.uploaderName }}</span>
          <div class="text-xs text-slate-600 mt-2">
            <span>{{ formatViews(video.views) }} views - </span>
            <span>{{ video.uploadedDate }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { formatViews } from "../utils/formatViews";
import { convertTimer } from "../utils/convertTime";
import { useRouter } from "vue-router";
const videos = ref(null);
const fetchVideos = ref([]);
const router = useRouter();

const nextTrendingData = async () => {
  const endOfPage =
    window.scrollY + window.innerHeight >= document.body.offsetHeight - 200;
  if (!endOfPage) return;
  try {
    let selectedVideo = null;
    do {
      selectedVideo =
        videos.value[Math.floor(Math.random() * videos.value.length)];
    } while (fetchVideos.value.includes(selectedVideo.url));
    fetchVideos.value.push(selectedVideo.url);
    const { data } = await axios.get(
      `/streams/${selectedVideo.url.split("=")[1]}`
    );
    const removeShorts = data.relatedStreams.filter(
      (s) => s.type === "stream" && !s.isShort
    );
    const removeDuplicateVideos = [
      ...new Map(
        [...videos.value, ...removeShorts].map((v) => [v["url"], v])
      ).values(),
    ];
    videos.value = removeDuplicateVideos;
  } catch (error) {
    console.log(error);
  }
};
onMounted(async () => {
  try {
    const { data } = await axios.get(
      `/trending?region=${localStorage["countryCode"] || "VN"}`
    );
    videos.value = data.filter((v) => !v.isShort);
    document.title = "VueTube";
    window.addEventListener("scroll", nextTrendingData);
    window.scrollTo(0, 0);
  } catch (error) {
    console.log(error);
  }
  console.log(videos);
});
</script>
