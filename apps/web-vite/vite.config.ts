/// <reference types='vitest' />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, false, '');

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/web-vite',
    server: {
      port: 4200,
      host: 'localhost',
    },
    define: {
      'import.meta.env.PORT_API': JSON.stringify(env.PORT_API),
      'import.meta.env.HOST_API': JSON.stringify(env.HOST_API),
      'import.meta.env.HTTP_API': JSON.stringify(env.HTTP_API),
    },
    preview: {
      port: 4300,
      host: 'localhost',
    },
    plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    build: {
      outDir: '../../dist/apps/web-vite',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    test: {
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../coverage/apps/web-vite',
        provider: 'v8' as const,
      },
    },
  };
});
