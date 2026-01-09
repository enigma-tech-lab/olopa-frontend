import React, { useState, useEffect, useCallback } from 'react';
import { 
  Wallet, Shield, CheckCircle, Clock, ArrowRight, FileText, XCircle, AlertCircle, Copy, Zap, Lock, Globe, Menu, X
} from 'lucide-react';

// ============================================
// CONFIGURATION
// ============================================
const API_URL = 'https://olopa-backend-2.onrender.com'; // replace with real backend

const ROUTES = {
  HOME: 'home',
  CREATE: 'create',
  DEAL: 'deal',
  DOCS: 'docs',
  TERMS: 'terms',
  PRIVACY: 'privacy'
};

const DEAL_STATUS = {
  PENDING: 'pending',
  FUNDED: 'funded',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

const CURRENCIES = ['XRP', 'RLUSD'];

// ============================================
// CUSTOM HOOKS
// ============================================
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  return matches;
};

const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);
  return [copied, copy];
};

// ============================================
// UI COMPONENTS
// ============================================
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
  </div>
);

const DisclaimerBanner = () => (
  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-3 text-center sticky top-0 z-50 shadow-lg">
    <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-semibold">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>BETA: OLOPA is coordination software. Non-custodial. XRPL-native. Use at your own risk.</span>
    </div>
  </div>
);

const Button = ({ children, variant = 'primary', size = 'md', className = '', icon: Icon, ...props }) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white shadow-lg',
    outline: 'border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10',
    ghost: 'text-gray-300 hover:text-white hover:bg-slate-800'
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', hover = false }) => (
  <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 ${hover ? 'transition-transform duration-300 hover:scale-105 hover:shadow-cyan-500/10' : ''} ${className}`}>
    {children}
  </div>
);

const Input = ({ label, error, icon: Icon, ...props }) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-semibold text-gray-300">{label}</label>}
    <div className="relative">
      {Icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Icon className="w-5 h-5" /></div>}
      <input
        className={`w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border-2 transition-all duration-200 ${Icon ? 'pl-12' : ''} ${error ? 'border-red-500' : 'border-slate-600 focus:border-cyan-500'} focus:outline-none focus:ring-2 focus:ring-cyan-500/20 placeholder:text-gray-500`}
        {...props}
      />
    </div>
    {error && (
      <p className="text-red-400 text-sm flex items-center gap-2">
        <AlertCircle className="w-4 h-4" /> {error}
      </p>
    )}
  </div>
);

const StatusBadge = ({ status }) => {
  const config = {
    [DEAL_STATUS.PENDING]: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50', icon: Clock },
    [DEAL_STATUS.FUNDED]: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50', icon: Lock },
    [DEAL_STATUS.ACTIVE]: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50', icon: Zap },
    [DEAL_STATUS.COMPLETED]: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50', icon: CheckCircle },
    [DEAL_STATUS.CANCELLED]: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/50', icon: XCircle }
  };
  const { bg, text, border, icon: Icon } = config[status] || config[DEAL_STATUS.PENDING];
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${bg} ${text} ${border}`}>
      <Icon className="w-4 h-4" />
      {status.toUpperCase()}
    </span>
  );
};

const CopyButton = ({ text, label = 'Copy' }) => {
  const [copied, copy] = useCopyToClipboard();
  return (
    <button onClick={() => copy(text)} className="inline-flex items-center gap-2 px-3 py-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
      {copied ? (<><CheckCircle className="w-4 h-4" /> Copied!</>) : (<><Copy className="w-4 h-4" /> {label}</>)}
    </button>
  );
};

