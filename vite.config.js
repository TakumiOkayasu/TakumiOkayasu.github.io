import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	base: "/takumiokayasu.github.io/",
	plugins: [react(), tailwindcss()],
	server: {
		host: true,
		port: 5173,
	},
});
