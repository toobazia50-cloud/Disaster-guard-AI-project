// Voice alert system using Web Speech API
export function speakAlert(message: string, urgent: boolean = false): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported')
    return
  }
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel()
  
  const utterance = new SpeechSynthesisUtterance(message)
  utterance.lang = 'en-US'
  utterance.rate = urgent ? 1.1 : 0.95
  utterance.pitch = urgent ? 1.2 : 1
  utterance.volume = 1
  
  // Try to use a female voice for alerts
  const voices = window.speechSynthesis.getVoices()
  const preferredVoice = voices.find(v => 
    v.lang.includes('en') && (v.name.includes('Female') || v.name.includes('Samantha'))
  ) || voices.find(v => v.lang.includes('en'))
  
  if (preferredVoice) {
    utterance.voice = preferredVoice
  }
  
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

// Predefined emergency messages
export const EMERGENCY_MESSAGES = {
  flood_critical: "Critical flood danger detected. All residents in low-lying areas must evacuate immediately. Move to higher ground and designated emergency shelters.",
  flood_warning: "Flood warning issued. Monitor water levels and prepare for possible evacuation. Stay tuned for further updates.",
  heatwave_critical: "Extreme heat wave alert. Temperatures exceeding 45 degrees. Stay indoors, drink plenty of water, and check on elderly neighbors.",
  heatwave_warning: "Heat wave advisory in effect. Avoid outdoor activities during peak hours. Stay hydrated and seek shade.",
  earthquake: "Earthquake alert. Drop, cover, and hold on. After shaking stops, evacuate buildings carefully and move to open areas.",
  cyclone_critical: "Severe cyclone warning. Secure all loose objects, stock emergency supplies, and evacuate coastal areas immediately.",
  cyclone_warning: "Cyclone advisory issued. Prepare emergency supplies and be ready to evacuate if instructed.",
  general_safe: "Current conditions are stable. Continue normal activities while staying prepared for emergencies.",
  sos_activated: "SOS signal activated. Emergency services have been notified. Help is on the way. Stay calm and remain in a safe location."
}

export type EmergencyMessageKey = keyof typeof EMERGENCY_MESSAGES

export function getEmergencyMessage(key: EmergencyMessageKey): string {
  return EMERGENCY_MESSAGES[key]
}
