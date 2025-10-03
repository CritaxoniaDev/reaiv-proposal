'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import {
  LayoutDashboard,
  FileText,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  ShoppingCart,
  Search,
  Bell,
  Settings,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Calendar,
  Activity
} from 'lucide-react'

// Mock data
const salesData = [
  { month: 'Jan', sales: 45000, orders: 124 },
  { month: 'Feb', sales: 52000, orders: 142 },
  { month: 'Mar', sales: 48000, orders: 118 },
  { month: 'Apr', sales: 61000, orders: 156 },
  { month: 'May', sales: 55000, orders: 134 },
  { month: 'Jun', sales: 67000, orders: 178 }
]

const customerHabits = [
  { day: 'Mon', visits: 420, conversions: 45 },
  { day: 'Tue', visits: 380, conversions: 52 },
  { day: 'Wed', visits: 450, conversions: 38 },
  { day: 'Thu', visits: 520, conversions: 67 },
  { day: 'Fri', visits: 490, conversions: 55 },
  { day: 'Sat', visits: 380, conversions: 42 },
  { day: 'Sun', visits: 320, conversions: 35 }
]

const growthData = [
  { location: 'United States', growth: 85, color: 'bg-blue-500' },
  { location: 'United Kingdom', growth: 72, color: 'bg-green-500' },
  { location: 'Canada', growth: 68, color: 'bg-purple-500' },
  { location: 'Australia', growth: 45, color: 'bg-orange-500' },
  { location: 'Germany', growth: 38, color: 'bg-pink-500' }
]

