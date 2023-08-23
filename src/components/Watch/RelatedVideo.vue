<template>
  <router-link
    v-for="video in getVideos([...relatedVideos, ...nextVideos])"
    :key="video.url"
    class="video flex justify-start mb-3 cursor-pointer"
    :to="video.url"
  >
    <template v-if="!video.url.includes(list)">
      <div class="max-w-full">
        <div class="relative aspect-video h-24 rounded-lg overflow-hidden">
          <img :src="video.thumbnail" alt="" :style="{ height: '100%' }" />

          <template v-if="video.duration < 0">
            <div class="absolute bottom-1 right-1 bg-red-500 text-white">
              LIVE
            </div>
          </template>

          <template v-else-if="video.type === 'playlist'">
            <div
              class="h-[30%] right-0 left-0 bottom-0 rounded-lg bg-slate-800 text-white flex justify-center items-center"
            >
              <font-awesome-icon :icon="['fas', 'tower-broadcast']" />
            </div>
          </template>

          <template v-else>
            <div class="absolute bottom-1 right-1 bg-white">
              {{ convertTimer(video.duration) }}
            </div>
          </template>
        </div>
      </div>

      <div class="max-w-full">
        <div class="videoDetail flex justify-start">
          <span class="line-clamp-2 font-semibold">{{ video.title }}</span>
          <span>{{ video.uploaderName }}</span>
          <span>{{ formatViews(video.views) }}</span>
        </div>
      </div>
    </template>
  </router-link>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { ref, watch } from "vue";
import { formatViews } from "../../utils/formatViews";
import { convertTimer } from "../../utils/convertTime";
const route = useRoute();
const router = useRouter();
const { list } = route.query;
const fetchedVideos = ref([]);
const nextVideos = ref([]);
const { relatedVideos } = defineProps(["relatedVideos"]);

const handleRedirectPlaylist = async (url) => {
  if (url.includes("watch?v=")) {
    router.push(url.replace("&playnext=1", ""));
    return;
  }
  const list = url.split("list=")[1];
  const { data } = await axios.get(`/playlists/${list}`);
  router.push(`${data.relatedStreams?.[0].url}&list=${list}`);
};

const handleLoadMoreRelatedVideos = async (relatedVideos) => {
  try {
    let selectedVideo = null;
    do {
      selectedVideo =
        relatedVideos[Math.floor(Math.random() * relatedVideos.length)];
    } while (fetchedVideos.value.includes(selectedVideo.url));
    fetchedVideos.value.push(selectedVideo.url);
    const { data } = await axios.get(
      `/streams/${selectedVideo.url.split("=")[1]}`
    );
    const removeShorts = data.relatedStreams.filter((s) => !s.isShort);
    nextVideos.value = [...nextVideos.value, ...removeShorts];
  } catch (err) {
    console.error(err);
  }
};

const getVideos = (listVideos) => [
  ...new Map(listVideos.map((v) => [v["url"], v])).values(),
];
watch(route, () => (nextVideos.value = []));
</script>

<style scoped>
.video {
  gap: 8px 12px;
}

.videoDetail {
  flex-flow: column;
}

.videoTitle {
  flex-flow: column;
}
</style>
