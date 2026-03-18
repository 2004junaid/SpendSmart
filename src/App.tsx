/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { 
  Wallet, 
  Zap, 
  Mail, 
  Lock, 
  Home, 
  Plus, 
  Calendar, 
  MessageSquare, 
  User, 
  ChevronRight, 
  ArrowLeft,
  Utensils,
  Car,
  Home as HomeIcon,
  ShoppingBag,
  Film,
  Heart,
  Plane,
  MoreHorizontal,
  Send,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Loader2,
  Search,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { cn, Transaction, CATEGORIES } from './types';

// --- Mock Data ---
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', title: 'Whole Foods Market', amount: 85.20, category: 'Food & Dining', date: 'Today', isRecurring: false },
  { id: '2', title: 'Uber Ride', amount: 15.50, category: 'Transportation', date: 'Today', isRecurring: false },
  { id: '3', title: 'Monthly Rent', amount: 1200.00, category: 'Rent & Utilities', date: 'Oct 1', isRecurring: true },
  { id: '4', title: 'Netflix Subscription', amount: 19.99, category: 'Entertainment', date: 'Oct 5', isRecurring: true },
  { id: '5', title: 'Gym Membership', amount: 45.00, category: 'Health & Fitness', date: 'Oct 10', isRecurring: true },
];

const CHART_DATA = [
  { name: 'Rent', value: 1200, color: '#4f46e5' },
  { name: 'Food', value: 450, color: '#f97316' },
  { name: 'Transport', value: 180, color: '#2563eb' },
];

// --- Components ---

const IconComponent = ({ name, className }: { name: string, className?: string }) => {
  const icons: Record<string, any> = {
    Utensils, Car, Home: HomeIcon, ShoppingBag, Film, Heart, Plane, MoreHorizontal
  };
  const Icon = icons[name] || MoreHorizontal;
  return <Icon className={className} size={20} />;
};

