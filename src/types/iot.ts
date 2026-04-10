export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface IoTNodeData {
  id: string;
  nodeId: string;
  topic: string;
  temperature: number;
  voltage: number;
  energy: number;
  status: RiskLevel;
  timestamp: string;
}

export interface Device {
  id: string;
  name: string;
  consumption: number;
  isActive: boolean;
}

export interface SystemStats {
  totalGeneration: number;
  totalConsumption: number;
  batteryLevel: number;
  batteryHealth: number;
  cycleCount: number;
  totalSavedWh: number;
  co2ReducedG: number;
  efficiencyScore: number;
}

export interface SerialLog {
  id: string;
  timestamp: string;
  topic: string;
  payload: string;
}
