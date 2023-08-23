import "../src/assets/style/tailwind.css";
import "../src/assets/style/global.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import axios from "axios";
library.add(fab);
library.add(fas);
import { createApp } from "vue";
axios.defaults.baseURL = "https://pipedapi.kavin.rocks";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
