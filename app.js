/**
 * CampusQoS Optimizer - Master Simulation Engine & UI Controller
 * Simulates DiffServ QoS (LLQ + CBWFQ + WRED) vs Legacy FIFO under various link loads.
 */

// ============================================================================
// State Management
// ============================================================================
const state = {
    mode: 'qos',          // 'qos' or 'fifo'
    load: 110,            // % bottleneck congestion
    activeStreams: {
        voice: true,
        video: true,
        lms: true,
        bulk: true
    },
    metrics: {
        voiceLatency: 18.4,
        voiceJitter: 3.2,
        voiceLoss: 0.0,
        videoLoss: 0.2,
        videoLatency: 48,
        videoBw: 5.0,
        lmsTime: 0.62,
        lmsRetrans: 0.02,
        bulkThroughput: 2.4,
        bulkDrops: 3.4
    },
    queues: {
        voice: 0,
        video: 2,
        lms: 1,
        bulk: 14,
        fifoTotal: 45
    }
};

// Global references
let latencyChart = null;
let bandwidthChart = null;
let degradationChart = null;
let animationFrameId = null;

// ============================================================================
// Canvas Packet Flow & Pipeline Animation
// ============================================================================
class TopologySimulator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.packets = [];
        this.lastPacketTime = 0;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.width = rect.width;
        this.height = rect.height;
    }

    spawnPacket() {
        const loadFactor = state.load / 100;
        
        // Traffic Types & Spawn Probabilities
        const types = [
            { type: 'voice', color: '#10b981', size: 4, speed: 2.2, yOffset: -38, priority: 1 },
            { type: 'video', color: '#8b5cf6', size: 7, speed: 1.8, yOffset: -12, priority: 2 },
            { type: 'lms',   color: '#06b6d4', size: 5, speed: 1.6, yOffset: 12,  priority: 3 },
            { type: 'bulk',  color: '#f59e0b', size: 8, speed: 1.4, yOffset: 38,  priority: 4 }
        ];

        types.forEach(t => {
            if (!state.activeStreams[t.type]) return;

            let chance = 0.08 * loadFactor;
            if (t.type === 'bulk') chance *= 1.8; // bulk saturates
            if (t.type === 'voice') chance *= 0.6; // voice is small & steady

            if (Math.random() < chance) {
                this.packets.push({
                    x: 60,
                    y: (this.height / 2) + t.yOffset + (Math.random() * 6 - 3),
                    type: t.type,
                    color: t.color,
                    size: t.size,
                    speed: t.speed,
                    priority: t.priority,
                    state: 'ingress', // ingress -> queue -> bottleneck -> egress
                    queuedTime: 0,
                    dropped: false,
                    alpha: 1
                });
            }
        });
    }

    updateAndDraw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        const centerY = this.height / 2;
        const ingressX = 140;
        const queueX = this.width * 0.42;
        const bottleneckEndX = this.width * 0.72;
        const egressX = this.width - 60;

        // 1. Draw Topology Background Lines & Nodes
        this.drawTopologyDiagram(ingressX, queueX, bottleneckEndX, egressX, centerY);

        // 2. Spawn and Update Packets
        this.spawnPacket();

        for (let i = this.packets.length - 1; i >= 0; i--) {
            const p = this.packets[i];

            if (p.dropped) {
                p.y += 1.5;
                p.alpha -= 0.03;
                if (p.alpha <= 0) {
                    this.packets.splice(i, 1);
                    continue;
                }
            } else if (p.x < ingressX) {
                // Moving to Ingress Router
                p.x += p.speed * 1.5;
            } else if (p.x < queueX) {
                // Moving towards bottleneck queue
                p.x += p.speed * 1.3;
                p.y += (centerY - p.y) * 0.08; // funnel into bottleneck
            } else if (p.x >= queueX && p.x < bottleneckEndX) {
                // In Bottleneck Queue
                const isOverloaded = state.load > 100;
                
                if (state.mode === 'fifo') {
                    // FIFO behavior: Massive queuing delay for all packets
                    const fifoDelayFactor = Math.max(0.15, 1.2 - (state.load / 120));
                    p.x += p.speed * fifoDelayFactor;
                    
                    // Tail drop when overloaded
                    if (isOverloaded && Math.random() < 0.04 * (state.load / 100) && p.type !== 'voice') {
                        p.dropped = true;
                        p.color = '#ef4444';
                    }
                    if (isOverloaded && state.load > 130 && Math.random() < 0.015 && p.type === 'voice') {
                        p.dropped = true;
                        p.color = '#ef4444';
                    }
                } else {
                    // QoS (LLQ + CBWFQ + WRED)
                    if (p.type === 'voice') {
                        // Strict LLQ: Fast-tracked, zero delay
                        p.x += p.speed * 1.8;
                    } else if (p.type === 'video') {
                        // CBWFQ 50%: Smooth high rate
                        p.x += p.speed * 1.1;
                    } else if (p.type === 'lms') {
                        // CBWFQ 20%: Reliable rate
                        p.x += p.speed * 0.95;
                    } else if (p.type === 'bulk') {
                        // WRED: Early drop to throttle TCP window
                        if (isOverloaded && Math.random() < 0.08 * (state.load / 100)) {
                            p.dropped = true;
                            p.color = '#ef4444';
                        } else {
                            p.x += p.speed * 0.45; // Throttled leftover speed
                        }
                    }
                }
            } else if (p.x < egressX) {
                // Egress Serialization to Receiver
                p.x += p.speed * 1.8;
            } else {
                // Reached destination
                this.packets.splice(i, 1);
                continue;
            }

            // Draw Packet Circle
            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Glow for voice
            if (p.type === 'voice' && !p.dropped) {
                this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
            this.ctx.restore();
        }

        animationFrameId = requestAnimationFrame(() => this.updateAndDraw());
    }

    drawTopologyDiagram(ingressX, queueX, bottleneckEndX, egressX, centerY) {
        const ctx = this.ctx;

        // Draw Links (Wires)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 3;

        // Senders to Ingress
        [-38, -12, 12, 38].forEach(offset => {
            ctx.beginPath();
            ctx.moveTo(50, centerY + offset);
            ctx.lineTo(ingressX, centerY);
            ctx.stroke();
        });

        // Bottleneck Link Channel
        ctx.strokeStyle = state.mode === 'qos' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ingressX, centerY);
        ctx.lineTo(bottleneckEndX, centerY);
        ctx.stroke();

        // Inner bottleneck core
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(ingressX, centerY);
        ctx.lineTo(bottleneckEndX, centerY);
        ctx.stroke();

        // Bottleneck to Receiver
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(bottleneckEndX, centerY);
        ctx.lineTo(egressX, centerY);
        ctx.stroke();

        // Bottleneck label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(`10 Mbps Bottleneck (${state.load}% Load)`, (ingressX + bottleneckEndX) / 2, centerY - 18);

        // Ingress Router Node
        this.drawNode(ingressX, centerY, 'Ingress Router\n(DiffServ Marker)', '#6366f1');

        // Egress Router Node
        this.drawNode(bottleneckEndX, centerY, 'Egress Router\n(Scheduler)', '#3b82f6');

        // Senders Label
        ctx.fillStyle = '#64748b';
        ctx.font = '10px Plus Jakarta Sans';
        ctx.textAlign = 'left';
        ctx.fillText('Campus Senders', 15, centerY - 55);

        // Receiver Label
        ctx.textAlign = 'right';
        ctx.fillText('Target Destination', this.width - 15, centerY - 25);
    }

    drawNode(x, y, label, color) {
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x - 20, y - 20, 40, 40, 8);
        ctx.fill();
        ctx.stroke();

        // Inner icon symbol
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Label below
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '9px Plus Jakarta Sans';
        ctx.textAlign = 'center';
        const lines = label.split('\n');
        lines.forEach((line, idx) => {
            ctx.fillText(line, x, y + 32 + idx * 11);
        });
        ctx.restore();
    }
}

