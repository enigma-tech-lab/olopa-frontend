import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Wallet, Shield, CheckCircle, Clock, ArrowRight, Github, 
  FileText, XCircle, AlertCircle, Copy, ExternalLink,
  ChevronDown, Menu, X, Zap, Lock, Globe
} from 'lucide-react';

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

const ROUTES = {
  HOME: 'home',
  CREATE: 'create',
  DEAL: 'deal',
  TERMS: 'terms',
  PRIVACY: 'privacy',
  DOCS: 'docs'
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
    media.addListener(listener);
    return () => media.removeListener(listener);
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
// UTILITY COMPONENTS
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
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', hover = false }) => (
  <div className={`
    bg-gradient-to-br from-slate-800 to-slate-900 
    rounded-2xl shadow-2xl border border-slate-700/50 
    ${hover ? 'transition-transform duration-300 hover:scale-105 hover:shadow-cyan-500/10' : ''}
    ${className}
  `}>
    {children}
  </div>
);

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
        className={`
          w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg
          border-2 transition-all duration-200
          ${Icon ? 'pl-12' : ''}
          ${error ? 'border-red-500' : 'border-slate-600 focus:border-cyan-500'}
          focus:outline-none focus:ring-2 focus:ring-cyan-500/20
          placeholder:text-gray-500
        `}
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
    <button
      onClick={() => copy(text)}
      className="inline-flex items-center gap-2 px-3 py-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
    >
      {copied ? (
        <>
          <CheckCircle className="w-4 h-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          {label}
        </>
      )}
    </button>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================

