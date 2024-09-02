<script lang="ts" setup>
import type { Database } from "@@/types/database.types.ts";
import { Notify, Loading } from "quasar";

const supabase = useSupabaseClient<Database>();

const filter = ref("");
const from = ref("");
const to = ref("");
const ticket = ref("");

const pagination = ref({
	sortBy: "video_date",
	descending: true,
	page: 1,
	rowsPerPage: 10,
	rowsNumber: 10,
});

const videos: any = ref([]);

const { refresh, status } = useLazyAsyncData(async () => {
	let query = supabase
		.from("videos")
		.select("*", { count: "exact" })
		.order("video_date", { ascending: false });

	if (filter.value) {
		query = query.or(`title.ilike.%${filter.value}%`);
	}

	if (ticket.value) {
		query = query.filter(
			"tickets",
			"cs",
			// eslint-disable-next-line no-useless-escape
			"\{" + ticket.value.toUpperCase() + "\}"
		);
	}

	if (from.value) {
		query = query.filter("video_date", "gte", from.value);
	}

	if (to.value) {
		query = query.filter("video_date", "lte", to.value);
	}

	const fetchCount =
		pagination.value.rowsPerPage === 0
			? pagination.value.rowsNumber
			: pagination.value.rowsPerPage;

	const startRow =
		(pagination.value.page - 1) * pagination.value.rowsPerPage;
	const endRow = pagination.value.page * fetchCount;

	Loading.show();

	const { error, data, count } = await query.range(
		startRow,
		endRow - 1
	);

	Loading.hide();

	if (error) {
		Notify.create({
			type: "negative",
			position: "bottom-right",
			message: error.message,
		});
	}

	pagination.value.rowsNumber = count || 0;

	if (data) {
		if (pagination.value.page == 1) {
			videos.value = data;
		} else {
			videos.value = [...videos.value, ...data];
		}
	}

	return videos.value;
});

const lastVideoDate = ref(
	(
		await supabase
			.from("videos")
			.select("video_date")
			.order("video_date", { ascending: false })
			.limit(1)
			.single()
	).data?.video_date
);

const onLoadMore = () => {
	pagination.value.page++;
	refresh();
};

watch([filter, from, to, ticket], (n) => {
	pagination.value.page = 1;
	refresh();
});

type Profile =
	Database["public"]["Tables"]["profiles"]["Row"];

const profile = inject<Profile>("profile");
</script>

<template>
	<div>
		<QPage
			v-if="profile"
			class="q-px-lg q-pb-lg"
			:style="$q.screen.xs ? 'margin-top: -40px' : ''"
		>
			<PageTitle
				title="Reuniones CDI internacional"
				sub-title="En esta sección encontrarás las reuniones del CDI Internacional con el Master Juan Antonio Chávez."
			/>
			<div class="row q-pt-lg q-col-gutter-xl">
				<div v-if="!profile?.watch_videos" class="col-12">
					<q-banner inline-actions class="text-white bg-red" rounded>
						Tu usuario tiene pendiente la autorización para ver los
						videos.
					</q-banner>
				</div>

				<div class="row col-12 q-col-gutter-sm">
					<q-input
						v-model="filter"
						class="col-xs-12 col-md-3"
						debounce="300"
						placeholder="Buscar por título"
					>
						<template #append>
							<q-icon name="search" />
						</template>
					</q-input>
					<q-input
						v-model="from"
						class="col-xs-6 col-md-2"
						type="date"
					>
						<template #prepend>
							<span class="text-caption"> Desde </span>
						</template>
					</q-input>
					<q-input v-model="to" class="col-xs-6 col-md-2" type="date">
						<template #prepend>
							<span class="text-caption"> Hasta </span>
						</template>
					</q-input>
					<q-input
						v-model="ticket"
						class="col-xs-12 col-md-2"
						debounce="500"
						placeholder="Buscar por ticket"
					>
						<template #append>
							<q-icon name="search" />
						</template>
					</q-input>
				</div>
				<VideoCard
					v-for="(video, index) in videos"
					:key="video.video_id"
					:video="video"
					:last="video.video_date == lastVideoDate && index == 0"
				/>
				<div
					v-if="
						status !== 'pending' &&
						(videos?.length || 0) < pagination.rowsNumber
					"
					class="col-12 col-md-4 flex justify-center items-center"
				>
					<q-btn
						flat
						class="full-height full-width"
						color="primary"
						no-caps
						rounded
						icon="downloading"
						label="Cargar mas videos"
						@click="onLoadMore"
					/>
				</div>
			</div>
		</QPage>
	</div>
</template>

<style></style>
