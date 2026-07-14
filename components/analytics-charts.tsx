'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { generateHistoricalData } from '@/lib/ml-engine'
import { cn } from '@/lib/utils'

const COLORS = {
  safe: '#4ade80',
  warning: '#fbbf24',
  critical: '#f87171',
  primary: '#22d3ee',
  accent: '#fb923c',
  muted: '#6b7280'
}

interface ChartCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  delay?: number
}

function ChartCard({ title, subtitle, children, delay = 0 }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card rounded-xl p-5"
    >
      <div className="mb-4">
        <h3 className="font-semibold">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {children}
    </motion.div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg p-3 border border-border shadow-lg">
        <p className="text-sm font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function WeatherTrendChart() {
  const data = useMemo(() => {
    const historical = generateHistoricalData(14)
    return historical.dates.map((date, i) => ({
      date: date.slice(5), // MM-DD format
      temperature: historical.temperatures[i],
      rainfall: historical.rainfall[i],
      humidity: historical.humidity[i]
    }))
  }, [])
  
  return (
    <ChartCard title="Weather Trends" subtitle="Last 14 days">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={12}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperature"
              name="Temperature (°C)"
              stroke={COLORS.accent}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="rainfall"
              name="Rainfall (mm)"
              stroke={COLORS.primary}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="humidity"
              name="Humidity (%)"
              stroke={COLORS.safe}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function RiverLevelChart() {
  const data = useMemo(() => {
    const historical = generateHistoricalData(14)
    return historical.dates.map((date, i) => ({
      date: date.slice(5),
      level: historical.riverLevels[i],
      warning: 70,
      critical: 85
    }))
  }, [])
  
  return (
    <ChartCard title="River Level Monitoring" subtitle="Percentage of maximum capacity">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="riverGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.4} />
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={12}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="level"
              name="River Level (%)"
              stroke={COLORS.primary}
              strokeWidth={2}
              fill="url(#riverGradient)"
            />
            <Line
              type="monotone"
              dataKey="warning"
              name="Warning Level"
              stroke={COLORS.warning}
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="critical"
              name="Critical Level"
              stroke={COLORS.critical}
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function RiskDistributionChart() {
  const data = useMemo(() => {
    const historical = generateHistoricalData(30)
    const safe = historical.risks.filter(r => r === 'safe').length
    const warning = historical.risks.filter(r => r === 'warning').length
    const critical = historical.risks.filter(r => r === 'critical').length
    
    return [
      { name: 'Safe', value: safe, color: COLORS.safe },
      { name: 'Warning', value: warning, color: COLORS.warning },
      { name: 'Critical', value: critical, color: COLORS.critical }
    ]
  }, [])
  
  return (
    <ChartCard title="Risk Distribution" subtitle="Last 30 days">
      <div className="h-[250px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function PredictionAccuracyChart() {
  const data = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      accuracy: 85 + Math.random() * 12,
      predictions: Math.floor(50 + Math.random() * 100)
    }))
  }, [])
  
  return (
    <ChartCard title="Prediction Accuracy" subtitle="Monthly model performance">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={12}
              tickLine={false}
              domain={[75, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="accuracy"
              name="Accuracy (%)"
              fill={COLORS.safe}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function AlertTrendsChart() {
  const data = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        flood: Math.floor(Math.random() * 5),
        heatwave: Math.floor(Math.random() * 3),
        other: Math.floor(Math.random() * 2)
      }
    })
  }, [])
  
  return (
    <ChartCard title="Alert Trends" subtitle="Last 7 days">
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="day" 
              stroke="#6b7280" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={12}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="flood" name="Flood" stackId="a" fill={COLORS.primary} />
            <Bar dataKey="heatwave" name="Heatwave" stackId="a" fill={COLORS.accent} />
            <Bar dataKey="other" name="Other" stackId="a" fill={COLORS.muted} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function RegionalComparisonChart() {
  const data = [
    { region: 'Sindh', flood: 65, heat: 45 },
    { region: 'Punjab', flood: 25, heat: 35 },
    { region: 'KPK', flood: 88, heat: 15 },
    { region: 'Balochistan', flood: 10, heat: 72 },
    { region: 'Kashmir', flood: 82, heat: 10 },
    { region: 'Gilgit', flood: 55, heat: 5 }
  ]
  
  return (
    <ChartCard title="Regional Risk Comparison" subtitle="Flood vs Heatwave risk">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              type="number" 
              stroke="#6b7280" 
              fontSize={12}
              tickLine={false}
              domain={[0, 100]}
            />
            <YAxis 
              type="category" 
              dataKey="region" 
              stroke="#6b7280" 
              fontSize={12}
              tickLine={false}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="flood" name="Flood Risk" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
            <Bar dataKey="heat" name="Heat Risk" fill={COLORS.accent} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
