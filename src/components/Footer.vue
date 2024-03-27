<template>
    <footer class="sticky bottom-0 w-full h-12">
        <img class="object-cover w-8 h-8 rounded-full bg-slate-600 hover:cursor-pointer" src="/assets/github-logo.svg"
            alt="footer image" @click="openLink()" />
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