/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

/**
 * Manages a counter value and displays it in the DOM.
 * Provides buttons to increase and decrease the counter.
 */
let count = 0
const countSpan = document.getElementById('count')
const decreaseBtn = document.getElementById('decreaseBtn')
decreaseBtn.addEventListener('click', () => {
    count--
    countSpan.innerText = count
    console.log(`decrease button clicked.\nCount: ${count}`)
})

const increaseBtn = document.getElementById('increaseBtn')
increaseBtn.addEventListener('click', () => {
    count++
    countSpan.innerText = count
    console.log(`increase button clicked.\nCount: ${count}`)
})

