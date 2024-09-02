<script lang="ts" setup>
interface Props {
	tickets?: string[] | null;
}
defineProps<Props>();
</script>

<template>
	<QChip
		v-for="ticket in tickets"
		:key="ticket"
		dense
		square
		style="
			background: rgba(56, 189, 248, 0.25);
			color: rgb(14, 165, 233);
			border: 1px solid rgba(56, 189, 248, 0.4);
		"
	>
		{{ ticket }}
	</QChip>
</template>

<style></style>
