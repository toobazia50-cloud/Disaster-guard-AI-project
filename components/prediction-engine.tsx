'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAppStore, getRiskColor, getRiskPulse } from '@/lib/store'
import { predictDisasterRisk } from '@/lib/ml-engine'
import { cn } from '@/lib/utils'
import type { PredictionInput, PredictionResult, RiskLevel } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RiskIndicator } from './dashboard-widgets'
import {
  Brain,
  Play,
  RotateCcw,
  Thermometer,
  Droplets,
  Wind,
  Waves,
  CloudRain,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Loader2,
  Lightbulb
} from 'lucide-react'

const defaultInput: PredictionInput = {
  temperature: 35,
  rainfall: 45,
  humidity: 65,
  riverLevel: 55,
  windSpeed: 20
}

export function PredictionEngine() {
  const { addPrediction, lastPrediction, voiceEnabled } = useAppStore()
  const [input, setInput] = useState<PredictionInput>(defaultInput)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(lastPrediction)
  
  const handleInputChange = (key: keyof PredictionInput, value: string) => {
    const numValue = parseFloat(value) || 0
    setInput(prev => ({ ...prev, [key]: numValue }))
  }
  
  const runPrediction = useCallback(async () => {
    setIsProcessing(true)
    
    // Simulate processing delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const prediction = predictDisasterRisk(input)
    setResult(prediction)
    addPrediction(prediction)
    setIsProcessing(false)
  }, [input, addPrediction])
  
  const resetInputs = () => {
    setInput(defaultInput)
    setResult(null)
  }
  
  const inputFields = [
    { key: 'temperature', label: 'Temperature', unit: '°C', icon: Thermometer, max: 50, color: 'text-accent' },
    { key: 'rainfall', label: 'Rainfall', unit: 'mm', icon: CloudRain, max: 200, color: 'text-primary' },
    { key: 'humidity', label: 'Humidity', unit: '%', icon: Droplets, max: 100, color: 'text-chart-2' },
    { key: 'riverLevel', label: 'River Level', unit: '%', icon: Waves, max: 100, color: 'text-chart-3' },
    { key: 'windSpeed', label: 'Wind Speed', unit: 'km/h', icon: Wind, max: 100, color: 'text-muted-foreground' }
  ] as const
  
  return (
    <div className="space-y-6">
      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg gradient-primary">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">AI Prediction Engine</h2>
              <p className="text-sm text-muted-foreground">Random Forest Classifier</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetInputs}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button
              onClick={runPrediction}
              disabled={isProcessing}
              className="gradient-primary text-primary-foreground"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Prediction
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {inputFields.map(({ key, label, unit, icon: Icon, max, color }) => (
            <div key={key} className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm">
                <Icon className={cn('h-4 w-4', color)} />
                {label}
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={input[key]}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="pr-12"
                  min={0}
                  max={max}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {unit}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={cn(
                    'h-full rounded-full',
                    input[key] / max > 0.7 ? 'bg-critical' :
                    input[key] / max > 0.45 ? 'bg-warning' : 'bg-safe'
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((input[key] / max) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Processing Animation */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-xl p-8 flex flex-col items-center justify-center"
        >
          <motion.div
            className="w-20 h-20 rounded-full border-4 border-primary/30 border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          />
          <p className="mt-4 text-muted-foreground">Analyzing environmental data...</p>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span>Running 100 decision trees</span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              ...
            </motion.span>
          </div>
        </motion.div>
      )}
      
      {/* Results Section */}
      {result && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Main Result */}
          <div className={cn(
            'glass-card rounded-xl p-6 flex flex-col items-center justify-center',
            getRiskPulse(result.riskLevel)
          )}>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Prediction Result
            </h3>
            <RiskIndicator
              level={result.riskLevel}
              confidence={result.confidence}
              label={`${result.riskLevel} Risk`}
              size="lg"
            />
            <p className="mt-4 text-xs text-muted-foreground text-center">
              Prediction made at {new Date(result.timestamp).toLocaleTimeString()}
            </p>
          </div>
          
          {/* Factor Contributions */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Factor Analysis
            </h3>
            <div className="space-y-3">
              {result.factors.map((factor, idx) => {
                const StatusIcon = factor.status === 'safe' ? CheckCircle2 :
                  factor.status === 'warning' ? AlertTriangle : XCircle
                
                return (
                  <motion.div
                    key={factor.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <StatusIcon className={cn('h-4 w-4', getRiskColor(factor.status))} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-sm">
                        <span>{factor.name}</span>
                        <span className={getRiskColor(factor.status)}>
                          {factor.contribution}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                        <motion.div
                          className={cn(
                            'h-full rounded-full',
                            factor.status === 'safe' && 'bg-safe',
                            factor.status === 'warning' && 'bg-warning',
                            factor.status === 'critical' && 'bg-critical'
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(factor.contribution * 3, 100)}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
          
          {/* Recommendations */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-warning" />
              AI Recommendations
            </h3>
            <div className="space-y-2">
              {result.recommendations.map((rec, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

interface PredictionHistoryProps {
  limit?: number
}

export function PredictionHistory({ limit = 10 }: PredictionHistoryProps) {
  const { predictionHistory } = useAppStore()
  
  const history = predictionHistory.slice(0, limit)
  
  if (history.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6 text-center">
        <p className="text-muted-foreground">No prediction history yet</p>
      </div>
    )
  }
  
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="font-semibold mb-4">Recent Predictions</h3>
      <div className="space-y-2">
        {history.map((prediction, idx) => (
          <motion.div
            key={prediction.timestamp}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-2 h-2 rounded-full',
                prediction.riskLevel === 'safe' && 'bg-safe',
                prediction.riskLevel === 'warning' && 'bg-warning',
                prediction.riskLevel === 'critical' && 'bg-critical'
              )} />
              <span className="text-sm capitalize">{prediction.riskLevel}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {prediction.confidence}% confidence
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(prediction.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
