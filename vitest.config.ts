/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
	test: {
		environment: 'happy-dom',
		setupFiles: ['./src/test/setup.ts'],
		include: ['src/**/*.{test,spec}.{ts,tsx}'],
		restoreMocks: true,
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{ts,tsx,astro}'],
			exclude: ['src/test/**', 'src/**/*.{test,spec}.{ts,tsx}', 'src/**/*.d.ts'],
			reporter: ['text', 'html'],
		},
	},
});
