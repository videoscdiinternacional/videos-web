<script setup>
import moment from "moment";
import "moment/locale/es";
moment.locale("es");
moment.updateLocale("es", {
	monthsShort: [
		"Ene",
		"Feb",
		"Mar",
		"Abr",
		"May",
		"Jun",
		"Jul",
		"Ago",
		"Sep",
		"Oct",
		"Nov",
		"Dic",
	],
});
</script>

<template>
	<NuxtLoadingIndicator />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<style>
@font-face {
	font-family: "Minnie Regular";
	src: url("/Minnie-Regular.woff");
}

body {
	font-family: Roboto, -apple-system, Helvetica Neue,
		Helvetica, Arial, sans-serif;
}

.q-table thead th {
	font-size: 14px;
	text-transform: uppercase;
	font-weight: 600;
}

.q-table tbody td {
	font-size: 16px;
}

.body--light .q-table {
	border-top: 1.8px solid #9ca0bb !important;
	color: #757575 !important;
}

input {
	color-scheme: dark;
}

.q-field--dense .q-field__label {
	font-size: 15px;
	top: 13px;
}

.q-field--dense.q-field--float .q-field__label {
	transform: translateY(-45%) scale(0.75);
}

.q-field--dense .q-field__before,
.q-field--dense .q-field__prepend {
	padding-right: 12px;
}

.q-select--with-chips.q-field--dark .q-chip--dark {
	background-color: var(--q-primary);
}

.q-chip__icon--remove {
	margin-top: 0.5px;
}
</style>
