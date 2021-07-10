<template>
	<nav>
		<ul>
			<li>Aliases</li>
			<li>Security</li>
			<li>Purchases</li>
		</ul>
	</nav>
	<div class="base-section">
		<router-view />
	</div>
</template>

<script>
	export default {
		name: 'AccountPage'
	}
</script>

<style scoped>
</style>
