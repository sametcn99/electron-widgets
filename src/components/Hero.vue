<template>
    <main class="flex flex-col h-full gap-2">
        <div v-for="widget in widgets" :key="widget.title"
            class="flex flex-row flex-wrap items-center justify-between w-full p-2 font-bold text-left hover:bg-zinc-900"
            id="widgetsData">
            <div>
                <h1 class="p-0 text-2xl">{{ widget.title }} </h1>
            </div>
            <div>
                <button :class="{ 'icon eye-visible': widget.visible, 'icon eye-invisible': !widget.visible, }"
                    @click="toggleVisibility(widget)">
                </button>
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