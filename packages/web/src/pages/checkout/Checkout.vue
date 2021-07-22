<template>
	<div class="base-container">
		<h1>Checkout</h1>
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		name: 'Checkout'
	}
</script>

<style scoped>
	.base-container {
		max-width: 800px;
	}
	h1 {
		text-align: center;
	}
</style>
