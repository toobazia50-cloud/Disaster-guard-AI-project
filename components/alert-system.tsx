'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, getRiskColor } from '@/lib/store'
import { speakAlert, stopSpeaking, getEmergencyMessage } from '@/lib/voice-alerts'
import { cn } from '@/lib/utils'
import type { Alert, RiskLevel } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  AlertTriangle,
  X,
  Volume2,
  VolumeX,
  Clock,
  MapPin,
  Siren,
  ShieldAlert,
  Flame,
  Waves,
  Wind,
  ChevronRight
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const alertIcons = {
  flood: Waves,
  heatwave: Flame,
  cyclone: Wind,
  earthquake: ShieldAlert,
  general: AlertTriangle
}

interface AlertCardProps {
  alert: Alert
  onDismiss: () => void
  onSpeak: () => void
  isPlaying: boolean
}

function AlertCard({ alert, onDismiss, onSpeak, isPlaying }: AlertCardProps) {
  const Icon = alertIcons[alert.type]
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      className={cn(
        'relative glass-card rounded-xl overflow-hidden',
        alert.severity === 'critical' && 'border-critical/50 pulse-critical',
        alert.severity === 'warning' && 'border-warning/50',
        alert.severity === 'safe' && 'border-safe/50'
      )}
    >
      {/* Severity indicator bar */}
      <div className={cn(
        'absolute left-0 top-0 bottom-0 w-1',
        alert.severity === 'critical' && 'bg-critical',
        alert.severity === 'warning' && 'bg-warning',
        alert.severity === 'safe' && 'bg-safe'
      )} />
      
      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={cn(
              'p-2 rounded-lg',
              alert.severity === 'critical' && 'bg-critical/20 text-critical',
              alert.severity === 'warning' && 'bg-warning/20 text-warning',
              alert.severity === 'safe' && 'bg-safe/20 text-safe'
            )}>
              <Icon className="h-5 w-5" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{alert.title}</h4>
                <span className={cn(
                  'px-1.5 py-0.5 rounded text-xs font-medium uppercase',
                  alert.severity === 'critical' && 'bg-critical/20 text-critical',
                  alert.severity === 'warning' && 'bg-warning/20 text-warning',
                  alert.severity === 'safe' && 'bg-safe/20 text-safe'
                )}>
                  {alert.severity}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground">{alert.message}</p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {alert.region}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onSpeak}
            >
              {isPlaying ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function AlertList() {
  const { alerts, dismissAlert, voiceEnabled } = useAppStore()
  const [playingAlert, setPlayingAlert] = useState<string | null>(null)
  
  const activeAlerts = alerts.filter(a => a.isActive)
  
  const handleSpeak = (alert: Alert) => {
    if (playingAlert === alert.id) {
      stopSpeaking()
      setPlayingAlert(null)
    } else if (voiceEnabled) {
      stopSpeaking()
      speakAlert(alert.message, alert.severity === 'critical')
      setPlayingAlert(alert.id)
      // Reset after estimated speech duration
      setTimeout(() => setPlayingAlert(null), 8000)
    }
  }
  
  if (activeAlerts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card rounded-xl p-8 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-safe/20 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="h-8 w-8 text-safe" />
        </div>
        <h3 className="font-semibold text-lg mb-1">All Clear</h3>
        <p className="text-sm text-muted-foreground">
          No active alerts at this time. All monitored regions are stable.
        </p>
      </motion.div>
    )
  }
  
  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {activeAlerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onDismiss={() => dismissAlert(alert.id)}
            onSpeak={() => handleSpeak(alert)}
            isPlaying={playingAlert === alert.id}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

interface EmergencyBannerProps {
  show: boolean
  message: string
  severity: RiskLevel
  onDismiss: () => void
}

export function EmergencyBanner({ show, message, severity, onDismiss }: EmergencyBannerProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={cn(
            'fixed top-0 left-0 right-0 z-[100] py-3 px-4',
            severity === 'critical' && 'bg-critical',
            severity === 'warning' && 'bg-warning',
            severity === 'safe' && 'bg-safe'
          )}
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Siren className={cn(
                'h-5 w-5',
                severity === 'critical' ? 'text-critical-foreground animate-pulse' : 'text-warning-foreground'
              )} />
              <span className={cn(
                'font-medium',
                severity === 'critical' ? 'text-critical-foreground' : 'text-warning-foreground'
              )}>
                {message}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDismiss}
              className="h-8 w-8 text-white hover:text-white/80"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function SOSButton() {
  const [isActivated, setIsActivated] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const { voiceEnabled, addAlert } = useAppStore()
  
  useEffect(() => {
    if (isActivated && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (isActivated && countdown === 0) {
      // Trigger SOS
      if (voiceEnabled) {
        speakAlert(getEmergencyMessage('sos_activated'), true)
      }
      addAlert({
        id: `sos-${Date.now()}`,
        type: 'general',
        severity: 'critical',
        title: 'SOS Signal Activated',
        message: 'Emergency distress signal sent. Emergency services have been notified.',
        region: 'User Location',
        timestamp: new Date().toISOString(),
        isActive: true
      })
      setIsActivated(false)
      setCountdown(5)
    }
  }, [isActivated, countdown, voiceEnabled, addAlert])
  
  const handleActivate = () => {
    if (isActivated) {
      setIsActivated(false)
      setCountdown(5)
    } else {
      setIsActivated(true)
    }
  }
  
  return (
    <motion.button
      onClick={handleActivate}
      className={cn(
        'relative w-24 h-24 rounded-full font-bold text-lg transition-all',
        isActivated
          ? 'bg-critical text-critical-foreground pulse-critical'
          : 'bg-gradient-to-br from-critical to-red-700 text-white hover:scale-105'
      )}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10">
        {isActivated ? countdown : 'SOS'}
      </span>
      
      {/* Ripple effect when activated */}
      {isActivated && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full bg-critical"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <motion.span
            className="absolute inset-0 rounded-full bg-critical"
            animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.5 }}
          />
        </>
      )}
    </motion.button>
  )
}

export function QuickAlertActions() {
  const { addAlert, voiceEnabled } = useAppStore()
  
  const triggerTestAlert = (type: Alert['type'], severity: RiskLevel) => {
    const messages = {
      flood: {
        critical: 'Critical flooding detected in your area. Evacuate immediately.',
        warning: 'Flood warning issued. Prepare for possible evacuation.',
        safe: 'Flood conditions improving. Remain vigilant.'
      },
      heatwave: {
        critical: 'Extreme heat emergency. Seek shelter immediately.',
        warning: 'Heat wave advisory in effect. Stay hydrated.',
        safe: 'Heat conditions normalizing.'
      }
    }
    
    const message = messages[type as keyof typeof messages]?.[severity] || 'Alert triggered.'
    
    addAlert({
      id: `test-${Date.now()}`,
      type,
      severity,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${severity.charAt(0).toUpperCase() + severity.slice(1)} Alert`,
      message,
      region: 'Test Region',
      timestamp: new Date().toISOString(),
      isActive: true
    })
    
    if (voiceEnabled) {
      speakAlert(message, severity === 'critical')
    }
  }
  
  return (
    <div className="glass-card rounded-xl p-4 space-y-3">
      <h3 className="font-semibold text-sm flex items-center gap-2">
        <Siren className="h-4 w-4" />
        Quick Alert Actions
      </h3>
      
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="justify-start border-critical/30 hover:bg-critical/10"
          onClick={() => triggerTestAlert('flood', 'critical')}
        >
          <Waves className="h-4 w-4 mr-2 text-critical" />
          Flood Critical
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="justify-start border-warning/30 hover:bg-warning/10"
          onClick={() => triggerTestAlert('flood', 'warning')}
        >
          <Waves className="h-4 w-4 mr-2 text-warning" />
          Flood Warning
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="justify-start border-critical/30 hover:bg-critical/10"
          onClick={() => triggerTestAlert('heatwave', 'critical')}
        >
          <Flame className="h-4 w-4 mr-2 text-critical" />
          Heat Critical
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="justify-start border-warning/30 hover:bg-warning/10"
          onClick={() => triggerTestAlert('heatwave', 'warning')}
        >
          <Flame className="h-4 w-4 mr-2 text-warning" />
          Heat Warning
        </Button>
      </div>
    </div>
  )
}
