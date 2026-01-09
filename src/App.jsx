import React, { useState, useCallback } from 'react';
import { 
  Wallet, Shield, CheckCircle, Clock, ArrowRight, Github, 
  FileText, XCircle, AlertCircle, Copy, ExternalLink,
  Menu, X, Zap, Lock, Globe
} from 'lucide-react';

// Configuration
const API_URL = 'https://olopa-backend-2.onrender.com'; // UPDATE THIS!

const ROUTES = {
  HOME: 'home',
  CREATE: 'create',
  DEAL: 'deal',
  DOCS: 'docs',
  TERMS: 'terms'
};

const DEAL_STATUS = {
  PENDING: 'pending',
  FUNDED: 'funded',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Button Component
const Button = ({ children, variant = 'primary', size = 'md', className = '', icon: Icon, ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
    outline: 'border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10',
    ghost: 'text-gray-300 hover:text-white hover:bg-slate-800'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button 
      className={`font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

// Card Component
const Card = ({ children, className = '', hover = false }) => (
  <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 ${hover ? 'transition-transform duration-300 hover:scale-105' : ''} ${className}`}>
    {children}
  </div>
);

// Input Component
const Input = ({ label, error, icon: Icon, ...props }) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-semibold text-gray-300">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <input
        className={`w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border-2 transition-all ${Icon ? 'pl-12' : ''} ${error ? 'border-red-500' : 'border-slate-600 focus:border-cyan-500'} focus:outline-none focus:ring-2 focus:ring-cyan-500/20 placeholder:text-gray-500`}
        {...props}
      />
    </div>
    {error && (
      <p className="text-red-400 text-sm flex items-center gap-2">
        <AlertCircle className="w-4 h-4" />
        {error}
      </p>
    )}
  </div>
);

// Status Badge
const StatusBadge = ({ status }) => {
  const config = {
    [DEAL_STATUS.PENDING]: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50', icon: Clock },
    [DEAL_STATUS.FUNDED]: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50', icon: Lock },
    [DEAL_STATUS.COMPLETED]: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50', icon: CheckCircle },
  };

  const { bg, text, border, icon: Icon } = config[status] || config[DEAL_STATUS.PENDING];

  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${bg} ${text} ${border}`}>
      <Icon className="w-4 h-4" />
      {status.toUpperCase()}
    </span>
  );
};

// Main App
export default function App() {
  const [view, setView] = useState(ROUTES.HOME);
  const [wallet, setWallet] = useState(null);
  const [deals, setDeals] = useState([]);
  const [currentDeal, setCurrentDeal] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    currency: 'XRP',
    freelancerAddress: '',
    deadline: '7',
    description: ''
  });

  const [errors, setErrors] = useState({});

  // Connect Wallet
  const connectWallet = useCallback(async () => {
    setLoading(true);
    setTimeout(() => {
      const mockWallet = {
        address: 'rN7n7otQDd6FczFgLdlqtyMVrn3HMtthP4',
        verified: true
      };
      setWallet(mockWallet);
      setLoading(false);
    }, 1000);
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet(null);
    setView(ROUTES.HOME);
  }, []);

  // Validate Form
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Deal title is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount required';
    if (!formData.freelancerAddress.trim()) newErrors.freelancerAddress = 'Freelancer address required';
    if (!formData.deadline || parseInt(formData.deadline) < 1) newErrors.deadline = 'Deadline must be at least 1 day';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Create Deal
  const createDeal = useCallback(() => {
    if (!validateForm()) return;
    setLoading(true);
    
    const deal = {
      id: `DEAL-${Date.now()}`,
      ...formData,
      status: DEAL_STATUS.PENDING,
      creator: wallet.address,
      createdAt: new Date().toISOString(),
    };
    
    setTimeout(() => {
      setDeals(prev => [...prev, deal]);
      setCurrentDeal(deal);
      setLoading(false);
      setView(ROUTES.DEAL);
      setFormData({
        title: '',
        amount: '',
        currency: 'XRP',
        freelancerAddress: '',
        deadline: '7',
        description: ''
      });
    }, 1000);
  }, [formData, wallet, validateForm]);

  // Header Component
  const Header = () => (
    <header className="sticky top-0 z-40 backdrop-blur-lg bg-slate-900/80 border-b border-slate-700/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setView(ROUTES.HOME)} className="flex items-center gap-3 group">
            <Shield className="w-8 h-8 text-cyan-400 transition-transform group-hover:scale-110" />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              OLOPA
            </span>
          </button>

          <div className="flex items-center gap-4">
            {wallet ? (
              <Button variant="secondary" onClick={disconnectWallet}>
                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
              </Button>
            ) : (
              <Button variant="primary" onClick={connectWallet} disabled={loading}>
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );

  // Home Page
  const HomePage = () => (
    <div className="min-h-screen">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
      
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-5xl mx-auto">
          <span className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold mb-6">
            Built on XRP Ledger
          </span>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Sign deals. Lock funds.
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Settle on-ledger.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            OLOPA is the trust layer for P2P agreements on XRPL. Bring your deal, sign with your wallet, settle with certainty.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="primary" 
              size="lg"
              icon={ArrowRight}
              onClick={() => wallet ? setView(ROUTES.CREATE) : connectWallet()}
            >
              Create Your First Deal
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              icon={FileText}
              onClick={() => setView(ROUTES.DOCS)}
            >
              View Documentation
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
            {[
              { value: '0%', label: 'Platform Fees' },
              { value: '3-5s', label: 'Settlement Time' },
              { value: '$0.0001', label: 'Transaction Cost' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Four steps. One settlement.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            { icon: FileText, title: 'Create Deal', desc: 'Define terms, amount, deadline. Generate unique deal link.' },
            { icon: CheckCircle, title: 'Sign Intent', desc: 'Both parties connect wallets and sign agreement cryptographically.' },
            { icon: Lock, title: 'Fund Escrow', desc: 'Client locks XRP or RLUSD directly on XRPL. Non-custodial.' },
            { icon: Zap, title: 'Auto Release', desc: 'Funds settle automatically after deadline. Instant finality.' }
          ].map((step, i) => (
            <Card key={i} hover className="p-6 text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );

  // Create Deal Page
  const CreateDealPage = () => (
    <div className="min-h-screen py-12">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
      
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <button onClick={() => setView(ROUTES.HOME)} className="text-gray-400 hover:text-white flex items-center gap-2 mb-4">
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-white mb-3">Create New Deal</h1>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            <Input
              label="Deal Title"
              placeholder="e.g., Website Development"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              error={errors.title}
              icon={FileText}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Amount"
                type="number"
                placeholder="500"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                error={errors.amount}
              />

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border-2 border-slate-600 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="XRP">XRP</option>
                  <option value="RLUSD">RLUSD</option>
                </select>
              </div>
            </div>

            <Input
              label="Freelancer Wallet Address"
              placeholder="rN7n7otQDd6FczFgLdhmKRAWjRS8Sf6rXQ"
              value={formData.freelancerAddress}
              onChange={(e) => setFormData({...formData, freelancerAddress: e.target.value})}
              error={errors.freelancerAddress}
              icon={Wallet}
            />

            <Input
              label="Deadline (days)"
              type="number"
              placeholder="7"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              error={errors.deadline}
              icon={Clock}
            />

            <Button
              variant="primary"
              size="lg"
              onClick={createDeal}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating...' : 'Create Deal'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  // Deal Page
  const DealPage = () => {
    if (!currentDeal) return null;

    return (
      <div className="min-h-screen py-12">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
        
        <div className="container mx-auto px-4 max-w-4xl">
          <button onClick={() => setView(ROUTES.HOME)} className="text-gray-400 hover:text-white mb-6">
            ← Back
          </button>

          <Card className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{currentDeal.title}</h1>
                <StatusBadge status={currentDeal.status} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-cyan-400">{currentDeal.amount} {currentDeal.currency}</div>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-700 pt-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Client:</span>
                <span className="text-white font-mono">{currentDeal.creator.slice(0, 8)}...{currentDeal.creator.slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Freelancer:</span>
                <span className="text-white font-mono">{currentDeal.freelancerAddress.slice(0, 8)}...{currentDeal.freelancerAddress.slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Deadline:</span>
                <span className="text-white">{currentDeal.deadline} days</span>
              </div>
            </div>

            <div className="mt-6 bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-lg">
              <h4 className="text-cyan-400 font-semibold mb-2">Next Steps</h4>
              <p className="text-gray-300 text-sm">
                Share this deal URL with the freelancer. Once both parties sign, funds will be locked in XRPL escrow.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // Docs Page
  const DocsPage = () => (
    <div className="min-h-screen py-12">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
      
      <div className="container mx-auto px-4 max-w-4xl">
        <button onClick={() => setView(ROUTES.HOME)} className="text-gray-400 hover:text-white mb-6">
          ← Back
        </button>

        <Card className="p-8">
          <h1 className="text-4xl font-bold text-white mb-6">Documentation</h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">What is OLOPA?</h2>
              <p>OLOPA is a decentralized escrow platform built on the XRP Ledger. It enables trustless P2P agreements with automatic settlement.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">How it Works</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Create a deal with terms and amount</li>
                <li>Both parties sign with their XRPL wallets</li>
                <li>Client funds the escrow on-chain</li>
                <li>After deadline, funds auto-release to freelancer</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Backend API</h2>
              <p className="mb-2">Base URL: <code className="bg-slate-700 px-2 py-1 rounded">{API_URL}</code></p>
              <p>Check out the full API documentation on GitHub.</p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );

  // Render
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-3 text-center sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-semibold">
          <AlertCircle className="w-4 h-4" />
          <span>BETA: OLOPA is coordination software. Use at your own risk.</span>
        </div>
      </div>

      <Header />
      
      {view === ROUTES.HOME && <HomePage />}
      {view === ROUTES.CREATE && <CreateDealPage />}
      {view === ROUTES.DEAL && <DealPage />}
      {view === ROUTES.DOCS && <DocsPage />}
    </div>
  );
}
