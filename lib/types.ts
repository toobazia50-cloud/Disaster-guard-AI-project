export type RiskLevel = 'safe' | 'warning' | 'critical'

export interface WeatherData {
  temperature: number
  humidity: number
  rainfall: number
  windSpeed: number
  pressure: number
  visibility: number
  condition: string
  icon: string
  lastUpdated: string
}

export interface RiverData {
  name: string
  level: number
  maxLevel: number
  trend: 'rising' | 'falling' | 'stable'
  riskLevel: RiskLevel
}

export interface RegionData {
  id: string
  name: string
  riskLevel: RiskLevel
  confidence: number
  temperature: number
  rainfall: number
  humidity: number
  floodRisk: number
  heatwaveRisk: number
  alerts: Alert[]
}

export interface Alert {
  id: string
  type: 'flood' | 'heatwave' | 'cyclone' | 'earthquake' | 'general'
  severity: RiskLevel
  title: string
  message: string
  region: string
  timestamp: string
  isActive: boolean
}

export interface PredictionInput {
  temperature: number
  rainfall: number
  humidity: number
  riverLevel: number
  windSpeed: number
}

export interface PredictionResult {
  riskLevel: RiskLevel
  confidence: number
  factors: {
    name: string
    contribution: number
    status: RiskLevel
  }[]
  recommendations: string[]
  timestamp: string
}

export interface HistoricalData {
  date: string
  temperature: number
  rainfall: number
  humidity: number
  riverLevel: number
  riskLevel: RiskLevel
  actualDisaster: boolean
}

export interface DatasetInfo {
  name: string
  rows: number
  columns: number
  missingValues: number
  duplicates: number
  uploadedAt: string
  columns_list: string[]
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'operator' | 'viewer'
  avatar?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface SystemStats {
  totalAlerts: number
  activeAlerts: number
  regionsMonitored: number
  predictionAccuracy: number
  lastPrediction: string
  systemStatus: 'online' | 'degraded' | 'offline'
}
