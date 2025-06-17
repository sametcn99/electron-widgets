<template>
    <div class="relative" @click="isOpen = !isOpen">
        <Bars4Icon class="w-6 h-6 rounded-xl hover:scale-105 hover:cursor-pointer" />
        <div v-if="isOpen" class="absolute right-0 z-10 w-48 py-2 text-sm bg-gray-300 rounded-lg shadow-xl">
            <button class="w-full p-1 text-gray-900 hover:bg-gray-900 hover:text-white"
                @click="makeVisibleAllWidgets">Make Visible All
                Widgets</button>
            <button class="w-full p-1 text-gray-900 hover:bg-gray-900 hover:text-white"
                @click="makeInvisibleAllWidgets">Make Invisible All
                Widgets</button>
            <button class="w-full p-1 text-gray-900 hover:bg-gray-900 hover:text-white" @click="lockWidgets">Lock
                All
                Widgets</button>
            <button class="w-full p-1 text-gray-900 hover:bg-gray-900 hover:text-white" @click="unlockWidgets">Unlock
                All Widgets</button>
            <div class="w-full h-[2px] bg-black bg-opacity-10"></div>
            <button class="w-full p-1 text-gray-900 hover:bg-gray-900 hover:text-white" @click="showAllWidgets">Show
                All
                Widgets</button>
            <button class="w-full p-1 text-gray-900 hover:bg-gray-900 hover:text-white" @click="sortWidgets">Sort
                Widgets</button>
            <button class="w-full p-1 text-gray-900 hover:bg-gray-900 hover:text-white"
                @click="revealWidgetsFolder">Reveal Widgets Folder</button>
            <div class="w-full h-[2px] bg-black bg-opacity-10"></div>
            <button class="w-full p-1 text-gray-900 hover:bg-gray-900 hover:text-white"
                @click="openAbout">About</button>
            <button class="w-full p-1 text-gray-900 hover:bg-gray-900 hover:text-white" @click="openWiki">Wiki</button>
            <button
                class="flex items-center justify-center w-full gap-1 p-2 text-gray-900 hover:bg-gray-900 hover:text-white"
                @click="openSponsor">
                <p>Sponsor</p>
                <HeartIcon class="w-4 fill-red-700" />
            </button>
            <p class="w-full text-center text-gray-900">Version: {{ appVersion }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { Bars4Icon, HeartIcon } from '@heroicons/vue/24/outline';


export default {
    components: {
        Bars4Icon,
        HeartIcon
    },
    methods: {
        openAbout() {
            window.electronAPI.openExternal("https://github.com/sametcn99/electron-widgets")
        },
        revealWidgetsFolder() {
            window.electronAPI.revealWidgetsFolder()
        },
        showAllWidgets() {
            window.electronAPI.showAllWidgets()
        },
        lockWidgets() {
            window.electronAPI.setLockAllWidgets(true)
        },
        unlockWidgets() {
            window.electronAPI.setLockAllWidgets(false)
        },
        makeVisibleAllWidgets() {
            window.electronAPI.setVisibilityAllWidgets(true)
        },
        makeInvisibleAllWidgets() {
            window.electronAPI.setVisibilityAllWidgets(false)
        },
        sortWidgets() {
            window.electronAPI.sortWidgets()
        },
        openSponsor() {
            window.electronAPI.showNotification("Thank you for considering to sponsor me! 🙏",
                "I'm working on this project in my free time. Your support will help me to continue \
                developing this project and adding new features. Thank you! ❤️");
            window.electronAPI.openExternal("https://github.com/sponsors/sametcn99")
        },
        openWiki() {
            window.electronAPI.openExternal("https://github.com/sametcn99/electron-widgets/wiki")
        }
    },
    setup() {
        const isOpen = ref(false);

        function close() {
            isOpen.value = false;
        }
        const appVersion = ref('');

        onMounted(async () => {
            appVersion.value = await window.electronAPI.getAppVersion();
        });


        return { isOpen, close, appVersion };
    }
};
</script>