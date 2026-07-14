'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Bell,
  Volume2,
  VolumeX,
  Globe,
  Sun,
  Moon,
  Shield,
  User,
  Mail,
  Save,
  RefreshCw
} from 'lucide-react'

export function SettingsPage() {
  const {
    theme,
    toggleTheme,
    voiceEnabled,
    setVoiceEnabled,
    language,
    setLanguage,
    user
  } = useAppStore()
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Manage your preferences and account settings</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-6 space-y-4"
        >
          <h3 className="font-semibold flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Appearance
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">Switch between dark and light mode</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Language</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'en' ? 'English' : 'اردو'}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              >
                <Globe className="h-4 w-4 mr-2" />
                {language === 'en' ? 'اردو' : 'English'}
              </Button>
            </div>
          </div>
        </motion.div>
        
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6 space-y-4"
        >
          <h3 className="font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Voice Alerts</p>
                <p className="text-sm text-muted-foreground">Enable text-to-speech for emergency alerts</p>
              </div>
              <Button
                variant={voiceEnabled ? 'default' : 'outline'}
                size="icon"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={voiceEnabled ? 'gradient-primary' : ''}
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive alerts on your device</p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Alerts</p>
                <p className="text-sm text-muted-foreground">Get critical alerts via email</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </div>
        </motion.div>
        
        {/* Account */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6 space-y-4"
        >
          <h3 className="font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            Account
          </h3>
          
          {user && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input defaultValue={user.name} />
              </div>
              
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={user.email} />
              </div>
              
              <div className="space-y-2">
                <Label>Role</Label>
                <Input defaultValue={user.role} disabled className="capitalize" />
              </div>
              
              <Button className="gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </motion.div>
        
        {/* System */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-6 space-y-4"
        >
          <h3 className="font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div>
                <p className="font-medium text-sm">Version</p>
                <p className="text-xs text-muted-foreground">DisasterGuard AI v2.0.1</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div>
                <p className="font-medium text-sm">Model Version</p>
                <p className="text-xs text-muted-foreground">Random Forest v1.2</p>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-3 w-3 mr-1" />
                Update
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div>
                <p className="font-medium text-sm">API Status</p>
                <p className="text-xs text-safe flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
                  All systems operational
                </p>
              </div>
            </div>
            
            <Button variant="destructive" className="w-full">
              Clear All Data
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export function AboutPage() {
  const features = [
    {
      title: 'AI-Powered Predictions',
      description: 'Random Forest classifier trained on historical disaster data for accurate risk assessment.'
    },
    {
      title: 'Real-Time Monitoring',
      description: 'Live weather data integration with continuous environmental monitoring.'
    },
    {
      title: 'Voice Alert System',
      description: 'Text-to-speech emergency announcements for immediate awareness.'
    },
    {
      title: 'Interactive Risk Map',
      description: 'Visual representation of regional risk levels across Pakistan.'
    },
    {
      title: 'Multi-Language Support',
      description: 'Available in English and Urdu for wider accessibility.'
    },
    {
      title: 'Emergency Response',
      description: 'SOS functionality with AI-guided disaster preparedness recommendations.'
    }
  ]
  
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 glow-primary"
        >
          <Shield className="h-10 w-10 text-primary-foreground" />
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-4">DisasterGuard AI</h1>
        <p className="text-lg text-muted-foreground">
          Smart Disaster Prediction & Emergency Alert System
        </p>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-6 max-w-3xl mx-auto"
      >
        <h2 className="font-semibold text-lg mb-4">About the Project</h2>
        <p className="text-muted-foreground leading-relaxed">
          DisasterGuard AI is a comprehensive disaster management platform designed specifically for Pakistan. 
          It leverages machine learning algorithms to predict natural disasters including floods, heatwaves, 
          and other environmental hazards. The system provides real-time monitoring, automated alerts, 
          and AI-powered recommendations to help communities prepare for and respond to emergencies.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-xl p-5"
          >
            <h3 className="font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm text-muted-foreground"
      >
        <p>Version 2.0.1 | Developed for Pakistan Disaster Management</p>
        <p className="mt-1">Powered by Machine Learning & Real-Time Data Analytics</p>
      </motion.div>
    </div>
  )
}
