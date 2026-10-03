/**
 * Campus QoS Optimizer - Simple & User-Friendly Engine
 * Palette: #FBFBFB, #E8F9FF, #C4D9FF, #C5BAFF
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Intro Animation Logic
    const intro = document.getElementById('introScreen');
    const bar = document.getElementById('introBar');
    const btnEnter = document.getElementById('btnEnter');
    const navLogo = document.getElementById('navLogo');

    let progress = 0;
    let isIntroDone = false;

    function closeIntro() {
        if (isIntroDone) return;
        isIntroDone = true;
        intro.classList.add('hide');
        setTimeout(() => { intro.style.display = 'none'; }, 600);
    }

    if (btnEnter) {
        btnEnter.addEventListener('click', closeIntro);
    }

    // Auto-progress intro loader
    const timer = setInterval(() => {
        progress += 4;
        if (bar) bar.style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(timer);
            setTimeout(closeIntro, 350);
        }
    }, 40);

    // Replay intro on logo click
    if (navLogo) {
        navLogo.addEventListener('click', () => {
            intro.style.display = 'flex';
            intro.classList.remove('hide');
            isIntroDone = false;
            progress = 0;
            if (bar) bar.style.width = '0%';
            
            const replayTimer = setInterval(() => {
                progress += 5;
                if (bar) bar.style.width = `${progress}%`;
                if (progress >= 100) {
                    clearInterval(replayTimer);
                    setTimeout(closeIntro, 300);
                }
            }, 30);
        });
    }

    // 2. Interactive Demonstrator State
    let isQoSEnabled = true;
    let loadValue = 100;

    const btnQoS = document.getElementById('btnQoS');
    const btnFIFO = document.getElementById('btnFIFO');
    const loadSlider = document.getElementById('loadSlider');
    const loadText = document.getElementById('loadText');

    // Result Metric Elements
    const vLat = document.getElementById('valVoiceLatency');
    const sVoice = document.getElementById('statusVoice');
    const dVoice = document.getElementById('descVoice');

    const vLoss = document.getElementById('valVideoLoss');
    const sVideo = document.getElementById('statusVideo');
    const dVideo = document.getElementById('descVideo');

    const vLMS = document.getElementById('valLMSTime');
    const sLMS = document.getElementById('statusLMS');
    const dLMS = document.getElementById('descLMS');

    const vBulk = document.getElementById('valBulkSpeed');
    const sBulk = document.getElementById('statusBulk');
    const dBulk = document.getElementById('descBulk');

    function updateMetrics() {
        // Update Load Text
        if (loadValue < 60) {
            loadText.textContent = `${loadValue}% (Light)`;
        } else if (loadValue <= 100) {
            loadText.textContent = `${loadValue}% (Normal Peak)`;
        } else {
            loadText.textContent = `${loadValue}% (Overload Congestion)`;
        }

        if (isQoSEnabled) {
            // QoS Prioritized Behavior
            vLat.textContent = (16 + (loadValue * 0.04)).toFixed(0);
            sVoice.textContent = 'Clear Audio';
            dVoice.textContent = 'Voice packets jump to front via LLQ (< 25ms delay).';

            vLoss.textContent = loadValue > 100 ? (0.2 + (loadValue - 100) * 0.01).toFixed(1) : '0.1';
            sVideo.textContent = 'Smooth HD';
            dVideo.textContent = '50% dedicated bandwidth slice guarantees continuous stream.';

            vLMS.textContent = '0.6';
            sLMS.textContent = 'Fast Response';
            dLMS.textContent = 'Guaranteed 20% slice ensures instant quiz and page load.';

            vBulk.textContent = Math.max(0.8, (2.8 - (loadValue > 100 ? (loadValue - 100) * 0.03 : 0))).toFixed(1);
            sBulk.textContent = 'Controlled (WRED)';
            dBulk.textContent = 'Downloads use spare bandwidth without impacting live classes.';
        } else {
            // No QoS (FIFO) Collapse under load
            if (loadValue <= 60) {
                vLat.textContent = '45';
                sVoice.textContent = 'Acceptable';
                dVoice.textContent = 'Low traffic allows packets through.';

                vLoss.textContent = '0.8';
                sVideo.textContent = 'Minor Jitter';
                dVideo.textContent = 'Occasional frame skips.';

                vLMS.textContent = '1.2';
                sLMS.textContent = 'Normal';
                dLMS.textContent = 'Standard web response.';

                vBulk.textContent = '4.5';
                sBulk.textContent = 'Active';
                dBulk.textContent = 'Downloads share link equally.';
            } else {
                vLat.textContent = (250 + (loadValue - 60) * 2).toFixed(0);
                sVoice.textContent = 'Severe Lag (>300ms)';
                dVoice.textContent = 'Choppy distorted audio; packets trapped in FIFO buffer bloat.';

                vLoss.textContent = (8.5 + (loadValue - 60) * 0.1).toFixed(1);
                sVideo.textContent = 'Frequent Freezes';
                dVideo.textContent = 'High packet loss causes continuous video buffering.';

                vLMS.textContent = (3.5 + (loadValue - 60) * 0.02).toFixed(1);
                sLMS.textContent = 'Timeout Risk';
                dLMS.textContent = 'Slow response risks student exam submission failures.';

                vBulk.textContent = '7.5';
                sBulk.textContent = 'Link Saturation';
                dBulk.textContent = 'Aggressive TCP streams consume link and starve voice/video.';
            }
        }
    }

    // Toggle Handlers
    if (btnQoS && btnFIFO) {
        btnQoS.addEventListener('click', () => {
            isQoSEnabled = true;
            btnQoS.classList.add('active');
            btnFIFO.classList.remove('active');
            updateMetrics();
        });

        btnFIFO.addEventListener('click', () => {
            isQoSEnabled = false;
            btnFIFO.classList.add('active');
            btnQoS.classList.remove('active');
            updateMetrics();
        });
    }

    // Slider Handler
    if (loadSlider) {
        loadSlider.addEventListener('input', (e) => {
            loadValue = parseInt(e.target.value, 10);
            updateMetrics();
        });
    }

    // Copy Config Button
    const btnCopy = document.getElementById('btnCopy');
    const ciscoCode = document.getElementById('ciscoCode');

    if (btnCopy && ciscoCode) {
        btnCopy.addEventListener('click', () => {
            navigator.clipboard.writeText(ciscoCode.innerText).then(() => {
                btnCopy.textContent = 'Copied!';
                setTimeout(() => { btnCopy.textContent = 'Copy Config'; }, 2000);
            });
        });
    }

    // Initial render
    updateMetrics();
});
