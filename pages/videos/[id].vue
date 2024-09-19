<script lang="ts" setup>
import type { Database } from "@@/types/database.types.ts";
import moment from "moment";

const route = useRoute();

type Video = Database["public"]["Tables"]["videos"]["Row"];
type Profile =
	Database["public"]["Tables"]["profiles"]["Row"];

const supabase = useSupabaseClient<Database>();

const { data } = useLazyAsyncData<Video | null>(
	`video-${route.params.id}`,
	async () =>
		(
			await supabase
				.from("videos")
				.select("*")
				.eq("id", `${route.params.id}`)
				.single()
		).data
);

const profile = inject<Profile>("profile");
</script>

<template>
	<QPage class="q-pa-lg">
		<PageTitle :title="data?.title || ''" go-back />
		<q-banner
			v-if="!profile?.watch_videos"
			inline-actions
			class="text-white bg-red"
			rounded
		>
			Tu usuario no esta autorizado a ver este contenido.
		</q-banner>
		<div
			v-if="data && profile?.watch_videos"
			style="position: relative; padding-top: 56.25%"
		>
			<iframe
				:src="`https://iframe.mediadelivery.net/embed/${data.library_id}/${data.video_id}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`"
				loading="lazy"
				style="
					border: 0;
					position: absolute;
					top: 0;
					height: 100%;
					width: 100%;
				"
				allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
				allowfullscreen="true"
			></iframe>
		</div>
		<div
			v-if="data?.tickets?.length"
			class="tickets row q-pt-md items-center"
		>
			<span class="text-subtitle2 text-bold"> Tickers: </span>
			<TicketsList :tickets="data?.tickets" />
		</div>
		<div class="row q-pt-md">
			{{ data?.description }}
		</div>
		<div class="row q-pt-md text-caption text-bold text-grey-7">
			{{ moment(data?.video_date).utc().format("DD MMM YYYY") }}
		</div>
	</QPage>
</template>

<style></style>
