import Link from 'next/link';
import { Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-12 px-6 sm:px-8">
      <div className="max-w-3xl mx-auto space-y-8 w-full">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Instrucciones de Eliminación de Datos</h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            En cumplimiento con las políticas de Meta Platform y privacidad de datos, te explicamos cómo puedes solicitar la eliminación completa de tu información y desconexión de cuentas en <strong>ReFlow</strong>.
          </p>
        </div>

        {/* Steps Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-white">¿Cómo eliminar tus datos de ReFlow?</h2>

          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center flex-shrink-0">1</div>
              <div>
                <strong className="text-white block mb-1">Eliminación Directa desde la Plataforma:</strong>
                Inicia sesión en tu panel de control en <Link href="/dashboard" className="text-indigo-400 hover:underline">ReFlow Dashboard</Link> y elimina tu perfil o cuentas conectadas. Todos tus datos locales e historiales serán purgados al instante.
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center flex-shrink-0">2</div>
              <div>
                <strong className="text-white block mb-1">Solicitud por Correo Electrónico:</strong>
                Envía un correo electrónico a <a href="mailto:soporte@reflow.me" className="text-indigo-400 underline">soporte@reflow.me</a> indicando en el asunto "Eliminación de Datos - ReFlow". Nuestro equipo procesará la solicitud en un plazo máximo de 48 horas hábiles.
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center flex-shrink-0">3</div>
              <div>
                <strong className="text-white block mb-1">Revocar Permisos en Meta / Instagram:</strong>
                Puedes ir directamente a la configuración de tu cuenta de Facebook o Instagram en <a href="https://www.facebook.com/settings?tab=business_tools" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline">Configuración de Negocio / Integraciones</a> y remover nuestra aplicación de tu lista de accesos autorizados.
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center gap-3 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Una vez completada la solicitud, todos tus tokens de acceso, estadísticas e información de perfil se eliminan de manera permanente de nuestros servidores.</span>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300">
            <Zap className="w-4 h-4" /> Volver al Inicio de ReFlow
          </Link>
        </div>
      </div>

      <footer className="mt-16 pt-8 border-t border-slate-900 text-center text-xs text-slate-500">
        Diseñado por BI LABS - Costa Rica
      </footer>
    </div>
  );
}
