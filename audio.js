// ======== Background Audio Controller (YouTube API) ========

let ytPlayer;
let isAudioPlaying = false;
let currentVolume = 50;

// Load the IFrame Player API code asynchronously
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player) after the API code downloads
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('youtube-player', {
        height: '0', // Hide the player completely
        width: '0',
        videoId: 'WcpwPuvXiNw', // User requested video ID
        playerVars: {
            'autoplay': 1,      // Request autoplay (often blocked until interaction)
            'controls': 0,      // Hide controls
            'disablekb': 1,     // Disable keyboard
            'fs': 0,            // No fullscreen
            'iv_load_policy': 3,// Hide annotations
            'loop': 1,          // Loop video
            'playlist': 'WcpwPuvXiNw' // Required for loop to work on single video
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// Function triggered when player is ready
function onPlayerReady(event) {
    const audioBtn = document.getElementById('audio-btn');
    const audioIcon = document.getElementById('audio-icon');
    const volumeSlider = document.getElementById('volume-slider');

    // Set initial volume
    event.target.setVolume(currentVolume);

    // Some browsers enforce muting to allow autoplay, so we can try to play it muted,
    // but the user wants it to start unmuted if possible. We will just play it.
    // If it fails, that's a browser policy, and the user can click play.
    event.target.playVideo();

    // Toggle Play/Pause when the container button is clicked
    audioBtn.addEventListener('click', (e) => {
        // Prevent click events from propagating to the slider dragging
        e.stopPropagation();

        if (isAudioPlaying) {
            ytPlayer.pauseVideo();
            setAudioStateOff();
        } else {
            ytPlayer.playVideo();
            setAudioStateOn();
        }
    });

    // Handle Volume change
    volumeSlider.addEventListener('input', (e) => {
        currentVolume = e.target.value;
        ytPlayer.setVolume(currentVolume);

        if (currentVolume > 0 && !isAudioPlaying) {
            ytPlayer.playVideo();
        }

        updateIcon(currentVolume, isAudioPlaying);
    });

    // Attempt to start playing on any first user interaction with the page to bypass Autoplay-Policy
    document.body.addEventListener('click', function unlockAudio() {
        if (!isAudioPlaying) {
            ytPlayer.playVideo();
            document.body.removeEventListener('click', unlockAudio);
        }
    }, { once: true });
}

// Update icon based on volume and play state
function updateIcon(vol, playing) {
    const audioIcon = document.getElementById('audio-icon');
    if (!playing || vol == 0) {
        audioIcon.className = "fa-solid fa-volume-xmark transition-all text-gray-500";
    } else if (vol < 50) {
        audioIcon.className = "fa-solid fa-volume-low transition-all text-accentPurple text-glow";
    } else {
        audioIcon.className = "fa-solid fa-volume-high transition-all text-accentPurple text-glow";
    }
}

function setAudioStateOn() {
    isAudioPlaying = true;
    updateIcon(currentVolume, true);
}

function setAudioStateOff() {
    isAudioPlaying = false;
    updateIcon(currentVolume, false);
}

// Ensure looping works perfectly by seeking when video ends
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        setAudioStateOn();
    } else if (event.data === YT.PlayerState.PAUSED) {
        setAudioStateOff();
    }
}
