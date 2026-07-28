import Link from "next/link";
import { Sparkles, BarChart3, MessageSquare, FileText, ArrowRight, CheckCircle2, Zap, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
              ReFlow
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Características</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Cómo Funciona</a>
            <Link href="/sofiatech" className="hover:text-white transition-colors">Ver Perfil Demo</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] transition-all"
            >
              Crear mi Media Kit
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-8 animate-pulse">
            <Sparkles className="w-4 h-4" /> La evolución definitiva del Link-in-Bio para Creadores
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-8">
            Tu Media Kit en Vivo, <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Cotizador por WhatsApp</span> y Estadísticas Reales.
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            ReFlow centraliza tus redes sociales, permite que marcas coticen tus servicios en segundos y genera PDFs profesionales actualizados al instante.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 transition-all flex items-center justify-center gap-3"
            >
              Empezar Gratis Ahora <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/sofiatech"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-base hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              Ver Ejemplo en Vivo (<span className="text-indigo-400">@sofiatech</span>)
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-16 pt-12 border-t border-slate-900 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-black text-white">+2,500</div>
              <div className="text-sm text-slate-500 mt-1">Creadores Activos</div>
            </div>
            <div>
              <div className="text-3xl font-black text-indigo-400">100%</div>
              <div className="text-sm text-slate-500 mt-1">APIs en Tiempo Real</div>
            </div>
            <div>
              <div className="text-3xl font-black text-purple-400">3x</div>
              <div className="text-sm text-slate-500 mt-1">Más Conversión Comercial</div>
            </div>
            <div>
              <div className="text-3xl font-black text-pink-400">PDF</div>
              <div className="text-sm text-slate-500 mt-1">Descarga Instantánea</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-900/50 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Todo lo que necesitas para monetizar tu comunidad
            </h2>
            <p className="text-slate-400">
              Olvídate de enviar PDFs estáticos por correo que se desactualizan al día siguiente. ReFlow es tu oficina comercial digital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Analíticas en Vivo</h3>
              <p className="text-slate-400 leading-relaxed">
                Conexión OAuth con Instagram, TikTok y YouTube para mostrar seguidores, engagement rate y alcance real actualizado segundo a segundo.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Cotizador & WhatsApp</h3>
              <p className="text-slate-400 leading-relaxed">
                Tus clientes seleccionan entregables, calculan presupuesto y te escriben directamente a WhatsApp con el pedido prellenado. Cero fricción.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-pink-500/50 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Media Kit en PDF</h3>
              <p className="text-slate-400 leading-relaxed">
                ¿Las agencias piden PDF tradicional? Genera un documento corporativo impecable y descargable con tus métricas actuales en un clic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white">ReFlow</span>
            <span className="text-xs text-slate-500">© 2026 ReFlow Inc. Todos los derechos reservados.</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/sofiatech" className="hover:text-white transition-colors">Demo Perfil</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard Creador</Link>
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
      </footer>
    </div>
  );
}
