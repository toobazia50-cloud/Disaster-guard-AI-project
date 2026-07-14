import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Alert, RegionData, RiskLevel, WeatherData, PredictionResult, ChatMessage, SystemStats } from './types'

interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  
  // Theme
  theme: 'dark' | 'light'
  toggleTheme: () => void
  
  // Sidebar
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  
  // Navigation
  currentPage: string
  setCurrentPage: (page: string) => void
  
  // Alerts
  alerts: Alert[]
  addAlert: (alert: Alert) => void
  dismissAlert: (id: string) => void
  clearAllAlerts: () => void
  
  // Regions
  regions: RegionData[]
  selectedRegion: string | null
  setSelectedRegion: (region: string | null) => void
  updateRegion: (id: string, data: Partial<RegionData>) => void
  
  // Weather
  weather: WeatherData | null
  setWeather: (data: WeatherData) => void
  
  // Predictions
  lastPrediction: PredictionResult | null
  predictionHistory: PredictionResult[]
  addPrediction: (prediction: PredictionResult) => void
  
  // Chat
  chatMessages: ChatMessage[]
  addChatMessage: (message: ChatMessage) => void
  clearChat: () => void
  
  // System
  systemStats: SystemStats
  updateSystemStats: (stats: Partial<SystemStats>) => void
  
  // Voice alerts
  voiceEnabled: boolean
  setVoiceEnabled: (enabled: boolean) => void
  
  // Language
  language: 'en' | 'ur'
  setLanguage: (lang: 'en' | 'ur') => void
}

const defaultRegions: RegionData[] = [
  {
    id: 'sindh',
    name: 'Sindh',
    riskLevel: 'warning',
    confidence: 78,
    temperature: 38,
    rainfall: 45,
    humidity: 72,
    floodRisk: 65,
    heatwaveRisk: 45,
    alerts: []
  },
  {
    id: 'punjab',
    name: 'Punjab',
    riskLevel: 'safe',
    confidence: 85,
    temperature: 35,
    rainfall: 20,
    humidity: 55,
    floodRisk: 25,
    heatwaveRisk: 35,
    alerts: []
  },
  {
    id: 'kpk',
    name: 'Khyber Pakhtunkhwa',
    riskLevel: 'critical',
    confidence: 92,
    temperature: 32,
    rainfall: 120,
    humidity: 85,
    floodRisk: 88,
    heatwaveRisk: 15,
    alerts: []
  },
  {
    id: 'balochistan',
    name: 'Balochistan',
    riskLevel: 'safe',
    confidence: 88,
    temperature: 42,
    rainfall: 5,
    humidity: 28,
    floodRisk: 10,
    heatwaveRisk: 72,
    alerts: []
  },
  {
    id: 'gilgit',
    name: 'Gilgit-Baltistan',
    riskLevel: 'warning',
    confidence: 75,
    temperature: 22,
    rainfall: 60,
    humidity: 65,
    floodRisk: 55,
    heatwaveRisk: 5,
    alerts: []
  },
  {
    id: 'azad_kashmir',
    name: 'Azad Kashmir',
    riskLevel: 'critical',
    confidence: 89,
    temperature: 28,
    rainfall: 95,
    humidity: 78,
    floodRisk: 82,
    heatwaveRisk: 10,
    alerts: []
  },
  {
    id: 'islamabad',
    name: 'Islamabad',
    riskLevel: 'safe',
    confidence: 94,
    temperature: 33,
    rainfall: 35,
    humidity: 60,
    floodRisk: 30,
    heatwaveRisk: 25,
    alerts: []
  },
  {
    id: 'karachi',
    name: 'Karachi',
    riskLevel: 'warning',
    confidence: 82,
    temperature: 36,
    rainfall: 55,
    humidity: 80,
    floodRisk: 58,
    heatwaveRisk: 40,
    alerts: []
  }
]

const defaultAlerts: Alert[] = [
  {
    id: '1',
    type: 'flood',
    severity: 'critical',
    title: 'Flash Flood Warning',
    message: 'Heavy rainfall expected in northern regions. Flash floods likely in Swat and Dir districts.',
    region: 'Khyber Pakhtunkhwa',
    timestamp: new Date().toISOString(),
    isActive: true
  },
  {
    id: '2',
    type: 'heatwave',
    severity: 'warning',
    title: 'Heat Wave Advisory',
    message: 'Temperatures expected to reach 45°C in Jacobabad and surrounding areas.',
    region: 'Sindh',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isActive: true
  },
  {
    id: '3',
    type: 'flood',
    severity: 'warning',
    title: 'River Level Alert',
    message: 'Indus River approaching high flood level near Sukkur Barrage.',
    region: 'Sindh',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    isActive: true
  }
]

