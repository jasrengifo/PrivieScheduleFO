import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import fs from 'fs';

// Plugin para crear .htaccess
const htaccessPlugin = {
  name: 'htaccess',
  closeBundle() {
    const htaccessContent = `RewriteEngine On
RewriteBase /

# Si el archivo o directorio no existe, redirigir a index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]

# Configuración de caché para assets
<FilesMatch "\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    Header set Cache-Control "max-age=31536000, public"
</FilesMatch>

# Prevenir acceso a archivos .htaccess
<Files .htaccess>
    Order allow,deny
    Deny from all
</Files>`;

    try {
      fs.writeFileSync('dist/.htaccess', htaccessContent);
      console.log('✅ .htaccess creado exitosamente');
    } catch (error) {
      console.error('❌ Error al crear .htaccess:', error);
    }
  }
};

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Cargar las variables de entorno según el modo
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue(), htaccessPlugin],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'process.env': env,
      'import.meta.env': env
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`
        }
      }
    }
  }
})