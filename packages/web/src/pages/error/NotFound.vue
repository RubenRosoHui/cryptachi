<template>
	<div class="base-container text-align-center error">
		<img src="../../assets/icons/svg/fi-rr-ban.svg" class="icon-100 red-filter"/>
		<h1>Page Not Found</h1>
		<p>The page you are looking for was not found.</p>
		<div>
			<router-link id="link-return-home" to="/">Go back home</router-link>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'NotFound'
	}
</script>

<style scoped>
	.base-container * {
		margin-top: var(--spacing-4);
	}
	.base-container *:first-child {
		margin-top: 0;
	}
	h1 {
		color: var(--red);
	}
	#link-return-home {
	}
</style>
