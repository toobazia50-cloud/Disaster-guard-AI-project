import type { PredictionInput, PredictionResult, RiskLevel } from './types'

// Simulated Random Forest Classifier for disaster prediction
// In production, this would call a backend ML model

interface FeatureWeights {
  temperature: number
  rainfall: number
  humidity: number
  riverLevel: number
  windSpeed: number
}

const FEATURE_WEIGHTS: FeatureWeights = {
  temperature: 0.15,
  rainfall: 0.35,
  humidity: 0.15,
  riverLevel: 0.30,
  windSpeed: 0.05
}

const THRESHOLDS = {
  temperature: { warning: 38, critical: 42 },
  rainfall: { warning: 50, critical: 100 },
  humidity: { warning: 75, critical: 90 },
  riverLevel: { warning: 70, critical: 85 },
  windSpeed: { warning: 40, critical: 60 }
}

function normalizeValue(value: number, max: number): number {
  return Math.min(value / max, 1)
}

function getFeatureRisk(value: number, thresholds: { warning: number; critical: number }): RiskLevel {
  if (value >= thresholds.critical) return 'critical'
  if (value >= thresholds.warning) return 'warning'
  return 'safe'
}

function getFeatureContribution(value: number, max: number, weight: number): number {
  return normalizeValue(value, max) * weight * 100
}

export function predictDisasterRisk(input: PredictionInput): PredictionResult {
  // Calculate normalized risk scores
  const temperatureScore = normalizeValue(input.temperature, 50)
  const rainfallScore = normalizeValue(input.rainfall, 200)
  const humidityScore = normalizeValue(input.humidity, 100)
  const riverLevelScore = normalizeValue(input.riverLevel, 100)
  const windSpeedScore = normalizeValue(input.windSpeed, 100)
  
  // Weighted average for overall risk
  const overallRisk = 
    temperatureScore * FEATURE_WEIGHTS.temperature +
    rainfallScore * FEATURE_WEIGHTS.rainfall +
    humidityScore * FEATURE_WEIGHTS.humidity +
    riverLevelScore * FEATURE_WEIGHTS.riverLevel +
    windSpeedScore * FEATURE_WEIGHTS.windSpeed
  
  // Determine risk level
  let riskLevel: RiskLevel
  if (overallRisk >= 0.7) {
    riskLevel = 'critical'
  } else if (overallRisk >= 0.45) {
    riskLevel = 'warning'
  } else {
    riskLevel = 'safe'
  }
  
  // Calculate confidence (simulated based on data consistency)
  const variance = Math.abs(
    Math.max(temperatureScore, rainfallScore, humidityScore, riverLevelScore, windSpeedScore) -
    Math.min(temperatureScore, rainfallScore, humidityScore, riverLevelScore, windSpeedScore)
  )
  const confidence = Math.round((1 - variance * 0.3) * 100 * (0.85 + Math.random() * 0.1))
  
  // Factor contributions
  const factors = [
    {
      name: 'Temperature',
      contribution: Math.round(getFeatureContribution(input.temperature, 50, FEATURE_WEIGHTS.temperature)),
      status: getFeatureRisk(input.temperature, THRESHOLDS.temperature)
    },
    {
      name: 'Rainfall',
      contribution: Math.round(getFeatureContribution(input.rainfall, 200, FEATURE_WEIGHTS.rainfall)),
      status: getFeatureRisk(input.rainfall, THRESHOLDS.rainfall)
    },
    {
      name: 'Humidity',
      contribution: Math.round(getFeatureContribution(input.humidity, 100, FEATURE_WEIGHTS.humidity)),
      status: getFeatureRisk(input.humidity, THRESHOLDS.humidity)
    },
    {
      name: 'River Level',
      contribution: Math.round(getFeatureContribution(input.riverLevel, 100, FEATURE_WEIGHTS.riverLevel)),
      status: getFeatureRisk(input.riverLevel, THRESHOLDS.riverLevel)
    },
    {
      name: 'Wind Speed',
      contribution: Math.round(getFeatureContribution(input.windSpeed, 100, FEATURE_WEIGHTS.windSpeed)),
      status: getFeatureRisk(input.windSpeed, THRESHOLDS.windSpeed)
    }
  ]
  
  // Generate recommendations
  const recommendations = generateRecommendations(input, riskLevel, factors)
  
  return {
    riskLevel,
    confidence: Math.min(confidence, 99),
    factors,
    recommendations,
    timestamp: new Date().toISOString()
  }
}

