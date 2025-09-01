// Music data
const tracks = [
    {
        id: 1,
        title: "Creative Minds",
        artist: "Bensound",
        url: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3",
        image: "https://www.bensound.com/bensound-img/creativeminds.jpg",
        duration: "2:09"
    },
    {
        id: 2,
        title: "Happy Rock",
        artist: "Bensound",
        url: "https://www.bensound.com/bensound-music/bensound-happyrock.mp3",
        image: "https://www.bensound.com/bensound-img/happyrock.jpg",
        duration: "1:45"
    },
    {
        id: 3,
        title: "Jazzy Frenchy",
        artist: "Bensound",
        url: "https://www.bensound.com/bensound-music/bensound-jazzyfrenchy.mp3",
        image: "https://www.bensound.com/bensound-img/jazzyfrenchy.jpg",
        duration: "1:44"
    },
    {
        id: 4,
        title: "Better Days",
        artist: "Bensound",
        url: "https://www.bensound.com/bensound-music/bensound-betterdays.mp3",
        image: "https://www.bensound.com/bensound-img/betterdays.jpg",
        duration: "2:33"
    },
    {
        id: 5,
        title: "Summer",
        artist: "Bensound",
        url: "https://www.bensound.com/bensound-music/bensound-summer.mp3",
        image: "https://www.bensound.com/bensound-img/summer.jpg",
        duration: "2:50"
    }
];

// DOM elements
const audioElement = document.getElementById('audio-element');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const volumeSlider = document.getElementById('volume-slider');
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const currentTimeEl = document.querySelector('.current-time');
const durationEl = document.querySelector('.duration');
const albumArt = document.querySelector('.album-art');
const songTitle = document.querySelector('.song-title');
const songArtist = document.querySelector('.song-artist');
const playlistEl = document.getElementById('playlist');

// Player state
let currentTrackIndex = 0;
let isPlaying = false;

// Initialize the player
function initPlayer() {
    loadTrack(currentTrackIndex);
    renderPlaylist();
    
    // Event listeners
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', playPreviousTrack);
    nextBtn.addEventListener('click', playNextTrack);
    volumeSlider.addEventListener('input', updateVolume);
    progressBar.addEventListener('click', seek);
    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('ended', playNextTrack);
}

// Load a track
function loadTrack(index) {
    const track = tracks[index];
    audioElement.src = track.url;
    albumArt.querySelector('img').src = track.image;
    songTitle.textContent = track.title;
    songArtist.textContent = track.artist;
    
    // Reset progress
    progress.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = track.duration;
    
    // Update active track in playlist
    updateActiveTrack();
}

// Toggle play/pause
function togglePlayPause() {
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
}

// Play audio
function playAudio() {
    audioElement.play();
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    albumArt.classList.add('playing');
}

// Pause audio
function pauseAudio() {
    audioElement.pause();
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    albumArt.classList.remove('playing');
}

// Play next track
function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playAudio();
}

// Play previous track
function playPreviousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playAudio();
}

// Update volume
function updateVolume() {
    audioElement.volume = volumeSlider.value;
}

// Update progress bar
function updateProgress() {
    const { currentTime, duration } = audioElement;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(currentTime);
    }
}

// Format time in minutes:seconds
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Seek to a specific position in the track
function seek(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioElement.duration;
    
    audioElement.currentTime = (clickX / width) * duration;
}

// Render playlist
function renderPlaylist() {
    playlistEl.innerHTML = '';
    
    tracks.forEach((track, index) => {
        const playlistItem = document.createElement('div');
        playlistItem.classList.add('playlist-item');
        if (index === currentTrackIndex) {
            playlistItem.classList.add('active');
        }
        
        playlistItem.innerHTML = `
            <img src="${track.image}" alt="${track.title}">
            <div class="playlist-info">
                <div class="playlist-title">${track.title}</div>
                <div class="playlist-artist">${track.artist}</div>
            </div>
        `;
        
        playlistItem.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(currentTrackIndex);
            playAudio();
        });
        
        playlistEl.appendChild(playlistItem);
    });
}

// Update active track in playlist
function updateActiveTrack() {
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach((item, index) => {
        if (index === currentTrackIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Initialize the player when the page loads
window.addEventListener('load', initPlayer);