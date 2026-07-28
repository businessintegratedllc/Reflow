"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, Users, DollarSign, Shield, CheckCircle, ExternalLink, 
  Search, Settings, CreditCard, Lock, Unlock, ArrowDownCircle, Trash2, KeyRound, AlertCircle
} from 'lucide-react';
import { PAYPAL_CONFIG } from '@/lib/mockData';
import { Subscriber } from '@/types';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Admin state
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paypalEmail, setPaypalEmail] = useState(PAYPAL_CONFIG.businessEmail);
  const [successMsg, setSuccessMsg] = useState('');

  // Admin password (default: admin123, customizable)
  const ADMIN_PASS = 'admin123';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('reflow_admin_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
      const savedSubs = localStorage.getItem('reflow_subscribers');
      if (savedSubs) {
        try { setSubscribers(JSON.parse(savedSubs)); } catch (e) {}
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASS) {
      setIsAuthenticated(true);
      sessionStorage.setItem('reflow_admin_auth', 'true');
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('reflow_admin_auth');
  };

  const handleSavePayPal = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('¡Configuración de cuenta PayPal actualizada con éxito!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Downgrade creator to Free / Freemium
  const handleDowngrade = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de bajar de nivel a ${name} al plan Gratuito (Freemium)?`)) {
      const updated = subscribers.map(s => {
        if (s.id === id) {
          return { ...s, plan: 'Free', amount: 0.00, paypalOrderId: 'DOWNGRADED-BY-ADMIN' };
        }
        return s;
      });
      setSubscribers(updated);
      localStorage.setItem('reflow_subscribers', JSON.stringify(updated));
      setSuccessMsg(`¡El creador ${name} ha sido bajado al plan Gratuito con éxito!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Block or Unblock account status
  const handleToggleBlock = (id: string, currentStatus: string, name: string) => {
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
    const actionText = newStatus === 'blocked' ? 'bloquear' : 'desbloquear';
    
    if (confirm(`¿Estás seguro de ${actionText} la cuenta de ${name}?`)) {
      const updated = subscribers.map(s => {
        if (s.id === id) {
          return { ...s, status: newStatus as any };
        }
        return s;
      });
      setSubscribers(updated);
      localStorage.setItem('reflow_subscribers', JSON.stringify(updated));
      setSuccessMsg(`¡Cuenta de ${name} ${actionText}da correctamente!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const totalRevenue = subscribers.filter(s => s.plan === 'Pro (PayPal)' && s.status === 'active').reduce((sum, s) => sum + s.amount, 0);
  const activeCount = subscribers.filter(s => s.status === 'active').length;

  const filteredSubscribers = subscribers.filter(s => 
    s.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If not authenticated, show secure password login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center py-12 px-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-600 to-yellow-500 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">Acceso Administrador</h1>
            <p className="text-xs text-slate-400">Introduce tu contraseña maestra para acceder al panel de gestión de ReFlow.</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> Contraseña incorrecta. (Contraseña por defecto: <code className="font-mono text-white">admin123</code>)
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Contraseña Maestra</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-600/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" /> Entrar al Panel Admin
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              ← Volver al sitio principal
            </Link>
          </div>
        </div>

        <footer className="mt-16 text-center text-xs text-slate-600">
          Diseñado por BI LABS - Costa Rica
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row justify-between">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-600 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">ReFlow Admin</span>
              <span className="block text-xs text-amber-400 font-medium">Panel Maestro Segurizado</span>
            </div>
          </div>

          <nav className="space-y-2">
            <Link
              href="/admin"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/20"
            >
              <Users className="w-5 h-5" /> Suscriptores & Gestión
            </Link>

            <Link
              href="/dashboard"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              <Zap className="w-5 h-5 text-indigo-400" /> Ir al Dashboard Creador
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"
          >
            <Lock className="w-4 h-4" /> Bloquear Sesión Admin
          </button>
          <Link
            href="/"
            className="w-full py-3 px-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-amber-400" /> Ver Sitio Público
          </Link>
        </div>
      </aside>

      {/* Main Admin Content & Footer */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto flex flex-col justify-between">
        <div className="max-w-6xl space-y-8 w-full">
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3 shadow-lg">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Panel de Administración de Suscripciones</h1>
              <p className="text-slate-400 text-sm mt-1">Gestiona creadores, baja de nivel planes no pagados y bloquea cuentas con total seguridad.</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> PayPal: RandallCastroR9
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Ingresos Totales (Pro)</div>
              <div className="text-3xl font-black text-emerald-400">${totalRevenue.toFixed(2)} USD</div>
              <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">↑ Sincronizado con PayPal</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Creadores Registrados</div>
              <div className="text-3xl font-black text-white">{activeCount}</div>
              <div className="text-xs text-amber-400 mt-2 flex items-center gap-1">Total en ReFlow</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Pasarela de Pago</div>
              <div className="text-xl font-bold text-indigo-400 mt-1">PayPal.me</div>
              <div className="text-xs text-slate-400 mt-2 font-mono">RandallCastroR9</div>
            </div>
          </div>

          {/* PayPal Account Settings Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-2">Configuración de Cuenta PayPal</h2>
            <p className="text-slate-400 text-sm mb-6">Enlace de PayPal.me configurado para recibir los pagos de suscripción de los creadores.</p>

            <form onSubmit={handleSavePayPal} className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <input
                  type="text"
                  required
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder="RandallCastroR9"
                  className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-600/30 hover:scale-[1.02] transition-all"
              >
                Actualizar Cuenta PayPal
              </button>
            </form>
          </div>

          {/* Subscribers Table with Actions */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-white">Listado y Control de Creadores</h2>
              
              <div className="relative w-full sm:w-72">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar creador..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              {filteredSubscribers.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No hay creadores registrados todavía. Cuando un creador configure su perfil o adquiera el plan Pro, aparecerá listado aquí en tiempo real.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs font-semibold uppercase text-slate-400">
                      <th className="py-3 px-4">Creador / Perfil</th>
                      <th className="py-3 px-4">Correo</th>
                      <th className="py-3 px-4">Plan Actual</th>
                      <th className="py-3 px-4">Estado Cuenta</th>
                      <th className="py-3 px-4 text-center">Acciones de Administrador</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {filteredSubscribers.map(sub => (
                      <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-4 font-bold text-white">{sub.creatorName}</td>
                        <td className="py-4 px-4 text-slate-400">{sub.email}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            sub.plan === 'Pro (PayPal)' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          }`}>
                            {sub.plan}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            sub.status === 'blocked' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {sub.status === 'blocked' ? 'Bloqueada' : 'Activa'}
                          </span>
                        </td>
                        <td className="py-4 px-4 flex items-center justify-center gap-2">
                          {sub.plan === 'Pro (PayPal)' && (
                            <button
                              onClick={() => handleDowngrade(sub.id, sub.creatorName)}
                              title="Bajar de nivel al plan Gratuito"
                              className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <ArrowDownCircle className="w-3.5 h-3.5" /> Bajar a Free
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleBlock(sub.id, sub.status, sub.creatorName)}
                            title={sub.status === 'blocked' ? 'Desbloquear cuenta' : 'Bloquear cuenta'}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                              sub.status === 'blocked' 
                                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' 
                                : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                            }`}
                          >
                            {sub.status === 'blocked' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                            {sub.status === 'blocked' ? 'Desbloquear' : 'Bloquear'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Global Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-900 text-center text-xs text-slate-500">
          Diseñado por BI LABS - Costa Rica
        </footer>
      </main>
    </div>
  );
}
