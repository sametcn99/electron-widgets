<template>
    <nav id="custom-title-bar"
        class="sticky top-0 z-50 flex flex-row items-center justify-between w-full h-16 draggable backdrop-blur-xl">
        <div class="flex flex-row items-center w-full gap-2 ">
            <img src="/assets/electron.png" alt="logo" class="w-8 h-8" />
            <input id="searchInput" type="text" placeholder="Search" @input="search"
                class="p-2 font-bold bg-transparent rounded-md focus:border focus:border-1 focus:outline-none " />
        </div>
        <div class="flex flex-row items-center gap-2 w-fit ">
            <SettingsButton />
            <MinusIcon @click="minimize" title="Minimize the application"
                class="w-10 h-10 font-extrabold transition-colors duration-300 bg-transparent border-0 rounded-md cursor-default hover:bg-zinc-800" />
            <XMarkIcon @click="close" title="Close the application"
                class="w-10 h-10 font-extrabold transition-colors duration-300 bg-transparent border-0 rounded-md cursor-default hover:bg-red-900" />
        </div>
    </nav>
</template>

<script lang="ts">
import { MinusIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import SettingsButton from './SettingsButton.vue';

export default {
    components: {
        MinusIcon,
        XMarkIcon,
        SettingsButton
    },
    emits: ["search"], // Define the "search" event here
    setup(_props, { emit }) { // Add the { emit } argument here
        const search = (event: Event) => {
            const searchInput = event.target as HTMLInputElement;
            const searchValue = searchInput.value;
            emit("search", searchValue); // Use emit here
        };
        const minimize = () => {
            window.electronAPI.minimizeWindow();
        };
        const close = () => {
            window.electronAPI.closeWindow();
        };
        return {
            search,
            minimize,
            close,
        };
    }
};
</script>