<template>
  <div
    class="bg-white aspect-video relative flex items-center justify-center"
    id="player-wrapper"
  >
    <template v-if="onlyAudio">
      <img :src="thumbnail" alt="thumbnail" />
    </template>
    <template v-else>
      <video
        ref="videoRef"
        :src="videoUrl(videoStreams, selectedQuality)"
        :style="{ height: '100%' }"
        @canplay="handlePlayBuffer"
        @pause="handleEventPip('pause')"
        @play="handleEventPip('play')"
        @waiting="handleLoadingMetaData"
        @click="handleClickVideo"
        type="video/*"
      ></video>
    </template>

    <audio
      id="audio"
      ref="audioRef"
      :src="audioUrl(audioStreams)"
      type="audio/*"
      @canplay="handlePlayBuffer"
      @timeupdate="handleTimeUpdate"
      @seeking="isSeeking = true"
      @seeked="isSeeking = false"
      @waiting="handleLoadingMetaData"
    />

    <div class="flex flex-col absolute inset-0">
      <div
        id="player-status"
        class="flex items-center justify-center flex-1"
        @click="handleClickVideo"
      >
        <template v-if="playerStatus === 'loading'">
          <n-spin :size="70" :stroke-width="15" />
        </template>
        <template v-else-if="playerStatus === 'pause'">
          <div class="text-white mb-8">
            <font-awesome-icon icon="play" size="2xl" class="w-24 h-24" />
          </div>
        </template>
      </div>

      <!-- controls -->

      <div
        id="player-controls"
        class="px-3 pb-4 bg-gradient-to-t from-slate-700 to-slate-950 relative cursor-pointer"
      >
        <n-slider
          v-model:value="playedTime"
          :max="duration"
          :format-tooltip="(time) => convertTimer(time)"
          :on-update-value="handleChangeVideoDuration"
        />

        <div class="flex justify-between items-center mt-[6px] mx-4 text-white">
          <div class="left flex items-center justify-start">
            <div @click="handleClickVideo" class="p-2 relative player">
              <font-awesome-icon :icon="['fas', 'pause']" class="icon-pause" />
              <font-awesome-icon :icon="['fas', 'play']" class="icon-play" />
            </div>
            <div class="p-4" @click="handleControlClick('next')">
              <font-awesome-icon
                :icon="['fas', 'forward-step']"
                v-model:value="autoNextVideo"
              />
            </div>

            <div class="flex items-center justify-center">
              <div class="relative volume" @click="toggleMuted">
                <font-awesome-icon
                  :icon="['fas', 'volume-high']"
                  class="unmuted"
                />
                <font-awesome-icon
                  :icon="['fas', 'volume-xmark']"
                  class="muted"
                />
              </div>
              <div class="relative ml-3">
                <n-slider
                  v-model:value="volume"
                  :on-update-value="handleChangeVolume"
                  :step="5"
                  :style="{ width: '60px' }"
                />
              </div>
            </div>

            <div class="ml-3">
              <time>{{ convertTimer(playedTime) }}</time>
              <span> / </span>
              <time>
                {{ convertTimer(duration) }}
              </time>
            </div>
          </div>

          <div class="right flex items-center justify-end">
            <div class="mr-4 setting" @click="openSettingOption">
              <font-awesome-icon :icon="['fas', 'gear']" />
            </div>

            <template v-if="!onlyAudio">
              <n-card
                id="setting-controls"
                size="small"
                :bordered="false"
                :style="{
                  position: 'absolute',
                  bottom: '60px',
                  right: '10px',
                  width: 'max-content',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0,0,0,0.85)',
                  opacity: 0,
                  pointerEvents: 'none',
                  transition: 'opacity 0.2s ease',
                }"
              >
                <n-tabs
                  type="line"
                  animated
                  size="small"
                  :tab-style="{
                    padding: '5px 12px',
                    color: '#fff',
                  }"
                >
                  <n-tab-pane name="quality">
                    <n-list
                      :show-divider="false"
                      hoverable
                      clickable
                      :style="{
                        backgroundColor: 'transparent',
                        fontSize: '12px',
                        color: '#000',
                      }"
                    >
                      <n-scrollbar :style="{ maxHeight: '250px' }">
                        <template
                          v-for="quality in qualities(videoStreams)"
                          :key="quality.quality"
                        >
                          <n-list-item :style="{ padding: '0' }">
                            <div
                              class="p-2 flex text-white items-center"
                              @click="handleSelectedQuality(quality.quality)"
                            >
                              <div
                                class="mr-2 text-white"
                                :style="{
                                  opacity:
                                    parseInt(quality.quality) ===
                                    parseInt(selectedQuality)
                                      ? 1
                                      : 0,
                                }"
                              >
                                <font-awesome-icon :icon="['fas', 'check']" />
                              </div>
                              {{ quality.quality }}
                            </div>
                          </n-list-item>
                        </template>
                      </n-scrollbar>
                    </n-list>
                  </n-tab-pane>

                  <n-tab-pane name="Tốc độ phát">
                    <n-list
                      :show-divider="false"
                      hoverable
                      clickable
                      :style="{
                        backgroundColor: 'transparent',
                        fontSize: '12px',
                        color: '#000',
                      }"
                    >
                      <n-scrollbar :style="{ maxHeight: '250px' }">
                        <template
                          v-for="playbackRate in [1, 2, 3, 4, 5, 6, 7, 8]"
                          :key="playbackRate.playbackRate"
                        >
                          <n-list-item :style="{ padding: '0' }">
                            <div
                              class="p-2 flex text-white items-center"
                              @click="
                                handleSelectPlaybackRate(playbackRate * 0.25)
                              "
                            >
                              <div
                                class="mr-2 text-white"
                                :style="{
                                  opacity:
                                    playbackRate * 0.25 ===
                                    videoRef.playbackRate
                                      ? 1
                                      : 0,
                                }"
                              >
                                <font-awesome-icon :icon="['fas', 'check']" />
                              </div>
                              {{
                                0.25 * playbackRate === 1
                                  ? "Normal"
                                  : 0.25 * playbackRate
                              }}
                            </div>
                          </n-list-item>
                        </template>
                      </n-scrollbar>
                    </n-list>
                  </n-tab-pane>
                </n-tabs>
              </n-card>
            </template>

            <div class="full relative" @click="handleClickFullScreen">
              <font-awesome-icon :icon="['fas', 'expand']" class="icon-full" />
              <font-awesome-icon
                :icon="['fas', 'compress']"
                class="icon-exitfull"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, onBeforeUnmount, reactive, h } from "vue";

