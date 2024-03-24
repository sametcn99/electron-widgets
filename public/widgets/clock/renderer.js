function updateTime() {
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();

    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;

    var timeHTML = hour + ':' + minute + ':' + second;
    document.getElementById('clock').textContent = timeHTML;
}

setInterval(updateTime, 1000); // Update every second

document.addEventListener('DOMContentLoaded', () => {
    updateTime(); // Start the clock when the page loads
});