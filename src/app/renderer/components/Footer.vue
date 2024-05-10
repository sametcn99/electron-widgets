<template>
    <footer class="flex flex-row w-full h-6 gap-2 py-2 pl-2">
        <img class="object-cover w-8 h-8 p-2 rounded-full bg-slate-300 hover:cursor-pointer"
            src="/assets/github-logo.svg" alt="github logo" title="Open GitHub" @click="openLink()" />

        <img id="open-directory" class="object-cover w-8 h-8 p-2 rounded-full bg-slate-300 hover:cursor-pointer"
            src="/assets/folder.svg" alt="folder logo" title="Open Directory" @click="openDirectory" />

        <img id="add-widget" class="object-cover w-8 h-8 p-2 rounded-full bg-slate-300 hover:cursor-pointer"
            src="/assets/folder-plus.svg" alt="folder plus" title="Add Widget" @click="addWidget()" />

        <img id="show-all-widgets" class="object-cover w-8 h-8 p-2 rounded-full bg-slate-300 hover:cursor-pointer"
            src="/assets/eye.svg" alt="eye logo" title="Show All Widgets" @click="showAllWidgets()" />
    </footer>
</template>

<script setup lang="ts">

// Function to open an external link after user confirmation
const openLink = () => {
    const confirm = window.confirm(
        "You are exiting the application. Are you sure you want to continue?",
    );
    if (confirm) {
        // Uses the Electron API to open an external link
        window.electronAPI.openExternalLink("https://sametcc.me/electron-widgets");
    }
};

// Function to add a new widget
const addWidget = () => {
    // Calls the Electron API to add a widget
    window.electronAPI.addWidget();
}

// Function to open a directory
const openDirectory = () => {
    // Invokes the Electron API to open a directory
    window.electronAPI.openDirectory();
}

// Function to show all widgets
const showAllWidgets = () => {
    // Calls the Electron API to display all widgets
    window.electronAPI.showAllWidgets();
}
</script>
