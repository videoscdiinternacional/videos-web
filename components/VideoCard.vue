<script lang="ts" setup>
import type { Database } from "@@/types/database.types.ts";
import moment from "moment";
import TicketsList from "./TicketsList.vue";

type Video = Database["public"]["Tables"]["videos"]["Row"];

interface Props {
	video: Video;
	last?: boolean;
	filter?: string;
}

defineProps<Props>();

defineEmits(["filter"]);
</script>

<template>
	<div v-if="last" class="col-12">
		<div class="my-card row relative-position">
			<NuxtLink :href="`/videos/${video.id}`" tabindex="-1">
				<span class="absolute" aria-hidden="true"></span>
			</NuxtLink>
			<div class="col-12 row">
				<q-img
					class="col-xs-12 col-md-5"
					:src="video.thumbnail ? video.thumbnail : '/thumbnail.jpg'"
					:ratio="16 / 9"
				/>
				<div
					class="col-xs-12 col-md-7 row items-center"
					:class="{
						'q-pl-lg': $q.screen.gt.sm,
					}"
				>
					<div class="col-12 column no-wrap">
						<div class="col-auto tickets row no-wrap q-pt-sm scroll">
							<TicketsList
								:tickets="video.tickets"
								:filter="filter"
								@filter="$emit('filter', $event)"
							/>
						</div>

						<div class="col-auto q-pt-sm">
							<div class="title">{{ video.title }}</div>
						</div>

						<div class="col-auto">
							<div class="subtitle text-grey-7 ellipsis-3-lines">
								{{ video.description }}
							</div>
						</div>

						<div
							class="col-auto q-pt-md text-caption text-bold text-grey-7"
						>
							{{ moment(video.video_date).utc().format("DD MMM YYYY") }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div v-else class="col-12 col-md-4">
		<div class="my-card full-height row relative-position">
			<NuxtLink :href="`/videos/${video.id}`" tabindex="-1">
				<span class="absolute" aria-hidden="true"></span>
			</NuxtLink>
			<div class="full-height col-12 no-wrap column">
				<q-img
					class="col-auto"
					:src="video.thumbnail ? video.thumbnail : '/thumbnail.jpg'"
					:ratio="16 / 9"
				/>

				<div class="col row q-pa-xs">
					<div class="col-12 column no-wrap">
						<div class="col-auto tickets row no-wrap q-pt-sm scroll">
							<TicketsList
								:tickets="video.tickets"
								:filter="filter"
								@filter="$emit('filter', $event)"
							/>
						</div>

						<div class="col-auto q-pt-sm">
							<div class="title">{{ video.title }}</div>
						</div>

						<div class="col">
							<div class="subtitle text-grey-7 ellipsis-2-lines">
								{{ video.description }}
							</div>
						</div>

						<div
							class="col-auto q-pt-md text-caption text-bold text-grey-7"
						>
							{{ moment(video.video_date).utc().format("DD MMM YYYY") }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
.my-card {
	width: 100%;
	&:hover img {
		--tw-scale-x: 1.05;
		--tw-scale-y: 1.05;
	}
	& a span {
		inset: 0;
		z-index: 1;
	}
	& .q-img {
		border-color: rgb(229, 231, 235, 1);
		border-style: solid;
		border-width: 1px;
		box-sizing: border-box;
		border-radius: 0.8rem;
	}
	& img {
		transition-duration: 0.2s;
		transition-property: transform;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		--tw-scale-x: 1;
		--tw-scale-y: 1;
		transform: scaleX(var(--tw-scale-x))
			scaleY(var(--tw-scale-y));
	}

	& .tickets::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	& .tickets {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	& .title {
		font-size: 1.15rem;
		line-height: 1.75rem;
		font-weight: 600;
		color: rbg(17 24 39);
	}

	& .subtitle {
		font-size: 0.9rem;
		line-height: 1.5rem;
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
	}
}
</style>
