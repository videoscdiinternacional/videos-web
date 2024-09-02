<script lang="ts" setup>
import type { Database } from "@@/types/database.types.ts";
import { Notify, Loading } from "quasar";

definePageMeta({
	layout: "auth",
});

const { required, email, useValidation } = useValidator();

const state = reactive({
	email: "",
});

const rules = {
	email: { required, email },
};

const validator = useValidation(rules, state);

const supabase = useSupabaseClient<Database>();

const router = useRouter();

const url = useNuxtApp().$config.public.baseUrl;

async function onSubmit() {
	const result = await validator.value.$validate();

	if (result) {
		Loading.show();

		const { error, data } =
			await supabase.auth.resetPasswordForEmail(state.email, {
				redirectTo: `${url}resetPassword`,
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
			router.replace("/login");
		}
	}
}
</script>

<template>
	<div class="">
		<div class="q-pa-md text-center q-gutter-md">
			<p class="title">¿Olvidó su contraseña?</p>
			<div class="sub-title text-grey-7">
				Introduce la dirección de correo electrónico asociado a tu
				cuenta y te enviaremos un enlace para restablecer tu
				contraseña.
			</div>
		</div>
		<QForm class="q-gutter-lg" @submit="onSubmit">
			<QInput
				v-model="state.email"
				label="Email"
				:error="validator.email.$error"
				:error-message="
					validator.email.$errors[0]?.$message.toString()
				"
			>
				<template #prepend>
					<q-icon name="email" />
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
					Recuperar contraseña
				</QBtn>
			</div>
		</QForm>
	</div>
</template>

<style></style>
