<script lang="ts" setup>
import type { Database } from "@@/types/database.types.ts";
import { Notify, Loading } from "quasar";
import { minLength, helpers } from "@vuelidate/validators";

definePageMeta({
	layout: "auth",
});

const { required, email, useValidation } = useValidator();

const state = reactive({
	first_name: "",
	last_name: "",
	email: "",
	password: "",
});

const rules = {
	first_name: { required },
	last_name: { required },
	email: { required, email },
	password: {
		required,
		minLength: helpers.withMessage(
			"Debe tener un mínimo de 6 caracteres",
			minLength(6)
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

		const { error, data } = await supabase.auth.signUp({
			email: state.email,
			password: state.password,
			options: {
				data: {
					first_name: state.first_name,
					last_name: state.last_name,
				},
			},
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

const showPassword = ref(false);
</script>

<template>
	<div class="">
		<div class="q-pa-md text-center q-gutter-md">
			<p class="title">Crear una cuenta</p>
			<div class="sub-title text-grey-7">
				Ya tienes una cuenta?
				<NuxtLink href="/login" class="text-primary">
					<span> Iniciar sesión </span>
				</NuxtLink>
			</div>
		</div>

		<QForm class="q-gutter-lg" @submit="onSubmit">
			<QInput
				v-model="state.first_name"
				label="Nombre"
				:error="validator.first_name.$error"
				:error-message="
					validator.first_name.$errors[0]?.$message.toString()
				"
			>
				<template #prepend>
					<q-icon name="perm_identity" />
				</template>
			</QInput>

			<QInput
				v-model="state.last_name"
				label="Apellido"
				:error="validator.last_name.$error"
				:error-message="
					validator.last_name.$errors[0]?.$message.toString()
				"
			>
				<template #prepend>
					<q-icon name="badge" />
				</template>
			</QInput>

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

			<QInput
				v-model="state.password"
				:type="showPassword ? 'text' : 'password'"
				label="Contaseña"
				:error="validator.password.$error"
				:error-message="
					validator.password.$errors[0]?.$message.toString()
				"
			>
				<template #prepend>
					<q-icon name="key" />
				</template>
				<template #append>
					<q-icon
						:name="showPassword ? 'visibility_off' : 'visibility'"
						@click="showPassword = !showPassword"
					/>
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
					Crear cuenta
				</QBtn>
			</div>
		</QForm>
	</div>
</template>

<style></style>
