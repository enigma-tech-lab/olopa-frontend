import React, { useState, useCallback, useEffect } from 'react';
import { 
  Wallet, Shield, CheckCircle, Clock, ArrowRight, 
  FileText, AlertCircle, Copy, Zap, Lock, Users, Share2
} from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

const API_URL = import.meta.env.VITE_API_URL || 'https://olopa-backend-2.onrender.com';

const ROUTES = { HOME: 'home', CREATE: 'create', DEAL: 'deal', DOCS: 'docs' };
const DEAL_STATUS = { PENDING: 'pending', SIGNED: 'signed', FUNDED: 'funded', COMPLETED: 'completed' };
const DEAL_ROLES = { CLIENT: 'client', FREELANCER: 'freelancer', VIEWER: 'viewer' };

// Components moved outside to prevent re-render issues
const Button = ({ children, variant = 'primary', size = 'md', className = '', icon: Icon, ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
    outline: 'border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10',
    success: 'bg-green-600 hover:bg-green-700 text-white'
  };
  
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3', lg: 'px-8 py-4 text-lg' };

  return (
    <button 
      className={`font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 ${className}`}>
    {children}
  </div>
);

const Input = ({ label, error, icon: Icon, ...props }) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-semibold text-gray-300">{label}</label>}
    <div className="relative">
      {Icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Icon className="w-5 h-5" /></div>}
      <input
        className={`w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border-2 transition-all ${Icon ? 'pl-12' : ''} ${error ? 'border-red-500' : 'border-slate-600 focus:border-cyan-500'} focus:outline-none placeholder:text-gray-500`}
        {...props}
      />
    </div>
    {error && <p className="text-red-400 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</p>}
  </div>
);

const StatusBadge = ({ status }) => {
  const config = {
    [DEAL_STATUS.PENDING]: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50', icon: Clock, label: 'Awaiting Signatures' },
    [DEAL_STATUS.SIGNED]: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50', icon: Users, label: 'Signed - Ready to Fund' },
    [DEAL_STATUS.FUNDED]: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50', icon: Lock, label: 'Funded - In Escrow' },
    [DEAL_STATUS.COMPLETED]: { bg: 'bg-green-600/20', text: 'text-green-500', border: 'border-green-600/50', icon: CheckCircle, label: 'Completed' }
  };
  const { bg, text, border, icon: Icon, label } = config[status] || config[DEAL_STATUS.PENDING];
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${bg} ${text} ${border}`}>
      <Icon className="w-4 h-4" />{label}
    </span>
  );
};

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="flex items-center gap-2 px-3 py-2 text-sm text-cyan-400 hover:text-cyan-300 bg-slate-700/50 rounded-lg">
      {copied ? <><CheckCircle className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy Link</>}
    </button>
  );
};

const Header = ({ wallet, loading, connectWallet, disconnectWallet, setView }) => (
  <header className="sticky top-0 z-40 backdrop-blur-lg bg-slate-900/90 border-b border-slate-700/50">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <button onClick={() => setView(ROUTES.HOME)} className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-cyan-400" />
        <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">OLOPA</span>
      </button>
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
  </header>
);

const HomePage = ({ wallet, setView, connectWallet }) => (
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
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Settle on-ledger.</span>
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          OLOPA is the trust layer for P2P agreements on XRPL. Non-custodial escrow with cryptographic signatures.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" icon={ArrowRight} onClick={() => wallet ? setView(ROUTES.CREATE) : connectWallet()}>
            Create Your First Deal
          </Button>
          <Button variant="outline" size="lg" icon={FileText} onClick={() => setView(ROUTES.DOCS)}>
            Documentation
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
          {[
            { value: '0%', label: 'Platform Fees' },
            { value: '3-5s', label: 'Settlement' },
            { value: '$0.0001', label: 'TX Cost' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

const CreateDealPage = ({ wallet, setView, createDeal, formData, setFormData, errors, loading }) => (
  <div className="min-h-screen py-12">
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
    <div className="container mx-auto px-4 max-w-3xl">
      <button onClick={() => setView(ROUTES.HOME)} className="text-gray-400 hover:text-white mb-4">← Back</button>
      <h1 className="text-4xl font-bold text-white mb-8">Create New Deal</h1>
      <Card className="p-8">
        <div className="space-y-6">
          <Input
            label="Deal Title"
            placeholder="Website Development Project"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
            error={errors.title}
            icon={FileText}
          />
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Amount"
              type="number"
              placeholder="500"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({...prev, amount: e.target.value}))}
              error={errors.amount}
            />
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({...prev, currency: e.target.value}))}
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
            onChange={(e) => setFormData(prev => ({...prev, freelancerAddress: e.target.value}))}
            error={errors.freelancerAddress}
            icon={Wallet}
          />
          <Input
            label="Deadline (days)"
            type="number"
            placeholder="7"
            value={formData.deadline}
            onChange={(e) => setFormData(prev => ({...prev, deadline: e.target.value}))}
            error={errors.deadline}
            icon={Clock}
          />
          <Button variant="primary" size="lg" onClick={createDeal} disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Deal'}
          </Button>
        </div>
      </Card>
    </div>
  </div>
);

const DealPage = ({ deal, userRole, wallet, setView, signDeal, fundEscrow, loading }) => {
  if (!deal) return null;

  const dealUrl = `${window.location.origin}/?deal=${deal.id}`;
  const clientSigned = deal.signatures?.client;
  const freelancerSigned = deal.signatures?.freelancer;
  const bothSigned = clientSigned && freelancerSigned;

  return (
    <div className="min-h-screen py-12">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
      <div className="container mx-auto px-4 max-w-4xl">
        <button onClick={() => setView(ROUTES.HOME)} className="text-gray-400 hover:text-white mb-6">← Back</button>
        
        <Card className="p-8 mb-6">
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{deal.title}</h1>
              <StatusBadge status={deal.status} />
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-cyan-400">{deal.amount} {deal.currency}</div>
              <div className="text-gray-400 text-sm mt-1">{deal.deadline} days deadline</div>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-700 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Client:</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono">{deal.creator.slice(0, 10)}...{deal.creator.slice(-6)}</span>
                {clientSigned && <CheckCircle className="w-5 h-5 text-green-400" />}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Freelancer:</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono">{deal.freelancerAddress.slice(0, 10)}...{deal.freelancerAddress.slice(-6)}</span>
                {freelancerSigned && <CheckCircle className="w-5 h-5 text-green-400" />}
              </div>
            </div>
            {deal.escrowTxHash && (
              <div className="flex justify-between">
                <span className="text-gray-400">Escrow TX:</span>
                <a href={`https://testnet.xrpl.org/transactions/${deal.escrowTxHash}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-mono">
                  {deal.escrowTxHash.slice(0, 10)}...
                </a>
              </div>
            )}
          </div>
        </Card>

        {/* Share Card */}
        {userRole === DEAL_ROLES.CLIENT && deal.status === DEAL_STATUS.PENDING && (
          <Card className="p-6 mb-6 bg-blue-900/20 border-blue-500/30">
            <div className="flex items-start gap-4">
              <Share2 className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">Share with Freelancer</h3>
                <p className="text-gray-300 text-sm mb-4">Send this link to the freelancer to review and sign the deal:</p>
                <div className="bg-slate-800 p-3 rounded-lg mb-3">
                  <code className="text-cyan-400 text-sm break-all">{dealUrl}</code>
                </div>
                <CopyButton text={dealUrl} />
              </div>
            </div>
          </Card>
        )}

        {/* Action Cards */}
        {userRole === DEAL_ROLES.CLIENT && !clientSigned && (
          <Card className="p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Sign Agreement</h3>
            <p className="text-gray-300 mb-4">Sign this deal to confirm the terms. The freelancer will also need to sign.</p>
            <Button variant="primary" onClick={signDeal} disabled={loading}>
              {loading ? 'Signing...' : 'Sign as Client'}
            </Button>
          </Card>
        )}

        {userRole === DEAL_ROLES.FREELANCER && !freelancerSigned && (
          <Card className="p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Review & Sign</h3>
            <p className="text-gray-300 mb-4">Review the deal terms above. If you agree, sign to accept this work agreement.</p>
            <Button variant="primary" onClick={signDeal} disabled={loading}>
              {loading ? 'Signing...' : 'Sign as Freelancer'}
            </Button>
          </Card>
        )}

        {userRole === DEAL_ROLES.CLIENT && bothSigned && deal.status === DEAL_STATUS.SIGNED && (
          <Card className="p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Fund Escrow</h3>
            <p className="text-gray-300 mb-4">Both parties have signed. Lock {deal.amount} {deal.currency} in XRPL escrow to activate the deal.</p>
            <Button variant="success" icon={Lock} onClick={fundEscrow} disabled={loading}>
              {loading ? 'Creating Escrow...' : 'Fund Escrow on XRPL'}
            </Button>
          </Card>
        )}

        {deal.status === DEAL_STATUS.FUNDED && (
          <Card className="p-6 bg-green-900/20 border-green-500/30">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-green-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Funds Locked in Escrow</h3>
                <p className="text-gray-300 text-sm mt-1">The funds are secured on XRPL and will auto-release after the deadline.</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [view, setView] = useState(ROUTES.HOME);
  const [wallet, setWallet] = useState(null);
  const [currentDeal, setCurrentDeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(DEAL_ROLES.VIEWER);
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    currency: 'XRP',
    freelancerAddress: '',
    deadline: '7'
  });
  const [errors, setErrors] = useState({});

  // Check URL for deal ID on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dealId = params.get('deal');
    if (dealId) {
      // In real app, fetch deal from backend
      // For now, use mock data
      loadDealFromUrl(dealId);
    }
  }, []);

  // Determine user role when deal or wallet changes
  useEffect(() => {
    if (!currentDeal || !wallet) {
      setUserRole(DEAL_ROLES.VIEWER);
      return;
    }
    if (wallet.address === currentDeal.creator) {
      setUserRole(DEAL_ROLES.CLIENT);
    } else if (wallet.address === currentDeal.freelancerAddress) {
      setUserRole(DEAL_ROLES.FREELANCER);
    } else {
      setUserRole(DEAL_ROLES.VIEWER);
    }
  }, [currentDeal, wallet]);

  const loadDealFromUrl = (dealId) => {
    // Mock: In production, fetch from backend/storage
    const mockDeal = {
      id: dealId,
      title: 'Website Development',
      amount: '500',
      currency: 'XRP',
      creator: 'rN7n7otQDd6FczFgLdlqtyMVrn3HMtthP4',
      freelancerAddress: 'rLHzPsX6oXkzU9fNZmPEd7ks9TKmfD1Fqv',
      deadline: '7',
      status: DEAL_STATUS.PENDING,
      signatures: { client: false, freelancer: false }
    };
    setCurrentDeal(mockDeal);
    setView(ROUTES.DEAL);
  };

  const connectWallet = useCallback(async () => {
    setLoading(true);
    setTimeout(() => {
      setWallet({ address: 'rN7n7otQDd6FczFgLdlqtyMVrn3HMtthP4', verified: true });
      setLoading(false);
    }, 1000);
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet(null);
    setView(ROUTES.HOME);
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount required';
    if (!formData.freelancerAddress.trim()) newErrors.freelancerAddress = 'Address required';
    if (!formData.deadline || parseInt(formData.deadline) < 1) newErrors.deadline = 'Min 1 day';
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
      signatures: { client: false, freelancer: false }
    };
    
    setTimeout(() => {
      setCurrentDeal(deal);
      window.history.pushState({}, '', `?deal=${deal.id}`);
      setView(ROUTES.DEAL);
      setLoading(false);
      setFormData({ title: '', amount: '', currency: 'XRP', freelancerAddress: '', deadline: '7' });
    }, 1000);
  }, [formData, wallet, validateForm]);

  const signDeal = useCallback(() => {
    if (!wallet || !currentDeal) return;
    setLoading(true);
    
    setTimeout(() => {
      const updated = { ...currentDeal };
      if (userRole === DEAL_ROLES.CLIENT) {
        updated.signatures.client = true;
      } else if (userRole === DEAL_ROLES.FREELANCER) {
        updated.signatures.freelancer = true;
      }
      
      if (updated.signatures.client && updated.signatures.freelancer) {
        updated.status = DEAL_STATUS.SIGNED;
      }
      
      setCurrentDeal(updated);
      setLoading(false);
    }, 1500);
  }, [currentDeal, userRole, wallet]);

  const fundEscrow = useCallback(() => {
    if (!currentDeal) return;
    setLoading(true);
    
    setTimeout(() => {
      setCurrentDeal(prev => ({
        ...prev,
        status: DEAL_STATUS.FUNDED,
        escrowTxHash: 'E3FE6EA3D48F0C2B639448020EA4F03D4F4F8FFDB243A852A0F59177921B4879'
      }));
      setLoading(false);
    }, 2000);
  }, [currentDeal]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-3 text-center sticky top-0 z-50">
        <div className="flex items-center justify-center gap-2 text-sm font-semibold">
          <AlertCircle className="w-4 h-4" />
          <span>BETA: Non-custodial. Use at your own risk.</span>
        </div>
      </div>

      <Header 
        wallet={wallet}
        loading={loading}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        setView={setView}
      />
      
      {view === ROUTES.HOME && <HomePage wallet={wallet} setView={setView} connectWallet={connectWallet} />}
      {view === ROUTES.CREATE && <CreateDealPage wallet={wallet} setView={setView} createDeal={createDeal} formData={formData} setFormData={setFormData} errors={errors} loading={loading} />}
      {view === ROUTES.DEAL && <DealPage deal={currentDeal} userRole={userRole} wallet={wallet} setView={setView} signDeal={signDeal} fundEscrow={fundEscrow} loading={loading} />}
      <Analytics />
    </div>
  );
          }
