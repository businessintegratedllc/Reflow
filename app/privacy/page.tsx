import Link from 'next/link';
import { Zap, ShieldCheck, ArrowRight } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6 sm:px-8 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto space-y-8 w-full">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">ReFlow</span>
          </Link>
          <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            Legal & Privacidad
          </span>
        </div>

        <div className="space-y-6 text-slate-300 text-sm leading-relaxed bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-3xl font-black text-white mb-2">Política de Privacidad de ReFlow</h1>
          <p className="text-xs text-slate-500">Última actualización: 27 de julio de 2026</p>

          <p>
            En <strong>ReFlow</strong> ("nosotros", "nuestro" o la "Plataforma"), valoramos y respetamos tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos tu información cuando utilizas nuestro sitio web y los servicios de Media Kit y analíticas para creadores de contenido.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">1. Información que Recopilamos</h2>
          <p>
            Para proporcionarte nuestros servicios de Media Kit en vivo, analíticas y cotizaciones, recopilamos la siguiente información:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li><strong>Información de Registro:</strong> Nombre completo, nombre de usuario (ej. <code>reflow.me/tu-nombre</code>), correo electrónico y contraseña cifrada.</li>
            <li><strong>Información de Perfil Profesional:</strong> Biografía, nicho, foto de perfil y número de WhatsApp para cotizaciones comerciales.</li>
            <li><strong>Datos de Redes Sociales (vía OAuth API):</strong> Cuando conectas tus cuentas oficiales de Instagram, TikTok o YouTube, recopilamos métricas autorizadas por ti (seguidores, engagement rate, alcance) mediante las APIs oficiales de Meta y Google.</li>
            <li><strong>Datos de Suscripción:</strong> Los pagos de suscripciones Pro se procesan a través de pasarelas seguras como PayPal (<code>paypal.me/RandallCastroR9</code>). ReFlow no almacena tus datos bancarios.</li>
          </ul>

          <h2 className="text-lg font-bold text-white pt-4">2. Uso de la Información</h2>
          <p>
            Utilizamos la información recopilada para:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>Crear y mantener tu perfil público de creador (Media Kit Dinámico).</li>
            <li>Sincronizar y mostrar métricas de rendimiento en tiempo real en tu perfil.</li>
            <li>Facilitar el embudo de ventas y cotizaciones con marcas a través de WhatsApp.</li>
            <li>Procesar tus pagos de suscripción y verificar el estado de tu cuenta en nuestro Panel de Administración.</li>
          </ul>

          <h2 className="text-lg font-bold text-white pt-4">3. Compartir Información y Datos de la API</h2>
          <p>
            Tu perfil público de ReFlow y tus estadísticas consolidadas son visibles únicamente para las marcas y agencias a las que tú decidas compartirles tu enlace público. Los datos obtenidos a través de las APIs de Meta y Google se utilizan estrictamente para mostrar tus propias analíticas. Nunca vendemos ni compartimos tus datos con terceros no autorizados.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">4. Seguridad y Retención de Datos</h2>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas robustas (cifrado de tokens, HTTPS y Supabase RLS) para proteger tu información. Retenemos tus datos mientras tu cuenta esté activa o sea necesaria para proporcionarte el servicio.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">5. Tus Derechos y Eliminación de Datos</h2>
          <p>
            Tienes derecho a acceder, rectificar o eliminar tu información personal. Puedes purgar tus datos desde tu panel o visitar nuestras <Link href="/privacy/data-deletion" className="text-indigo-400 underline">Instrucciones de Eliminación de Datos</Link> para revocar accesos en cualquier momento.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">6. Contacto</h2>
          <p>
            Si tienes dudas sobre esta Política de Privacidad, puedes contactarnos en: <strong>soporte@reflow.me</strong>
          </p>
        </div>

        <div className="text-center pt-4">
          <Link href="/" className="text-xs text-indigo-400 hover:underline">
            ← Volver a la página principal de ReFlow
          </Link>
        </div>
      </div>

      <footer className="mt-16 pt-8 border-t border-slate-900 text-center text-xs text-slate-500">
        Diseñado por BI LABS - Costa Rica
      </footer>
    </div>
  );
}
