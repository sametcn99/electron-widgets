<template>
  <nav id="custom-title-bar"
    class="flex h-fit w-full flex-row items-center justify-between bg-[#141414] font-bold text-gray-300 sticky top-0">
    <span class="w-full draggable">Electron Widgets</span>
    <div class="flex flex-row items-center gap-2 w-fit">
      <button id="minimizeBtn"
        class="w-8 h-8 font-bold transition-colors duration-300 bg-transparent border-0 rounded-md cursor-default hover:bg-black/50">
        —
      </button>
      <button id="closeBtn"
        class="w-8 h-8 font-bold transition-colors duration-300 bg-transparent border-0 rounded-md cursor-default hover:bg-black/50">
        X
      </button>
    </div>
  </nav>
  <main id="widgetsData" class="widgets-container"></main>
  <footer class="sticky bottom-0 w-full h-12">
    <img class="object-cover w-8 h-8 rounded-full bg-slate-600 hover:cursor-pointer" src="/assets/github-logo.svg"
      alt="footer image" @click="openLink()" />
  </footer>
</template>

<script setup lang="ts">
import WidgetList from './components/widgetList.vue';

console.log('👋 This message is being logged by "App.vue", included via Vite');
const openLink = () => {
  console.log(
    '👋 This message is being logged by "App.vue", included via Vite',
  );
  const confirm = window.confirm(
    "You are exiting the application. Are you sure you want to continue?",
  );
  if (confirm) {
    // window.electronAPI is coming from preload.js
    // using ipcRenderer and contextBridge
    console.log("confirmed");
    window.electronAPI.openExternalLink("https://sametcc.me/electron-widgets");
  }
};
</script>
