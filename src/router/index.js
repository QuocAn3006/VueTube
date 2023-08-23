import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../components/Home.vue"),
    },
    {
      path: "/watch",
      component: () => import("../components/Watch/index.vue"),
    },
    {
      path: "/search",
      component: () => import("../components/Search/index.vue"),
    },
  ],
});

export default router;
