<template>
	<teleport to="body">
		<div class="backdrop" v-if="show" @click="onClose" />
		<dialog v-if="show">
			<header>
				<slot name="header">
					<h1>Base Dialog</h1>
				</slot>
			</header>
			<div class="dialog-content">
				<slot></slot>
			</div>
		</dialog>
	</teleport>
</template>

<script>
	export default {
		name: 'BaseDialog',
		emits: ['close'],
		props: {
			show: { type: Boolean, required: true }
		},
		methods: {
			onClose() {
				this.$emit('close');
			}
		}
	}
</script>

<style scoped>
	dialog {
		display: block;
		position: fixed;
		top: 10vh;
		z-index: 11;
		background-color: var(--black-dark);
		color: var(--text);
		border: 3px solid var(--black);
		margin: 0 auto;
		width: 90%;
		max-width: 600px;
	}

	header,
	.dialog-content {
		padding: var(--spacing-4);
	}
</style>
