<template>
    <footer class="flex flex-row w-full h-6 gap-2 py-2 pl-2">
        <img class="object-cover w-8 h-8 p-2 rounded-full bg-slate-300 hover:cursor-pointer"
            src="/assets/github-logo.svg" alt="github logo" @click="openLink()" />
        <img id="open-directory" class="object-cover w-8 h-8 p-2 rounded-full bg-slate-300 hover:cursor-pointer"
            src="/assets/folder.svg" alt="folder logo" />
        <img id="show-all-widgets" class="object-cover w-8 h-8 p-2 rounded-full bg-slate-300 hover:cursor-pointer"
            src="/assets/eye.svg" alt="eye logo" />
    </footer>
</template>
<script setup>
const openLink = () => {
    const confirm = window.confirm(
        "You are exiting the application. Are you sure you want to continue?",
    );
    if (confirm) {
        window.electronAPI.openExternalLink("https://sametcc.me/electron-widgets");
    }
};
</script>
