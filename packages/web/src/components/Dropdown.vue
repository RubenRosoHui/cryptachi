<template>
	<teleport to="body">
		<div class="backdrop" />
	</teleport>
	<div class="dropdown-container">
		<h1>This is the dropdown</h1>
		<img :src="buttonImgUrl" />
		<div v-if="showContents" class="dropdown-content">
			<slot />
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Dropdown',
		props: {
			showContents: { type: Boolean, required: false, default: false },
			buttonImgUrl: { type: String, required: false, default: require('../assets/icons/svg/fi-rr-menu-burger.svg') }
		}
	};
</script>

<style scoped>
</style>
