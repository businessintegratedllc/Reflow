# ReFlow — Media Kit Dinámico & Hub de Ventas para Creadores

ReFlow es la plataforma web definitiva que combina páginas de perfil profesional, analíticas en tiempo real conectadas a APIs de redes sociales, un cotizador interactivo con WhatsApp y generación instantánea de Media Kits en PDF.

## 🚀 Características Principales

1. **Perfil Profesional & Hub de Enlaces**: Páginas personalizadas (`reflow.me/tu-nombre`) para creadores de contenido.
2. **Estadísticas en Tiempo Real**: Conexión con Meta (Instagram), TikTok y YouTube para mostrar seguidores, engagement rate y alcance real actualizado.
3. **Cotizador Interactivo & WhatsApp**: Las marcas seleccionan entregables, calculan presupuestos y generan un mensaje directo a WhatsApp con el pedido prellenado.
4. **Media Kit en PDF Descargable**: Generación de documentos corporativos impecables para agencias y comités de aprobación.

---

## 🛠️ Stack Tecnológico
- **Frontend & Backend**: Next.js 14+ (App Router) con TypeScript y Tailwind CSS.
- **Base de Datos & Auth**: Supabase (PostgreSQL + Auth con Row Level Security).
- **Iconos**: Lucide React.
- **Despliegue**: Netlify (Soportado nativamente con `@netlify/plugin-nextjs`).

---

## 📦 Instalación y Desarrollo Local

1. Clona el repositorio e instala las dependencias:
   ```bash
   git clone https://github.com/tu-usuario/reflow.git
   cd reflow
   npm install
   ```

2. Configura tus variables de entorno (puedes usar `.env.example` como base):
   ```bash
   cp .env.example .env.local
   ```

3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🚢 Despliegue en Netlify

1. Sube tu repositorio a **GitHub**.
2. Entra a [Netlify](https://app.netlify.com) y selecciona **"Add new site" > "Import an existing project"**.
3. Conecta tu repositorio de GitHub.
4. Netlify detectará automáticamente la configuración en `netlify.toml` (`npm run build`).
5. Agrega tus variables de entorno de Supabase en la configuración de Netlify.
6. Haz clic en **Deploy Site**.
