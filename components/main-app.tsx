'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Sidebar } from '@/components/sidebar'
import { LoginForm } from '@/components/login-form'
import { AIChatbot } from '@/components/ai-chatbot'
import {
  StatCard,
  WeatherWidget,
  RiskIndicator,
  SystemStatusBar
} from '@/components/dashboard-widgets'
import { PakistanMap } from '@/components/pakistan-map'
import { AlertList, SOSButton, QuickAlertActions } from '@/components/alert-system'
import { PredictionEngine, PredictionHistory } from '@/components/prediction-engine'
import {
  WeatherTrendChart,
  RiverLevelChart,
  RiskDistributionChart,
  PredictionAccuracyChart,
  AlertTrendsChart,
  RegionalComparisonChart
} from '@/components/analytics-charts'
import { DatasetManager } from '@/components/dataset-manager'
import { SettingsPage, AboutPage } from '@/components/pages'
import { cn } from '@/lib/utils'
import {
  Thermometer,
  Droplets,
  Waves,
  Activity,
  AlertTriangle,
  Clock,
  MapPin
} from 'lucide-react'

function DashboardContent() {
  const { regions, weather, systemStats, alerts } = useAppStore()
  
  // Calculate overall risk
  const criticalRegions = regions.filter(r => r.riskLevel === 'critical')
  const warningRegions = regions.filter(r => r.riskLevel === 'warning')
  const overallRisk = criticalRegions.length > 0 ? 'critical' : 
    warningRegions.length > 0 ? 'warning' : 'safe'
  const avgConfidence = Math.round(
    regions.reduce((acc, r) => acc + r.confidence, 0) / regions.length
  )
  
  const activeAlerts = alerts.filter(a => a.isActive)
  
  return (
    <div className="space-y-6">
      {/* Header with status */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Command Center Dashboard</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
        <SystemStatusBar />
      </div>
      
      {/* Main stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Temperature"
          value={weather?.temperature || 0}
          unit="°C"
          icon={<Thermometer className="h-5 w-5" />}
          riskLevel={weather && weather.temperature > 40 ? 'critical' : 
            weather && weather.temperature > 35 ? 'warning' : 'safe'}
          trend="up"
          trendValue="+2°C from yesterday"
          delay={0}
        />
        <StatCard
          title="Rainfall"
          value={weather?.rainfall || 0}
          unit="mm"
          icon={<Droplets className="h-5 w-5" />}
          riskLevel={weather && weather.rainfall > 100 ? 'critical' : 
            weather && weather.rainfall > 50 ? 'warning' : 'safe'}
          trend="up"
          trendValue="+15mm today"
          delay={0.1}
        />
        <StatCard
          title="River Level"
          value={65}
          unit="%"
          icon={<Waves className="h-5 w-5" />}
          riskLevel="warning"
          trend="up"
          trendValue="Rising steadily"
          delay={0.2}
        />
        <StatCard
          title="Active Alerts"
          value={activeAlerts.length}
          icon={<AlertTriangle className="h-5 w-5" />}
          riskLevel={activeAlerts.length > 2 ? 'critical' : 
            activeAlerts.length > 0 ? 'warning' : 'safe'}
          delay={0.3}
        />
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Weather and Risk */}
        <div className="space-y-6">
          <WeatherWidget />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-5"
          >
            <h3 className="font-semibold mb-4">Overall Risk Assessment</h3>
            <div className="flex items-center justify-center">
              <RiskIndicator
                level={overallRisk}
                confidence={avgConfidence}
                label="System Status"
                size="lg"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-safe/10">
                <p className="text-safe font-medium">{regions.filter(r => r.riskLevel === 'safe').length}</p>
                <p className="text-muted-foreground">Safe</p>
              </div>
              <div className="p-2 rounded-lg bg-warning/10">
                <p className="text-warning font-medium">{warningRegions.length}</p>
                <p className="text-muted-foreground">Warning</p>
              </div>
              <div className="p-2 rounded-lg bg-critical/10">
                <p className="text-critical font-medium">{criticalRegions.length}</p>
                <p className="text-muted-foreground">Critical</p>
              </div>
            </div>
          </motion.div>
          
          <QuickAlertActions />
        </div>
        
        {/* Center column - Map */}
        <div className="lg:col-span-2 space-y-6">
          <PakistanMap />
          
          <WeatherTrendChart />
        </div>
      </div>
      
      {/* Bottom section - Alerts and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="font-semibold">Active Alerts</h3>
          <AlertList />
        </motion.div>
        
        <RiverLevelChart />
      </div>
    </div>
  )
}

function AlertsContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Emergency Alerts</h1>
          <p className="text-muted-foreground">Monitor and manage disaster alerts</p>
        </div>
        <SOSButton />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AlertList />
        </div>
        <div className="space-y-6">
          <QuickAlertActions />
          <AlertTrendsChart />
        </div>
      </div>
    </div>
  )
}

function PredictionContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Disaster Prediction</h1>
        <p className="text-muted-foreground">Machine learning-based risk assessment engine</p>
      </div>
      
      <PredictionEngine />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PredictionHistory limit={10} />
        <PredictionAccuracyChart />
      </div>
    </div>
  )
}

function MapContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pakistan Risk Map</h1>
        <p className="text-muted-foreground">Interactive regional disaster risk visualization</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PakistanMap />
        </div>
        <div className="space-y-6">
          <RiskDistributionChart />
          <RegionalComparisonChart />
        </div>
      </div>
    </div>
  )
}

function DatasetContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dataset Management</h1>
        <p className="text-muted-foreground">Upload, preprocess, and manage disaster data</p>
      </div>
      
      <DatasetManager />
    </div>
  )
}

function ReportsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics & Reports</h1>
        <p className="text-muted-foreground">Comprehensive disaster analytics and trends</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherTrendChart />
        <RiverLevelChart />
        <RiskDistributionChart />
        <PredictionAccuracyChart />
        <AlertTrendsChart />
        <RegionalComparisonChart />
      </div>
    </div>
  )
}

export function MainApp() {
  const { isAuthenticated, currentPage, sidebarOpen, theme } = useAppStore()
  
  // Apply theme class to html
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }
  
  if (!isAuthenticated) {
    return <LoginForm />
  }
  
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardContent />
      case 'prediction':
        return <PredictionContent />
      case 'alerts':
        return <AlertsContent />
      case 'map':
        return <MapContent />
      case 'dataset':
        return <DatasetContent />
      case 'reports':
        return <ReportsContent />
      case 'settings':
        return <SettingsPage />
      case 'about':
        return <AboutPage />
      default:
        return <DashboardContent />
    }
  }
  
  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Sidebar />
      
      <main className={cn(
        'transition-all duration-300 p-4 lg:p-6',
        sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-[80px]'
      )}>
        <div className="pt-12 lg:pt-0">
          {renderContent()}
        </div>
      </main>
      
      <AIChatbot />
    </div>
  )
}
