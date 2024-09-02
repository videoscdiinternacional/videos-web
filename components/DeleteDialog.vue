<script lang="ts" setup>
import { roundClose } from "@quasar/extras/material-icons-round";

interface Props {
	title?: string;
	text?: string;
}

defineProps<Props>();

const { dialogRef, onDialogHide, onDialogOK } =
	useDialogPluginComponent();

defineEmits([...useDialogPluginComponent.emits]);
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
			<QForm class="column full-width">
				<QToolbar>
					<QToolbarTitle>{{ title }} </QToolbarTitle>
					<QBtn v-close-popup flat round dense :icon="roundClose" />
				</QToolbar>

				<QSeparator />

				<QCardSection
					class="col scroll text-center"
					v-bind="$attrs"
				>
					<div class="column items-center">
						<q-icon class="q-pa-md" name="help_outline" size="100px" />
					</div>
					<span class="text-body1 text-center">{{ text }}</span>
				</QCardSection>

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
								no-caps
								size="14px"
								padding="6px 24px"
								color="negative"
								:class="$q.screen.gt.sm ? '' : 'col'"
								label="Eliminar"
								@click="onDialogOK"
							/>
						</div>
					</div>
				</QCardActions>
			</QForm>
		</QCard>
	</QDialog>
</template>

<style></style>
