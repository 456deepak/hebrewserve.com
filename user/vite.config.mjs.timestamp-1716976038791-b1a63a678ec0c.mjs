// vite.config.mjs
import path from "path";
import { defineConfig } from "file:///home/hari/Desktop/socialv2/user/node_modules/vite/dist/node/index.js";
import react from "file:///home/hari/Desktop/socialv2/user/node_modules/@vitejs/plugin-react/dist/index.mjs";
import jsconfigPaths from "file:///home/hari/Desktop/socialv2/user/node_modules/vite-jsconfig-paths/dist/index.mjs";
import { loadEnv } from "file:///home/hari/Desktop/socialv2/user/node_modules/vite/dist/node/index.js";
var vite_config_default = ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    plugins: [react(), jsconfigPaths()],
    // https://github.com/jpuri/react-draft-wysiwyg/issues/1317
    base: process.env.VITE_APP_BASE_NAME,
    define: {
      global: "window",
      "process.env": env
    },
    resolve: {
      alias: [
        {
          find: /^~(.+)/,
          replacement: path.join(process.cwd(), "node_modules/$1")
        },
        {
          find: /^src(.+)/,
          replacement: path.join(process.cwd(), "src/$1")
        }
      ]
    },
    server: {
      // this ensures that the browser opens upon server start
      open: true,
      // this sets a default port to 3000
      port: 4001
    },
    preview: {
      // this ensures that the browser opens upon preview start
      open: true,
      // this sets a default port to 3000
      port: 4001
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvaGFyaS9EZXNrdG9wL3NvY2lhbHYyL3VzZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2hhcmkvRGVza3RvcC9zb2NpYWx2Mi91c2VyL3ZpdGUuY29uZmlnLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9oYXJpL0Rlc2t0b3Avc29jaWFsdjIvdXNlci92aXRlLmNvbmZpZy5tanNcIjsvLyBodHRwczovL2dpdGh1Yi5jb20vdml0ZWpzL3ZpdGUvZGlzY3Vzc2lvbnMvMzQ0OFxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQganNjb25maWdQYXRocyBmcm9tICd2aXRlLWpzY29uZmlnLXBhdGhzJztcbmltcG9ydCB7IGxvYWRFbnYgfSBmcm9tIFwidml0ZVwiO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnQgZGVmYXVsdCAoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCBcIlwiKTtcbiAgcmV0dXJuIGRlZmluZUNvbmZpZyh7XG4gICAgcGx1Z2luczogW3JlYWN0KCksIGpzY29uZmlnUGF0aHMoKV0sXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2pwdXJpL3JlYWN0LWRyYWZ0LXd5c2l3eWcvaXNzdWVzLzEzMTdcbiAgICBiYXNlOiBwcm9jZXNzLmVudi5WSVRFX0FQUF9CQVNFX05BTUUsXG4gICAgZGVmaW5lOiB7XG4gICAgICBnbG9iYWw6ICd3aW5kb3cnLFxuICAgICAgXCJwcm9jZXNzLmVudlwiOiBlbnZcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBmaW5kOiAvXn4oLispLyxcbiAgICAgICAgICByZXBsYWNlbWVudDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdub2RlX21vZHVsZXMvJDEnKVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmluZDogL15zcmMoLispLyxcbiAgICAgICAgICByZXBsYWNlbWVudDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdzcmMvJDEnKVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIC8vIHRoaXMgZW5zdXJlcyB0aGF0IHRoZSBicm93c2VyIG9wZW5zIHVwb24gc2VydmVyIHN0YXJ0XG4gICAgICBvcGVuOiB0cnVlLFxuICAgICAgLy8gdGhpcyBzZXRzIGEgZGVmYXVsdCBwb3J0IHRvIDMwMDBcbiAgICAgIHBvcnQ6IDQwMDFcbiAgICB9LFxuICAgIHByZXZpZXc6IHtcbiAgICAgIC8vIHRoaXMgZW5zdXJlcyB0aGF0IHRoZSBicm93c2VyIG9wZW5zIHVwb24gcHJldmlldyBzdGFydFxuICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgIC8vIHRoaXMgc2V0cyBhIGRlZmF1bHQgcG9ydCB0byAzMDAwXG4gICAgICBwb3J0OiA0MDAxXG4gICAgfVxuICB9KVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLE9BQU8sVUFBVTtBQUNqQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxtQkFBbUI7QUFDMUIsU0FBUyxlQUFlO0FBR3hCLElBQU8sc0JBQVEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUMzQixRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFDM0MsU0FBTyxhQUFhO0FBQUEsSUFDbEIsU0FBUyxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUM7QUFBQTtBQUFBLElBRWxDLE1BQU0sUUFBUSxJQUFJO0FBQUEsSUFDbEIsUUFBUTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsZUFBZTtBQUFBLElBQ2pCO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTDtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sYUFBYSxLQUFLLEtBQUssUUFBUSxJQUFJLEdBQUcsaUJBQWlCO0FBQUEsUUFDekQ7QUFBQSxRQUNBO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixhQUFhLEtBQUssS0FBSyxRQUFRLElBQUksR0FBRyxRQUFRO0FBQUEsUUFDaEQ7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBO0FBQUEsTUFFTixNQUFNO0FBQUE7QUFBQSxNQUVOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxTQUFTO0FBQUE7QUFBQSxNQUVQLE1BQU07QUFBQTtBQUFBLE1BRU4sTUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGLENBQUM7QUFDSDsiLAogICJuYW1lcyI6IFtdCn0K
