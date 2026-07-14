'use client'

import { motion } from 'framer-motion'
import { useAppStore, getRiskColor, getRiskPulse } from '@/lib/store'
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RiskLevel } from '@/lib/types'

interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
  riskLevel?: RiskLevel
  delay?: number
}

export function StatCard({
  title,
  value,
  unit,
  icon,
  trend,
  trendValue,
  riskLevel,
  delay = 0
}: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={cn(
        'relative glass-card rounded-xl p-4 overflow-hidden',
        riskLevel && getRiskPulse(riskLevel)
      )}
    >
      {/* Background gradient based on risk */}
      {riskLevel && (
        <div className={cn(
          'absolute inset-0 opacity-10',
          riskLevel === 'safe' && 'bg-gradient-to-br from-safe to-transparent',
          riskLevel === 'warning' && 'bg-gradient-to-br from-warning to-transparent',
          riskLevel === 'critical' && 'bg-gradient-to-br from-critical to-transparent'
        )} />
      )}
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            <span className={cn(
              'text-2xl font-bold',
              riskLevel ? getRiskColor(riskLevel) : 'text-foreground'
            )}>
              {value}
            </span>
            {unit && (
              <span className="text-sm text-muted-foreground">{unit}</span>
            )}
          </div>
          {trend && trendValue && (
            <div className={cn(
              'flex items-center gap-1 text-xs',
              trend === 'up' ? 'text-critical' : trend === 'down' ? 'text-safe' : 'text-muted-foreground'
            )}>
              <TrendIcon className="h-3 w-3" />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={cn(
          'p-2.5 rounded-lg',
          riskLevel === 'safe' && 'bg-safe/20 text-safe',
          riskLevel === 'warning' && 'bg-warning/20 text-warning',
          riskLevel === 'critical' && 'bg-critical/20 text-critical',
          !riskLevel && 'bg-primary/20 text-primary'
        )}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}

export function WeatherWidget() {
  const { weather } = useAppStore()
  
  if (!weather) return null
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Live Weather</h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Updated {new Date(weather.lastUpdated).toLocaleTimeString()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/50">
            <Thermometer className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Temperature</p>
            <p className="text-lg font-semibold">{weather.temperature}°C</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Droplets className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="text-lg font-semibold">{weather.humidity}%</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-chart-3/20">
            <Droplets className="h-5 w-5 text-chart-3" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Rainfall</p>
            <p className="text-lg font-semibold">{weather.rainfall} mm</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <Wind className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Wind</p>
            <p className="text-lg font-semibold">{weather.windSpeed} km/h</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{weather.pressure} hPa</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
          {weather.condition}
        </div>
      </div>
    </motion.div>
  )
}

interface RiskIndicatorProps {
  level: RiskLevel
  confidence: number
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export function RiskIndicator({ level, confidence, label, size = 'md' }: RiskIndicatorProps) {
  const StatusIcon = level === 'safe' ? CheckCircle2 : level === 'warning' ? AlertTriangle : XCircle
  
  const sizes = {
    sm: { container: 'h-16 w-16', icon: 'h-6 w-6', text: 'text-xs' },
    md: { container: 'h-24 w-24', icon: 'h-8 w-8', text: 'text-sm' },
    lg: { container: 'h-32 w-32', icon: 'h-12 w-12', text: 'text-base' }
  }
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center gap-2"
    >
      <div className={cn(
        'relative rounded-full flex items-center justify-center',
        sizes[size].container,
        getRiskPulse(level)
      )}>
        {/* Circular progress */}
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-muted/30"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className={cn(
              level === 'safe' && 'stroke-safe',
              level === 'warning' && 'stroke-warning',
              level === 'critical' && 'stroke-critical'
            )}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: confidence / 100 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              strokeDasharray: '283',
              strokeDashoffset: '0'
            }}
          />
        </svg>
        
        <div className="flex flex-col items-center">
          <StatusIcon className={cn(
            sizes[size].icon,
            getRiskColor(level)
          )} />
          <span className={cn(
            'font-bold',
            sizes[size].text,
            getRiskColor(level)
          )}>
            {confidence}%
          </span>
        </div>
      </div>
      
      {label && (
        <span className={cn(
          'font-medium capitalize',
          sizes[size].text,
          getRiskColor(level)
        )}>
          {label || level}
        </span>
      )}
    </motion.div>
  )
}

export function SystemStatusBar() {
  const { systemStats } = useAppStore()
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card rounded-xl px-4 py-3 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-2 h-2 rounded-full',
            systemStats.systemStatus === 'online' && 'bg-safe animate-pulse',
            systemStats.systemStatus === 'degraded' && 'bg-warning animate-pulse',
            systemStats.systemStatus === 'offline' && 'bg-critical'
          )} />
          <span className="text-sm font-medium capitalize">{systemStats.systemStatus}</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Activity className="h-3.5 w-3.5" />
          <span>{systemStats.regionsMonitored} regions monitored</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="text-muted-foreground">Accuracy: </span>
          <span className="font-medium text-safe">{systemStats.predictionAccuracy}%</span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Active Alerts: </span>
          <span className={cn(
            'font-medium',
            systemStats.activeAlerts > 0 ? 'text-critical' : 'text-safe'
          )}>
            {systemStats.activeAlerts}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
