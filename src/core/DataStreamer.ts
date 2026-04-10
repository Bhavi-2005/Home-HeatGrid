import { IoTNodeData, RiskLevel } from "../types/iot";

export class DataStreamer {
  private interval: number;
  private subscribers: ((data: IoTNodeData[]) => void)[] = [];
  private timer: NodeJS.Timeout | null = null;

  constructor(interval: number = 2000) {
    this.interval = interval;
  }

  public subscribe(callback: (data: IoTNodeData[]) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== callback);
    };
  }

  public start() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      const data = this.generateAllNodesData();
      this.subscribers.forEach(cb => cb(data));
    }, this.interval);
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private generateAllNodesData(): IoTNodeData[] {
    return [
      this.generateNodeData("kitchen", "ESP32-K1", "home/kitchen/energy", 70, 50),
      this.generateNodeData("ac", "ESP32-A2", "home/ac/energy", 40, 20),
      this.generateNodeData("fridge", "ESP32-R3", "home/fridge/energy", 35, 10),
    ];
  }

  private generateNodeData(id: string, nodeId: string, topic: string, baseTemp: number, range: number): IoTNodeData {
    const temp = baseTemp + Math.random() * range;
    const voltage = Math.max(0, (temp - 25) * 0.05);
    const energy = voltage * 2.5; // Simulated conversion efficiency
    const status: RiskLevel = temp > 85 ? "HIGH" : temp > 55 ? "MEDIUM" : "LOW";

    return {
      id,
      nodeId,
      topic,
      temperature: parseFloat(temp.toFixed(1)),
      voltage: parseFloat(voltage.toFixed(2)),
      energy: parseFloat(energy.toFixed(2)),
      status,
      timestamp: new Date().toLocaleTimeString(),
    };
  }
}
