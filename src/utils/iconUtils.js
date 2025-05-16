import { 
  CheckCircle, 
  LayoutDashboard, 
  ListChecks, 
  Bell, 
  BarChart, 
  LogOut,
  Sun,
  Moon,
  Calendar,
  Clock,
  RepeatIcon,
  AlertCircle
} from 'lucide-react';

/**
 * Get the icon component by name
 * @param {string} name - The name of the icon
 * @returns {Component} - React component for the icon
 */
export function getIcon(name) {
  const icons = {
    CheckCircle,
    LayoutDashboard,
    ListChecks,
    Bell,
    BarChart,
    LogOut,
    Sun,
    Moon,
    Calendar,
    Clock,
    Repeat: RepeatIcon,
    AlertCircle
  };
  
  return icons[name] || null;
}