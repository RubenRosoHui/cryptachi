<template>
	<p class="text-align-center" :class="messageStyles">
		{{ message }}
	</p>
</template>

<script>
	export default {
		name: 'FormMessage',
		props: {
			message: { type: String, required: true },
			type: { type: String, required: false, default: 'error' }
		},
		computed: {
			messageStyles() {
				const styles = {};

				if (this.type === 'success') styles.success = true;
				else styles.error = true;

				return styles;
			}
		}
	}
</script>

<style scoped>
	p {
		margin-top: var(--spacing-4);
	}

	.error:before {
		content: "ERROR: "
	}
	.success:before {
		content: "SUCCESS: "
	}
</style>
