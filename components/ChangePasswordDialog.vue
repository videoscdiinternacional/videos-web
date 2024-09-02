<script lang="ts" setup>
import type { Database } from "@@/types/database.types.ts";
import { roundClose } from "@quasar/extras/material-icons-round";
import { sameAs, helpers } from "@vuelidate/validators";
import { Notify, Loading } from "quasar";

const { dialogRef, onDialogHide, onDialogOK } =
	useDialogPluginComponent();

defineEmits([...useDialogPluginComponent.emits, "submit"]);

const loading = ref(false);

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

const onSubmit = async () => {
	const result = await validator.value.$validate();
	if (result) {
		Loading.show();

		const { error } = await supabase.auth.updateUser({
			password: state.password,
		});

		Loading.hide();

		if (error) {
			Notify.create({
				type: "negative",
				position: "bottom-right",
				message: error.message,
			});
			return;
		}

		onDialogOK();
	}
};
</script>

<template>
	<QDialog
		ref="dialogRef"
		v-close-popup
		class="side-dialog"
		square
		@hide="onDialogHide"
	>
		<QCard class="row" :style="`min-width: min(600px, 90vw)`">
			<QForm class="column full-width" @submit.prevent="onSubmit">
				<QToolbar>
					<QToolbarTitle> Cambiar contraseña </QToolbarTitle>
					<QBtn v-close-popup flat round dense :icon="roundClose" />
				</QToolbar>

				<QSeparator />

				<QCardSection class="col scroll" v-bind="$attrs">
					<QForm class="row q-col-gutter-md">
						<QInput
							v-model="state.password"
							class="col-12"
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
							class="col-12"
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
					</QForm>
				</QCardSection>

				<QInnerLoading :showing="loading">
					<QSpinner size="50px" color="primary" />
				</QInnerLoading>

				<QSeparator />

				<QCardActions class="q-col-gutter-sm items-center">
					<div
						class="col-xs-12 col-md-grow row"
						:class="$q.screen.gt.sm ? 'justify-end' : 'justify-evenly'"
					>
						<div
							class="q-gutter-sm"
							:class="$q.screen.gt.sm ? '' : 'row col-12'"
						>
							<QBtn
								v-close-popup
								no-caps
								flat
								size="14px"
								padding="6px 24px"
								:class="$q.screen.gt.sm ? '' : 'col'"
								label="Cancelar"
							/>
							<QBtn
								type="submit"
								no-caps
								size="14px"
								padding="6px 24px"
								color="primary"
								:class="$q.screen.gt.sm ? '' : 'col'"
								label="Guardar"
								:disable="loading"
							/>
						</div>
					</div>
				</QCardActions>
			</QForm>
		</QCard>
	</QDialog>
</template>

<style></style>
