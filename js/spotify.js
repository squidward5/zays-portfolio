// big thanks to lanyard for making this possible :)
// .gg/lanyard

const DISCORD_ID = "739917405542678659";

let currentTrack = null;
let progressInterval = null;
let heartbeatInterval = null;
let socket = null;

function formatTime(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const explicitCache = {}; 

async function checkExplicit(trackId) {
    const badge = document.getElementById("spotify-explicit");
    if (!badge) return;

    if (trackId in explicitCache) {
        badge.classList.toggle("visible", explicitCache[trackId]);
        return;
    }

    try {
        const res = await fetch(`/api/explicit?track_id=${trackId}`);
        const data = await res.json();
        explicitCache[trackId] = !!data.explicit;
        badge.classList.toggle("visible", explicitCache[trackId]);
    } catch (err) {
        console.error("[spotify-widget] explicit check failed:", err);
        badge.classList.remove("visible");
    }
}

function updateProgressBar() {
    if (!currentTrack) return;

    const now = Date.now();
    const { start, end } = currentTrack;
    const duration = end - start;
    const elapsed = Math.min(Math.max(now - start, 0), duration);
    const percent = (elapsed / duration) * 100;

    document.getElementById("spotify-bar-fill").style.width = `${percent}%`;
    document.getElementById("spotify-current-time").textContent = formatTime(elapsed);
    document.getElementById("spotify-end-time").textContent = formatTime(duration);
}

function applyPresence(data) {
    const widget = document.getElementById("spotify-widget");
    if (!widget) return;

    if (data.listening_to_spotify && data.spotify) {
        const s = data.spotify;

        document.getElementById("spotify-art").src = s.album_art_url;
        document.getElementById("spotify-song").textContent = s.song;
        console.log("[spotify-widget] raw artist string:", JSON.stringify(s.artist));
        document.getElementById("spotify-artist").textContent = s.artist.replace(/;\s*/g, ", ");

        widget.dataset.trackUrl = `https://open.spotify.com/track/${s.track_id}`;

        checkExplicit(s.track_id);

        currentTrack = { start: s.timestamps.start, end: s.timestamps.end };

        if (progressInterval) clearInterval(progressInterval);
        updateProgressBar();
        progressInterval = setInterval(updateProgressBar, 1000);

        widget.classList.add("visible");
    } else {
        widget.classList.remove("visible");
        currentTrack = null;
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }
}

function setupClickHandler() {
    const widget = document.getElementById("spotify-widget");
    if (!widget || widget.dataset.clickBound) return;

    widget.addEventListener("click", () => {
        const url = widget.dataset.trackUrl;
        if (url) window.open(url, "_blank");
    });
    widget.dataset.clickBound = "true";
}

function connectLanyardSocket() {
    socket = new WebSocket("wss://api.lanyard.rest/socket");

    socket.onopen = () => {
        console.log("[spotify-widget] connected to Lanyard socket");
    };

    socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        switch (msg.op) {
            case 1:
                if (heartbeatInterval) clearInterval(heartbeatInterval);
                heartbeatInterval = setInterval(() => {
                    if (socket.readyState === WebSocket.OPEN) {
                        socket.send(JSON.stringify({ op: 3 }));
                    }
                }, msg.d.heartbeat_interval);

                socket.send(JSON.stringify({
                    op: 2,
                    d: { subscribe_to_id: DISCORD_ID }
                }));
                break;

            case 0:
                if (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE") {
                    console.log("[spotify-widget] presence update:", msg.d);
                    applyPresence(msg.d);
                }
                break;
        }
    };

    socket.onclose = () => {
        console.warn("[spotify-widget] socket closed, reconnecting in 3s...");
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        setTimeout(connectLanyardSocket, 3000);
    };

    socket.onerror = (err) => {
        console.error("[spotify-widget] socket error:", err);
        socket.close();
    };
}

setupClickHandler();
connectLanyardSocket();