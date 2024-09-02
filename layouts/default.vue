<script lang="ts" setup>
import type { Database } from "@@/types/database.types.ts";
import { Dialog } from "quasar";
import ChangePasswordDialog from "@@/components/ChangePasswordDialog.vue";

const supabase = useSupabaseClient<Database>();

const user = useSupabaseUser();
const router = useRouter();
const route = useRoute();
const blur = ref(false);
function onSignOut() {
	supabase.auth.signOut().then(() => router.replace("login"));
}

type Profile =
	Database["public"]["Tables"]["profiles"]["Row"];

const profile = ref<Profile | null>();

const onScroll = ({ position }: any) => {
	blur.value = position > 66;
};

const avatar = computed(
	() =>
		`${profile?.value?.first_name
			.substring(0, 1)
			.toUpperCase()}${profile?.value?.last_name
			.substring(0, 1)
			.toUpperCase()}`
);

watch(
	() => user,
	async (n) => {
		if (n) {
			profile.value = (
				await supabase
					.from("profiles")
					.select("*")
					.eq("id", n.value.id)
					.single()
			).data;
		} else {
			profile.value = null;
		}
	},
	{ immediate: true }
);

provide("profile", profile);

const changePasswordDialog = () => {
	Dialog.create({
		component: ChangePasswordDialog,
	});
};
</script>

<template>
	<q-layout view="hHh LpR lff" @scroll="onScroll">
		<q-header
			class="text-grey-9"
			:class="{ 'bg-blur': blur }"
			:bordered="blur"
		>
			<q-toolbar style="min-height: 56px">
				<q-toolbarTitle class="row items-center">
					<NuxtLink class="brand-font q-pr-sm" href="/">
						CMC
					</NuxtLink>
					<QChip
						dense
						square
						style="
							background: rgba(56, 189, 248, 0.25);
							color: rgb(14, 165, 233);
							border: 1px solid rgba(56, 189, 248, 0.4);
						"
					>
						Trading e Inversión
					</QChip>
				</q-toolbarTitle>

				<div class="q-gutter-md">
					<QBtn
						v-if="$q.screen.gt.xs && profile?.add_videos"
						class="text-bold"
						flat
						rounded
						label="Videos"
						to="/admin/videos"
						:text-color="
							route.path == '/admin/videos' ? 'primary' : 'white'
						"
						no-caps
					/>
					<QBtn
						v-if="$q.screen.gt.xs && profile?.manage_users"
						class="text-bold"
						flat
						rounded
						label="Usuarios"
						to="/admin/users"
						:text-color="
							route.path == '/admin/users' ? 'primary' : 'white'
						"
						no-caps
					/>
					<q-avatar
						v-if="profile"
						color="primary"
						text-color="white"
						class="cursor-pointer"
						size="md"
						font-size="15px"
					>
						{{ avatar }}
						<q-menu>
							<q-list>
								<template v-if="$q.screen.xs">
									<q-item
										v-if="profile?.add_videos"
										v-close-popup
										clickable
										tabindex="0"
										to="/admin/videos"
									>
										<q-item-section avatar>
											<q-avatar icon="play_circle_filled" />
										</q-item-section>
										<q-item-section>
											<q-item-label>Administrar videos</q-item-label>
										</q-item-section>
									</q-item>
									<q-item
										v-if="profile?.manage_users"
										v-close-popup
										clickable
										tabindex="0"
										to="/admin/users"
									>
										<q-item-section avatar>
											<q-avatar icon="people" />
										</q-item-section>
										<q-item-section>
											<q-item-label>Administrar usuarios</q-item-label>
										</q-item-section>
									</q-item>
									<q-separator />
								</template>
								<q-item
									v-close-popup
									clickable
									tabindex="0"
									@click="changePasswordDialog"
								>
									<q-item-section avatar>
										<q-avatar icon="password" />
									</q-item-section>
									<q-item-section>
										<q-item-label>Cambiar contraseña</q-item-label>
									</q-item-section>
								</q-item>
								<q-item
									v-close-popup
									clickable
									tabindex="1"
									@click="onSignOut()"
								>
									<q-item-section avatar>
										<q-avatar icon="logout" />
									</q-item-section>
									<q-item-section>
										<q-item-label>Cerrar sesión</q-item-label>
									</q-item-section>
								</q-item>
							</q-list>
						</q-menu>
					</q-avatar>
				</div>
			</q-toolbar>
		</q-header>
		<div
			v-if="route.path == '/'"
			class="row"
			:style="$q.screen.xs ? 'margin-top: 66px' : ''"
		>
			<img src="/CMC.jpg" style="width: 100%" />
		</div>
		<q-page-container>
			<slot></slot>
		</q-page-container>
		<q-footer class="transparent text-grey-8 q-py-md" bordered>
			<div class="row q-px-sm">
				<div class="col-xs-12 col-md-6">
					Copyright © {{ new Date().getFullYear() }}. All rights
					reserved.
				</div>
				<div class="col-xs-12 col-md-6 text-bold text-right">
					Juan Antonio Chávez
				</div>
			</div>
		</q-footer>
	</q-layout>
</template>

<style>
.q-header.bg-blur {
	background: rgb(0, 0, 0, 0.75) !important;
	--tw-backdrop-blur: blur(8px);
	-webkit-backdrop-filter: blur(8px);
	backdrop-filter: blur(8px);
}

.body--dark .q-header {
	background: transparent;
}

.brand-font {
	font-family: "Minnie Regular";
	font-size: 44px;
	text-decoration: none;
	color: black;
}

.body--dark .brand-font {
	color: white;
}

.q-header .q-toolbar,
.q-page-container,
.q-footer .row {
	max-width: 80rem;
	margin: auto;
}

.text-gray-7 {
	color: rgb(107, 114, 128);
}

.q-table__top {
	gap: 1rem;
}
</style>
