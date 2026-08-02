function formatTime(seconds) {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const players = document.querySelectorAll(".music-player");

    players.forEach((player) => {
        const src = player.dataset.src;
        const audio = new Audio(src);
        audio.preload = "metadata";

        const playPauseBtn = player.querySelector(".music-play-pause");
        const stopBtn = player.querySelector(".music-stop");
        const iconPlay = player.querySelector(".icon-play");
        const iconPause = player.querySelector(".icon-pause");
        const barTrack = player.querySelector(".music-bar-track");
        const barFill = player.querySelector(".music-bar-fill");
        const currentTimeEl = player.querySelector(".music-current-time");
        const endTimeEl = player.querySelector(".music-end-time");

        function setPlayingIcon(isPlaying) {
            iconPlay.style.display = isPlaying ? "none" : "block";
            iconPause.style.display = isPlaying ? "block" : "none";
            playPauseBtn.setAttribute("aria-label", isPlaying ? "pause" : "play");
        }

        audio.addEventListener("loadedmetadata", () => {
            endTimeEl.textContent = formatTime(audio.duration);
        });

        audio.addEventListener("ended", () => {
            setPlayingIcon(false);
            barFill.style.width = "0%";
            currentTimeEl.textContent = "0:00";
        });

        playPauseBtn.addEventListener("click", () => {
            if (audio.paused) {
                // pause every other player so only one plays at a time
                document.querySelectorAll(".music-player").forEach((other) => {
                    if (other !== player) {
                        other._audio?.pause();
                    }
                });
                audio.play();
                setPlayingIcon(true);
            } else {
                audio.pause();
                setPlayingIcon(false);
            }
        });

        stopBtn.addEventListener("click", () => {
            audio.pause();
            audio.currentTime = 0;
            setPlayingIcon(false);
            barFill.style.width = "0%";
            currentTimeEl.textContent = "0:00";
        });

        let isDragging = false;

        function percentFromEvent(e) {
            const rect = barTrack.getBoundingClientRect();
            const x = e.clientX - rect.left;
            return Math.min(Math.max(x / rect.width, 0), 1);
        }

        function previewSeek(percent) {
            barFill.style.width = `${percent * 100}%`;
            currentTimeEl.textContent = formatTime(percent * audio.duration);
        }

        barTrack.addEventListener("pointerdown", (e) => {
            isDragging = true;
            barTrack.setPointerCapture(e.pointerId);
            previewSeek(percentFromEvent(e));
        });

        barTrack.addEventListener("pointermove", (e) => {
            if (!isDragging) return;
            previewSeek(percentFromEvent(e));
        });

        barTrack.addEventListener("pointerup", (e) => {
            if (!isDragging) return;
            isDragging = false;
            audio.currentTime = percentFromEvent(e) * audio.duration;
        });

        barTrack.addEventListener("pointercancel", () => {
            isDragging = false;
        });

        audio.addEventListener("timeupdate", () => {
            if (isDragging) return;
            const percent = (audio.currentTime / audio.duration) * 100 || 0;
            barFill.style.width = `${percent}%`;
            currentTimeEl.textContent = formatTime(audio.currentTime);
        });

        player._audio = audio;
    });
});