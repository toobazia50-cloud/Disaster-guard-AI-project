'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/lib/store'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  Loader2
} from 'lucide-react'

export function LoginForm() {
  const { login } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const success = await login(email, password)
    
    if (!success) {
      setError('Invalid credentials. Try admin@disasterguard.pk / admin123')
    }
    
    setIsLoading(false)
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 grid-pattern">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8 space-y-6">
          {/* Logo */}
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto glow-primary"
            >
              <Shield className="h-8 w-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-2xl font-bold">DisasterGuard AI</h1>
            <p className="text-sm text-muted-foreground">
              Smart Disaster Prediction & Emergency Alert System
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@disasterguard.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-critical/10 text-critical text-sm"
              >
                <AlertTriangle className="h-4 w-4" />
                {error}
              </motion.div>
            )}
            
            <Button
              type="submit"
              className="w-full gradient-primary text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          {/* Demo credentials */}
          <div className="text-center space-y-2 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">Demo Credentials</p>
            <div className="flex items-center justify-center gap-2 text-xs">
              <code className="px-2 py-1 rounded bg-secondary">admin@disasterguard.pk</code>
              <code className="px-2 py-1 rounded bg-secondary">admin123</code>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Pakistan Disaster Management Authority
        </p>
      </motion.div>
    </div>
  )
}