import { convertTimer } from "../../utils/convertTime";
import {
  NSlider,
  NSpin,
  NCard,
  NTabs,
  NTabPane,
  NList,
  NListItem,
  NScrollbar,
} from "naive-ui";
import { useRoute, useRouter } from "vue-router";

const {
  videoStreams,
  audioStreams,
  duration,
  nextVideo,
  onlyAudio,
  thumbnail,
} = defineProps([
  "videoStreams",
  "audioStreams",
  "duration",
  "nextVideo",
  "onlyAudio",
  "thumbnail",
]);

const emit = defineEmits(["time-update"]);

let videoProgressInterval = null;
let mouseMoveTimeout = null;
const route = useRoute();
const router = useRouter();
const playedTime = ref(0);
const videoRef = ref();
const audioRef = ref();
const timePercent = ref(0);
const isSeeking = ref(false);
const selectedSubtitle = ref("off");
const playerStatus = ref("play");
const autoNextVideo = ref(localStorage.autoplay ?? true);
const statusFull = ref(false);
const volume = ref(localStorage.volume ? +localStorage.volume : 100);
const selectedQuality = ref(localStorage["resolution"] || "720p");
const isFullScreen = reactive({
  "Full screen": {
    text: "full",
    key: "f",
    isShow: true,
  },
  "Exit full screen": {
    text: "exit",
    key: "f",
    isShow: false,
  },
});

const videoUrl = (streams, quality) => {
  const sortStreams = streams.filter((s) => s.format === "WEBM" && s.videoOnly);
  const video =
    sortStreams.find((s) => s.quality.includes(quality)) || sortStreams[0];
  selectedQuality.value = video.quality;
  return video.url;
};

const audioUrl = (audios) => {
  const bestAudioQuality = audios.sort((a, b) => b.bitrate - a.bitrate)[0];
  return bestAudioQuality.url;
};

// qualities

