import { IoTNodeData, Device, SystemStats } from "../types/iot";

export class EnergyEngine {
  private static readonly BATTERY_CAPACITY = 1000; // Wh
  private static readonly CO2_FACTOR = 0.4; // g per Wh

  public static processTelemetry(nodes: IoTNodeData[], devices: Device[], currentStats: SystemStats): SystemStats {
    const totalGen = nodes.reduce((acc, n) => acc + n.energy, 0);
    const totalCon = devices.reduce((acc, d) => acc + (d.isActive ? d.consumption / 60 : 0), 0);
    
    const netEnergy = totalGen - totalCon;
    const newBatteryLevel = Math.min(this.BATTERY_CAPACITY, Math.max(0, currentStats.batteryLevel + netEnergy));
    
    // Efficiency score calculation based on heat-to-energy conversion across all nodes
    const avgTemp = nodes.reduce((acc, n) => acc + n.temperature, 0) / nodes.length;
    const efficiencyScore = Math.min(100, Math.max(0, (totalGen / (avgTemp * 0.1)) * 100));

    // Battery health degradation simulation (very slow)
    const healthDegradation = totalCon * 0.00001;
    const newHealth = Math.max(0, currentStats.batteryHealth - healthDegradation);

    // Cycle count increment (simplified)
    const cycleIncrement = (totalGen + totalCon) / (this.BATTERY_CAPACITY * 2);

    return {
      totalGeneration: totalGen,
      totalConsumption: totalCon * 60, // Back to Watts for display
      batteryLevel: newBatteryLevel,
      batteryHealth: newHealth,
      cycleCount: currentStats.cycleCount + cycleIncrement,
      totalSavedWh: currentStats.totalSavedWh + totalGen,
      co2ReducedG: (currentStats.totalSavedWh + totalGen) * this.CO2_FACTOR,
      efficiencyScore: parseFloat(efficiencyScore.toFixed(1)),
    };
  }
}
