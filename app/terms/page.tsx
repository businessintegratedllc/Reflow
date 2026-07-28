import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6 sm:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">ReFlow</span>
          </Link>
          <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            Legal & Términos
          </span>
        </div>

        <div className="space-y-6 text-slate-300 text-sm leading-relaxed bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-3xl font-black text-white mb-2">Términos de Servicio de ReFlow</h1>
          <p className="text-xs text-slate-500">Última actualización: 27 de julio de 2026</p>

          <p>
            Bienvenido a <strong>ReFlow</strong>. Al acceder o utilizar nuestra plataforma web, aceptas cumplir y estar sujeto a los siguientes Términos de Servicio. Por favor, léelos detenidamente.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">1. Descripción del Servicio</h2>
          <p>
            ReFlow es una plataforma SaaS orientada a creadores de contenido e influencers. Ofrece perfiles y Media Kits dinámicos, analíticas conectadas vía API, cotizador con WhatsApp, reportes en PDF y suscripciones gestionadas mediante PayPal.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">2. Cuentas de Usuario</h2>
          <p>
            Debes registrarte proporcionando información veraz. Eres responsable de mantener la confidencialidad de tus credenciales y del uso de tus redes sociales profesionales conectadas.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">3. Suscripciones y Pagos (PayPal)</h2>
          <p>
            Los pagos del Plan Pro se procesan a través del enlace de pago oficial en PayPal (<code>paypal.me/RandallCastroR9</code>). Las tarifas de suscripción mensual no son reembolsables una vez procesado el pago.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">4. Uso Aceptable</h2>
          <p>
            Te comprometes a no utilizar ReFlow para publicar contenido fraudulento, suplantar identidades, ni realizar ataques de seguridad o ingeniería inversa en la plataforma.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">5. Limitación de Responsabilidad</h2>
          <p>
            ReFlow se proporciona "tal cual". No nos hacemos responsables por interrupciones derivadas de caídas en las APIs de terceros (Meta, TikTok, YouTube) o proveedores externos.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">6. Contacto</h2>
          <p>
            Para consultas sobre estos Términos, escríbenos a: <strong>soporte@reflow.me</strong>
          </p>
        </div>

        <div className="text-center pt-4">
          <Link href="/" className="text-xs text-indigo-400 hover:underline">
            ← Volver a la página principal de ReFlow
          </Link>
        </div>
      </div>
    </div>
  );
}
