// https://github.com/vitejs/vite/discussions/3448
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import { loadEnv } from "vite";
// ----------------------------------------------------------------------

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    plugins: [react(), jsconfigPaths()],
    // https://github.com/jpuri/react-draft-wysiwyg/issues/1317
    base: process.env.VITE_APP_BASE_NAME,
    define: {
      global: 'window',
      "process.env": env
    },
    resolve: {
      alias: [
        {
          find: /^~(.+)/,
          replacement: path.join(process.cwd(), 'node_modules/$1')
        },
        {
          find: /^src(.+)/,
          replacement: path.join(process.cwd(), 'src/$1')
        }
      ]
    },
    server: {
      // this ensures that the browser opens upon server start
      open: true,
      // this sets a default port to 3000
      port: 5002
    },
    preview: {
      // this ensures that the browser opens upon preview start
      open: true,
      // this sets a default port to 3000
      port: 5002
    }
  })
}
