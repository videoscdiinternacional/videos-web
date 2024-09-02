// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	hooks: {
		"prerender:routes"({ routes }) {
			routes.clear(); // Do not generate any routes (except the defaults)
		},
	},
	future: {
		compatibilityVersion: 4,
	},
	compatibilityDate: "2024-04-03",
	devtools: { enabled: true },
	modules: [
		"@nuxt/eslint",
		"nuxt-quasar-ui",
		"@nuxtjs/supabase",
	],

	supabase: {
		redirectOptions: {
			login: "/login",
			callback: "/confirm",
			include: undefined,
			exclude: ["/signup", "/forgotPassword", "/resetPassword"],
		},
	},
	quasar: {
		lang: "es",
		plugins: ["Dialog", "Dark", "Lang", "Loading", "Notify"],
		config: {
			dark: true,
			brand: {
				primary: "#0EA5E9",
				dark: "#111",
				"dark-page": "#000000",
			},
		},
		components: {
			defaults: {
				QInput: {
					outlined: true,
					dense: true,
					hideBottomSpace: true,
				},
				QSelect: {
					outlined: true,
					dense: true,
					hideBottomSpace: true,
				},
			},
		},
	},
	runtimeConfig: {
		public: {
			baseUrl: "",
		},
	},
});
