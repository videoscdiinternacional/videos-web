<script lang="ts" setup>
import type { Database } from "@@/types/database.types.ts";
import { Notify, Loading } from "quasar";
import { sameAs, helpers } from "@vuelidate/validators";

definePageMeta({
	layout: "auth",
});

const { required, useValidation } = useValidator();

const state = reactive({
	password: "",
	confirmPassword: "",
});

const rules = {
	password: { required },
	confirmPassword: {
		required,
		sameAs: helpers.withMessage(
			"Las contraseñas no coinciden",
			sameAs(toRef(state, "password"))
		),
	},
};

const validator = useValidation(rules, state);

const supabase = useSupabaseClient<Database>();

const router = useRouter();

async function onSubmit() {
	const result = await validator.value.$validate();

	if (result) {
		Loading.show();

		const { error, data } = await supabase.auth.updateUser({
			password: state.password,
		});

		Loading.hide();

		if (error) {
			Notify.create({
				type: "negative",
				position: "bottom-right",
				message: error.message,
			});
		}

		if (data) {
			router.replace("/");
		}
	}
}
</script>

<template>
	<div class="">
		<div class="q-pa-md text-center q-gutter-md">
			<p class="title">Recuperar contraseña</p>
			<div class="sub-title text-grey-7"></div>
		</div>
		<QForm class="q-gutter-lg" @submit="onSubmit">
			<QInput
				v-model="state.password"
				label="Contraseña"
				:error="validator.password.$error"
				:error-message="
					validator.password.$errors[0]?.$message.toString()
				"
				type="password"
			>
				<template #prepend>
					<q-icon name="key" />
				</template>
			</QInput>

			<QInput
				v-model="state.confirmPassword"
				label="Confirmar contraseña"
				:error="validator.confirmPassword.$error"
				:error-message="
					validator.confirmPassword.$errors[0]?.$message.toString()
				"
				type="password"
			>
				<template #prepend>
					<q-icon name="lock" />
				</template>
			</QInput>

			<div class="row">
				<QBtn
					type="submit"
					class="full-width text-bold"
					color="primary"
					rounded
					no-caps
				>
					Generar contraseña
				</QBtn>
			</div>
		</QForm>
	</div>
</template>

<style></style>
