'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import {
  LayoutDashboard,
  Brain,
  Bell,
  Map,
  Database,
  BarChart3,
  Settings,
  Info,
  Menu,
  X,
  Shield,
  LogOut,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'prediction', label: 'AI Prediction', icon: Brain },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'map', label: 'Risk Map', icon: Map },
  { id: 'dataset', label: 'Dataset', icon: Database },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'about', label: 'About', icon: Info },
]

export function Sidebar() {
  const {
    currentPage,
    setCurrentPage,
    sidebarOpen,
    setSidebarOpen,
    theme,
    toggleTheme,
    voiceEnabled,
    setVoiceEnabled,
    language,
    setLanguage,
    user,
    logout,
    alerts
  } = useAppStore()
  
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const activeAlerts = alerts.filter(a => a.isActive).length
  
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isMobile ? (sidebarOpen ? 0 : -280) : 0,
          width: sidebarOpen ? 280 : 80
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          'fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-50',
          'flex flex-col',
          isMobile && !sidebarOpen && '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <motion.div
            className="flex items-center gap-3"
            animate={{ justifyContent: sidebarOpen ? 'flex-start' : 'center' }}
          >
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <h1 className="font-bold text-lg text-foreground">DisasterGuard</h1>
                  <p className="text-xs text-muted-foreground">AI Protection</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPage === item.id
            const hasAlert = item.id === 'alerts' && activeAlerts > 0
            
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id)
                  if (isMobile) setSidebarOpen(false)
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  'hover:bg-sidebar-accent group relative',
                  isActive && 'bg-sidebar-accent'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={cn(
                  'relative flex items-center justify-center',
                  isActive && 'text-sidebar-primary'
                )}>
                  <item.icon className={cn(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )} />
                  {hasAlert && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-critical rounded-full pulse-critical" />
                  )}
                </div>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className={cn(
                        'text-sm font-medium overflow-hidden whitespace-nowrap',
                        isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                  />
                )}
              </motion.button>
            )
          })}
        </nav>
        
        {/* Quick actions */}
        <div className="p-3 border-t border-sidebar-border space-y-2">
          <div className={cn(
            'flex gap-1',
            sidebarOpen ? 'justify-between' : 'flex-col items-center'
          )}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={cn('h-9 w-9', !voiceEnabled && 'text-muted-foreground')}
              title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
            >
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="h-9 w-9"
              title={language === 'en' ? 'اردو' : 'English'}
            >
              <Globe className="h-4 w-4" />
            </Button>
          </div>
          
          {/* User info */}
          {user && sidebarOpen && (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.role}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {user && !sidebarOpen && (
            <Button variant="ghost" size="icon" onClick={logout} className="w-full h-9">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </motion.aside>
    </>
  )
}