export default function App() {
  const [screen, setScreen] = useState<'auth' | 'dashboard' | 'add' | 'ai'>('auth');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isLoading, setIsLoading] = useState(false);

  const generatePDFReport = () => {
    const doc = new jsPDF();
    const usn = "1RV22CS001"; 
    const email = "mj9394260@gmail.com";
    
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); 
    doc.text('SpendSmart: Prototype Development Plan', 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); 
    doc.text(`Author: ${usn} | ${email}`, 20, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 35);
    
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 40, 190, 40);

    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42); 
    doc.text('1. Proposed Application Features', 20, 55);
    
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85); 
    const features = [
      ['Feature', 'Description'],
      ['AI Dashboard', 'Real-time spending visualization with trend analysis.'],
      ['Smart Logging', 'Categorized expense tracking for one-time and recurring costs.'],
      ['AI Advisor', 'Conversational interface for personalized financial insights.'],
      ['Recurring Manager', 'Automated tracking of subscriptions and bills.']
    ];
    (doc as any).autoTable({
      startY: 60,
      head: [features[0]],
      body: features.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] }
    });

    const currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text('2. Role of AI Studio in Prototyping', 20, currentY);
    
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    const aiStudioText = [
      'AI Studio acts as the primary rapid development environment. Its role includes:',
      '• UI/UX Generation: Using React and Tailwind to mimic Material Design 3.',
      '• Logic Simulation: Implementing the core expense tracking logic in TypeScript.',
      '• AI Integration: Directly connecting to Gemini 3 Flash to test the Advisor chatbot.',
      '• Rapid Iteration: Validating user flows and visual hierarchy before native coding.'
    ];
    doc.text(aiStudioText, 20, currentY + 10);

    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text('3. Android Studio Implementation Plan', 20, currentY + 55);
    
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    const androidText = [
      'The transition to Android Studio will focus on production-grade native performance:',
      '• UI: Translating React components to Jetpack Compose with Material 3.',
      '• Database: Migrating local state to Firebase Firestore for cloud sync.',
      '• Auth: Implementing Firebase Authentication for secure user sessions.',
      '• Native APIs: Adding push notifications, biometric auth, and home screen widgets.'
    ];
    doc.text(androidText, 20, currentY + 65);

    doc.save(`${usn}_${email}_PrototypePlan_Report.pdf`);
  };

  // Auth Screen
  const AuthScreen = () => (
    <div className="min-h-screen flex flex-col p-8 bg-slate-50 relative">
      <div className="absolute top-6 right-6">
        <button 
          onClick={generatePDFReport}
          className="flex items-center gap-2 text-xs font-bold text-royal-blue bg-white px-3 py-2 rounded-lg android-shadow border border-slate-100"
        >
          <Download size={14} />
          Report PDF
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-royal-blue rounded-3xl flex items-center justify-center android-shadow"
        >
          <Wallet className="text-white" size={40} />
        </motion.div>
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">SpendSmart</h1>
          <p className="text-slate-500 font-medium">Your Personal AI Financial Advisor</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="email" placeholder="Email address" className="input-field pl-12" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="password" placeholder="Password" className="input-field pl-12" />
            </div>
          </div>

          <button 
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                setIsLoggedIn(true);
                setScreen('dashboard');
              }, 1500);
            }}
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>

          <button className="btn-secondary w-full">Sign Up</button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-50 text-slate-500">Or continue with</span></div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-95">
            <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" alt="Google" className="w-5 h-5" referrerPolicy="no-referrer" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );

  // Dashboard Screen
  const DashboardScreen = () => (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Top Bar */}
      <div className="p-6 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900">SpendSmart</h2>
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-white android-shadow">
          JD
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Total Spent Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="premium-card p-6 bg-gradient-to-br from-royal-blue to-indigo-primary text-white border-none"
        >
          <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Total Spent This Month</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-4xl font-bold">$1,240.50</h3>
          </div>
          <div className="mt-4 flex items-center gap-2 text-emerald-300 font-medium text-sm bg-white/10 w-fit px-3 py-1 rounded-full">
            <TrendingDown size={16} />
            <span>12% vs last month</span>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <div className="premium-card p-6">
          <h4 className="font-bold text-slate-900 mb-4">Category Breakdown</h4>
          <div className="flex items-center gap-4">
            <div className="h-32 w-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CHART_DATA}
                    innerRadius={35}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {CHART_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {CHART_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="text-slate-900 font-bold">${item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-900">Recent Transactions</h4>
            <button className="text-royal-blue text-sm font-semibold">See All</button>
          </div>
          <div className="space-y-3">
            {transactions.map((tx) => {
              const category = CATEGORIES.find(c => c.name === tx.category) || CATEGORIES[7];
              return (
                <motion.div 
                  key={tx.id}
                  whileHover={{ scale: 1.02 }}
                  className="premium-card p-4 flex items-center gap-4"
                >
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", category.color)}>
                    <IconComponent name={category.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{tx.title}</p>
                    <p className="text-xs text-slate-500 font-medium">{tx.date}{tx.isRecurring && ' • Recurring'}</p>
                  </div>
                  <p className="font-bold text-slate-900">-${tx.amount.toFixed(2)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAB */}
      <button 
        onClick={() => setScreen('add')}
        className="fixed bottom-28 right-6 w-16 h-16 bg-royal-blue text-white rounded-2xl flex items-center justify-center android-shadow active:scale-90 transition-transform z-20"
      >
        <Plus size={32} />
      </button>
    </div>
  );

  // Add Expense Screen
  const AddExpenseScreen = () => {
    const [type, setType] = useState<'one-time' | 'recurring'>('one-time');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0].name);
    const [frequency, setFrequency] = useState('Monthly');

    const handleSave = () => {
      if (!amount || !description) return;
      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        title: description,
        amount: parseFloat(amount),
        category: category,
        date: 'Today',
        isRecurring: type === 'recurring'
      };
      setTransactions([newTx, ...transactions]);
      setScreen('dashboard');
    };

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="p-6 flex items-center gap-4 bg-white border-b border-slate-100">
          <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2 text-slate-600"><ArrowLeft /></button>
          <h2 className="text-xl font-bold text-slate-900">Log New Expense</h2>
        </div>

        <div className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* Tabs */}
          <div className="bg-slate-200 p-1 rounded-xl flex">
            <button 
              onClick={() => setType('one-time')}
              className={cn("flex-1 py-2 rounded-lg text-sm font-bold transition-all", type === 'one-time' ? "bg-white text-royal-blue android-shadow" : "text-slate-500")}
            >
              One-Time
            </button>
            <button 
              onClick={() => setType('recurring')}
              className={cn("flex-1 py-2 rounded-lg text-sm font-bold transition-all", type === 'recurring' ? "bg-white text-royal-blue android-shadow" : "text-slate-500")}
            >
              Recurring
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">$</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field pl-10 text-2xl font-bold" 
                  placeholder="0.00" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field" 
                placeholder="What was this for?" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field appearance-none bg-no-repeat bg-[right_1rem_center]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
              >
                {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label>
              <input type="date" className="input-field" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>

            {type === 'recurring' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="space-y-2"
              >
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Frequency</label>
                <select 
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="input-field"
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Yearly</option>
                </select>
              </motion.div>
            )}
          </div>
        </div>

        <div className="p-6 bg-white border-t border-slate-100">
          <button onClick={handleSave} className="btn-primary w-full">Save Expense</button>
        </div>
      </div>
    );
  };

  // AI Advisor Screen
  const AIAdvisorScreen = () => {
    const [messages, setMessages] = useState([
      { role: 'assistant', content: "I noticed your food spending is 20% higher this week. Would you like some tips on cutting down?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [messages]);

    const handleSend = async () => {
      if (!input.trim()) return;
      
      const userMsg = input;
      setInput('');
      setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
      setIsTyping(true);

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            { role: 'user', parts: [{ text: `You are SpendSmart AI Advisor. The user has these transactions: ${JSON.stringify(transactions)}. User says: ${userMsg}` }] }
          ],
          config: {
            systemInstruction: "You are a helpful, professional, and encouraging financial advisor. Keep responses concise and focused on financial health. Use the user's transaction data to provide specific insights."
          }
        });
        
        setMessages(prev => [...prev, { role: 'assistant', content: response.text || "I'm sorry, I couldn't process that right now." }]);
      } catch (error) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to AI. Please try again later." }]);
      } finally {
        setIsTyping(false);
      }
    };

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="p-6 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-royal-blue flex items-center justify-center text-white">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-none">AI Advisor</h2>
              <span className="text-xs text-emerald-500 font-bold">Online</span>
            </div>
          </div>
          <button onClick={() => setScreen('dashboard')} className="p-2 text-slate-400"><MoreHorizontal /></button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}
            >
              <div className={cn(
                "max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed",
                msg.role === 'user' 
                  ? "bg-royal-blue text-white rounded-tr-none android-shadow" 
                  : "bg-white text-slate-700 rounded-tl-none border border-slate-100 android-shadow"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-slate-100 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {["Summarize my month", "How can I save?", "Top categories"].map(chip => (
              <button 
                key={chip}
                onClick={() => { setInput(chip); }}
                className="whitespace-nowrap px-4 py-2 bg-slate-100 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your spending..." 
              className="input-field flex-1" 
            />
            <button 
              onClick={handleSend}
              className="w-12 h-12 bg-royal-blue text-white rounded-xl flex items-center justify-center active:scale-90 transition-transform"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen relative overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        {screen === 'auth' && <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><AuthScreen /></motion.div>}
        {screen === 'dashboard' && <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><DashboardScreen /></motion.div>}
        {screen === 'add' && <motion.div key="add" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute inset-0 z-30"><AddExpenseScreen /></motion.div>}
        {screen === 'ai' && <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><AIAdvisorScreen /></motion.div>}
      </AnimatePresence>

      {/* Bottom Navigation */}
      {isLoggedIn && screen !== 'add' && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-lg border-t border-slate-100 px-6 py-4 flex justify-between items-center z-20">
          <button onClick={() => setScreen('dashboard')} className={cn("flex flex-col items-center gap-1", screen === 'dashboard' ? "text-royal-blue" : "text-slate-400")}>
            <Home size={24} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
          </button>
          <button onClick={() => setScreen('add')} className="flex flex-col items-center gap-1 text-slate-400">
            <Plus size={24} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Add</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <Calendar size={24} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Schedules</span>
          </button>
          <button onClick={() => setScreen('ai')} className={cn("flex flex-col items-center gap-1", screen === 'ai' ? "text-royal-blue" : "text-slate-400")}>
            <MessageSquare size={24} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">AI Advisor</span>
          </button>
        </div>
      )}
    </div>
  );
}
