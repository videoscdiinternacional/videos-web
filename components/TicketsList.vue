<script lang="ts" setup>
interface Props {
	tickets?: string[] | null;
	filter?: string;
}
defineProps<Props>();

defineEmits(["filter"]);
</script>

<template>
	<QChip
		v-for="ticket in tickets"
		:key="ticket"
		dense
		square
		clickable
		:style="
			ticket == filter?.toUpperCase()
				? `background: rgba(249, 197, 154, 0.6);
			color: rgb(251, 176, 104);
			border: 1px solid rgba(251, 176, 104, 0.6);`
				: `background: rgba(56, 189, 248, 0.25);
			color: rgb(14, 165, 233);
			border: 1px solid rgba(56, 189, 248, 0.4);`
		"
		class="ticket-chip"
		@click="$emit('filter', ticket)"
	>
		{{ ticket }}
	</QChip>
</template>

<style>
.ticket-chip {
	z-index: 5;
}
</style>
