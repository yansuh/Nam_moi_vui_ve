const targetTime = new Date("Feb 17, 2026 00:00:00").getTime();
let audioAutoplayed = false;
let audioFallbackEnabled = false;
let timerInterval = null;

// --- PHẦN 1: GIỮ NGUYÊN LOGIC AUDIO CỦA BẠN ---

function showAudioStatus(message, type = "info") {
    const status = document.getElementById('audioStatus');
    if (!status) return;
    status.textContent = message;
    status.className = 'audio-status show';
    if (type === "success") {
        status.style.background = "rgba(76, 175, 80, 0.9)";
        status.style.color = "white";
    } else if (type === "error") {
        status.style.background = "rgba(244, 67, 54, 0.9)";
        status.style.color = "white";
    } else {
        status.style.background = "rgba(255, 215, 0, 0.9)";
        status.style.color = "#8B0000";
    }
    setTimeout(() => { status.classList.remove('show'); }, 3000);
}

async function tryAutoplayAudio() {
    const audio = document.getElementById('tetAudio');
    if (!audio || audioAutoplayed) return;
    try {
        audio.volume = 0.5;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            await playPromise;
            audioAutoplayed = true;
            showAudioStatus("🎵 Nhạc Tết đang phát", "success");
            disableClickFallback();
            return true;
        }
    } catch (error) {
        showAudioStatus("🎵 Click để nghe nhạc", "info");
        enableClickFallback();
        return false;
    }
}

function disableClickFallback() {
    document.body.removeEventListener('click', clickFallbackHandler);
    audioFallbackEnabled = false;
}

function enableClickFallback() {
    if (!audioFallbackEnabled) {
        document.body.addEventListener('click', clickFallbackHandler);
        audioFallbackEnabled = true;
    }
}

function clickFallbackHandler() {
    const audio = document.getElementById('tetAudio');
    if (!audio || audioAutoplayed) return;
    audio.play().then(() => {
        audioAutoplayed = true;
        showAudioStatus("🎵 Nhạc Tết đang phát", "success");
        disableClickFallback();
    }).catch(error => {
        showAudioStatus("⚠️ Không thể phát nhạc", "error");
    });
}

// --- PHẦN 2: LOGIC ĐẾM NGƯỢC VÀ HIỆU ỨNG LÌ XÌ ---

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetTime - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    
    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

    if (distance < 0) {
        clearInterval(timerInterval);
        showLixiScreen(); // Hiện Lì xì khi hết giờ
    }
}

// Hàm hiện Lì xì (Bước đệm theo yêu cầu mới)
function showLixiScreen() {
    const container = document.querySelector(".container");
    if (!container) return;
    
    container.innerHTML = `
        <div class="lixi-wrapper" style="text-align: center;">
            <h2 class="sub-title">Lộc Xuân May Mắn</h2>
            <div class="lixi" id="btnOpenLixi" style="margin: 0 auto; cursor: pointer;">
                <div class="lixi-top"></div>
                <div class="lixi-button">MỞ</div>
            </div>
            <p class="hint">Chạm vào bao lì xì để nhận điều bất ngờ</p>
        </div>
    `;
    
    document.getElementById('btnOpenLixi').onclick = handleOpenLixi;
}

// Hàm mở Lì xì bắn tiền và hiện thiệp
function handleOpenLixi() {
    const symbols = ['🧧', '💵', '💰', '✨', '🪙'];
    for (let i = 0; i < 60; i++) {
        const p = document.createElement('div');
        p.className = 'money-particle';
        p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        p.style.left = '50%'; p.style.top = '50%';
        const angle = Math.random() * Math.PI * 2;
        const dist = 300 + Math.random() * 500;
        p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
        p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 2000);
    }

    const container = document.querySelector(".container");
    container.style.opacity = '0';
    setTimeout(() => {
        showFinalCard(); // Hiện thiệp chúc mừng
        container.style.opacity = '1';
    }, 600);
}

function showFinalCard() {
    const container = document.querySelector(".container");
    container.innerHTML = `
        <div class="ready-container">
            <div class="question-box">
                <h1 class="main-title">Chúc Mừng Năm Mới!</h1>
                <p class="question">
                    Chị đã sẵn sàng cho một năm mới <br>
                    <strong>BÌNH AN - HẠNH PHÚC - MAY MẮN</strong> chưa?
                </p>
                <button class="ready-btn" id="readyButton">
                    <span class="btn-text">Chị đã sẵn sàng rồi!</span>
                    <span class="btn-icon">🎉</span>
                </button>
            </div>
        </div>
    `;
    document.getElementById('readyButton').onclick = goToMainPage;
}

function goToMainPage() {
    document.body.style.opacity = '0.7';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => { window.location.href = 'index.html'; }, 500);
}

// --- PHẦN 3: KHỞI TẠO (GIỮ NGUYÊN) ---

function initApp() {
    tryAutoplayAudio();
    setTimeout(() => { if (!audioAutoplayed) tryAutoplayAudio(); }, 1000);
    setTimeout(() => { if (!audioAutoplayed) tryAutoplayAudio(); }, 2000);
    
    updateCountdown();
    timerInterval = setInterval(updateCountdown, 1000);
}

window.addEventListener('load', () => { setTimeout(initApp, 500); });
