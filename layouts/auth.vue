<template>
	<q-layout view="hHh lpR fFf">
		<q-page-container>
			<div class="gradient"></div>
			<q-page class="flex flex-center">
				<QCard flat class="card-login">
					<QCardSection class="text-center">
						<span class="brand-font"> CMC </span>
						<div class="row justify-center">
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
						</div>
					</QCardSection>
					<QCardSection class="q-px-lg q-pt-none">
						<slot></slot>
					</QCardSection>
				</QCard>
			</q-page>
		</q-page-container>
	</q-layout>
</template>

<script lang="ts" setup></script>

<style>
.card-login {
	min-width: min(400px, 90vw);
	max-width: min(400px, 90vw);
	background-color: #ffffff04;
	border-radius: 0.75rem;
	border: 1px solid rgb(31, 41, 55);
	& .title {
		font-size: 1.5rem;
		line-height: 2rem;
		font-weight: 600;
	}
	& .sub-title {
		font-size: 1rem;
		line-height: 1.5rem;
	}
}

.brand-font {
	font-family: "Minnie Regular";
	font-size: 50px;
	color: white;
}

.gradient {
	background: radial-gradient(
		50% 50% at 50% 50%,
		rgb(56, 189, 248, 0.12) 0,
		rgb(3, 7, 18)
	);
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	pointer-events: none;
	position: absolute;
}
</style>
