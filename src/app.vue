<template>
  <nav id="custom-title-bar" class="flex h-fit w-full flex-row items-center justify-between bg-[#141414] font-bold text-gray-300">
    <span class="w-full draggable">Electron Widget App</span>
    <div class="flex flex-row items-center gap-2 w-fit">
      <button id="minimizeBtn" class="w-8 h-8 font-bold transition-colors duration-300 bg-transparent border-0 rounded-md cursor-default hover:bg-black/50">—</button>
      <button id="closeBtn" class="w-8 h-8 font-bold transition-colors duration-300 bg-transparent border-0 rounded-md cursor-default hover:bg-black/50">X</button>
    </div>
  </nav>
  <main id="widgetsData" class="widgets-container"></main>
</template>

<script setup>
console.log('👋 This message is being logged by "App.vue", included via Vite');
</script>