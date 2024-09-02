<script lang="ts" setup>
import type { Database } from "@@/types/database.types.ts";
import { Notify, Loading } from "quasar";

definePageMeta({
	layout: "auth",
});

const { required, email, useValidation } = useValidator();

const state = reactive({
	email: "",
	password: "",
});

const rules = {
	email: { required, email },
	password: { required },
};

const validator = useValidation(rules, state);

const supabase = useSupabaseClient<Database>();

const router = useRouter();

async function onSubmit() {
	const result = await validator.value.$validate();

	if (result) {
		Loading.show();

		const { error, data } =
			await supabase.auth.signInWithPassword({
				email: state.email,
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

const showPassword = ref(false);
</script>

<template>
	<div class="">
		<div class="q-pa-md text-center q-gutter-md">
			<p class="title">Bienvenido</p>
			<div class="sub-title text-grey-7">
				No tiene cuenta aún?
				<NuxtLink href="/signup" class="text-primary">
					<span>Registrarse</span>
				</NuxtLink>
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

			<QInput
				v-model="state.password"
				:type="showPassword ? 'text' : 'password'"
				label="Contraseña"
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
					Ingresar
				</QBtn>
			</div>
		</QForm>

		<div class="row q-pt-lg justify-center">
			<NuxtLink href="/forgotPassword" class="text-primary">
				<span>¿Olvidó su contraseña?</span>
			</NuxtLink>
		</div>
	</div>
</template>

<style></style>
