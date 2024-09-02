// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
	rules: {
		"prefer-promise-reject-errors": "off",

		// The core 'no-unused-vars' rules (in the eslint:recommended ruleset)
		// does not work with type definitions
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": "off",

		// allow debugger during development only
		"no-debugger":
			process.env.NODE_ENV === "production" ? "error" : "off",

		"@typescript-eslint/no-explicit-any": "off",

		"vue/html-self-closing": [
			"warn",
			{
				html: {
					void: "always",
					normal: "never",
				},
			},
		],
	},
});