// ============================================================================
// Telemetry Computation Engine
// ============================================================================
function calculateTelemetry() {
    const load = state.load;
    const isQoS = state.mode === 'qos';

    if (isQoS) {
        // QoS Mode (LLQ + CBWFQ + WRED)
        // Voice delay is strictly prioritized via LLQ (< 25ms always)
        state.metrics.voiceLatency = (16.0 + (load * 0.04) + (Math.random() * 2 - 1)).toFixed(1);
        state.metrics.voiceJitter = (2.8 + (load * 0.015) + (Math.random() * 0.6 - 0.3)).toFixed(1);
        state.metrics.voiceLoss = (0.0).toFixed(1);

        // Video protected with 50% CBWFQ
        if (load <= 100) {
            state.metrics.videoLoss = (0.1).toFixed(1);
            state.metrics.videoLatency = (42 + load * 0.08).toFixed(0);
        } else {
            state.metrics.videoLoss = (0.2 + (load - 100) * 0.015).toFixed(1);
            state.metrics.videoLatency = (48 + (load - 100) * 0.15).toFixed(0);
        }
        state.metrics.videoBw = 5.0;

        // LMS protected with 20% CBWFQ
        state.metrics.lmsTime = (0.55 + (load * 0.001) + (Math.random() * 0.05)).toFixed(2);
        state.metrics.lmsRetrans = (0.02).toFixed(2);

        // Bulk absorbs the impact via WRED early drops
        if (load <= 100) {
            state.metrics.bulkThroughput = ((100 - load * 0.6) * 0.05 + 2.0).toFixed(1);
            state.metrics.bulkDrops = (0.5 + load * 0.02).toFixed(1);
        } else {
            state.metrics.bulkThroughput = Math.max(0.8, (2.8 - (load - 100) * 0.04)).toFixed(1);
            state.metrics.bulkDrops = (2.5 + (load - 100) * 0.12).toFixed(1);
        }

        // Queue occupancy
        state.queues.voice = Math.floor(Math.random() * 2);
        state.queues.video = Math.min(10, Math.floor(2 + (load / 40)));
        state.queues.lms = Math.min(8, Math.floor(1 + (load / 60)));
        state.queues.bulk = Math.min(30, Math.floor(10 + (load / 6)));
    } else {
        // Legacy FIFO Mode (No QoS) - Severe degradation under congestion
        if (load < 80) {
            state.metrics.voiceLatency = (25 + load * 0.8).toFixed(1);
            state.metrics.voiceJitter = (8 + load * 0.4).toFixed(1);
            state.metrics.voiceLoss = (0.2).toFixed(1);
            state.metrics.videoLoss = (1.2).toFixed(1);
            state.metrics.lmsTime = (1.2).toFixed(2);
            state.metrics.bulkThroughput = (4.5).toFixed(1);
        } else if (load <= 100) {
            state.metrics.voiceLatency = (140 + (load - 80) * 4).toFixed(1);
            state.metrics.voiceJitter = (45 + (load - 80) * 2).toFixed(1);
            state.metrics.voiceLoss = (3.5 + (load - 80) * 0.2).toFixed(1);
            state.metrics.videoLoss = (6.8 + (load - 80) * 0.3).toFixed(1);
            state.metrics.lmsTime = (2.8 + (load - 80) * 0.06).toFixed(2);
            state.metrics.bulkThroughput = (6.5).toFixed(1);
        } else {
            // Overload state (>100%)
            const over = load - 100;
            state.metrics.voiceLatency = (310 + over * 2.8 + Math.random() * 15).toFixed(1);
            state.metrics.voiceJitter = (85 + over * 1.2 + Math.random() * 8).toFixed(1);
            state.metrics.voiceLoss = Math.min(14.5, 7.5 + over * 0.15).toFixed(1);
            state.metrics.videoLoss = Math.min(22.0, 11.8 + over * 0.25).toFixed(1);
            state.metrics.lmsTime = (4.2 + over * 0.08).toFixed(2);
            state.metrics.bulkThroughput = (7.8).toFixed(1); // Bulk hogs link in FIFO
        }

        state.metrics.bulkDrops = (18.5 + (load / 10)).toFixed(1); // Uncontrolled tail drops

        // FIFO single combined queue
        state.queues.voice = Math.min(40, Math.floor(load * 0.3));
        state.queues.video = Math.min(40, Math.floor(load * 0.35));
        state.queues.lms = Math.min(40, Math.floor(load * 0.2));
        state.queues.bulk = Math.min(50, Math.floor(load * 0.45));
    }
}

