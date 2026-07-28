"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, CheckCircle, ExternalLink, MessageSquare, FileText, 
  Share2, ShieldCheck, ArrowRight, X, Sparkles
} from 'lucide-react';
import { PricingPackage, CreatorProfile, SocialStat } from '@/types';

export default function PublicProfilePage() {
  const [selectedPackages, setSelectedPackages] = useState<PricingPackage[]>([]);
  const [brandName, setBrandName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  // Load creator data from localStorage (or fallback to empty clean state)
  const [creator, setCreator] = useState<CreatorProfile>({
    id: 'user-default',
    username: 'tuusuario',
    fullName: 'Tu Nombre',
    bio: 'Creador de contenido digital. Conecto marcas con audiencias auténticas.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    niche: 'Tecnología & Lifestyle',
    whatsappNumber: '+50600000000'
  });

  const [stats, setStats] = useState<SocialStat[]>([
    { id: '1', platform: 'instagram', handle: '@tu_instagram', followers: 12500, engagementRate: 4.5, avgReach: 8200, connected: false, lastSynced: 'Nunca' },
    { id: '2', platform: 'tiktok', handle: '@tu_tiktok', followers: 34000, engagementRate: 6.8, avgReach: 24000, connected: false, lastSynced: 'Nunca' },
    { id: '3', platform: 'youtube', handle: '@tu_youtube', followers: 5200, engagementRate: 5.2, avgReach: 4100, connected: false, lastSynced: 'Nunca' }
  ]);

  const [packages, setPackages] = useState<PricingPackage[]>([
    { id: 'pkg-1', userId: 'user-default', title: 'Post / Reel Patrocinado', description: 'Mención de marca y video vertical en feed.', price: 150, currency: 'USD', deliveryDays: 3, active: true },
    { id: 'pkg-2', userId: 'user-default', title: 'Pack Historias (3 Stories)', description: 'Secuencia de 3 historias con enlace swipe-up.', price: 90, currency: 'USD', deliveryDays: 2, active: true }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCreator = localStorage.getItem('reflow_creator');
      if (savedCreator) {
        try { setCreator(JSON.parse(savedCreator)); } catch (e) {}
      }
      const savedStats = localStorage.getItem('reflow_stats');
      if (savedStats) {
        try { setStats(JSON.parse(savedStats)); } catch (e) {}
      }
      const savedPackages = localStorage.getItem('reflow_packages');
      if (savedPackages) {
        try { setPackages(JSON.parse(savedPackages)); } catch (e) {}
      }
    }
  }, []);

  const togglePackageSelection = (pkg: PricingPackage) => {
    if (selectedPackages.some(p => p.id === pkg.id)) {
      setSelectedPackages(selectedPackages.filter(p => p.id !== pkg.id));
    } else {
      setSelectedPackages([...selectedPackages, pkg]);
    }
  };

  const totalPrice = selectedPackages.reduce((sum, p) => sum + p.price, 0);

  const handleWhatsAppQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPackages.length === 0) return;

    const itemsText = selectedPackages.map(p => `• ${p.title} ($${p.price} USD)`).join('\n');
    const message = `Hola ${creator.fullName}! Vi tu perfil en ReFlow y me interesa cotizar la siguiente campaña para la marca *${brandName}* (${contactEmail}):\n\n${itemsText}\n\n*Presupuesto Total Estimado:* $${totalPrice} USD.\n\n¿Estás disponible para colaborar?`;
    
    const whatsappUrl = `https://wa.me/${creator.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    
    setQuoteSuccess(true);
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1000);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-12 px-4 sm:px-6 selection:bg-indigo-500 selection:text-white">
      {/* Top Brand Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-semibold">
          <Zap className="w-4 h-4 text-indigo-400" /> Creado con ReFlow
        </Link>

        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
        >
          <FileText className="w-4 h-4 text-pink-400" /> Descargar Media Kit (PDF)
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative z-10">
          <img
            src={creator.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
            alt={creator.fullName}
            className="w-28 h-28 rounded-3xl object-cover border-4 border-indigo-500/30 shadow-xl"
          />
          <div className="flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{creator.fullName}</h1>
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <p className="text-sm text-indigo-400 font-medium mt-1">@{creator.username} • {creator.niche}</p>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">{creator.bio}</p>
          </div>
        </div>

        {/* Live Social Stats Grid */}
        <div className="space-y-3 relative z-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Estadísticas Verificadas en Vivo</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map(s => (
              <div key={s.platform} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 capitalize">{s.platform}</span>
                  {s.connected && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                </div>
                <div>
                  <div className="text-xl font-black text-white">{s.connected ? s.followers.toLocaleString() : '---'}</div>
                  <div className="text-xs text-indigo-400 mt-1">{s.connected ? `${s.engagementRate}% engagement` : 'Desconectado'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Packages & Quotator Selection */}
        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Paquetes de Colaboración (Selecciona para cotizar)</div>
            <span className="text-xs text-indigo-400 font-medium">{selectedPackages.length} seleccionados</span>
          </div>

          <div className="space-y-3">
            {packages.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No hay paquetes configurados en este perfil.</p>
            ) : (
              packages.map(pkg => {
                const isSelected = selectedPackages.some(p => p.id === pkg.id);
                return (
                  <div
                    key={pkg.id}
                    onClick={() => togglePackageSelection(pkg)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      isSelected 
                        ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-lg mt-0.5 flex items-center justify-center border transition-colors ${
                        isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 bg-slate-900'
                      }`}>
                        {isSelected && <CheckCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{pkg.title}</h3>
                        <p className="text-xs text-slate-400 mt-1">{pkg.description}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-black text-emerald-400">${pkg.price}</div>
                      <div className="text-[10px] text-slate-500">Entrega {pkg.deliveryDays} días</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* WhatsApp Quote Trigger CTA */}
        <div className="pt-4 border-t border-slate-800 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400">Total Estimado Seleccionado:</div>
            <div className="text-2xl font-black text-white">${totalPrice} USD</div>
          </div>

          <button
            onClick={() => setShowQuoteModal(true)}
            disabled={selectedPackages.length === 0}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
          >
            <MessageSquare className="w-5 h-5" /> Cotizar por WhatsApp <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setShowQuoteModal(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-2">Finalizar Cotización</h3>
            <p className="text-xs text-slate-400 mb-6">Ingresa los datos de tu marca para generar el mensaje directo de WhatsApp con {creator.fullName}.</p>

            {quoteSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center space-y-3">
                <CheckCircle className="w-10 h-10 mx-auto" />
                <div className="font-bold text-white">¡Cotización generada con éxito!</div>
                <p className="text-xs text-slate-300">Abriendo WhatsApp Business con el resumen de tu pedido...</p>
              </div>
            ) : (
              <form onSubmit={handleWhatsAppQuote} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Nombre de la Marca / Empresa</label>
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Ej. Nike Latam"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Correo de Contacto</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="marketing@marca.com"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-6 space-y-2">
                    <div className="text-xs text-slate-400 font-semibold">Resumen de selección:</div>
                    {selectedPackages.map(p => (
                      <div key={p.id} className="text-xs text-slate-300 flex justify-between">
                        <span>{p.title}</span>
                        <span className="text-emerald-400">${p.price}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white text-sm">
                      <span>Total:</span>
                      <span className="text-emerald-400">${totalPrice} USD</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> Enviar Mensaje a WhatsApp
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-slate-600">
        ReFlow Media Kit & Sales Hub • Impulsando la economía de creadores.
      </footer>
    </div>
  );
}
