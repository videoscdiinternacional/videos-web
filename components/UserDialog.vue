<script lang="ts" setup>
import type { Database } from "@@/types/database.types.ts";
import { requiredIf, helpers } from "@vuelidate/validators";
import { roundClose } from "@quasar/extras/material-icons-round";

interface Props {
	id?: string;
}
const props = defineProps<Props>();

const { dialogRef, onDialogHide, onDialogOK } =
	useDialogPluginComponent();

defineEmits([...useDialogPluginComponent.emits, "submit"]);

const loading = ref(true);

type Profile =
	Database["public"]["Tables"]["profiles"]["Update"] & {
		email?: string;
		password?: string;
	};

const { required, useValidation } = useValidator();

const state = reactive<Profile>({
	first_name: "",
	last_name: "",
	add_videos: false,
	manage_users: false,
	watch_videos: false,
});

const rules = {
	first_name: { required },
	last_name: { required },
	email: {
		required: helpers.withMessage(
			"Este campo es requerido",
			requiredIf(() => !props.id)
		),
	},
	password: {
		required: helpers.withMessage(
			"Este campo es requerido",
			requiredIf(() => !props.id)
		),
	},
};

const validator = useValidation<Profile>(rules, state);

const supabase = useSupabaseClient<Database>();

const { data } = useLazyAsyncData(
	`user-${props.id}`,
	async () =>
		props.id
			? (
					await supabase
						.from("profiles")
						.select("*")
						.eq("id", props.id)
						.single()
			  ).data
			: Promise.resolve<Profile>({})
);

watch(data, (data) => {
	if (data) {
		Object.assign(state, data);
		loading.value = false;
	}
});

const onSubmit = async () => {
	const result = await validator.value.$validate();
	if (result) {
		let userId = props.id;

		if (!props.id) {
			const { data } = await supabase.auth.signUp({
				email: state.email!,
				password: state.password!,
				options: {
					data: {
						first_name: state.first_name,
						last_name: state.last_name,
					},
				},
			});

			if (data && data.user) {
				userId = data.user?.id;
			} else {
				return;
			}
		}

		supabase
			.from("profiles")
			.update({
				first_name: state.first_name,
				last_name: state.last_name,
				watch_videos: state.watch_videos,
				add_videos: state.add_videos,
				manage_users: state.manage_users,
			})
			.eq("id", userId!)
			.then(() => {
				onDialogOK();
			});
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
		<QCard class="row" :style="`min-width: min(500px, 90vw)`">
			<QForm class="column full-width" @submit.prevent="onSubmit">
				<QToolbar>
					<QToolbarTitle>
						{{ props.id ? "Editar usuario" : "Agregar usuario" }}
					</QToolbarTitle>
					<QBtn v-close-popup flat round dense :icon="roundClose" />
				</QToolbar>

				<QSeparator />

				<QCardSection class="col scroll" v-bind="$attrs">
					<QForm class="row q-col-gutter-md">
						<QInput
							v-model="state.first_name"
							class="col-12"
							label="Nombre"
							:error="validator.first_name.$error"
							:error-message="
								validator.first_name.$errors[0]?.$message.toString()
							"
						/>
						<QInput
							v-model="state.last_name"
							class="col-12"
							label="Apellido"
							:error="validator.last_name.$error"
							:error-message="
								validator.last_name.$errors[0]?.$message.toString()
							"
						/>
						<QInput
							v-if="!props.id"
							v-model="state.email"
							class="col-12"
							label="Email"
							:error="validator.email.$error"
							:error-message="
								validator.email.$errors[0]?.$message.toString()
							"
						/>
						<QInput
							v-if="!props.id"
							v-model="state.password"
							class="col-12"
							label="Password"
							:error="validator.password.$error"
							:error-message="
								validator.password.$errors[0]?.$message.toString()
							"
						/>

						<QList class="col-12">
							<q-item v-ripple tag="label">
								<q-item-section>
									<q-item-label>Puede ver videos</q-item-label>
								</q-item-section>
								<q-item-section side>
									<q-toggle v-model="state.watch_videos" color="green" />
								</q-item-section>
							</q-item>
							<q-item v-ripple tag="label">
								<q-item-section>
									<q-item-label>Puede agregar videos</q-item-label>
								</q-item-section>
								<q-item-section side>
									<q-toggle v-model="state.add_videos" color="orange" />
								</q-item-section>
							</q-item>
							<q-item v-ripple tag="label">
								<q-item-section>
									<q-item-label>Puede administrar usuarios</q-item-label>
								</q-item-section>
								<q-item-section side>
									<q-toggle v-model="state.manage_users" color="purple" />
								</q-item-section>
							</q-item>
						</QList>
					</QForm>
				</QCardSection>

				<QInnerLoading :showing="loading">
					<QSpinner size="50px" color="primary" />
				</QInnerLoading>

				<QSeparator />

				<QCardActions class="q-col-gutter-sm items-center">
					<div v-if="$slots.footer" class="col-xs-12 col-md-auto">
						<slot name="footer"></slot>
					</div>
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
							<slot name="buttons"></slot>
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