// ============================================================================
// UI Updates & Card Telemetry Binding
// ============================================================================
function updateUIDisplays() {
    calculateTelemetry();

    // Voice Card
    const vLat = document.getElementById('liveVoiceLatency');
    const vJit = document.getElementById('liveVoiceJitter');
    const vLoss = document.getElementById('liveVoiceLoss');
    const pillV = document.getElementById('pillVoice');
    const expV = document.getElementById('expVoice');
    const meterV = document.getElementById('meterVoice');

    if (vLat) vLat.textContent = state.metrics.voiceLatency;
    if (vJit) vJit.textContent = `${state.metrics.voiceJitter} ms`;
    if (vLoss) vLoss.textContent = `${state.metrics.voiceLoss}%`;

    if (parseFloat(state.metrics.voiceLatency) > 150) {
        pillV.className = 'card-status-pill status-degraded';
        pillV.textContent = 'Severe Lag (>150ms)';
        expV.textContent = 'Experience: Distorted, robotic choppy voice audio';
        meterV.style.width = '100%';
        meterV.style.background = '#ef4444';
    } else {
        pillV.className = 'card-status-pill status-healthy';
        pillV.textContent = 'Healthy SLA';
        expV.textContent = 'Experience: Crystal clear conversational audio';
        meterV.style.width = `${Math.min(100, (parseFloat(state.metrics.voiceLatency) / 150) * 100)}%`;
        meterV.style.background = 'var(--color-voice)';
    }

    // Video Card
    const vidLoss = document.getElementById('liveVideoLoss');
    const vidLat = document.getElementById('liveVideoLatency');
    const pillVid = document.getElementById('pillVideo');
    const expVid = document.getElementById('expVideo');
    const meterVid = document.getElementById('meterVideo');

    if (vidLoss) vidLoss.textContent = state.metrics.videoLoss;
    if (vidLat) vidLat.textContent = `${state.metrics.videoLatency} ms`;

    if (parseFloat(state.metrics.videoLoss) > 5.0) {
        pillVid.className = 'card-status-pill status-degraded';
        pillVid.textContent = 'Frequent Freezes';
        expVid.textContent = 'Experience: Heavy pixelation, audio-video desync';
        meterVid.style.width = '100%';
        meterVid.style.background = '#ef4444';
    } else {
        pillVid.className = 'card-status-pill status-healthy';
        pillVid.textContent = 'Smooth HD';
        expVid.textContent = 'Experience: Stable live webinar / zero buffering';
        meterVid.style.width = '20%';
        meterVid.style.background = 'var(--color-video)';
    }

    // LMS Card
    const lmsTime = document.getElementById('liveLmsTime');
    const pillLms = document.getElementById('pillLms');
    const expLms = document.getElementById('expLms');
    const meterLms = document.getElementById('meterLms');

    if (lmsTime) lmsTime.textContent = state.metrics.lmsTime;
    if (parseFloat(state.metrics.lmsTime) > 3.0) {
        pillLms.className = 'card-status-pill status-degraded';
        pillLms.textContent = 'Timeout Risk';
        expLms.textContent = 'Experience: Quiz submit spinner, slow gradebook sync';
        meterLms.style.background = '#ef4444';
    } else {
        pillLms.className = 'card-status-pill status-healthy';
        pillLms.textContent = 'Responsive';
        expLms.textContent = 'Experience: Instant gradebook & exam submission';
        meterLms.style.background = 'var(--color-lms)';
    }

    // Bulk Card
    const bulkThroughput = document.getElementById('liveBulkThroughput');
    const bulkDrops = document.getElementById('liveBulkDrops');
    const pillBulk = document.getElementById('pillBulk');
    const expBulk = document.getElementById('expBulk');

    if (bulkThroughput) bulkThroughput.textContent = state.metrics.bulkThroughput;
    if (bulkDrops) bulkDrops.textContent = `${state.metrics.bulkDrops}% (${state.mode === 'qos' ? 'WRED' : 'TailDrop'})`;

    if (state.mode === 'fifo') {
        pillBulk.className = 'card-status-pill status-degraded';
        pillBulk.textContent = 'Consuming Link';
        expBulk.textContent = 'Experience: Aggressive TCP bulk bursts starve voice/video';
    } else {
        pillBulk.className = 'card-status-pill status-controlled';
        pillBulk.textContent = 'WRED Throttled';
        expBulk.textContent = 'Experience: Downloads proceed gracefully in background';
    }

    // Queue occupancy bars
    updateQueueBars();
}

