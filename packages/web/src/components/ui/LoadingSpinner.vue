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
