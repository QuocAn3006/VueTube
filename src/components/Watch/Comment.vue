<template>
  <template v-if="comments.disabled">
    <span>Comments are turn offf</span>
  </template>

  <template v-else-if="comments.length">
    <h4 class="font-semibold text-lg mb-4">Comments</h4>
    <div v-for="comment in comments" :key="comment.commentId" class="mb-5 flex">
      <div class="max-w-full">
        <div class="ava w-12 h-12">
          <img :src="comment.thumbnail" alt="" class="rounded-full" />
        </div>
      </div>
      <div class="flex flex-col ml-4 flex-wrap">
        <template v-if="comment.pined">
          <div class="text-center mb-1">
            <font-awesome-icon :icon="['fas', 'thumbtack']" />
            <span>Ghim bởi {{ uploader }}</span>
          </div>
        </template>

        <div>
          <span class="font-semibold">{{ comment.author }} • </span>
          <span>{{ comment.commentedTime }}</span>
        </div>

        <n-ellipsis expand-trigger="click" line-clamp="3" :tooltip="false">
          <span v-html="renderHTML(comment.commentText)" />
        </n-ellipsis>

        <div class="flex">
          <div class="mr-2">
            <font-awesome-icon :icon="['fas', 'thumbs-up']" />
            <span class="ml-1">{{ formatViews(comment.likeCount) }}</span>
          </div>
          <div>
            <font-awesome-icon :icon="['fas', 'thumbs-down']" />
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { renderHTML } from "../../utils/renderHTML";
import { formatViews } from "../../utils/formatViews";

import { NEllipsis } from "naive-ui";

const { uploader, uploaderAvatar } = defineProps([
  "uploader",
  "uploaderAvatar",
]);
const comments = ref({});
const route = useRoute();
const router = useRouter();
const videoId = route.query.v;
const nextPage = ref();
const getComments = async (id) => {
  try {
    const { data } = await axios.get(`/comments/${id}`);
    comments.value = data.comments;
    nextPage.value = data.nextPage;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getComments(videoId);
});

watch(route, ({ query }) => {
  getComments(query.v);
});
</script>
