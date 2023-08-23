<template>
  <div class="py-[25px] px-[30px] min-h-screen">
    <div class="max-w-[1440px] mt-0 mx-auto">
      <template v-if="Object.keys(video).length">
        <div class="grid grid-cols-12 gap-x-12 gap-y-0">
          <div class="lg:col-span-8 col-span-full">
            <template v-if="video.title">
              <main-video :video="video"></main-video>
            </template>

            <div class="mt-12">
              <comment
                :uploader="video.uploader"
                :uploaderAvatar="video.uploaderAvatar"
              />
            </div>
          </div>

          <div class="lg:col-span-4 col-span-full">
            <related-video
              :relatedVideos="video.relatedStreams"
            ></related-video>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatViews } from "../../utils/formatViews";
import { useLoadingBar } from "naive-ui";
import MainVideo from "../Watch/MainVideo.vue";
import RelatedVideo from "../Watch/RelatedVideo.vue";
import Comment from "../Watch/Comment.vue";
const route = useRoute();
const router = useRouter();
const loading = useLoadingBar();
const { v } = route.query;
const playlistId = ref(route.query.list);
const video = ref({});

const getVideo = async (id) => {
  try {
    loading.start();
    const { data } = await axios.get(`/streams/${id}`);

    video.value = data;
    document.title = `${data.title} | VueTube`;
    loading.finish();
    return video.value;
  } catch (error) {
    loading.error();
    console.log(error);
  }
};

onMounted(async () => {
  const data = await getVideo(v);
});

watch(route, async ({ query }) => {
  window.scrollTo(0, 0);
  playlistId.value = route.query.list;
  const data = await getVideo(query.v);
});
</script>
