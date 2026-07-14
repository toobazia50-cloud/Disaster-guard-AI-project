'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore, getRiskColor } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { RegionData, RiskLevel } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AlertTriangle, Thermometer, Droplets, Waves } from 'lucide-react'

// Simplified Pakistan map paths for each region
const PAKISTAN_REGIONS: Record<string, { path: string; center: { x: number; y: number } }> = {
  gilgit: {
    path: 'M180,20 L220,15 L260,25 L280,50 L270,80 L240,90 L200,85 L170,60 L160,40 Z',
    center: { x: 220, y: 50 }
  },
  azad_kashmir: {
    path: 'M270,80 L300,75 L320,95 L310,120 L280,130 L250,115 L240,90 Z',
    center: { x: 280, y: 100 }
  },
  kpk: {
    path: 'M160,40 L200,85 L240,90 L250,115 L240,150 L200,160 L160,150 L130,120 L120,80 L140,50 Z',
    center: { x: 180, y: 110 }
  },
  islamabad: {
    path: 'M240,150 L260,145 L270,160 L260,175 L240,170 Z',
    center: { x: 255, y: 160 }
  },
  punjab: {
    path: 'M200,160 L240,150 L260,175 L280,200 L280,260 L260,300 L220,320 L180,310 L150,280 L140,230 L160,190 Z',
    center: { x: 210, y: 240 }
  },
  balochistan: {
    path: 'M40,150 L130,120 L160,150 L160,190 L140,230 L150,280 L130,320 L80,350 L30,340 L10,280 L20,220 L30,180 Z',
    center: { x: 80, y: 250 }
  },
  sindh: {
    path: 'M150,280 L180,310 L220,320 L230,360 L210,400 L160,420 L120,400 L100,360 L130,320 Z',
    center: { x: 170, y: 360 }
  },
  karachi: {
    path: 'M100,360 L120,400 L100,420 L60,410 L50,380 L70,360 Z',
    center: { x: 85, y: 390 }
  }
}

const getRiskFill = (level: RiskLevel, isHovered: boolean, isSelected: boolean): string => {
  const opacity = isSelected ? '0.8' : isHovered ? '0.7' : '0.5'
  switch (level) {
    case 'safe':
      return `rgba(74, 222, 128, ${opacity})`
    case 'warning':
      return `rgba(251, 191, 36, ${opacity})`
    case 'critical':
      return `rgba(248, 113, 113, ${opacity})`
    default:
      return `rgba(156, 163, 175, ${opacity})`
  }
}

const getRiskStroke = (level: RiskLevel): string => {
  switch (level) {
    case 'safe':
      return 'rgb(34, 197, 94)'
    case 'warning':
      return 'rgb(245, 158, 11)'
    case 'critical':
      return 'rgb(239, 68, 68)'
    default:
      return 'rgb(107, 114, 128)'
  }
}

interface RegionTooltipProps {
  region: RegionData
}

function RegionTooltipContent({ region }: RegionTooltipProps) {
  return (
    <div className="space-y-3 p-1">
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold">{region.name}</span>
        <span className={cn(
          'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
          region.riskLevel === 'safe' && 'bg-safe/20 text-safe',
          region.riskLevel === 'warning' && 'bg-warning/20 text-warning',
          region.riskLevel === 'critical' && 'bg-critical/20 text-critical'
        )}>
          {region.riskLevel}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1.5">
          <Thermometer className="h-3.5 w-3.5 text-accent" />
          <span>{region.temperature}°C</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Droplets className="h-3.5 w-3.5 text-primary" />
          <span>{region.rainfall} mm</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Waves className="h-3.5 w-3.5 text-chart-2" />
          <span>{region.floodRisk}% flood</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-warning" />
          <span>{region.heatwaveRisk}% heat</span>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        Confidence: {region.confidence}%
      </div>
    </div>
  )
}

export function PakistanMap() {
  const { regions, selectedRegion, setSelectedRegion } = useAppStore()
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  
  const regionMap = useMemo(() => {
    return regions.reduce((acc, region) => {
      acc[region.id] = region
      return acc
    }, {} as Record<string, RegionData>)
  }, [regions])
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Pakistan Risk Map</h3>
          <p className="text-sm text-muted-foreground">Real-time regional risk assessment</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-safe" />
            <span className="text-xs">Safe</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-xs">Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-critical" />
            <span className="text-xs">Critical</span>
          </div>
        </div>
      </div>
      
      <TooltipProvider>
        <svg
          viewBox="0 0 340 450"
          className="w-full h-auto max-h-[500px]"
          style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))' }}
        >
          {/* Grid pattern background */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="0.5"
              />
            </pattern>
            
            {/* Glow filters */}
            <filter id="glow-safe">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="rgb(34, 197, 94)" floodOpacity="0.5" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-warning">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="rgb(245, 158, 11)" floodOpacity="0.5" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-critical">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor="rgb(239, 68, 68)" floodOpacity="0.6" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Render regions */}
          {Object.entries(PAKISTAN_REGIONS).map(([id, { path, center }]) => {
            const region = regionMap[id]
            if (!region) return null
            
            const isHovered = hoveredRegion === id
            const isSelected = selectedRegion === id
            
            return (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <motion.g
                    onMouseEnter={() => setHoveredRegion(id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => setSelectedRegion(isSelected ? null : id)}
                    style={{ cursor: 'pointer' }}
                    animate={{
                      scale: isHovered || isSelected ? 1.02 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <motion.path
                      d={path}
                      fill={getRiskFill(region.riskLevel, isHovered, isSelected)}
                      stroke={getRiskStroke(region.riskLevel)}
                      strokeWidth={isSelected ? 3 : 2}
                      filter={`url(#glow-${region.riskLevel})`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    />
                    
                    {/* Region label */}
                    <text
                      x={center.x}
                      y={center.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[10px] font-medium pointer-events-none"
                      fill="white"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    >
                      {region.name.split(' ')[0]}
                    </text>
                    
                    {/* Alert indicator */}
                    {region.riskLevel === 'critical' && (
                      <motion.circle
                        cx={center.x + 25}
                        cy={center.y - 15}
                        r={6}
                        fill="rgb(239, 68, 68)"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      />
                    )}
                  </motion.g>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-card border-border">
                  <RegionTooltipContent region={region} />
                </TooltipContent>
              </Tooltip>
            )
          })}
        </svg>
      </TooltipProvider>
      
      {/* Selected region details */}
      {selectedRegion && regionMap[selectedRegion] && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-lg bg-secondary/50 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{regionMap[selectedRegion].name}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRegion(null)}
            >
              Close
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Flood Risk</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={cn(
                      'h-full rounded-full',
                      regionMap[selectedRegion].floodRisk > 70 ? 'bg-critical' :
                      regionMap[selectedRegion].floodRisk > 40 ? 'bg-warning' : 'bg-safe'
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${regionMap[selectedRegion].floodRisk}%` }}
                  />
                </div>
                <span className="font-medium">{regionMap[selectedRegion].floodRisk}%</span>
              </div>
            </div>
            
            <div>
              <p className="text-muted-foreground">Heatwave Risk</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={cn(
                      'h-full rounded-full',
                      regionMap[selectedRegion].heatwaveRisk > 70 ? 'bg-critical' :
                      regionMap[selectedRegion].heatwaveRisk > 40 ? 'bg-warning' : 'bg-safe'
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${regionMap[selectedRegion].heatwaveRisk}%` }}
                  />
                </div>
                <span className="font-medium">{regionMap[selectedRegion].heatwaveRisk}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