// Updated mock data with brand colors
const productData = [
  { name: 'SaaS Proposals', value: 35, color: '#6366f1' },
  { name: 'Consulting', value: 25, color: '#8b5cf6' },
  { name: 'Development', value: 20, color: '#06b6d4' },
  { name: 'Design', value: 15, color: '#10b981' },
  { name: 'Others', value: 5, color: '#f59e0b' }
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('Report')

  return (
    <div className="flex min-h-screen bg-indigo-50">
      {/* Fixed Sidebar */}
      <aside className="fixed left-2 top-6 bottom-6 w-64 bg-white rounded-3xl p-6 flex flex-col shadow-xl border border-indigo-100 z-10">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white rounded-full"></div>
          </div>
          <span className="font-bold text-indigo-900 text-lg">REAIV Dashboard</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2 mb-6">
            <li>
              <a 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'Report' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                    : 'text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800'
                }`}
                onClick={() => setActiveTab('Report')}
              >
                <LayoutDashboard size={20} />
                <span className="font-medium">Dashboard</span>
              </a>
            </li>
            <li>
              <a 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'Proposals' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                    : 'text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800'
                }`}
                onClick={() => setActiveTab('Proposals')}
              >
                <FileText size={20} />
                <span className="font-medium">Proposals</span>
                <Badge className={`ml-auto ${activeTab === 'Proposals' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'}`}>24</Badge>
              </a>
            </li>
            <li>
              <a 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'Clients' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                    : 'text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800'
                }`}
                onClick={() => setActiveTab('Clients')}
              >
                <Users size={20} />
                <span className="font-medium">Clients</span>
              </a>
            </li>
            <li>
              <a 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'Analytics' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                    : 'text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800'
                }`}
                onClick={() => setActiveTab('Analytics')}
              >
                <TrendingUp size={20} />
                <span className="font-medium">Analytics</span>
              </a>
            </li>
          </ul>
          
          <div className="border-t border-indigo-100 pt-4 mb-6">
            <a className="flex items-center gap-3 px-4 py-3 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 rounded-xl transition-all cursor-pointer">
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </a>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto space-y-4">
          {/* Free Plan Upgrade Card */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-xs font-medium text-indigo-600">FREE PLAN</span>
            </div>
            <p className="text-sm text-indigo-700 mb-3">Upgrade to Pro for advanced analytics</p>
            <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm py-2 h-8">
              Upgrade Now
            </Button>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://i.pravatar.cc/150?img=3" alt="User Avatar" />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold">FA</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-indigo-900 truncate">Ferra Alexandra</p>
              <p className="text-xs text-indigo-600 truncate">ferra@reaiv.com</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-indigo-400 hover:text-red-500 hover:bg-red-50"
              onClick={() => {
                console.log('Logout clicked');
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16,17 21,12 16,7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content with Left Margin */}
      <main className="flex-1 ml-64 p-6 min-h-screen">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <header className="bg-white rounded-3xl px-8 py-5 flex items-center justify-between shadow-sm border border-indigo-100">
            <div>
              <h1 className="text-2xl font-bold text-indigo-900">Analytics Dashboard</h1>
              <p className="text-sm text-indigo-600">{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center justify-center transition-colors">
                <Search size={16} className="text-indigo-600" />
              </button>
              <button className="w-10 h-10 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center justify-center relative transition-colors">
                <Bell size={16} className="text-indigo-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"></div>
              </button>
            </div>
          </header>

          {/* Grid */}
          <div className="main-grid grid grid-cols-1 md:grid-cols-6 gap-6">
            {/* Left top cluster */}
            <section className="md:col-span-4 md:row-span-2 grid grid-cols-1 sm:grid-cols-4 gap-6">
              {/* Total Revenue - Large Card */}
              <div className="sm:col-span-2 sm:row-span-2 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-3xl p-6 text-white shadow-xl overflow-hidden">
                <p className="text-indigo-100 mb-1 flex items-center gap-2">
                  <DollarSign size={16} />
                  Total Revenue
                </p>
                <p className="text-3xl font-bold mb-4">$612,917</p>
                <div className="flex items-center gap-2 text-emerald-300 mb-4">
                  <ArrowUpRight size={16} />
                  <span className="text-sm">+12.5% from last month</span>
                </div>
                <div className="mt-auto">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-indigo-100 text-sm mt-2">75% of yearly goal</p>
                </div>
              </div>

              {/* Total Orders */}
              <div className="sm:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-indigo-100 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-emerald-600" />
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                    <ArrowUpRight size={10} className="mr-1" />
                    8.2%
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-indigo-900 mb-1">1,247</h3>
                <p className="text-indigo-600 text-sm">Total Orders</p>
              </div>

              {/* Visitors */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-indigo-100 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                    <ArrowUpRight size={10} className="mr-1" />
                    5.1%
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-indigo-900 mb-1">34.5K</h3>
                <p className="text-indigo-600 text-sm">Visitors</p>
              </div>

              {/* Conversions */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-indigo-100 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 text-xs">
                    <ArrowDownRight size={10} className="mr-1" />
                    2.3%
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-indigo-900 mb-1">892</h3>
                <p className="text-indigo-600 text-sm">Conversions</p>
              </div>
            </section>

            {/* Product Statistics */}
            <section className="md:col-span-2 md:row-span-2 bg-white rounded-3xl p-6 shadow-sm border border-indigo-100 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-indigo-900">Proposal Types</h3>
                <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50">
                  <MoreHorizontal size={16} />
                </Button>
              </div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={productData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {productData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e0e7ff',
                        borderRadius: '8px',
                        color: '#3730a3'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {productData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-indigo-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-indigo-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Customer Behavior */}
            <section className="md:col-span-4 md:row-span-2 bg-white rounded-3xl p-6 shadow-sm border border-indigo-100 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-indigo-900 mb-1">Customer Behavior</h3>
                  <p className="text-sm text-indigo-600">Weekly engagement patterns</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="border-indigo-200 text-indigo-700">Weekly</Badge>
                  <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50">
                    <MoreHorizontal size={16} />
                  </Button>
                </div>
              </div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={customerHabits}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="day" stroke="#6366f1" fontSize={12} />
                    <YAxis stroke="#6366f1" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e0e7ff',
                        borderRadius: '8px',
                        color: '#3730a3'
                      }} 
                    />
                    <Bar dataKey="visits" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="conversions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Customer Growth */}
            <section className="md:col-span-2 md:row-span-2 bg-white rounded-3xl p-6 shadow-sm border border-indigo-100 overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={20} className="text-indigo-600" />
                <h3 className="font-semibold text-indigo-900">Growth by Region</h3>
              </div>
              <p className="text-sm text-indigo-600 mb-6">Customer acquisition by location</p>
              
              <div className="space-y-4">
                {growthData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-indigo-800">{item.location}</span>
                      <span className="text-sm text-indigo-600">{item.growth}%</span>
                    </div>
                    <Progress value={item.growth} className="h-2 bg-indigo-100" />
                  </div>
                ))}
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-indigo-100">
                  <p className="text-sm font-medium text-indigo-800 mb-1">🏆 Top Performer</p>
                  <p className="text-lg font-bold text-emerald-600">United States</p>
                  <p className="text-xs text-indigo-600">+15% this quarter</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}