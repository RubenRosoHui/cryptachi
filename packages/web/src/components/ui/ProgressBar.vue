<template>
	<div class="progress-bar">
		<div class="progress" :style="progressStyle" />
	</div>
</template>

<script>
	export default {
		name: 'ProgressBar',
		props: {
			total: {
				type: Number,
				required: true
			},
			progress: {
				type: Number,
				required: true
			}
		},
		computed: {
			progressStyle() {
				const progress = Math.floor(this.progress / this.total * 100);
				return { width: progress.toString() + '%' };
			}
		}
	}
</script>

<style scoped>
	div.progress-bar {
		height: 30px;
		border: 3px solid var(--cyan);
	}

	div.progress {
		background-color: var(--cyan-dark);
		height: 100%;
		transition-property: width;
		transition-duration: 0.3s;
		transition-timing-function: linear;
	}
</style>