const qualities = (streams) => {
  const qualities = streams
    .filter((s) => s.format === "WEBM")
    .sort((a, b) => parseInt(b.height) - parseInt(a.height));
  const removeDuplicate = [
    ...new Map(qualities.map((q) => [parseInt(q["quality"]), q])).values(),
  ];
  return removeDuplicate;
};

const handleSelectPlaybackRate = (playbackRate) => {
  videoRef.value.playbackRate = playbackRate;
  audioRef.value.playbackRate = playbackRate;
  closeSettingOption();
};

const handleSelectedQuality = (quality) => {
  selectedQuality.value = quality;
  videoUrl(videoStreams, quality);
  closeSettingOption();
};

const togglePlay = (status) => {
  playerStatus.value = status;
  audioRef.value?.[status]();
  videoRef.value?.[status]();
};

const handlePlayBuffer = () => {
  if (playerStatus.value === "pause") return;
  togglePlay("play");
};

const handleEventPip = (event) => {
  if (!document.pictureInPictureElement) return;
  togglePlay(event);
};
// Click video
const handleClickVideo = () => {
  if (playerStatus.value === "loading") return;
  const isVideoPlaying = !audioRef.value.paused;
  const player = document.querySelector(".player");
  isVideoPlaying ? togglePlay("pause") : togglePlay("play");

  if (isVideoPlaying) {
    player.classList.add("playing");
  } else {
    player.classList.remove("playing");
  }
};
const handleControlClick = async (type) => {
  switch (type) {
    case "play":
      togglePlay("play");
      break;
    case "pause":
      togglePlay("pause");
      break;
    case "mute":
      toggleMute("mute");
      break;
    case "mute":
      toggleMute("unmute");
      break;
    case "full screen":
      document.querySelector("body").requestFullscreen();
      toggleFullScreen("maximize");
      break;
    case "exit full screen":
      document.exitFullscreen();
      toggleFullScreen("minimize");
      break;
    case "previous":
      router.push(await previousVideo());

    case "next":
      router.push(await nextVideo());
    default:
      return;
  }
};
// moveover
const mouseEvent = () => {
  document.addEventListener("mousemove", () => {
    document.body.style.cursor = "default";
    document.querySelector("#player-status")?.classList.remove("hide-controls");
    clearTimeout(mouseMoveTimeout);
    mouseMoveTimeout = setTimeout(() => {
      document.body.style.cursor = "none";
      document.querySelector("#player-status")?.classList.add("hide-controls");
    }, 3000);
  });
};

//timeline
const handleTimeUpdate = () => {
  emit("time-update", { currentTime: Math.round(audioRef.value?.currentTime) });
  playedTime.value = Math.round(audioRef.value?.currentTime);
  if (videoRef.value) {
    if (
      Math.abs(videoRef.value.currentTime - audioRef.value.currentTime) > 0.1
    ) {
      videoRef.value.currentTime = audioRef.value.currentTime;
    }
  }
};

const handleChangeVideoDuration = (time) => {
  timePercent.value = 0;
  clearInterval(videoProgressInterval);
  audioRef.value.currentTime = time;
};

const handleLoadingMetaData = () => {
  audioRef.value?.pause();
  videoRef.value?.pause();
  playerStatus.value = "loading";
};

// fullscreen

const toggleFullScreen = (status) => {
  isFullScreen["Full screen"].isShow = status !== "maximize";
  isFullScreen["Exit full screen"].isShow = status === "maximize";
  if (status === "maximize") {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    }
    document.querySelector("#player-wrapper").classList.add("full-screen");
    return;
  }
  document.querySelector("#player-wrapper").classList.remove("full-screen");
};

const handleClickFullScreen = () => {
  const isFull = !statusFull.value;

  const full = document.querySelector(".full");
  isFull
    ? handleControlClick("full screen")
    : handleControlClick("exit full screen");

  if (isFull) {
    full.classList.add("fullsize");
  } else {
    full.classList.remove("fullsize");
  }
};

// volume

const handleChangeVolume = (eVol) => {
  const volumeIcon = document.querySelector(".volume");
  localStorage.volume = eVol;
  audioRef.value.volume = eVol / 100;
  if (eVol <= 0) {
    localStorage.muted = true;
    volumeIcon.classList.add("start");
    return;
  } else {
    volumeIcon.classList.remove("start");
  }

  localStorage.muted = false;
};

