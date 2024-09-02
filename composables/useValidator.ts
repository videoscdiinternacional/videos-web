import * as validators from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

export const useValidator = () => {
	const required = validators.helpers.withMessage(
		"Este campo es obligatorio",
		validators.required
	);

	const email = validators.helpers.withMessage(
		"Formato de email inválido",
		validators.email
	);

	// You can add more validators
	return {
		useValidation: useVuelidate,
		helpers: validators.helpers,
		required,
		email,
	};
};
