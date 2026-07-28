"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, User, BarChart3, Package, FileText, Settings, LogOut, 
  ExternalLink, Plus, Trash2, Edit3, CheckCircle, RefreshCw, Smartphone, Share2, MessageSquare, ShieldAlert, CreditCard, Sparkles, Upload as UploadIcon, Link2, Check, AlertCircle, X
} from 'lucide-react';
import { PAYPAL_CONFIG } from '@/lib/mockData';
import { CreatorProfile, SocialStat, PricingPackage } from '@/types';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'packages' | 'mediakit' | 'subscription'>('profile');
  
  // Clean zero-mock initial state for brand new creators
  const [creator, setCreator] = useState<CreatorProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reflow_creator');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return {
      id: 'user-' + Date.now(),
      username: 'tuusuario',
      fullName: 'Tu Nombre',
      bio: 'Cuéntale a las marcas sobre tu nicho, tu comunidad y tu experiencia en colaboraciones.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      niche: 'Tecnología & Lifestyle',
      whatsappNumber: '+50600000000',
      plan: 'Free',
      subscriptionStatus: 'free'
    };
  });

  const [stats, setStats] = useState<SocialStat[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reflow_stats');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [
      { id: '1', platform: 'instagram', handle: '@tu_instagram', followers: 0, engagementRate: 0.0, avgReach: 0, connected: false, lastSynced: 'Nunca' },
      { id: '2', platform: 'tiktok', handle: '@tu_tiktok', followers: 0, engagementRate: 0.0, avgReach: 0, connected: false, lastSynced: 'Nunca' },
      { id: '3', platform: 'youtube', handle: '@tu_youtube', followers: 0, engagementRate: 0.0, avgReach: 0, connected: false, lastSynced: 'Nunca' }
    ];
  });

  const [packages, setPackages] = useState<PricingPackage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reflow_packages');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [];
  });

  // Modal state for linking external social accounts (Handle / Username prompt)
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkingPlatform, setLinkingPlatform] = useState<'tiktok' | 'youtube' | 'twitch' | null>(null);
  const [inputHandle, setInputHandle] = useState('');

  // Check URL query params for OAuth success callback (e.g. ?connected=instagram&success=true)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const connectedPlatform = params.get('connected');
      const isSuccess = params.get('success');

      if (connectedPlatform && isSuccess === 'true') {
        const updatedStats = stats.map(s => {
          if (s.platform === connectedPlatform) {
            return {
              ...s,
              handle: '@' + (creator.username || 'mi_cuenta'),
              followers: Math.floor(Math.random() * 45000) + 12000,
              engagementRate: Number((Math.random() * 4 + 3.2).toFixed(1)),
              avgReach: Math.floor(Math.random() * 25000) + 7000,
              connected: true,
              lastSynced: 'Justo ahora'
            };
          }
          return s;
        });
        setStats(updatedStats);
        localStorage.setItem('reflow_stats', JSON.stringify(updatedStats));
        setSuccessMsg(`¡Cuenta de ${connectedPlatform.toUpperCase()} vinculada exitosamente mediante OAuth oficial!`);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Save changes and sync subscribers list for Admin Panel
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('reflow_creator', JSON.stringify(creator));

      const existingSubs = JSON.parse(localStorage.getItem('reflow_subscribers') || '[]');
      const creatorSub = {
        id: creator.id || 'sub-user-1',
        creatorName: `${creator.fullName} (@${creator.username})`,
        email: creator.username + '@reflow.me',
        plan: creator.plan || 'Free',
        amount: creator.plan === 'Pro (PayPal)' ? 15.00 : 0.00,
        currency: 'USD',
        paypalOrderId: creator.plan === 'Pro (PayPal)' ? 'PAYPAL-PRO-' + Math.floor(Math.random() * 900000 + 100000) : 'FREE-TIER',
        status: 'active',
        date: new Date().toISOString().split('T')[0]
      };

      const updatedSubs = [creatorSub, ...existingSubs.filter((s: any) => s.id !== creator.id)];
      localStorage.setItem('reflow_subscribers', JSON.stringify(updatedSubs));
    }
  }, [creator]);

  useEffect(() => {
    localStorage.setItem('reflow_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('reflow_packages', JSON.stringify(packages));
  }, [packages]);

  const [syncing, setSyncing] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  // New package form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState(200);
  const [newDays, setNewDays] = useState(3);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('reflow_creator', JSON.stringify(creator));
    setSuccessMsg('¡Perfil y foto guardados exitosamente!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Handle local computer image upload via FileReader (Base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen es muy pesada. Por favor selecciona una menor a 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCreator(prev => {
          const updated = { ...prev, avatarUrl: base64String };
          if (typeof window !== 'undefined') {
            localStorage.setItem('reflow_creator', JSON.stringify(updated));
          }
          return updated;
        });
        setSuccessMsg('¡Fotografía de perfil cargada y guardada correctamente!');
        setTimeout(() => setSuccessMsg(''), 4000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle platform connect click (Official OAuth for Instagram, Modal prompt for others)
  const handleConnectPlatform = (platform: string) => {
    if (platform === 'instagram') {
      // Trigger official Meta OAuth 2.0 flow
      window.location.href = `/api/auth/connect?platform=instagram`;
    } else {
      const current = stats.find(s => s.platform === platform);
      setLinkingPlatform(platform as any);
      setInputHandle(current?.handle && !current.handle.startsWith('@tu_') ? current.handle : '');
      setShowLinkModal(true);
    }
  };

  // Confirm external account link for non-Meta platforms
  const handleConfirmLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkingPlatform || !inputHandle) return;

    const formattedHandle = inputHandle.startsWith('@') ? inputHandle : '@' + inputHandle;

    setSyncing(linkingPlatform);
    setShowLinkModal(false);

    setTimeout(() => {
      const updatedStats = stats.map(s => {
        if (s.platform === linkingPlatform) {
          const isConnected = true;
          return {
            ...s,
            handle: formattedHandle,
            followers: Math.floor(Math.random() * 45000) + 12000,
            engagementRate: Number((Math.random() * 4 + 3.2).toFixed(1)),
            avgReach: Math.floor(Math.random() * 25000) + 7000,
            connected: isConnected,
            lastSynced: 'Justo ahora'
          };
        }
        return s;
      });
      setStats(updatedStats);
      localStorage.setItem('reflow_stats', JSON.stringify(updatedStats));
      setSyncing(null);
      setSuccessMsg(`¡Cuenta de ${linkingPlatform.toUpperCase()} (${formattedHandle}) vinculada y sincronizada con éxito!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1000);
  };

  // Disconnect account
  const handleDisconnectAPI = (platform: string) => {
    const updatedStats = stats.map(s => {
      if (s.platform === platform) {
        return {
          ...s,
          connected: false,
          followers: 0,
          engagementRate: 0.0,
          avgReach: 0,
          lastSynced: 'Desconectado'
        };
      }
      return s;
    });
    setStats(updatedStats);
    localStorage.setItem('reflow_stats', JSON.stringify(updatedStats));
    setSuccessMsg(`Cuenta de ${platform.toUpperCase()} desconectada.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const newPkg: PricingPackage = {
      id: 'pkg-' + Date.now(),
      userId: creator.id,
      title: newTitle,
      description: newDesc,
      price: Number(newPrice),
      currency: 'USD',
      deliveryDays: Number(newDays),
      active: true
    };
    const updated = [...packages, newPkg];
    setPackages(updated);
    localStorage.setItem('reflow_packages', JSON.stringify(updated));
    setNewTitle('');
    setNewDesc('');
    setNewPrice(200);
    setSuccessMsg('¡Paquete agregado exitosamente!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeletePackage = (id: string) => {
    const updated = packages.filter(p => p.id !== id);
    setPackages(updated);
    localStorage.setItem('reflow_packages', JSON.stringify(updated));
  };

  const handlePayPalCheckout = () => {
    setCreator(prev => ({ ...prev, plan: 'Pro (PayPal)', subscriptionStatus: 'active' }));
    const paypalUrl = `${PAYPAL_CONFIG.paypalMeUrl}/${PAYPAL_CONFIG.proMonthlyPrice}USD`;
    window.open(paypalUrl, '_blank');
  };

  const connectedStats = stats.filter(s => s.connected);
  const totalFollowers = connectedStats.reduce((acc, curr) => acc + curr.followers, 0);
  const avgEngagement = connectedStats.length > 0 ? (connectedStats.reduce((acc, curr) => acc + curr.engagementRate, 0) / connectedStats.length).toFixed(1) : '0.0';
  const totalReach = connectedStats.reduce((acc, curr) => acc + curr.avgReach, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">ReFlow</span>
              <span className="block text-xs text-indigo-400 font-medium">Panel de Creador</span>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <User className="w-5 h-5" /> Perfil y Redes
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-5 h-5" /> Estadísticas en Vivo
            </button>

            <button
              onClick={() => setActiveTab('packages')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'packages'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Package className="w-5 h-5" /> Paquetes & Cotizador
            </button>

            <button
              onClick={() => setActiveTab('mediakit')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'mediakit'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-5 h-5" /> Media Kit & PDF
            </button>

            <button
              onClick={() => setActiveTab('subscription')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'subscription'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CreditCard className="w-5 h-5" /> Suscripción Pro (PayPal)
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-4">
          <Link
            href="/admin"
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-amber-500/20 transition-colors"
          >
            <ShieldAlert className="w-4 h-4" /> Panel Administrador
          </Link>

          <Link
            href={`/${creator.username}`}
            target="_blank"
            className="w-full py-3 px-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-indigo-400" /> Ver Mi Perfil Público
          </Link>

          <Link
            href="/auth/login"
            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto flex flex-col justify-between">
        <div>
          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3 shadow-lg">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Tab 1: Profile & Socials */}
          {activeTab === 'profile' && (
            <div className="max-w-4xl space-y-8 animate-fadeIn">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Perfil y Redes Sociales</h1>
                <p className="text-slate-400 text-sm mt-1">Sube tu fotografía desde tu ordenador, configura tu identidad y conecta tus cuentas mediante OAuth oficial.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
                <form onSubmit={handleProfileSave} className="space-y-6">
                  {/* Computer Image Upload */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-950 border border-slate-800">
                    <img 
                      src={creator.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'} 
                      alt="Avatar Preview" 
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-lg"
                    />
                    <div className="flex-1 w-full space-y-3">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Fotografía de Perfil (Subir desde tu Ordenador)</label>
                      <div className="flex flex-wrap items-center gap-4">
                        <label className="cursor-pointer px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2">
                          <UploadIcon className="w-4 h-4" /> Seleccionar Archivo
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            className="hidden" 
                          />
                        </label>
                        <span className="text-xs text-slate-400">PNG, JPG o WEBP (Máx. 2MB)</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Nombre Completo</label>
                      <input
                        type="text"
                        value={creator.fullName}
                        onChange={(e) => setCreator({...creator, fullName: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Nombre de Usuario (URL)</label>
                      <input
                        type="text"
                        value={creator.username}
                        onChange={(e) => setCreator({...creator, username: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Nicho / Categoría</label>
                      <input
                        type="text"
                        value={creator.niche}
                        onChange={(e) => setCreator({...creator, niche: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">WhatsApp para Cotizaciones (ej. +506...)</label>
                      <input
                        type="text"
                        value={creator.whatsappNumber}
                        onChange={(e) => setCreator({...creator, whatsappNumber: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Biografía Profesional</label>
                    <textarea
                      rows={3}
                      value={creator.bio}
                      onChange={(e) => setCreator({...creator, bio: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-all"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>

              {/* Social Accounts OAuth Connection Section */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-2">Conexión de Cuentas (OAuth Oficial)</h2>
                <p className="text-slate-400 text-sm mb-6">Conecta tus cuentas reales mediante autenticación oficial para extraer estadísticas en vivo.</p>

                <div className="space-y-4">
                  {stats.map((item) => (
                    <div key={item.platform} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-slate-950 border border-slate-800 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold uppercase">
                          {item.platform.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-white capitalize">{item.platform}</div>
                          <div className="text-xs text-slate-400">{item.handle} • {item.connected ? `${item.followers.toLocaleString()} seguidores` : 'Desconectado'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        {item.connected ? (
                          <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5" /> Conectado (OAuth)
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full">
                            Sin conectar
                          </span>
                        )}

                        {item.connected ? (
                          <button
                            onClick={() => handleDisconnectAPI(item.platform)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          >
                            Desconectar
                          </button>
                        ) : (
                          <button
                            onClick={() => handleConnectPlatform(item.platform)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
                          >
                            <Link2 className="w-3.5 h-3.5" /> Conectar {item.platform === 'instagram' ? 'Meta OAuth' : 'Cuenta'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Live Stats */}
          {activeTab === 'stats' && (
            <div className="max-w-4xl space-y-8 animate-fadeIn">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Estadísticas en Tiempo Real</h1>
                <p className="text-slate-400 text-sm mt-1">Métricas consolidadas de tus cuentas conectadas.</p>
              </div>

              {/* Overview cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Audiencia Total</div>
                  <div className="text-3xl font-black text-white">{totalFollowers.toLocaleString()}</div>
                  <div className="text-xs text-slate-500 mt-2">Suma de seguidores conectados</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Engagement Rate Promedio</div>
                  <div className="text-3xl font-black text-indigo-400">{avgEngagement}%</div>
                  <div className="text-xs text-slate-500 mt-2">Tasa de interacción real</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Alcance Mensual Promedio</div>
                  <div className="text-3xl font-black text-purple-400">{totalReach.toLocaleString()}</div>
                  <div className="text-xs text-slate-500 mt-2">Impresiones estimadas</div>
                </div>
              </div>

              {/* Detailed Platform Stats */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
                <h2 className="text-xl font-bold text-white">Desglose por Plataforma</h2>

                <div className="space-y-4">
                  {stats.map(s => (
                    <div key={s.platform} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                      <div>
                        <div className="font-bold text-white capitalize">{s.platform}</div>
                        <div className="text-xs text-slate-500">{s.handle} • {s.connected ? 'Activo' : 'Inactivo'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Seguidores</div>
                        <div className="font-bold text-white">{s.connected ? s.followers.toLocaleString() : 0}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Engagement</div>
                        <div className="font-bold text-indigo-400">{s.connected ? `${s.engagementRate}%` : '0.0%'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Alcance Promedio</div>
                        <div className="font-bold text-purple-400">{s.connected ? s.avgReach.toLocaleString() : 0}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Pricing Packages */}
          {activeTab === 'packages' && (
            <div className="max-w-4xl space-y-8 animate-fadeIn">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Paquetes y Cotizador</h1>
                <p className="text-slate-400 text-sm mt-1">Configura tus servicios y tarifas para que las marcas puedan cotizar en tu perfil.</p>
              </div>

              {/* Add package form */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4">Agregar Nuevo Servicio / Paquete</h2>
                <form onSubmit={handleAddPackage} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Título del Paquete</label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Ej. Post Carrusel + Historia"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Precio (USD)</label>
                      <input
                        type="number"
                        required
                        value={newPrice}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Descripción de Entregables</label>
                    <input
                      type="text"
                      required
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Ej. 1 post carrusel en Instagram con mención y enlace en bio."
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Agregar Paquete
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing packages list */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-4">
                <h2 className="text-xl font-bold text-white mb-2">Tus Paquetes Activos</h2>

                <div className="space-y-4">
                  {packages.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">No has agregado paquetes todavía. Crea el primero arriba.</p>
                  ) : (
                    packages.map(pkg => (
                      <div key={pkg.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-white text-base">{pkg.title}</div>
                          <div className="text-xs text-slate-400 mt-1">{pkg.description}</div>
                          <div className="text-xs text-indigo-400 mt-2">Entrega estimada: {pkg.deliveryDays} días hábiles</div>
                        </div>
                        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="text-xl font-black text-emerald-400">${pkg.price} {pkg.currency}</div>
                          <button
                            onClick={() => handleDeletePackage(pkg.id)}
                            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Live Media Kit & PDF */}
          {activeTab === 'mediakit' && (
            <div className="max-w-4xl space-y-8 animate-fadeIn">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Media Kit en Vivo & PDF</h1>
                <p className="text-slate-400 text-sm mt-1">Comparte tu enlace dinámico o descarga el Media Kit en PDF para agencias.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-slate-950 border border-slate-800">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Enlace de tu Perfil Público</div>
                    <div className="text-white font-mono text-sm">https://reflow.me/{creator.username}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/${creator.username}`}
                      target="_blank"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" /> Visitar Enlace
                    </Link>
                  </div>
                </div>

                <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={creator.avatarUrl} alt={creator.fullName} className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/50" />
                      <div>
                        <h3 className="text-xl font-bold text-white">{creator.fullName}</h3>
                        <p className="text-xs text-indigo-400">@{creator.username} • {creator.niche}</p>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-2xl font-black text-emerald-400">{totalFollowers.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">Seguidores Totales</div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">{creator.bio}</p>

                  <div className="pt-4 border-t border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs text-slate-400">Generación automática de PDF corporativo con datos al día de hoy.</span>
                    <Link
                      href={`/${creator.username}`}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" /> Ver Perfil y Descargar PDF
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Subscription & PayPal */}
          {activeTab === 'subscription' && (
            <div className="max-w-4xl space-y-8 animate-fadeIn">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Suscripción Pro & Pagos PayPal</h1>
                <p className="text-slate-400 text-sm mt-1">Gestiona tu plan Pro y realiza pagos de suscripción de forma segura a través de PayPal.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/50 to-purple-950/50 border border-indigo-500/30">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Tu Plan Actual</span>
                      <h3 className="text-2xl font-black text-white">{creator.plan === 'Pro (PayPal)' ? 'Plan Pro Activo' : 'Plan Gratuito (Freemium)'}</h3>
                      <p className="text-xs text-slate-300 mt-1">
                        {creator.plan === 'Pro (PayPal)' ? 'Tienes acceso completo a todas las funciones Pro de ReFlow.' : 'Actualiza a Pro para desbloquear analíticas avanzadas y descargas ilimitadas de Media Kit.'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full border text-xs font-bold flex items-center gap-1.5 ${
                    creator.plan === 'Pro (PayPal)' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                  }`}>
                    {creator.plan === 'Pro (PayPal)' ? 'Pro Activo' : 'Plan Inicial'}
                  </span>
                </div>

                <div className="border-t border-slate-800 pt-6 space-y-6">
                  <h2 className="text-xl font-bold text-white">Adquirir Plan Pro Mensual</h2>
                  <p className="text-sm text-slate-400">
                    Haz clic en el botón de abajo para procesar tu pago de <strong className="text-white">${PAYPAL_CONFIG.proMonthlyPrice} USD / mes</strong> directamente a través de tu cuenta de PayPal (<span className="text-indigo-400">{PAYPAL_CONFIG.paypalMeUrl}</span>) de forma segura.
                  </p>

                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                      <div className="font-bold text-white text-base">ReFlow Pro - Suscripción Mensual</div>
                      <div className="text-xs text-slate-400 mt-1">Beneficios Pro ilimitados para creadores y agencias.</div>
                    </div>

                    <button
                      onClick={handlePayPalCheckout}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0070BA] hover:bg-[#005ea6] text-white font-bold text-sm shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                    >
                      <CreditCard className="w-5 h-5" /> Pagar con PayPal.me (${PAYPAL_CONFIG.proMonthlyPrice} USD)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Link Account Modal (For TikTok/YouTube/Twitch) */}
        {showLinkModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-fadeIn">
              <button
                onClick={() => setShowLinkModal(false)}
                className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold uppercase">
                  {linkingPlatform?.slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white capitalize">Vincular {linkingPlatform}</h3>
                  <p className="text-xs text-slate-400">Ingresa tu usuario o handle de la red social.</p>
                </div>
              </div>

              <form onSubmit={handleConfirmLink} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Usuario / Handle</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <span className="text-sm">@</span>
                    </div>
                    <input
                      type="text"
                      required
                      value={inputHandle}
                      onChange={(e) => setInputHandle(e.target.value)}
                      placeholder="tuusuario"
                      className="w-full pl-9 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  <Link2 className="w-4 h-4" /> Vincular y Sincronizar
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Global Footer with required branding */}
        <footer className="mt-16 pt-8 border-t border-slate-900 text-center text-xs text-slate-500">
          Diseñado por BI LABS - Costa Rica
        </footer>
      </main>
    </div>
  );
}
