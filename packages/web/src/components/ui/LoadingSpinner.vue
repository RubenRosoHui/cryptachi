<template>
	<img class="spinner yellow-filter" :style="spinnerStyles" src="../../assets/icons/svg/fi-rr-spinner-alt.svg"/>
</template>

<script>
	export default {
		name: 'LoadingSpinner',
		props: {
			size: {
				type: Number,
				required: false,
				default: 100
			}
		},
		computed: {
			spinnerStyles() {
				const styles = {};
				styles.width = this.size + 'px';
				return styles;
			}
		}
	}
</script>

<style scoped>
	.spinner {
		animation: spin 3s infinite;
		animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>>
