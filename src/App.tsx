/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Flame, 
  Wind, 
  Refrigerator, 
  Battery, 
  BatteryCharging, 
  Zap, 
  ZapOff,
  Smartphone, 
  Lightbulb, 
  TrendingUp, 
  Leaf, 
  AlertCircle,
  Info,
  Terminal,
  Cpu,
  Radio,
  ArrowRight,
  Activity,
  ShieldCheck,
  Sun,
  Moon,
  Settings,
  LayoutDashboard,
  Server,
  Network,
  Wifi,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Database,
  X,
  ChevronRight,
  Microchip,
  Waves,
  Cloud
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// Core Modules
import { DataStreamer } from './core/DataStreamer';
import { EnergyEngine } from './core/EnergyEngine';
import { IoTNodeData, Device, SystemStats, SerialLog, RiskLevel } from './types/iot';

// --- Components ---

const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className, onClick }) => (
  <div 
    onClick={onClick}
    className={cn(
      "card-premium overflow-hidden", 
      className
    )}
  >
    {children}
  </div>
);

const SystemFlow: React.FC<{ stats: SystemStats }> = ({ stats }) => {
  const activeSteps = useMemo(() => {
    const active = [];
    if (stats.totalGeneration > 0) active.push(0, 1);
    if (stats.batteryLevel > 0) active.push(2);
    if (stats.totalConsumption > 0) active.push(3);
    if (stats.efficiencyScore > 90) active.push(4);
    return active;
  }, [stats]);

  const steps = [
    { name: "Heat", icon: <Flame size={16} />, color: "text-orange-500 bg-orange-500/10" },
    { name: "Conversion", icon: <Zap size={16} />, color: "text-warning bg-warning/10" },
    { 
      name: stats.totalGeneration < stats.totalConsumption ? "Discharge" : "Storage", 
      icon: stats.totalGeneration < stats.totalConsumption ? <Zap size={16} /> : <Battery size={16} />, 
      color: stats.totalGeneration < stats.totalConsumption ? "text-danger bg-danger/10" : "text-primary bg-primary/10" 
    },
    { name: "Usage", icon: <Lightbulb size={16} />, color: "text-accent bg-accent/10" },
    { name: "Insights", icon: <TrendingUp size={16} />, color: "text-purple-500 bg-purple-500/10" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 py-4 px-6 bg-bg-card rounded-2xl border border-border-main backdrop-blur-sm">
      {steps.map((step, idx) => (
        <React.Fragment key={step.name}>
          <motion.div 
            whileHover={{ y: -2 }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-500",
              activeSteps.includes(idx) ? "bg-bg-hover shadow-lg shadow-black/5 ring-1 ring-border-main" : "opacity-50"
            )}
          >
            <div className={cn("p-2 rounded-lg transition-all duration-300", step.color)}>
              {step.icon}
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-text-primary">{step.name}</span>
          </motion.div>
          {idx < steps.length - 1 && (
            <ArrowRight size={14} className={cn(
              "transition-colors duration-500",
              activeSteps.includes(idx) && activeSteps.includes(idx + 1) ? "text-primary" : "text-border-main"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const IoTNodeCard: React.FC<{ node: IoTNodeData; isHighest: boolean; isSelected: boolean; onClick: () => void; onDetailsClick: () => void }> = ({ node, isHighest, isSelected, onClick, onDetailsClick }) => {
  const statusColor = node.status === "HIGH" ? "text-danger" : node.status === "MEDIUM" ? "text-warning" : "text-accent";
  
  const colorMap = {
    kitchen: 'bg-orange-500/10 text-orange-500',
    ac: 'bg-accent/10 text-accent',
    fridge: 'bg-cyan-500/10 text-cyan-500',
  };

  const iconMap = {
    kitchen: <Flame size={20} />,
    ac: <Wind size={20} />,
    fridge: <Refrigerator size={20} />,
  };

  return (
    <Card 
      onClick={onClick}
      className={cn(
        "p-5 flex flex-col gap-4 transition-all duration-500 border-2 cursor-pointer group hover:scale-[1.02] node-card-premium",
        isSelected ? "border-primary shadow-lg shadow-primary/20" : 
        isHighest ? "border-primary/30 shadow-md shadow-primary/5" : "border-transparent hover:border-border-main"
      )}
    >
      <div className="flex justify-between items-start">
        <div className={cn("p-3 rounded-xl transition-colors duration-300", colorMap[node.id as keyof typeof colorMap])}>
          {iconMap[node.id as keyof typeof iconMap]}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className={cn(
            "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white shadow-sm",
            node.status === "HIGH" ? "bg-danger" : node.status === "MEDIUM" ? "bg-warning" : "bg-accent"
          )}>
            {node.status}
          </div>
          <div className="text-[10px] font-mono text-text-secondary flex items-center gap-1">
            <Cpu size={10} /> {node.nodeId}
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-text-primary text-sm font-black capitalize group-hover:text-primary transition-colors">{node.id} Node</h3>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-text-primary">{node.temperature.toFixed(1)}</span>
            <span className="text-text-primary/70 text-sm font-medium">°C</span>
          </div>
          <div className="text-[10px] font-mono text-text-primary/60 bg-bg-hover px-2 py-1 rounded border border-border-main">
            {node.voltage.toFixed(2)}V
          </div>
        </div>
      </div>
      <div className="pt-3 border-t border-border-main flex justify-between items-center">
        <button 
          onClick={(e) => { e.stopPropagation(); onDetailsClick(); }}
          className="text-[10px] uppercase font-bold tracking-widest text-accent hover:text-accent/80 flex items-center gap-1 transition-colors"
        >
          View Details <ChevronRight size={12} />
        </button>
        <span className="text-sm font-black text-primary">+{node.energy.toFixed(2)} Wh</span>
      </div>
    </Card>
  );
};

const NodeDetailView: React.FC<{ node: IoTNodeData; onClose: () => void; logs: SerialLog[]; isDarkMode: boolean }> = ({ node, onClose, logs, isDarkMode }) => {
  const [simData, setSimData] = useState({
    temperature: node.temperature.toFixed(1),
    voltage: node.voltage.toFixed(2),
    energy: node.energy.toFixed(2),
    signal: Math.floor(60 + Math.random() * 40)
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSimData(prev => {
        const temp = 30 + Math.random() * 15;
        const voltage = (temp - 25) * 0.05;
        return {
          temperature: temp.toFixed(1),
          voltage: voltage.toFixed(2),
          energy: (voltage * 2).toFixed(2),
          signal: Math.floor(60 + Math.random() * 40)
        };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const components = [
    { name: "Heat Source", desc: `Thermal energy from ${node.id} environment`, icon: <Flame size={20} />, status: "Active", color: "text-orange-500 bg-orange-500/10" },
    { name: "TEG Module", desc: "Converts heat to voltage using Seebeck effect", icon: <Zap size={20} />, status: "Active", color: "text-warning bg-warning/10" },
    { name: "Voltage Sensor", desc: "Precision ADC monitoring power output", icon: <Activity size={20} />, status: "Active", color: "text-primary bg-primary/10" },
    { name: "ESP32 MCU", desc: "Dual-core processor for data handling", icon: <Microchip size={20} />, status: "Active", color: "text-accent bg-accent/10" },
    { name: "WiFi Module", desc: "2.4GHz radio for MQTT transmission", icon: <Wifi size={20} />, status: "Active", color: "text-cyan-500 bg-cyan-500/10" },
    { name: "Supercap Storage", desc: "Optional buffer for peak power events", icon: <Battery size={20} />, status: "Idle", color: "text-text-secondary bg-text-secondary/10" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-xl overflow-y-auto transition-colors duration-500",
        isDarkMode ? "bg-black/80" : "bg-white/90"
      )}
    >
      <div className="w-full max-w-6xl bg-bg-card rounded-3xl border border-border-main shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-border-main flex items-center justify-between sticky top-0 bg-bg-card z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent text-white rounded-2xl">
              <Cpu size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 text-text-primary">
                {node.id} Node Architecture
                <div className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded border border-primary/20">
                  {node.nodeId}
                </div>
              </h2>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Virtual Hardware Explorer</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto space-y-12">
          {/* 1. Interactive Flow Diagram */}
          <section>
            <div className="flex items-center gap-2 mb-8">
              <Waves size={20} className="text-accent" />
              <h3 className="text-sm font-black uppercase tracking-widest text-text-secondary">Energy & Data Flow</h3>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-12 px-8 bg-bg-main rounded-3xl border border-border-main relative overflow-hidden">
              {[
                { label: "Heat", icon: <Flame />, color: "text-orange-500" },
                { label: "TEG", icon: <Zap />, color: "text-warning" },
                { label: "Sensor", icon: <Activity />, color: "text-primary" },
                { label: "ESP32", icon: <Microchip />, color: "text-accent" },
                { label: "Cloud", icon: <Cloud />, color: "text-cyan-500" }
              ].map((step, idx, arr) => (
                <React.Fragment key={step.label}>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center gap-3 relative z-10"
                  >
                    <div className={cn(
                      "p-5 rounded-2xl bg-bg-card border-2 transition-all duration-500 shadow-xl",
                      step.color.replace('text-', 'border-'),
                      "shadow-" + step.color.split('-')[1] + "-500/20"
                    )}>
                      {React.cloneElement(step.icon as React.ReactElement, { size: 32, className: step.color })}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{step.label}</span>
                  </motion.div>
                  {idx < arr.length - 1 && (
                    <div className="flex-1 h-1 bg-border-main relative min-w-[40px]">
                      <motion.div 
                        animate={{ x: ['0%', '100%'], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className={cn("absolute top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-current to-transparent", step.color)}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 2. Hardware Components Panel */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <Settings size={20} className="text-text-secondary" />
                <h3 className="text-sm font-black uppercase tracking-widest text-text-secondary">Hardware Architecture</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {components.map((comp) => (
                  <Card key={comp.name} className="p-4 border-border-main hover:border-accent/30 transition-all group">
                    <div className="flex gap-4">
                      <div className={cn("p-3 rounded-xl shrink-0 transition-transform group-hover:scale-110", comp.color)}>
                        {comp.icon}
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-black text-text-primary">{comp.name}</h4>
                          <span className={cn(
                            "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter",
                            comp.status === "Active" ? "bg-primary/10 text-primary" : "bg-bg-hover text-text-secondary"
                          )}>{comp.status}</span>
                        </div>
                        <p className="text-[11px] text-text-secondary leading-relaxed">{comp.desc}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* 3. Simulation & Stats */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Activity size={20} className="text-primary" />
                <h3 className="text-sm font-black uppercase tracking-widest text-text-secondary">Live Simulation</h3>
              </div>
              <Card className="p-6 bg-bg-main border-border-main">
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Temperature</p>
                      <div className="text-3xl font-black text-orange-500">{simData.temperature}°C</div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Voltage</p>
                      <div className="text-2xl font-black text-warning">{simData.voltage}V</div>
                    </div>
                  </div>
                  
                  <div className="h-px bg-border-main" />
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Energy Gen</p>
                      <div className="text-3xl font-black text-primary">{simData.energy}Wh</div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Signal</p>
                      <div className="text-2xl font-black text-accent">{simData.signal}%</div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-text-secondary uppercase">Node Health</span>
                      <span className="text-[10px] font-black text-primary">OPTIMAL</span>
                    </div>
                    <div className="w-full h-2 bg-bg-hover rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '94%' }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* How It Works */}
              <div className="p-5 bg-accent/5 rounded-2xl border border-accent/10">
                <h4 className="text-xs font-black text-accent uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Info size={14} /> How It Works
                </h4>
                <p className="text-[11px] text-text-secondary leading-relaxed italic">
                  "Heat is converted into electrical energy using a thermoelectric generator. The voltage is measured, processed by an ESP32, and transmitted to the cloud dashboard."
                </p>
              </div>

              {/* Mini MQTT Log */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-text-secondary" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Node Serial Output</h3>
                </div>
                <div className="mqtt-panel-premium p-3 font-mono text-[9px] h-32 overflow-y-auto border border-border-main space-y-1">
                  {logs.slice(-5).map(log => (
                    <div key={log.id} className="flex gap-2">
                      <span className="text-text-secondary font-bold">[{log.timestamp.split(' ')[0]}]</span>
                      <span className="text-primary">TX:</span>
                      <span className="text-text-primary truncate">{log.payload}</span>
                    </div>
                  ))}
                  {logs.length === 0 && <div className="text-text-secondary italic">Waiting for node packets...</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const IoTConsole: React.FC<{ logs: SerialLog[]; selectedNodeId: string | null; onClearFilter: () => void }> = ({ logs, selectedNodeId, onClearFilter }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Card className="mqtt-panel-premium border-none overflow-hidden flex flex-col h-[500px] shadow-xl">
      <div className="bg-bg-main px-4 py-2.5 flex items-center justify-between border-b border-border-main">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-text-secondary">
            <Terminal size={14} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest">MQTT Live Stream</span>
          </div>
          {selectedNodeId && (
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded text-[9px] font-bold text-primary uppercase">
              Filter: {selectedNodeId}
              <button onClick={onClearFilter} className="hover:text-text-primary transition-colors">
                <AlertCircle size={10} className="rotate-45" />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-danger/30" />
            <div className="w-2 h-2 rounded-full bg-warning/30" />
            <div className="w-2 h-2 rounded-full bg-primary/30" />
          </div>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="p-4 font-mono text-[11px] overflow-y-auto space-y-1.5 scroll-smooth bg-bg-hover/30"
      >
        {logs.map(log => (
          <div key={log.id} className="flex gap-3 border-b border-border-main pb-1.5 group hover:bg-bg-hover transition-colors">
            <span className="text-text-secondary shrink-0 font-bold">[{log.timestamp}]</span>
            <span className="text-accent shrink-0 font-bold uppercase tracking-tighter">{log.topic.split('/')[1]}</span>
            <span className="break-all text-text-primary group-hover:text-primary transition-colors">PAYLOAD: <span className="text-primary">{log.payload}</span></span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-text-secondary gap-2">
            <Radio size={24} className="animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Awaiting MQTT Packets...</span>
          </div>
        )}
      </div>
    </Card>
  );
};

const BatterySystem: React.FC<{ stats: SystemStats; isCharging: boolean }> = ({ stats, isCharging }) => {
  const percentage = (stats.batteryLevel / 1000) * 100;
  const netFlow = stats.totalGeneration - stats.totalConsumption;
  const isIdle = Math.abs(netFlow) < 0.1;
  const isDischarging = !isCharging && !isIdle;
  
  // Color based on level
  const levelColorClass = percentage > 60 ? "from-success to-emerald-400" : 
                          percentage > 25 ? "from-warning to-orange-400" : 
                          "from-danger to-red-600";

  // Glow based on state
  const stateGlowClass = isCharging ? "glow-charging" : 
                         (isDischarging ? (percentage < 25 ? "glow-discharging-warning" : "glow-discharging") : "");

  const statusText = isCharging ? "CHARGING" : isIdle ? "IDLE" : "DISCHARGING";

  return (
    <Card className={cn(
      "p-6 flex flex-col gap-6 transition-all duration-500",
      stateGlowClass
    )}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-lg transition-colors",
            isCharging ? "bg-success/20 text-success" : isIdle ? "bg-text-secondary/10 text-text-secondary" : "bg-danger/20 text-danger"
          )}>
            <Battery size={18} />
          </div>
          <h3 className="text-text-secondary text-xs font-black uppercase tracking-widest">Energy Storage</h3>
        </div>
        <div className="flex flex-col items-end">
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-black tracking-tighter",
            isCharging ? "text-success" : isIdle ? "text-text-secondary" : "text-danger"
          )}>
            {isCharging ? <BatteryCharging size={14} className="animate-pulse" /> : 
             isIdle ? <Battery size={14} /> : 
             <Zap size={14} className="animate-pulse" />}
            {statusText}
          </div>
          <span className="text-[9px] font-mono font-bold text-text-secondary/60">
            {isIdle ? "0.0W" : `${netFlow > 0 ? '+' : ''}${netFlow.toFixed(1)}W`}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 py-4">
        <div className="relative w-full h-32 bg-bg-hover rounded-2xl border-4 border-border-main p-1.5 overflow-hidden shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className={cn(
              "h-full rounded-xl transition-all duration-1000 ease-out relative overflow-hidden bg-gradient-to-r",
              levelColorClass
            )}
          >
            {(isCharging || !isIdle) && (
              <motion.div 
                animate={{ x: isCharging ? ['-100%', '200%'] : ['200%', '-100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
            )}
          </motion.div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black tracking-tighter text-text-primary drop-shadow-sm">{percentage.toFixed(1)}%</span>
            <span className="text-[10px] uppercase font-black tracking-widest text-text-secondary/70">
              {stats.batteryLevel.toFixed(1)} / 1000.0 Wh
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-main">
        <div className="flex flex-col">
          <span className="text-[9px] text-text-secondary uppercase font-black tracking-tighter">Health</span>
          <span className="text-sm font-black text-text-primary">{(stats.batteryHealth * 100).toFixed(1)}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-text-secondary uppercase font-black tracking-tighter">Cycles</span>
          <span className="text-sm font-black text-text-primary">{stats.cycleCount.toFixed(0)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-text-secondary uppercase font-black tracking-tighter">Efficiency</span>
          <span className="text-sm font-black text-text-primary">{stats.efficiencyScore}%</span>
        </div>
      </div>
    </Card>
  );
};

// --- Main App ---

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);
  const [nodes, setNodes] = useState<IoTNodeData[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [viewingNodeId, setViewingNodeId] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([
    { id: 'led', name: 'Smart LED', consumption: 5, isActive: true },
    { id: 'mobile', name: 'Phone Charger', consumption: 15, isActive: false },
    { id: 'iot-hub', name: 'IoT Hub', consumption: 10, isActive: true },
  ]);

  const [stats, setStats] = useState<SystemStats>({
    totalGeneration: 0,
    totalConsumption: 0,
    batteryLevel: 450,
    batteryHealth: 0.99,
    cycleCount: 142,
    totalSavedWh: 124.5,
    co2ReducedG: 49.8,
    efficiencyScore: 85.4,
  });

  const [history, setHistory] = useState<{ time: string; gen: number; level: number }[]>([]);
  const [logs, setLogs] = useState<SerialLog[]>([]);
  
  const streamerRef = useRef<DataStreamer | null>(null);

  useEffect(() => {
    // Initialize Data Streamer
    streamerRef.current = new DataStreamer(2000);
    
    const unsubscribe = streamerRef.current.subscribe((newNodes) => {
      setNodes(newNodes);
      
      // Process through Energy Engine
      setStats(prev => EnergyEngine.processTelemetry(newNodes, devices, prev));

      // Update Logs
      const newLogs: SerialLog[] = newNodes.map(n => ({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        topic: n.topic,
        payload: JSON.stringify({ temp: n.temperature, v: n.voltage, s: n.status })
      }));
      setLogs(prev => [...prev, ...newLogs].slice(-100));

      // Update History
      setHistory(prev => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const totalGen = newNodes.reduce((acc, n) => acc + n.energy, 0);
        return [...prev, { time: timeStr, gen: totalGen, level: stats.batteryLevel }].slice(-20);
      });
    });

    streamerRef.current.start();

    return () => {
      unsubscribe();
      streamerRef.current?.stop();
    };
  }, [devices]);

  const filteredLogs = useMemo(() => {
    if (!selectedNodeId) return logs;
    return logs.filter(log => log.topic.includes(selectedNodeId));
  }, [logs, selectedNodeId]);

  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        if (!d.isActive && stats.batteryLevel < 50) return d; // Prevent turning on if battery < 5%
        return { ...d, isActive: !d.isActive };
      }
      return d;
    }));
  };

  const highestSourceId = useMemo(() => {
    if (nodes.length === 0) return "";
    return [...nodes].sort((a, b) => b.energy - a.energy)[0].id;
  }, [nodes]);

  const insights = useMemo(() => {
    const list = [];
    const highestNode = nodes.find(n => n.id === highestSourceId);
    if (highestNode) {
      list.push({ 
        text: `${highestNode.nodeId} (${highestNode.id}) is delivering peak efficiency.`, 
        icon: <TrendingUp size={14} className="text-energy-green" />,
        type: 'info'
      });
    }
    
    if (stats.batteryLevel < 200) {
      list.push({ 
        text: "Low energy reserves. Load shedding recommended for non-critical devices.", 
        icon: <AlertCircle size={14} className="text-danger-red" />,
        type: 'critical'
      });
    } else if (stats.batteryLevel > 900) {
      list.push({ 
        text: "Battery capacity reached. Excess energy being dissipated.", 
        icon: <Info size={14} className="text-iot-blue" />,
        type: 'info'
      });
    }

    if (stats.efficiencyScore > 90) {
      list.push({ 
        text: "System operating at maximum thermodynamic efficiency.", 
        icon: <ShieldCheck size={14} className="text-energy-green" />,
        type: 'info'
      });
    }

    return list;
  }, [nodes, stats, highestSourceId]);

  return (
    <div className={cn("min-h-screen transition-colors duration-500 relative bg-bg-main text-text-primary")}>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary p-3 rounded-2xl text-white shadow-xl shadow-primary/20">
              <LayoutDashboard size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black tracking-tight uppercase text-text-primary">Home HeatGrid</h1>
                <div className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1.5 border border-primary/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  System Live
                </div>
              </div>
              <p className="text-text-primary/60 text-xs font-bold uppercase tracking-widest">
                Industrial IoT Energy Recovery Platform
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl bg-bg-card border border-border-main text-text-secondary hover:text-text-primary transition-all shadow-sm"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="bg-bg-card px-4 py-2 rounded-xl border border-border-main flex items-center gap-4 shadow-sm">
              <div className="flex items-center gap-3 pr-4 border-r border-border-main">
                <Wifi size={16} className="text-accent animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-text-primary/60 uppercase tracking-tighter">Network Status</span>
                  <span className="text-[10px] font-bold text-text-primary">Connected</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Activity size={16} className="text-primary" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-text-primary/60 uppercase tracking-tighter">Latency</span>
                  <span className="text-[10px] font-bold text-text-primary">120ms</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* System Flow Visualization */}
        <SystemFlow stats={stats} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Nodes & Analytics */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Distributed Nodes */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-text-primary">
                  <Activity size={20} className="text-primary" />
                  Distributed IoT Nodes
                </h2>
                <div className="flex gap-2">
                  <div className="px-2 py-1 bg-bg-card rounded text-[10px] font-mono text-text-secondary border border-border-main">MQTT Protocol</div>
                  <div className="px-2 py-1 bg-bg-card rounded text-[10px] font-mono text-text-secondary border border-border-main">v2.5.0</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {nodes.map(node => (
                  <IoTNodeCard 
                    key={node.id} 
                    node={node} 
                    isHighest={node.id === highestSourceId} 
                    isSelected={node.id === selectedNodeId}
                    onClick={() => setSelectedNodeId(node.id === selectedNodeId ? null : node.id)}
                    onDetailsClick={() => setViewingNodeId(node.id)}
                  />
                ))}
              </div>
            </section>

            {/* Performance Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-6">Energy Generation Trend</h3>
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                      <defs>
                        <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00C896" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00C896" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis 
                        dataKey="time" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} 
                        minTickGap={30}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--bg-card)',
                          borderRadius: '12px', 
                          border: '1px solid var(--border)', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          fontSize: '10px',
                        }}
                        itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                        labelStyle={{ color: 'var(--text-primary)', fontWeight: 'black', marginBottom: '4px', textTransform: 'uppercase' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="gen" 
                        stroke="var(--primary)" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorGen)" 
                        animationDuration={1000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-6">Node Contribution (Wh)</h3>
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={nodes}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis 
                        dataKey="id" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 9, fill: 'var(--text-secondary)', textTransform: 'uppercase' }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} 
                      />
                      <Tooltip 
                        cursor={{ fill: 'var(--bg-hover)' }}
                        contentStyle={{ 
                          backgroundColor: 'var(--bg-card)',
                          borderRadius: '12px', 
                          border: '1px solid var(--border)', 
                          fontSize: '10px',
                        }}
                        itemStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                        labelStyle={{ color: 'var(--text-primary)', fontWeight: 'black', marginBottom: '4px', textTransform: 'uppercase' }}
                      />
                      <Bar dataKey="energy" radius={[6, 6, 0, 0]}>
                        {nodes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.id === highestSourceId ? 'var(--primary)' : 'var(--accent)'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* MQTT Console */}
            <IoTConsole 
              logs={filteredLogs} 
              selectedNodeId={selectedNodeId} 
              onClearFilter={() => setSelectedNodeId(null)} 
            />
          </div>

          {/* Right Column: Storage, Load & Intelligence */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Battery System */}
            <BatterySystem stats={stats} isCharging={stats.totalGeneration > stats.totalConsumption} />

            {/* Load Control */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-text-primary">
                  <Settings size={20} className="text-text-secondary" />
                  Smart Load Control
                </h2>
                <div className="text-[10px] font-bold text-danger bg-danger/10 px-2 py-1 rounded">
                  -{stats.totalConsumption.toFixed(0)}W Total
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {devices.map(d => (
                  <Card key={d.id} className={cn(
                    "p-4 transition-all duration-300 border-2",
                    d.isActive ? "border-primary/30 bg-primary/5" : "border-transparent opacity-60"
                  )}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg transition-all duration-300 relative",
                          d.isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-bg-hover text-text-secondary"
                        )}>
                          {d.isActive && (
                            <motion.div 
                              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 bg-primary rounded-lg"
                            />
                          )}
                          <div className="relative z-10">
                            {d.id === 'led' ? <Lightbulb size={16} /> : d.id === 'mobile' ? <Smartphone size={16} /> : <Radio size={16} />}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={cn(
                              "text-sm font-black transition-colors duration-300",
                              d.isActive ? "text-primary" : "text-text-secondary"
                            )}>
                              {d.name}
                            </h4>
                            {d.isActive && (
                              <div className={cn(
                                "flex items-center gap-1 text-[8px] font-bold uppercase tracking-tighter",
                                stats.totalGeneration < stats.totalConsumption ? "text-danger" : "text-accent"
                              )}>
                                <ArrowRight size={8} className="animate-pulse" />
                                {stats.totalGeneration < stats.totalConsumption ? "Discharge" : "Usage"}: {d.consumption}W
                              </div>
                            )}
                          </div>
                          <span className={cn(
                            "text-[10px] font-mono font-bold transition-colors duration-300",
                            d.isActive ? "text-primary/60" : "text-text-secondary/80"
                          )}>
                            {d.consumption}W Nominal
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleDevice(d.id)}
                        className={cn(
                          "w-10 h-5 rounded-full relative transition-colors duration-300",
                          d.isActive ? "bg-primary" : "bg-text-secondary/30"
                        )}
                      >
                        <motion.div 
                          animate={{ x: d.isActive ? 22 : 2 }}
                          className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Intelligence Engine */}
            <section>
              <Card className="p-5 bg-bg-card border-border-main">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-accent/10 text-accent rounded-lg">
                    <ShieldCheck size={16} />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-accent">Intelligence Engine</h3>
                </div>
                <div className="space-y-4">
                  {insights.map((insight, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={cn(
                        "flex gap-3 items-start p-3 rounded-xl border transition-all duration-300",
                        insight.type === 'critical' ? "bg-danger/5 border-danger/10" : 
                        insight.type === 'warning' ? "bg-warning/5 border-warning/10" :
                        "bg-bg-hover border-border-main"
                      )}
                    >
                      <div className="mt-0.5">{insight.icon}</div>
                      <p className={cn(
                        "text-[11px] leading-relaxed font-medium",
                        insight.type === 'critical' ? "text-danger" : 
                        insight.type === 'warning' ? "text-warning" :
                        "text-text-primary/80"
                      )}>{insight.text}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </section>

            {/* Impact Analytics */}
            <section className="grid grid-cols-2 gap-4">
              <Card className={cn(
                "p-5 transition-all duration-300 border shadow-lg shadow-primary/20",
                isDarkMode ? "bg-primary text-white border-none" : "bg-bg-card text-text-primary border-border-main"
              )}>
                <div className="flex justify-between items-start mb-2">
                  <Leaf size={18} className={isDarkMode ? "opacity-80" : "text-primary"} />
                  <span className={cn(
                    "text-[8px] font-bold uppercase tracking-widest",
                    isDarkMode ? "opacity-80" : "text-text-secondary"
                  )}>Sustainability</span>
                </div>
                <div className={cn(
                  "text-3xl font-black tracking-tighter",
                  !isDarkMode && "text-primary"
                )}>{stats.totalSavedWh.toFixed(1)}</div>
                <div className={cn(
                  "text-[10px] uppercase font-bold",
                  isDarkMode ? "opacity-80" : "text-text-secondary"
                )}>Total Wh Saved</div>
              </Card>
              <Card className="p-5 bg-bg-card text-text-primary border border-border-main">
                <div className="flex justify-between items-start mb-2">
                  <TrendingUp size={18} className="text-primary" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary">Efficiency</span>
                </div>
                <div className="text-3xl font-black tracking-tighter text-primary">{stats.efficiencyScore}%</div>
                <div className="text-[10px] uppercase font-bold text-text-secondary">System Score</div>
              </Card>
            </section>

          </div>
        </div>

        {/* Footer Info */}
        <footer className="pt-8 border-t border-border-main flex flex-col md:flex-row justify-between gap-6 text-text-secondary text-[10px] font-bold uppercase tracking-widest">
          <div className="flex flex-col gap-2">
            <p>© 2026 Home HeatGrid | Industrial IoT Energy Platform</p>
            <p className="font-mono text-text-secondary/60">Build: 2.5.0-production-stable // Node_ID: MASTER_HUB_01</p>
          </div>
          <div className="flex flex-wrap gap-6">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> MQTT Broker: Online</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent" /> TLS 1.3: Active</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> AI Engine: Optimized</span>
          </div>
        </footer>

        {/* Node Detail Modal */}
        <AnimatePresence>
          {viewingNodeId && nodes.find(n => n.id === viewingNodeId) && (
            <NodeDetailView 
              node={nodes.find(n => n.id === viewingNodeId)!} 
              onClose={() => setViewingNodeId(null)}
              logs={logs.filter(l => l.topic.includes(viewingNodeId))}
              isDarkMode={isDarkMode}
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
