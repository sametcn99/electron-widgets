<template>
    <nav id="custom-title-bar"
        class="sticky top-0 flex flex-row items-center justify-between w-full px-2 font-bold bg-black h-fit">
        <div class="flex flex-row items-center w-full gap-2 draggable">
            <img src="/assets/electron.png" alt="logo" class="w-4 h-4" />
            <span>Electron Widgets</span>
        </div>
        <div class="flex flex-row items-center gap-2 w-fit">
            <button id="minimizeBtn"
                class="w-8 h-8 font-extrabold transition-colors duration-300 bg-transparent border-0 rounded-md cursor-default hover:bg-zinc-800">
                —
            </button>
            <button id="closeBtn"
                class="w-8 h-8 font-extrabold transition-colors duration-300 bg-transparent border-0 rounded-md cursor-default hover:bg-red-900">
                X
            </button>
        </div>
    </nav>
</template>