const toggleMute = (status) => {
  localStorage.muted = status === "mute";
  localStorage.volume = status === "mute" ? 0 : audioRef.value.volume;
  audioRef.value.muted = status === "mute";

  audioRef.value.volume = audioRef.value.volume || 1;
  volume.value = status === "mute" ? 0 : parseInt(audioRef.value.volume * 100);
};

// setting
const openSettingOption = () => {
  document
    .querySelector("#setting-controls")
    .classList.toggle("settings-active");
  document
    .querySelector("#player-controls")
    .classList.toggle("settings-active");
};

const closeSettingOption = () => {
  document
    .querySelector("#setting-controls")
    .classList.remove("settings-active");
  document
    .querySelector("#player-controls")
    .classList.remove("settings-active");
};

// keyboard event
const keyBinding = () => {
  document.addEventListener("fullscreenchange", () => {
    const isFull = document.fullscreenElement !== null;
    !isFull ? toggleFullScreen("minimize") : toggleFullScreen("maximize");
  });
  window.addEventListener("keyup", (e) => {
    const key = e.key;

    if (key === "Backspace" || key === " ") {
      handleClickVideo();
    }
    if (key === "m") {
      const isMuted = audioRef.value?.muted;
      const volumeIcon = document.querySelector(".volume");

      isMuted ? toggleMute("unmute") : toggleMute("mute");

      if (isMuted) {
        volumeIcon.classList.remove("start");
      } else {
        volumeIcon.classList.add("start");
      }
    }

    if (key === "f") {
      const isFullSc = document.fullscreenElement !== null;
      isFullSc
        ? document.exitFullscreen()
        : document.querySelector("body").requestFullscreen();
    }

    if (key === "ArrowUp" && key === "ArrowDown") {
      handleChangeVolume(audioRef.value.volume / 100);
    }

    if (key === "ArrowRight") {
      const bonusTime = parseInt(localStorage.seek ?? 5);
      handleChangeVideoDuration(playedTime.value + bonusTime);
    }
    if (key === "ArrowLeft") {
      const bonusTime = parseInt(localStorage.seek ?? 5);
      handleChangeVideoDuration(playedTime.value - bonusTime);
    }
  });
};

onMounted(() => {
  audioRef.value.volume = volume.value / 100;
  // Autoplay when exit PIP
  document.addEventListener("leavepictureinpicture", () => {
    const isPause = videoRef.value?.paused;
    if (!isPause && !videoRef.value?.ended) {
      setTimeout(() => {
        togglePlay("play");
      }, 50);
    }
  });
  keyBinding();
  mouseEvent();
});

onBeforeUnmount(() => {
  clearInterval(videoProgressInterval);
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture();
  }
  clearTimeout(mouseMoveTimeout);
});
watch(route, () => {
  clearInterval(videoProgressInterval);
  timePercent.value = 0;
  videoProgressInterval = null;
  document.querySelector("#player-status").classList.remove("show-controls");
  document.querySelector("#player-controls").classList.remove("show-controls");
});
</script>

<style scoped>
video::-webkit-media-controls {
  display: none !important;
}

video::-webkit-media-controls-enclosure {
  display: none !important;
}
.full.fullsize .icon-exitfull {
  display: inline-block;
}
.full.fullsize .icon-full {
  display: none;
}

.full .icon-exitfull {
  display: none;
}

.player .icon-play {
  display: none;
}

.player.playing .icon-pause {
  display: none;
}

.player.playing .icon-play {
  display: inline-block;
}

.volume .muted {
  display: none;
}

.volume.start .muted {
  display: inline-block;
}

.volume.start .unmuted {
  display: none;
}

.settings-active {
  opacity: 1 !important;
  pointer-events: all !important;
}

#player-controls {
  opacity: 0;
  transition: opacity 0.2 ease;
}

#player-controls:hover,
#player-status:hover + #player-controls {
  opacity: 1;
  pointer-events: all;
}

.hide-controls:hover {
  opacity: 0;
  pointer-events: none;
}

.full-screen {
  position: fixed !important;
  inset: 0;
  z-index: 999;
}

.show-controls {
  opacity: 1;
}
</style>
>
