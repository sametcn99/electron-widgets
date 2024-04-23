<template>
    <main class="flex flex-col h-full gap-2">
        <div v-for="widget in widgets" :key="widget.title"
            class="flex flex-row flex-wrap items-center justify-between w-full p-2 font-bold text-left hover:bg-zinc-900"
            id="widgetsData">
            <div>
                <h1 class="text-xl">{{ widget.title }} </h1>
            </div>
            <div class="flex flex-row gap-2">
                <div v-if="widget.visible" @click="toggleLocked(widget, widget.title)"
                    class="rounded-full hover:bg-gray-700">
                    <img v-if="!widget.locked" src="/assets/unlock.svg" alt="unlock" class="w-6 h-6">
                    <img v-else src="/assets/lock.svg" alt="lock" class="w-6 h-6">
                </div>
                <div class="flex items-center w-12 h-6 duration-300 ease-in-out bg-gray-800 rounded-full"
                    :class="{ 'bg-gray-600 ': !widget.visible }" @click="toggleVisibility(widget)">
                    <div class="w-6 h-6 duration-300 ease-in-out transform bg-gray-500 rounded-full shadow-md"
                        :class="{ 'translate-x-6 bg-green-700': widget.visible, }"></div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
let widgets = ref<WidgetsConfig>();

async function loadWidgets() {
    const widgetData = await window.electronAPI.readWidgetsJson()
    widgets.value = widgetData;
}

async function toggleLocked(widget: WidgetConfig, widgetId: string) {
    window.electronAPI.lockWidget(widgetId);
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

onMounted(loadWidgets);

function toggleVisibility(widget: WidgetConfig) {
    widget.visible = !widget.visible;
    toggleWidgetVisibility(widget.title, widget.visible);
}
</script>