const App = () => {
  const [view, setView] = useState(ROUTES.HOME);
  const [wallet, setWallet] = useState(null);
  const [deals, setDeals] = useState([]);
  const [currentDeal, setCurrentDeal] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    currency: 'XRP',
    freelancerAddress: '',
    deadline: '7',
    description: ''
  });

  const [errors, setErrors] = useState({});

  // ============================================
  // WALLET MANAGEMENT
  // ============================================

  const connectWallet = useCallback(async () => {
    setLoading(true);
    // Simulate wallet connection
    setTimeout(() => {
      const mockWallet = {
        address: 'rN7n7otQDd6FczFgLdhmKRAWjRS8Sf6rXQ',
        did: 'did:xrpl:testnet:rN7n7otQDd6FczFgLdhmKRAWjRS8Sf6rXQ',
        verified: true
      };
      setWallet(mockWallet);
      setLoading(false);
    }, 1000);
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet(null);
    setView(ROUTES.HOME);
    setMobileMenuOpen(false);
  }, []);

  // ============================================
  // DEAL MANAGEMENT
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
      finishAfter: new Date(Date.now() + parseInt(formData.deadline) * 24 * 60 * 60 * 1000).toISOString()
    };
    
    setTimeout(() => {
      setDeals(prev => [...prev, deal]);
      setCurrentDeal(deal);
      setLoading(false);
      setView(ROUTES.DEAL);
      
      // Reset form
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

  const fundEscrow = useCallback(() => {
    if (!currentDeal) return;
    
    setLoading(true);
    setTimeout(() => {
      setCurrentDeal(prev => ({ ...prev, status: DEAL_STATUS.FUNDED }));
      setLoading(false);
    }, 1500);
  }, [currentDeal]);

  // ============================================
  // HEADER COMPONENT
  // ============================================

  const Header = () => (
    <header className="sticky top-12 z-40 backdrop-blur-lg bg-slate-900/80 border-b border-slate-700/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => setView(ROUTES.HOME)}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <Shield className="w-8 h-8 text-cyan-400 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              OLOPA
            </span>
          </button>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex items-center gap-6">
              <button onClick={() => setView(ROUTES.DOCS)} className="text-gray-300 hover:text-white transition-colors">
                Docs
              </button>
              <button onClick={() => setView(ROUTES.TERMS)} className="text-gray-300 hover:text-white transition-colors">
                Terms
              </button>
              <a 
                href="https://github.com/yourusername/olopa" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </nav>
          )}

          {/* Wallet Button */}
          <div className="flex items-center gap-4">
            {wallet ? (
              <div className="flex items-center gap-3">
                {wallet.verified && (
                  <span className="hidden sm:flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    DID Verified
                  </span>
                )}
                <Button variant="secondary" onClick={disconnectWallet}>
                  {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                </Button>
              </div>
            ) : (
              <Button variant="primary" onClick={connectWallet} disabled={loading}>
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
            
            {isMobile && (
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <nav className="mt-4 pb-4 flex flex-col gap-3 border-t border-slate-700 pt-4">
            <button onClick={() => { setView(ROUTES.DOCS); setMobileMenuOpen(false); }} className="text-left text-gray-300 hover:text-white transition-colors">
              Documentation
            </button>
            <button onClick={() => { setView(ROUTES.TERMS); setMobileMenuOpen(false); }} className="text-left text-gray-300 hover:text-white transition-colors">
              Terms of Service
            </button>
            <a 
              href="https://github.com/yourusername/olopa" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-left text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </nav>
        )}
      </div>
    </header>
  );

  // ============================================
  // HOME PAGE
  // ============================================

  const HomePage = () => (
    <div className="min-h-screen">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold">
              Built on XRP Ledger
            </span>
          </div>
          
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

          {/* Stats */}
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

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Four steps. One settlement.
          </h2>
          <p className="text-gray-400 text-lg">
            Simple, secure, and instant deal execution on XRPL
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            { 
              icon: FileText, 
              title: 'Create Deal', 
              desc: 'Define terms, amount, deadline. Generate unique deal link.',
              color: 'from-cyan-500 to-blue-500'
            },
            { 
              icon: CheckCircle, 
              title: 'Sign Intent', 
              desc: 'Both parties connect wallets and sign agreement cryptographically.',
              color: 'from-blue-500 to-purple-500'
            },
            { 
              icon: Lock, 
              title: 'Fund Escrow', 
              desc: 'Client locks XRP or RLUSD directly on XRPL. Non-custodial.',
              color: 'from-purple-500 to-pink-500'
            },
            { 
              icon: Zap, 
              title: 'Auto Release', 
              desc: 'Funds settle automatically after deadline. Instant finality.',
              color: 'from-pink-500 to-cyan-500'
            }
          ].map((step, i) => (
            <Card key={i} hover className="p-6 text-center group">
              <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* XRPL Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powered by XRP Ledger
          </h2>
          <p className="text-gray-400 text-lg">
            Production-grade blockchain for financial applications
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { 
              icon: Zap, 
              title: 'Lightning Fast', 
              desc: '3-5 second settlement finality. No waiting periods or pending states.' 
            },
            { 
              icon: Shield, 
              title: 'Battle-Tested', 
              desc: 'Native escrow protocol since 2017. No smart contract vulnerabilities.' 
            },
            { 
              icon: Globe, 
              title: 'Global & Cheap', 
              desc: 'Fractions of a cent per transaction. XRP and RLUSD support.' 
            }
          ].map((feature, i) => (
            <Card key={i} className="p-8">
              <feature.icon className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to close your next deal on-ledger?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join the future of trustless coordination. No fees, no custody, pure XRPL.
          </p>
          <Button 
            variant="primary" 
            size="lg"
            icon={wallet ? ArrowRight : Wallet}
            onClick={() => wallet ? setView(ROUTES.CREATE) : connectWallet()}
          >
            {wallet ? 'Create Deal' : 'Connect Wallet to Start'}
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-400 text-center md:text-left">
              © 2026 OLOPA. Built for NUS Fintech Summit Hackathon.
            </div>
            <div className="flex gap-6">
              <button onClick={() => setView(ROUTES.TERMS)} className="text-gray-400 hover:text-white transition-colors">
                Terms
              </button>
              <button onClick={() => setView(ROUTES.PRIVACY)} className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </button>
              <a href="https://github.com" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <Github className="w-4 h-4" /> GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

  // ============================================
  // CREATE DEAL PAGE
  // ============================================

  const CreateDealPage = () => (
    <div className="min-h-screen py-12">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <button 
            onClick={() => setView(ROUTES.HOME)}
            className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition-colors"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Create New Deal</h1>
          <p className="text-gray-400 text-lg">Define your agreement terms and generate an XRPL escrow</p>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            <Input
              label="Deal Title"
              placeholder="e.g., Website Development Project"
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
                  className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border-2 border-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                >
                  {CURRENCIES.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
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
              label="Completion Deadline (days)"
              type="number"
              placeholder="7"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              error={errors.deadline}
              icon={Clock}
            />

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Additional details about the work, deliverables, etc."
                rows={4}
                className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border-2 border-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 placeholder:text-gray-500"
              />
            </div>

            <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-lg">
              <h4 className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                How Escrow Works
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Funds will be locked on XRPL for {formData.deadline || '7'} days. After this time, the freelancer can claim funds. 
                You can cancel if work isn't delivered (requires separate transaction after deadline).
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={createDeal}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating Deal...' : 'Create Deal & Generate Escrow'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  // ============================================
  // DEAL VIEW PAGE
  // ============================================

  const DealPage = () => {
    if (!currentDeal) return null;

    const dealUrl = `https://olopa.app/deal/${currentDeal.id}`;
    const explorerUrl = `https://testnet.xrpl.org/accounts/${currentDeal.creator}`;

    return (
      <div className="min-h-screen py-12">
        <AnimatedBackground />
        
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-8">
            <button 
              onClick={() => setView(
