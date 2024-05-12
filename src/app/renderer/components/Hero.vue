<template>
    <section
        class="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        <div v-for="widget in widgets" :key="widget.title"
            class="flex flex-col flex-wrap items-start justify-between h-32 p-2 bg-opacity-50 shadow-xl min-w-32 hover:bg-zinc-700 bg-zinc-600 rounded-2xl shadow-zinc-900"
            id="widgetsData">
            <div class="flex flex-row justify-between w-full">
                <h1 class="font-bold break-words">{{ widget.title }} </h1>
                <DropdownButton :title="widget.title" :alwaysOnTop="widget.alwaysOnTop" :visible="widget.visible" />
            </div>
            <div class="flex flex-row justify-between w-full gap-2">
                <div class="flex items-center w-8 h-4 duration-300 ease-in-out bg-gray-800 rounded-full hover:cursor-pointer"
                    :class="{ 'bg-gray-600 ': !widget.visible }" @click="toggleVisibility(widget)">
                    <div class="w-4 h-4 duration-300 ease-in-out transform bg-gray-500 rounded-full shadow-md"
                        :class="{ 'translate-x-4 bg-green-700': widget.visible, }"></div>
                </div>
                <div v-if="widget.visible" @click="toggleLocked(widget, widget.title)"
                    class="rounded-2xl hover:scale-105 hover:cursor-pointer">
                    <LockOpenIcon v-if="!widget.locked" src="/assets/unlock.svg" alt="unlock" class="w-4 h-4"
                        title="Lock Widget" />
                    <LockClosedIcon v-else src="/assets/lock.svg" alt="lock" class="w-4 h-4" title="Unlock Widget" />
                </div>
            </div>
        </div>
        <div @click="addWidget()"
            class="flex flex-col items-center justify-center h-32 gap-2 p-2 mb-4 font-bold bg-opacity-50 min-w-32 hover:bg-zinc-900 bg-zinc-600 rounded-2xl hover:cursor-pointer">
            <SquaresPlusIcon class="w-8 h-8" />
            <p>Add New</p>
        </div>
    </section>
</template>

<script setup lang="ts">
import { SquaresPlusIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/vue/24/outline';
import DropdownButton from './DropdownButton.vue';

// Define the props
defineProps({
    widgets: Object as () => WidgetsConfig | null
});

async function toggleLocked(widget: WidgetConfig, widgetKey: string) {
    window.electronAPI.lockWidget(widgetKey);
    if (widget) {
        widget.locked = !widget.locked;
    }
}

async function toggleWidgetVisibility(widgetId: string, visible: boolean) {
    try {
        // Invoke IPC to read the current widgets configuration
        const widgetsData: WidgetsConfig = await window.electronAPI.readWidgetsJson();
        // Check if the widget exists in the configuration
        if (widgetsData[widgetId as keyof WidgetsConfig]) {
            // Update the visibility of the widget
            widgetsData[widgetId as keyof WidgetsConfig].visible = visible;
        } else {
            // Log an error if the widget is not found
            console.error("Widget not found: ", widgetId);
            return;
        }
        const data = widgetsData;
        // Write the updated widgets configuration back
        window.electronAPI.writeWidgetJson(data);
        // Create or close the widget window based on visibility
        if (visible === true) {
            window.electronAPI.createWidgetWindow(widgetId);
        } else if (visible === false) {
            window.electronAPI.closeWidgetWindow(widgetId);
        }
    } catch (error) {
        // Log any errors encountered during the process
        console.error("Failed to toggle widget visibility:", error);
    }
}


function toggleVisibility(widget: WidgetConfig) {
    widget.visible = !widget.visible;
    toggleWidgetVisibility(widget.title, widget.visible);
}

// Function to add a new widget
const addWidget = () => {
    // Calls the Electron API to add a widget
    window.electronAPI.addWidget();
}
</script>