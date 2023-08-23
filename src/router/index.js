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
    {
      path: "/logout",
      component: () => import("../components/Logout.vue"),
    },
  ],
});

export default router;
