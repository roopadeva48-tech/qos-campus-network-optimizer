import { create } from 'zustand';

export const useQoSStore = create((set, get) => ({
  isQoSEnabled: true,
  networkLoad: 100, // percentage 20 - 150
  showIntro: true,

  setQoSEnabled: (enabled) => set({ isQoSEnabled: enabled }),
  setNetworkLoad: (load) => set({ networkLoad: load }),
  setShowIntro: (show) => set({ showIntro: show }),

  // Computed Telemetry Metrics
  getMetrics: () => {
    const { isQoSEnabled, networkLoad } = get();

    if (isQoSEnabled) {
      return {
        voice: {
          latency: (16 + networkLoad * 0.04).toFixed(0),
          jitter: (2.8 + networkLoad * 0.015).toFixed(1),
          loss: 0.0,
          status: 'Optimal SLA',
          desc: 'Voice packets jump to front via strict LLQ (< 25ms delay).'
        },
        video: {
          loss: networkLoad > 100 ? (0.2 + (networkLoad - 100) * 0.01).toFixed(1) : 0.1,
          bandwidth: 5.0,
          status: 'Smooth HD',
          desc: '50% dedicated CBWFQ bandwidth slice guarantees continuous stream.'
        },
        lms: {
          responseTime: '0.6',
          retransmit: '0.02%',
          status: 'Fast Response',
          desc: 'Guaranteed 20% slice ensures instant quiz and page load.'
        },
        bulk: {
          throughput: Math.max(0.8, (2.8 - (networkLoad > 100 ? (networkLoad - 100) * 0.03 : 0))).toFixed(1),
          drops: '3.2%',
          status: 'Throttled (WRED)',
          desc: 'Downloads use spare capacity without impacting live classes.'
        },
        chartData: [
          { name: 'Voice (EF)', allocated: 0.1, actual: 0.1 },
          { name: 'Video (AF41)', allocated: 5.0, actual: 4.8 },
          { name: 'LMS (AF21)', allocated: 2.0, actual: 1.9 },
          { name: 'Bulk (BE)', allocated: 2.9, actual: Math.max(0.8, 2.8 * (networkLoad / 100)) },
        ]
      };
    } else {
      // FIFO Degradation
      const isOverload = networkLoad > 60;
      return {
        voice: {
          latency: isOverload ? (250 + (networkLoad - 60) * 2).toFixed(0) : '45',
          jitter: isOverload ? '95.0' : '15.0',
          loss: isOverload ? '8.5' : '0.8',
          status: isOverload ? 'Severe Lag (>300ms)' : 'Acceptable',
          desc: isOverload ? 'Choppy distorted audio; packets trapped in FIFO buffer bloat.' : 'Low traffic allows packets through.'
        },
        video: {
          loss: isOverload ? (8.5 + (networkLoad - 60) * 0.1).toFixed(1) : 0.8,
          bandwidth: isOverload ? 1.5 : 3.5,
          status: isOverload ? 'Frequent Freezes' : 'Minor Jitter',
          desc: isOverload ? 'High packet loss causes continuous video buffering.' : 'Occasional frame skips.'
        },
        lms: {
          responseTime: isOverload ? (3.5 + (networkLoad - 60) * 0.02).toFixed(1) : '1.2',
          retransmit: isOverload ? '4.8%' : '0.5%',
          status: isOverload ? 'Timeout Risk' : 'Normal',
          desc: isOverload ? 'Slow response risks student exam submission failures.' : 'Standard web response.'
        },
        bulk: {
          throughput: isOverload ? '7.5' : '4.5',
          drops: isOverload ? '18.4%' : '2.1%',
          status: isOverload ? 'Link Saturation' : 'Active',
          desc: isOverload ? 'Aggressive TCP bulk streams consume link and starve voice/video.' : 'Downloads share link equally.'
        },
        chartData: [
          { name: 'Voice (EF)', allocated: 0.05, actual: 0.05 },
          { name: 'Video (AF41)', allocated: 1.5, actual: 1.2 },
          { name: 'LMS (AF21)', allocated: 0.8, actual: 0.7 },
          { name: 'Bulk (BE)', allocated: 7.65, actual: 7.5 },
        ]
      };
    }
  }
}));