function generateRecommendations(
  input: PredictionInput,
  riskLevel: RiskLevel,
  factors: PredictionResult['factors']
): string[] {
  const recommendations: string[] = []
  
  if (riskLevel === 'critical') {
    recommendations.push('URGENT: Activate emergency response protocols immediately')
    recommendations.push('Issue evacuation orders for high-risk areas')
    recommendations.push('Deploy emergency response teams to affected regions')
  }
  
  if (riskLevel === 'warning') {
    recommendations.push('Alert local authorities and emergency services')
    recommendations.push('Prepare evacuation routes and shelters')
  }
  
  // Factor-specific recommendations
  const criticalFactors = factors.filter(f => f.status === 'critical')
  const warningFactors = factors.filter(f => f.status === 'warning')
  
  criticalFactors.forEach(factor => {
    switch (factor.name) {
      case 'Rainfall':
        recommendations.push('Activate flood barriers and drainage systems')
        recommendations.push('Monitor dam and reservoir levels continuously')
        break
      case 'River Level':
        recommendations.push('Issue flood warnings for riverside communities')
        recommendations.push('Coordinate with dam management for water release')
        break
      case 'Temperature':
        recommendations.push('Open cooling centers in urban areas')
        recommendations.push('Issue heat stroke prevention advisories')
        break
    }
  })
  
  warningFactors.forEach(factor => {
    switch (factor.name) {
      case 'Rainfall':
        recommendations.push('Monitor weather radar for intensification')
        break
      case 'River Level':
        recommendations.push('Increase monitoring frequency at key gauging stations')
        break
      case 'Humidity':
        recommendations.push('Prepare for potential severe weather conditions')
        break
    }
  })
  
  if (riskLevel === 'safe') {
    recommendations.push('Continue routine monitoring')
    recommendations.push('Review and update emergency preparedness plans')
  }
  
  return [...new Set(recommendations)].slice(0, 6)
}

// Simulated training function
export function trainModel(data: number[][]): { accuracy: number; trained: boolean } {
  // Simulate training delay and accuracy calculation
  const accuracy = 90 + Math.random() * 8
  return {
    accuracy: Math.round(accuracy * 10) / 10,
    trained: true
  }
}

// Generate synthetic historical data
export function generateHistoricalData(days: number = 30): {
  dates: string[]
  temperatures: number[]
  rainfall: number[]
  humidity: number[]
  riverLevels: number[]
  risks: RiskLevel[]
} {
  const dates: string[] = []
  const temperatures: number[] = []
  const rainfall: number[] = []
  const humidity: number[] = []
  const riverLevels: number[] = []
  const risks: RiskLevel[] = []
  
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
    
    // Generate correlated weather data with seasonal patterns
    const seasonalFactor = Math.sin((date.getMonth() / 12) * Math.PI * 2)
    
    const temp = 30 + seasonalFactor * 8 + (Math.random() - 0.5) * 10
    const rain = Math.max(0, 30 + seasonalFactor * 40 + (Math.random() - 0.5) * 60)
    const hum = 50 + seasonalFactor * 20 + (Math.random() - 0.5) * 30
    const river = Math.max(20, 50 + rain * 0.3 + (Math.random() - 0.5) * 20)
    
    temperatures.push(Math.round(temp * 10) / 10)
    rainfall.push(Math.round(rain * 10) / 10)
    humidity.push(Math.round(Math.min(100, Math.max(20, hum))))
    riverLevels.push(Math.round(Math.min(100, river)))
    
    // Determine risk based on values
    const riskScore = (rain / 150 + river / 100 + (temp > 40 ? 0.3 : 0)) / 2
    if (riskScore > 0.65) risks.push('critical')
    else if (riskScore > 0.4) risks.push('warning')
    else risks.push('safe')
  }
  
  return { dates, temperatures, rainfall, humidity, riverLevels, risks }
}