function updateQueueBars() {
    const occV = document.getElementById('occVoice');
    const occVid = document.getElementById('occVideo');
    const occLms = document.getElementById('occLms');
    const occBulk = document.getElementById('occBulk');

    const barV = document.getElementById('barVoice');
    const barVid = document.getElementById('barVideo');
    const barLms = document.getElementById('barLms');
    const barBulk = document.getElementById('barBulk');

    if (state.mode === 'qos') {
        if (occV) occV.textContent = `${state.queues.voice} pkts (LLQ Top)`;
        if (occVid) occVid.textContent = `${state.queues.video} pkts`;
        if (occLms) occLms.textContent = `${state.queues.lms} pkts`;
        if (occBulk) occBulk.textContent = `${state.queues.bulk} pkts (WRED Active)`;

        if (barV) barV.style.width = `${Math.min(100, state.queues.voice * 20 + 5)}%`;
        if (barVid) barVid.style.width = `${Math.min(100, state.queues.video * 10 + 10)}%`;
        if (barLms) barLms.style.width = `${Math.min(100, state.queues.lms * 12 + 8)}%`;
        if (barBulk) barBulk.style.width = `${Math.min(100, state.queues.bulk * 3 + 20)}%`;
    } else {
        if (occV) occV.textContent = `${state.queues.voice} pkts (FIFO Tail)`;
        if (occVid) occVid.textContent = `${state.queues.video} pkts (Blocked)`;
        if (occLms) occLms.textContent = `${state.queues.lms} pkts (Delayed)`;
        if (occBulk) occBulk.textContent = `${state.queues.bulk} pkts (Buffer Bloat)`;

        if (barV) barV.style.width = '85%';
        if (barVid) barVid.style.width = '90%';
        if (barLms) barLms.style.width = '80%';
        if (barBulk) barBulk.style.width = '95%';
    }
}

