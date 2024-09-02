<script lang="ts" setup>
interface Props {
	title: string;
	subTitle?: string;
	goBack?: boolean;
}

defineProps<Props>();

const router = useRouter();
</script>

<template>
	<div class="row">
		<div class="col">
			<h4 class="q-ma-sm text-bold">{{ title }}</h4>
		</div>
		<div class="col-auto">
			<QBtn
				v-if="goBack"
				no-caps
				rounded
				outline
				text-color="white"
				icon="arrow_back"
				label="Volver"
				@click="router.go(-1)"
			/>
		</div>
	</div>
	<div class="row">
		<div class="q-ma-sm text-grey-7 text-subtitle1">
			{{ subTitle }}
		</div>
	</div>
	<QSeparator class="q-my-lg" />
</template>

<style></style>
