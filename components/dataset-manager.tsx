'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Download,
  RefreshCw,
  Search,
  Filter,
  Database,
  Loader2
} from 'lucide-react'

interface DatasetRow {
  id: number
  temperature: number
  rainfall: number
  humidity: number
  riverLevel: number
  windSpeed: number
  riskLevel: string
  date: string
}

// Generate sample dataset
function generateSampleData(count: number): DatasetRow[] {
  return Array.from({ length: count }, (_, i) => {
    const temp = 25 + Math.random() * 20
    const rain = Math.random() * 150
    const humidity = 30 + Math.random() * 60
    const river = 20 + Math.random() * 70
    const wind = 5 + Math.random() * 50
    
    let risk = 'Safe'
    if (rain > 100 || river > 80) risk = 'Critical'
    else if (rain > 50 || river > 60 || temp > 40) risk = 'Warning'
    
    const date = new Date()
    date.setDate(date.getDate() - (count - i))
    
    return {
      id: i + 1,
      temperature: Math.round(temp * 10) / 10,
      rainfall: Math.round(rain * 10) / 10,
      humidity: Math.round(humidity),
      riverLevel: Math.round(river),
      windSpeed: Math.round(wind * 10) / 10,
      riskLevel: risk,
      date: date.toISOString().split('T')[0]
    }
  })
}

export function DatasetManager() {
  const [dataset, setDataset] = useState<DatasetRow[]>(() => generateSampleData(50))
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRisk, setFilterRisk] = useState<string>('all')
  
  const stats = {
    total: dataset.length,
    safe: dataset.filter(d => d.riskLevel === 'Safe').length,
    warning: dataset.filter(d => d.riskLevel === 'Warning').length,
    critical: dataset.filter(d => d.riskLevel === 'Critical').length,
    missingValues: 0,
    duplicates: 0
  }
  
  const filteredData = dataset.filter(row => {
    const matchesSearch = 
      row.date.includes(searchTerm) ||
      row.riskLevel.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterRisk === 'all' || row.riskLevel === filterRisk
    return matchesSearch && matchesFilter
  })
  
  const handleUpload = useCallback(async () => {
    setIsLoading(true)
    // Simulate file processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    setDataset(generateSampleData(100))
    setIsLoading(false)
  }, [])
  
  const handleClean = useCallback(async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Remove potential duplicates and fill missing values
    setDataset(prev => [...new Map(prev.map(item => [item.id, item])).values()])
    setIsLoading(false)
  }, [])
  
  const handleExport = useCallback(() => {
    const csv = [
      ['ID', 'Date', 'Temperature', 'Rainfall', 'Humidity', 'River Level', 'Wind Speed', 'Risk Level'].join(','),
      ...dataset.map(row => 
        [row.id, row.date, row.temperature, row.rainfall, row.humidity, row.riverLevel, row.windSpeed, row.riskLevel].join(',')
      )
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'disaster_data.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [dataset])
  
  return (
    <div className="space-y-6">
      {/* Dataset Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Total Records</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Database className="h-8 w-8 text-primary" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-4"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase">Risk Distribution</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1 text-safe text-sm">
                  <span className="w-2 h-2 rounded-full bg-safe" />
                  {stats.safe}
                </span>
                <span className="flex items-center gap-1 text-warning text-sm">
                  <span className="w-2 h-2 rounded-full bg-warning" />
                  {stats.warning}
                </span>
                <span className="flex items-center gap-1 text-critical text-sm">
                  <span className="w-2 h-2 rounded-full bg-critical" />
                  {stats.critical}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Missing Values</p>
              <p className="text-2xl font-bold text-safe">{stats.missingValues}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-safe" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Duplicates</p>
              <p className="text-2xl font-bold text-safe">{stats.duplicates}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-safe" />
          </div>
        </motion.div>
      </div>
      
      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card rounded-xl p-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button onClick={handleUpload} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Upload CSV
            </Button>
            <Button variant="outline" onClick={handleClean} disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Clean Data
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[200px]"
              />
            </div>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="all">All Risks</option>
              <option value="Safe">Safe</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
      </motion.div>
      
      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card rounded-xl overflow-hidden"
      >
        <div className="max-h-[500px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead className="w-[60px]">ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Temp (°C)</TableHead>
                <TableHead>Rainfall (mm)</TableHead>
                <TableHead>Humidity (%)</TableHead>
                <TableHead>River Level (%)</TableHead>
                <TableHead>Wind (km/h)</TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.slice(0, 20).map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs">{row.id}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.temperature}</TableCell>
                  <TableCell>{row.rainfall}</TableCell>
                  <TableCell>{row.humidity}</TableCell>
                  <TableCell>{row.riverLevel}</TableCell>
                  <TableCell>{row.windSpeed}</TableCell>
                  <TableCell>
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      row.riskLevel === 'Safe' && 'bg-safe/20 text-safe',
                      row.riskLevel === 'Warning' && 'bg-warning/20 text-warning',
                      row.riskLevel === 'Critical' && 'bg-critical/20 text-critical'
                    )}>
                      {row.riskLevel}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t border-border text-sm text-muted-foreground">
          Showing {Math.min(20, filteredData.length)} of {filteredData.length} records
        </div>
      </motion.div>
      
      {/* Preprocessing Steps */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card rounded-xl p-5"
      >
        <h3 className="font-semibold mb-4">Data Preprocessing Pipeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: 1, name: 'Missing Value Handling', status: 'complete', desc: 'Imputation with median values' },
            { step: 2, name: 'Duplicate Removal', status: 'complete', desc: 'Removed 0 duplicate rows' },
            { step: 3, name: 'Feature Scaling', status: 'complete', desc: 'MinMax normalization applied' },
            { step: 4, name: 'Outlier Detection', status: 'complete', desc: 'IQR method, 2 outliers flagged' }
          ].map((item) => (
            <div key={item.step} className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-safe/20 text-safe flex items-center justify-center text-sm font-medium">
                  {item.step}
                </div>
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-safe">
                <CheckCircle2 className="h-3 w-3" />
                Complete
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
