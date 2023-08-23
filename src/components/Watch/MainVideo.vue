<template>
  <template v-if="video.livestream">
    <iframe
      :src="`https://www.youtube-nocookie.com/embed/${route.query.v}?autoplay=1&amp;modestbranding=1`"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    >
    </iframe>
  </template>

  <template v-else>
    <custom-video
      :videoStreams="video.videoStreams"
      :audioStreams="video.audioStreams"
      :nextVideo="getNextVideo"
      :duration="video.duration"
      :thumbnail="video.thumbnailUrl"
      @time-update="getTimeUpdate"
    ></custom-video>

    <div class="mt-4">
      <h1 class="text-xl font-semibold">{{ video.title }}</h1>
    </div>

    <div class="flex justify-between items-center mt-4">
      <div class="flex items-center">
        <div>
          <img :src="video.uploaderAvatar" alt="" class="rounded-full" />
        </div>
        <div class="ml-2">
          <h1>{{ video.uploader }}</h1>
          <span
            >{{ formatViews(video.uploaderSubscriberCount) }} người đăng
            ký</span
          >
        </div>

        <div
          class="ml-8 px-3 py-2 bg-red-600 rounded-lg font-semibold text-white"
        >
          <button>Đăng kí</button>
        </div>
      </div>

      <div class="flex">
        <div class="p-3 bg-slate-100 rounded-xl text-base mr-2">
          <span class="mr-2">{{ formatViews(video.likes) }}</span>
          <font-awesome-icon :icon="['fas', 'thumbs-up']" />
        </div>

        <div class="p-3 bg-slate-100 rounded-xl text-base">
          <span class="mr-2">{{ formatViews(video.dislikes) }}</span>
          <font-awesome-icon :icon="['fas', 'thumbs-down']" />
        </div>
      </div>
    </div>

    <div class="mt-2 p-2 bg-slate-100 inline-block font-semibold">
      <span>{{ formatCommaViews(video.views) }} lượt xem - </span>
      <span>{{ video.uploadDate?.split("-").reverse().join("-") }}</span>
    </div>

    <div class="mt-4 bg-slate-100 p-4">
      <n-collapse arrow-placement="right" :style="{ color: '#000' }">
        <n-collapse-item title="Show more" :style="{ color: '#000' }">
          <span v-html="renderHTML(video.description)" />
        </n-collapse-item>
      </n-collapse>
    </div>
  </template>
</template>

<script setup>
import CustomVideo from "../Watch/CustomVideo.vue";
import { useRoute, useRouter } from "vue-router";
import { formatViews, formatCommaViews } from "../../utils/formatViews";
import { NCollapse, NCollapseItem } from "naive-ui";
import { renderHTML } from "../../utils/renderHTML";
const route = useRoute();
const router = useRouter();
const { video } = defineProps(["video"]);

const emit = defineEmits(["time-update"]);

const getTimeUpdate = ({ currentTime }) => {
  emit("time-update", { currentTime });
};

const getNextVideo = async () => {
  if (route.query.list) {
    const currentIndex = route.query.index ?? 1;
    const playlistId = route.query.list;
    const { data } = await axios.get(`/playlists/${playlistId} `);
    const nextVideoUrl = data.relatedStreams[currentIndex].url;
    return `${nextVideoUrl}&list=${playlistId}&index=${+currentIndex + 1}`;
  }
  const videos = video.relatedStreams.filter((v) => v.type === "stream");
  return videos[Math.floor(Math.random() * videos.length)].url;
};
</script>

<style scoped>
.n-collapse-item__header {
  color: #000;
}
</style>
