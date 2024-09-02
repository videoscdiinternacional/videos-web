<script lang="ts" setup>
import type { Database } from "@@/types/database.types.ts";
import moment from "moment";
import VideoDialog from "@@/components/VideoDialog.vue";
import { Dialog, Notify, Loading } from "quasar";
import DeleteDialog from "@@/components/DeleteDialog.vue";

type Video = Database["public"]["Tables"]["videos"]["Row"];

const supabase = useSupabaseClient<Database>();

const rows = ref<Video[]>([]);
const filter = ref("");
const loading = ref(false);

const columns = [
	{
		name: "video_date",
		required: true,
		label: "Fecha",
		align: "left",
		field: (row: Video) =>
			moment(row.video_date).utc().format("DD MMM YYYY"),
		sortable: true,
	},
	{
		name: "title",
		required: true,
		label: "Título",
		align: "left",
		field: (row: Video) => row.title,
		sortable: true,
	},
	{
		name: "actions",
		field: "id",
		required: true,
		label: "Acciones",
		sortable: false,
	},
];

const pagination = ref({
	sortBy: "video_date",
	descending: true,
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
		.from("videos")
		.select("*", { count: "exact" });

	if (sortBy) {
		query = query.order(sortBy, { ascending: !descending });
	}

	if (filter) {
		query = query.ilike("title", `%${filter}%`);
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

const openDialog = (id?: number) => {
	Dialog.create({
		component: VideoDialog,
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

const deleteDialog = (id: string, title: string) => {
	Dialog.create({
		component: DeleteDialog,
		componentProps: {
			title: "Eliaminar video",
			text: `¿Seguro desea eliminar el video ${title}?`,
		},
	}).onOk(async () => {
		Loading.show();

		const { error } = await supabase
			.from("videos")
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
			title="Administrar videos"
			sub-title="En esta sección podrá administrar el listado de videos que se ven en la página."
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
				<QInput
					v-model="filter"
					borderless
					dense
					debounce="300"
					placeholder="Buscar"
				>
					<template #append>
						<QIcon name="search" />
					</template>
				</QInput>
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
						@click="deleteDialog(props.row.id, props.row.title)"
					/>
				</QTd>
			</template>
		</q-table>
	</QPage>
</template>

<style></style>