// ============================================================================
// Chart Initialization & Live Streaming
// ============================================================================
function initCharts() {
    // 1. Real-time Latency Stream Chart
    const ctxLatency = document.getElementById('latencyStreamChart');
    if (ctxLatency) {
        const labels = Array.from({ length: 15 }, (_, i) => `${i}s`);
        const initialVoice = Array.from({ length: 15 }, () => 18);
        const initialThreshold = Array.from({ length: 15 }, () => 150);

        latencyChart = new Chart(ctxLatency, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Voice Latency (ms)',
                        data: initialVoice,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.35,
                        pointRadius: 2
                    },
                    {
                        label: 'ITU-T Max Delay SLA (150ms)',
                        data: initialThreshold,
                        borderColor: '#ef4444',
                        borderWidth: 1.5,
                        borderDash: [5, 5],
                        pointRadius: 0,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 300 },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }
                    },
                    y: {
                        min: 0,
                        max: 400,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#cbd5e1', font: { family: 'Plus Jakarta Sans', size: 11 } }
                    }
                }
            }
        });
    }

    // 2. Bandwidth Allocation Profile Chart
    const ctxBw = document.getElementById('bandwidthAllocChart');
    if (ctxBw) {
        bandwidthChart = new Chart(ctxBw, {
            type: 'bar',
            data: {
                labels: ['Voice (EF)', 'Video (AF41)', 'LMS (AF21)', 'Bulk (BE)'],
                datasets: [{
                    label: 'Effective Allocated Bandwidth (Mbps)',
                    data: [0.1, 5.0, 2.0, 2.9],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(6, 182, 212, 0.8)',
                        'rgba(245, 158, 11, 0.8)'
                    ],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#cbd5e1', font: { family: 'Plus Jakarta Sans', size: 11 } }
                    },
                    y: {
                        min: 0,
                        max: 10,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // 3. Degradation Profile Curve (Static Benchmark Comparison)
    const ctxDeg = document.getElementById('degradationChart');
    if (ctxDeg) {
        degradationChart = new Chart(ctxDeg, {
            type: 'line',
            data: {
                labels: ['20% Load', '50% Load', '80% Load', '100% Saturation', '140% Overload'],
                datasets: [
                    {
                        label: 'Standard FIFO (Delay escalates past 350ms)',
                        data: [22, 40, 85, 180, 365],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: '#ef4444'
                    },
                    {
                        label: 'QoS LLQ Model (Voice delay constrained < 25ms)',
                        data: [16, 17, 18, 20, 22],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.2,
                        pointRadius: 5,
                        pointBackgroundColor: '#10b981'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#cbd5e1', font: { family: 'Plus Jakarta Sans', size: 11 } }
                    },
                    y: {
                        min: 0,
                        max: 400,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: {
                            color: '#64748b',
                            font: { family: 'JetBrains Mono', size: 10 },
                            callback: value => `${value} ms`
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // Start Live Sampling Interval for Line Chart
    setInterval(() => {
        if (!latencyChart) return;
        const currentLatency = parseFloat(state.metrics.voiceLatency);
        
        latencyChart.data.datasets[0].data.shift();
        latencyChart.data.datasets[0].data.push(currentLatency);
        latencyChart.update('none');

        // Update Bandwidth Chart
        if (bandwidthChart) {
            if (state.mode === 'qos') {
                bandwidthChart.data.datasets[0].data = [0.1, 5.0, 2.0, Math.max(0.8, (10 - 7.1) * (state.load / 100))];
            } else {
                bandwidthChart.data.datasets[0].data = [0.05, 1.5, 0.8, 7.65]; // bulk dominates FIFO
            }
            bandwidthChart.update('none');
        }
    }, 1000);
}

// ============================================================================
// Event Listeners & Interactive Handlers
// ============================================================================
function setupEventListeners() {
    // 1. QoS Mode Switch (Segmented Control)
    const btnFifo = document.getElementById('btnModeFifo');
    const btnQos = document.getElementById('btnModeQos');
    const engineStatus = document.getElementById('engineStatus');

    if (btnFifo && btnQos) {
        btnFifo.addEventListener('click', () => {
            state.mode = 'fifo';
            btnFifo.classList.add('active');
            btnQos.classList.remove('active');
            if (engineStatus) {
                engineStatus.textContent = 'FIFO Mode (No QoS Active)';
                engineStatus.style.color = '#ef4444';
            }
            updateUIDisplays();
        });

        btnQos.addEventListener('click', () => {
            state.mode = 'qos';
            btnQos.classList.add('active');
            btnFifo.classList.remove('active');
            if (engineStatus) {
                engineStatus.textContent = 'DiffServ Engine Active';
                engineStatus.style.color = 'var(--color-voice)';
            }
            updateUIDisplays();
        });
    }

    // 2. Bottleneck Load Slider
    const loadSlider = document.getElementById('linkLoadRange');
    const loadBadge = document.getElementById('loadDisplayBadge');

    if (loadSlider && loadBadge) {
        loadSlider.addEventListener('input', (e) => {
            state.load = parseInt(e.target.value, 10);
            
            // Format Badge
            if (state.load < 60) {
                loadBadge.textContent = `${state.load}% (Light Demand)`;
                loadBadge.style.color = '#6ee7b7';
                loadBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                loadBadge.style.background = 'rgba(16, 185, 129, 0.15)';
            } else if (state.load <= 100) {
                loadBadge.textContent = `${state.load}% (Normal Traffic)`;
                loadBadge.style.color = '#fcd34d';
                loadBadge.style.borderColor = 'rgba(245, 158, 11, 0.4)';
                loadBadge.style.background = 'rgba(245, 158, 11, 0.15)';
            } else {
                loadBadge.textContent = `${state.load}% (Overload Saturation)`;
                loadBadge.style.color = '#fca5a5';
                loadBadge.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                loadBadge.style.background = 'rgba(239, 68, 68, 0.15)';
            }

            // Remove active status from preset buttons if user moves slider manually
            document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active'));
            updateUIDisplays();
        });
    }

    // 3. Preset Scenario Buttons
    const presetButtons = document.querySelectorAll('.btn-preset');
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            presetButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetLoad = parseInt(btn.getAttribute('data-load'), 10);
            const targetMode = btn.getAttribute('data-qos');

            state.load = targetLoad;
            state.mode = targetMode;

            if (loadSlider) {
                loadSlider.value = targetLoad;
                loadSlider.dispatchEvent(new Event('input'));
            }

            if (targetMode === 'qos' && btnQos) {
                btnQos.click();
            } else if (targetMode === 'fifo' && btnFifo) {
                btnFifo.click();
            }
        });
    });

    // 4. Code Viewer Tabs (Cisco MQC, Mininet, Python)
    const codeTabs = document.querySelectorAll('.code-tab');
    const codeBlocks = document.querySelectorAll('.code-block');

    codeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            codeTabs.forEach(t => t.classList.remove('active'));
            codeBlocks.forEach(b => b.classList.remove('active'));

            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            const targetBlock = document.getElementById(targetId);
            if (targetBlock) targetBlock.classList.add('active');
        });
    });

    // 5. Copy Code Button
    const btnCopy = document.getElementById('btnCopyCode');
    const copyText = document.getElementById('copyText');

    if (btnCopy && copyText) {
        btnCopy.addEventListener('click', () => {
            const activeCodeBlock = document.querySelector('.code-block.active');
            if (!activeCodeBlock) return;

            navigator.clipboard.writeText(activeCodeBlock.innerText).then(() => {
                const originalText = copyText.textContent;
                copyText.textContent = 'Copied!';
                btnCopy.style.background = 'rgba(16, 185, 129, 0.2)';
                btnCopy.style.borderColor = 'rgba(16, 185, 129, 0.5)';

                setTimeout(() => {
                    copyText.textContent = originalText;
                    btnCopy.style.background = '';
                    btnCopy.style.borderColor = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy code: ', err);
            });
        });
    }

    // 6. Environment Cards Toggle Code Tabs
    const envCards = document.querySelectorAll('.env-card');
    envCards.forEach(card => {
        card.addEventListener('click', () => {
            envCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const envType = card.getAttribute('data-env');
            if (envType === 'cisco') document.getElementById('tabCisco')?.click();
            if (envType === 'mininet') document.getElementById('tabMininet')?.click();
            if (envType === 'python') document.getElementById('tabPython')?.click();
        });
    });
}

// ============================================================================
// Initialization Entry Point
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Simulator Canvas
    const sim = new TopologySimulator('pipelineCanvas');
    sim.updateAndDraw();

    // 2. Setup Charts
    initCharts();

    // 3. Bind UI Events
    setupEventListeners();

    // 4. Initial UI render
    updateUIDisplays();

    // Periodic telemetry jitter simulation (micro variation)
    setInterval(() => {
        updateUIDisplays();
    }, 1500);
});
