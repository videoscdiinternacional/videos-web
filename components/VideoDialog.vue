<script lang="ts" setup>
import type { Database } from "@@/types/database.types.ts";
import { roundClose } from "@quasar/extras/material-icons-round";

interface Props {
	id?: string;
}
const props = defineProps<Props>();

const { dialogRef, onDialogHide, onDialogOK } =
	useDialogPluginComponent();

defineEmits([...useDialogPluginComponent.emits, "submit"]);

const loading = ref(true);

type Video =
	Database["public"]["Tables"]["videos"]["Update"];

const { required, useValidation } = useValidator();

const state = reactive<Video>({
	video_date: "",
	video_id: "",
	title: "",
	thumbnail: "",
});

const rules = {
	library_id: { required },
	video_id: { required },
	video_date: { required },
	title: { required },
	thumbnail: { required },
	description: {},
	preview: { required },
	tickets: {},
	keys: {},
};

const validator = useValidation<Video>(rules, state);

const supabase = useSupabaseClient<Database>();

const { data } = useLazyAsyncData(
	`video-${props.id}`,
	async () =>
		props.id
			? (
					await supabase
						.from("videos")
						.select("*")
						.eq("id", props.id)
						.single()
			  ).data
			: Promise.resolve<Video>({})
);

watch(data, (data) => {
	if (data) {
		Object.assign(state, data, {
			video_date: data.video_date?.substring(0, 10),
		});
		loading.value = false;
	}
});

const onSubmit = async () => {
	const result = await validator.value.$validate();
	if (result) {
		supabase
			.from("videos")
			.upsert({
				id: props.id,
				library_id: state.library_id!,
				video_id: state.video_id!,
				video_date: `${state.video_date}T00:00:00+00:00`,
				title: state.title!,
				description: state.description,
				preview: state.preview!,
				thumbnail: state.thumbnail,
				tickets: state.tickets,
			})
			.then(() => {
				onDialogOK();
			});
	}
};

function createValue(val: string, done: any) {
	done(val.toUpperCase());
}
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
					<QToolbarTitle>
						{{ props.id ? "Editar video" : "Agregar video" }}
					</QToolbarTitle>
					<QBtn v-close-popup flat round dense :icon="roundClose" />
				</QToolbar>

				<QSeparator />

				<QCardSection class="col scroll" v-bind="$attrs">
					<QForm class="row q-col-gutter-md">
						<QInput
							v-model="state.video_date"
							class="col-6"
							label="Fecha"
							type="date"
							:error="validator.video_date.$error"
							:error-message="
								validator.video_date.$errors[0]?.$message.toString()
							"
						/>

						<QInput
							v-model="state.library_id"
							class="col-6"
							label="Librería"
							:error="validator.library_id.$error"
							:error-message="
								validator.library_id.$errors[0]?.$message.toString()
							"
						/>
						<QInput
							v-model="state.video_id"
							class="col-12"
							label="Video Id"
							:error="validator.video_id.$error"
							:error-message="
								validator.video_id.$errors[0]?.$message.toString()
							"
						/>

						<QInput
							v-model="state.title"
							class="col-12"
							label="Título"
							:error="validator.title.$error"
							:error-message="
								validator.title.$errors[0]?.$message.toString()
							"
						/>

						<QInput
							v-model="state.thumbnail"
							class="col-12"
							label="Portada"
							:error="validator.thumbnail.$error"
							:error-message="
								validator.thumbnail.$errors[0]?.$message.toString()
							"
						/>

						<QInput
							v-model="state.preview"
							class="col-12"
							label="Vista previa"
							:error="validator.preview.$error"
							:error-message="
								validator.preview.$errors[0]?.$message.toString()
							"
						/>

						<QInput
							v-model="state.description"
							class="col-12"
							label="Descripción"
							type="textarea"
							:error="validator.description.$error"
							:error-message="
								validator.description.$errors[0]?.$message.toString()
							"
						/>

						<q-select
							v-model="state.tickets"
							class="col-12"
							label="Tickets"
							use-input
							use-chips
							multiple
							hide-dropdown-icon
							input-debounce="0"
							new-value-mode="add-unique"
							:error="validator.tickets.$error"
							:error-message="
								validator.tickets.$errors[0]?.$message.toString()
							"
							@new-value="createValue"
						/>
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