// ============================================
// MAIN APP
// ============================================
export default function App() {
  const [view, setView] = useState(ROUTES.HOME);
  const [wallet, setWallet] = useState(null);
  const [deals, setDeals] = useState([]);
  const [currentDeal, setCurrentDeal] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isMobile = useMediaQuery('(max-width: 768px)');

  const [formData, setFormData] = useState({
    title: '', amount: '', currency: 'XRP', freelancerAddress: '', deadline: '7', description: ''
  });
  const [errors, setErrors] = useState({});

  // ============================================
  // WALLET MANAGEMENT
  // ============================================
  const connectWallet = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setWallet({ address: 'rN7n7otQDd6FczFgLdhmKRAWjRS8Sf6rXQ', verified: true });
      setLoading(false);
    }, 1000);
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet(null);
    setView(ROUTES.HOME);
    setMobileMenuOpen(false);
  }, []);

  // ============================================
  // FORM VALIDATION & DEAL CREATION
  // ============================================
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Deal title is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount required';
    if (!formData.freelancerAddress.trim()) newErrors.freelancerAddress = 'Freelancer address required';
    if (!formData.deadline || parseInt(formData.deadline) < 1) newErrors.deadline = 'Deadline must be at least 1 day';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const createDeal = useCallback(() => {
    if (!validateForm()) return;
    setLoading(true);

    const deal = {
      id: `DEAL-${Date.now()}`,
      ...formData,
      status: DEAL_STATUS.PENDING,
      creator: wallet.address,
      createdAt: new Date().toISOString(),
      escrowSequence: null,
      finishAfter: new Date(Date.now() + parseInt(formData.deadline) * 24*60*60*1000).toISOString()
    };

    setTimeout(() => {
      setDeals(prev => [...prev, deal]);
      setCurrentDeal(deal);
      setLoading(false);
      setView(ROUTES.DEAL);
      setFormData({ title: '', amount: '', currency: 'XRP', freelancerAddress: '', deadline: '7', description: '' });
    }, 1000);
  }, [formData, wallet, validateForm]);

  const fundEscrow = useCallback(() => {
    if (!currentDeal) return;
    setLoading(true);
    setTimeout(() => {
      setCurrentDeal(prev => ({ ...prev, status: DEAL_STATUS.FUNDED }));
      setLoading(false);
    }, 1500);
  }, [currentDeal]);

  // ============================================
  // HEADER
  // ============================================
  const Header = () => (
    <header className="sticky top-12 z-40 backdrop-blur-lg bg-slate-900/80 border-b border-slate-700/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={() => setView(ROUTES.HOME)} className="flex items-center gap-3 group">
          <Shield className="w-8 h-8 text-cyan-400 transition-transform group-hover:scale-110" />
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">OLOPA</span>
        </button>

        {!isMobile && <nav className="flex items-center gap-6">
          <button onClick={() => setView(ROUTES.DOCS)} className="text-gray-300 hover:text-white">Docs</button>
          <button onClick={() => setView(ROUTES.TERMS)} className="text-gray-300 hover:text-white">Terms</button>
        </nav>}

        <div className="flex items-center gap-4">
          {wallet ? (
            <Button variant="secondary" onClick={disconnectWallet}>
              {wallet.address.slice(0,6)}...{wallet.address.slice(-4)}
            </Button>
          ) : (
            <Button variant="primary" onClick={connectWallet} disabled={loading}>
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}

          {isMobile && (
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
              {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
            </button>
          )}
        </div>

        {isMobile && mobileMenuOpen && (
          <nav className="mt-4 pb-4 flex flex-col gap-3 border-t border-slate-700 pt-4">
            <button onClick={() => { setView(ROUTES.DOCS); setMobileMenuOpen(false); }} className="text-left text-gray-300 hover:text-white">Docs</button>
            <button onClick={() => { setView(ROUTES.TERMS); setMobileMenuOpen(false); }} className="text-left text-gray-300 hover:text-white">Terms</button>
          </nav>
        )}
      </div>
    </header>
  );

  // ============================================
  // PAGES (HOME, CREATE, DEAL, DOCS)
  // ============================================
  const HomePage = () => (
    <div className="min-h-screen">
      <AnimatedBackground />
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 text-center max-w-5xl mx-auto">
        <span className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold mb-6">Built on XRP Ledger</span>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Sign deals. Lock funds.<br />
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Settle on-ledger.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          OLOPA is the trust layer for P2P agreements on XRPL. Bring your deal, sign with your wallet, settle with certainty.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="primary" size="lg" icon={ArrowRight} onClick={() => wallet ? setView(ROUTES.CREATE) : connectWallet()}>
            Create Your First Deal
          </Button>
          <Button variant="outline" size="lg" icon={FileText} onClick={() => setView(ROUTES.DOCS)}>View Documentation</Button>
        </div>
      </section>
    </div>
  );

  const CreateDealPage = () => (
    <div className="min-h-screen py-12">
      <AnimatedBackground />
      <div className="container mx-auto px-4 max-w-3xl">
        <button onClick={() => setView(ROUTES.HOME)} className="text-gray-400 hover:text-white flex items-center gap-2 mb-4">← Back</button>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Create New Deal</h1>

        <Card className="p-8 space-y-6">
          <Input label="Deal Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} icon={FileText} error={errors.title}/>
          <div className="grid md:grid-cols-2 gap-6">
            <Input label="Amount" type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} error={errors.amount}/>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">Currency</label>
              <select value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})} className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border-2 border-slate-600 focus:border-cyan-500">
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <Input label="Freelancer Wallet Address" value={formData.freelancerAddress} onChange={e => setFormData({...formData, freelancerAddress: e.target.value})} error={errors.freelancerAddress} icon={Wallet}/>
          <Input label="Deadline (days)" type="number" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} error={errors.deadline} icon={Clock}/>
          <Button variant="primary" size="lg" className="w-full" onClick={createDeal} disabled={loading}>{loading ? 'Creating...' : 'Create Deal'}</Button>
        </Card>
      </div>
    </div>
  );

  const DealPage = () => {
    if (!currentDeal) return null;
    return (
      <div className="min-h-screen py-12">
        <AnimatedBackground />
        <div className="container mx-auto px-4 max-w-4xl">
          <button onClick={() => setView(ROUTES.HOME)} className="text-gray-400 hover:text-white mb-6">← Back</button>
          <Card className="p-8">
            <div
