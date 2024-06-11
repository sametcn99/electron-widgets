<template>
    <div class="relative" v-on:mouseover="isOpen = true" v-on:mouseleave="isOpen = false">
        <Bars4Icon class="w-6 h-6 rounded-xl hover:scale-105 hover:cursor-pointer" />
        <div v-if="isOpen" class="absolute right-0 z-10 py-2 text-sm bg-gray-300 rounded-lg shadow-xl w-36">
            <button class="w-full p-2 text-gray-900 hover:bg-red-800 hover:text-white"
            @click="duplicateWidget()">Duplicate</button>
            <button v-if="visible === true" class="w-full p-2 text-gray-900 hover:bg-gray-900 hover:text-white"
                @click="show()">Show</button>
            <button v-if="alwaysOnTop === true" class="w-full p-2 text-gray-900 hover:bg-gray-900 hover:text-white"
                @click="setAlwaysOnTop()">Set Always On Top False</button>
            <button v-if="alwaysOnTop === false" class="text-gray-900 hover:bg-gray-900 hover:text-white"
                @click="setAlwaysOnTop()">Set Always On Top True</button>
            <button class="w-full p-2 text-gray-900 hover:bg-red-800 hover:text-white"
                @click="removeWidget()">Remove</button>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { Bars4Icon } from '@heroicons/vue/24/outline';

export default {
    components: {
        Bars4Icon
    },
    methods: {
        removeWidget() {
            window.confirm('Are you sure you want to remove this widget?') &&
                window.electronAPI.removeWidget(this.title || '');
        },
        setAlwaysOnTop() {
            window.electronAPI.setAlwaysOnTop(this.title || '', !this.alwaysOnTop);
        },
        show() {
            window.electronAPI.showWidget(this.title || '');
        },
        duplicateWidget() {
            window.electronAPI.duplicateWidget(this.title || '');
        }
    },
    props: {
        title: String,
        alwaysOnTop: Boolean,
        visible: Boolean
    },
    setup() {
        const isOpen = ref(false);
        function close() {
            isOpen.value = false;
        }

        return { isOpen, close };
    }
};
</script>