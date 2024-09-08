<script lang="ts" setup>
import type { Database } from "@@/types/database.types.ts";
import moment from "moment";
import UserDialog from "@@/components/UserDialog.vue";
import { Dialog, Notify, Loading } from "quasar";
import DeleteDialog from "@@/components/DeleteDialog.vue";

type Profile =
	Database["public"]["Tables"]["profiles"]["Row"];

const supabase = useSupabaseClient<Database>();

const rows = ref<Profile[]>([]);
const filter = ref("");
const loading = ref(false);

const columns = [
	{
		name: "first_name",
		required: true,
		label: "Nombre",
		align: "left",
		field: (row: Profile) => row.first_name,
		sortable: true,
	},
	{
		name: "last_name",
		required: true,
		label: "Apellido",
		align: "left",
		field: (row: Profile) => row.last_name,
		sortable: true,
	},
	{
		name: "created_at",
		required: true,
		label: "Creado el",
		align: "left",
		field: (row: Profile) =>
			moment(row.created_at).utc().format("DD MMM YYYY, HH:mm A"),
		sortable: true,
	},
	{
		name: "roles",
		required: true,
		label: "Permisos",
		align: "left",
		field: (row: Profile) => row.watch_videos,
		sortable: false,
	},
	{
		name: "last_sign_in_at",
		required: true,
		label: "Último ingreso",
		align: "left",
		field: (row: Profile) =>
			moment(row.last_sign_in_at)
				.utc()
				.format("DD MMM YYYY, HH:mm A"),

		sortable: true,
	},
	{
		name: "actions",
		required: true,
		label: "Acciones",
		sortable: false,
	},
];

const pagination = ref({
	sortBy: "last_name",
	descending: false,
	page: 1,
	rowsPerPage: 10,
	rowsNumber: 10,
});

async function onRequest(props: any) {
	const { page, rowsPerPage, sortBy, descending } =
		props.pagination;

	const filter = props.filter;

	loading.value = true;

	// get all rows if "All" (0) is selected
	const fetchCount =
		rowsPerPage === 0
			? pagination.value.rowsNumber
			: rowsPerPage;

	// calculate starting row of data
	const startRow = (page - 1) * rowsPerPage;
	const endRow = page * fetchCount;

	// fetch data from "server"

	let query = supabase
		.from("profiles")
		.select("*", { count: "exact" });

	if (sortBy) {
		query = query.order(sortBy, { ascending: !descending });
	}

	if (filter) {
		query = query.ilike("full_name", `%${filter}%`);
	}

	const { data, count } = await query.range(startRow, endRow);

	pagination.value.rowsNumber = count || 0;
	// clear out existing data and add new
	if (data) {
		rows.value.splice(0, rows.value.length, ...data);
	} else {
		rows.value = [];
	}

	// don't forget to update local pagination object
	pagination.value.page = page;
	pagination.value.rowsPerPage = rowsPerPage;
	pagination.value.sortBy = sortBy;
	pagination.value.descending = descending;

	// ...and turn of loading indicator
	loading.value = false;
}

onMounted(() => {
	onRequest({
		pagination: pagination.value,
		filter: filter.value,
	});
});

const openDialog = (id?: string) => {
	Dialog.create({
		component: UserDialog,
		componentProps: {
			id,
		},
	}).onOk(() => {
		onRequest({
			pagination: pagination.value,
			filter: filter.value,
		});
	});
};

const deleteDialog = (id: string, name: string) => {
	Dialog.create({
		component: DeleteDialog,
		componentProps: {
			title: "Eliaminar usuario",
			text: `¿Seguro desea eliminar el usuario ${name}?`,
		},
	}).onOk(async () => {
		Loading.show();

		const { error } = await supabase
			.from("profiles")
			.delete()
			.eq("id", id);

		Loading.hide();

		if (error) {
			Notify.create({
				type: "negative",
				position: "bottom-right",
				message: error.message,
			});
			return;
		}

		onRequest({
			pagination: pagination.value,
			filter: filter.value,
		});
	});
};
</script>

<template>
	<QPage class="q-pa-lg">
		<PageTitle
			title="Administrar usuarios"
			sub-title="En esta sección podrá administrar el listado de usuarios que tienen acceso a la página."
			go-back
		/>
		<q-table
			v-model:pagination="pagination"
			flat
			row-key="id"
			:rows="rows"
			:columns="columns"
			:loading="loading"
			:filter="filter"
			binary-state-sort
			@request="onRequest"
		>
			<template #top-left>
				<q-btn
					unelevated
					color="primary"
					label="Nuevo"
					icon="add"
					no-caps
					@click="openDialog()"
				/>
			</template>
			<template #top-right>
				<q-input
					v-model="filter"
					borderless
					dense
					debounce="300"
					placeholder="Buscar"
				>
					<template #append>
						<q-icon name="search" />
					</template>
				</q-input>
			</template>
			<template #body-cell-roles="props">
				<QTd :props="props">
					<div class="row q-gutter-xs">
						<QChip
							v-if="props.row.manage_users"
							square
							style="
								background: rgba(140, 137, 209, 0.6);
								color: rgb(185, 178, 255);
							"
						>
							Usuarios
						</QChip>
						<QChip
							v-if="props.row.add_videos"
							square
							style="
								background: rgba(249, 197, 154, 0.6);
								color: rgb(251, 176, 104);
							"
						>
							Videos
						</QChip>
						<QChip
							v-if="props.row.watch_videos"
							square
							style="
								background: rgba(225, 246, 232, 0.6);
								color: rgb(140, 255, 193);
							"
						>
							Ver
						</QChip>
					</div>
				</QTd>
			</template>
			<template #body-cell-actions="props">
				<QTd :props="props" class="q-gutter-x-sm">
					<QBtn
						flat
						icon="edit"
						round
						size="sm"
						@click="openDialog(props.row.id)"
					/>
					<QBtn
						flat
						icon="delete"
						round
						size="sm"
						@click="
							deleteDialog(
								props.row.id,
								`${props.row.last_name} ${props.row.first_name}`
							)
						"
					/>
				</QTd>
			</template>
		</q-table>
	</QPage>
</template>

<style></style>