const defaultSystemStats: SystemStats = {
  totalAlerts: 156,
  activeAlerts: 3,
  regionsMonitored: 8,
  predictionAccuracy: 94.5,
  lastPrediction: new Date().toISOString(),
  systemStatus: 'online'
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Simulate login - in production, this would call an API
        if (email === 'admin@disasterguard.pk' && password === 'admin123') {
          const user: User = {
            id: '1',
            email,
            name: 'Admin User',
            role: 'admin'
          }
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      
      // Theme
      theme: 'dark',
      toggleTheme: () => set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      
      // Sidebar
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // Navigation
      currentPage: 'dashboard',
      setCurrentPage: (page) => set({ currentPage: page }),
      
      // Alerts
      alerts: defaultAlerts,
      addAlert: (alert) => set(state => ({ alerts: [alert, ...state.alerts] })),
      dismissAlert: (id) => set(state => ({
        alerts: state.alerts.map(a => a.id === id ? { ...a, isActive: false } : a)
      })),
      clearAllAlerts: () => set(state => ({
        alerts: state.alerts.map(a => ({ ...a, isActive: false }))
      })),
      
      // Regions
      regions: defaultRegions,
      selectedRegion: null,
      setSelectedRegion: (region) => set({ selectedRegion: region }),
      updateRegion: (id, data) => set(state => ({
        regions: state.regions.map(r => r.id === id ? { ...r, ...data } : r)
      })),
      
      // Weather
      weather: {
        temperature: 35,
        humidity: 65,
        rainfall: 12,
        windSpeed: 15,
        pressure: 1013,
        visibility: 10,
        condition: 'Partly Cloudy',
        icon: 'cloud-sun',
        lastUpdated: new Date().toISOString()
      },
      setWeather: (data) => set({ weather: data }),
      
      // Predictions
      lastPrediction: null,
      predictionHistory: [],
      addPrediction: (prediction) => set(state => ({
        lastPrediction: prediction,
        predictionHistory: [prediction, ...state.predictionHistory].slice(0, 50)
      })),
      
      // Chat
      chatMessages: [],
      addChatMessage: (message) => set(state => ({
        chatMessages: [...state.chatMessages, message]
      })),
      clearChat: () => set({ chatMessages: [] }),
      
      // System
      systemStats: defaultSystemStats,
      updateSystemStats: (stats) => set(state => ({
        systemStats: { ...state.systemStats, ...stats }
      })),
      
      // Voice
      voiceEnabled: true,
      setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
      
      // Language
      language: 'en',
      setLanguage: (lang) => set({ language: lang })
    }),
    {
      name: 'disasterguard-storage',
      partialize: (state) => ({
        theme: state.theme,
        voiceEnabled: state.voiceEnabled,
        language: state.language,
        isAuthenticated: state.isAuthenticated,
        user: state.user
      })
    }
  )
)

// Risk level utilities
export const getRiskColor = (level: RiskLevel): string => {
  switch (level) {
    case 'safe': return 'text-safe'
    case 'warning': return 'text-warning'
    case 'critical': return 'text-critical'
    default: return 'text-muted-foreground'
  }
}

export const getRiskBgColor = (level: RiskLevel): string => {
  switch (level) {
    case 'safe': return 'bg-safe'
    case 'warning': return 'bg-warning'
    case 'critical': return 'bg-critical'
    default: return 'bg-muted'
  }
}

export const getRiskGlow = (level: RiskLevel): string => {
  switch (level) {
    case 'safe': return 'glow-safe'
    case 'warning': return 'glow-warning'
    case 'critical': return 'glow-critical'
    default: return ''
  }
}

export const getRiskPulse = (level: RiskLevel): string => {
  switch (level) {
    case 'safe': return 'pulse-safe'
    case 'warning': return 'pulse-warning'
    case 'critical': return 'pulse-critical'
    default: return ''
  }
}
