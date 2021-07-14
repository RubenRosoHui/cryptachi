<template>
	<base-dialog :show="show" @close="close">
		<template v-slot:header>
			<h1>{{ title }}</h1>
		</template>
		<div class="content">
			{{ content }}
		</div>
		<menu class="controls">
			<li v-if="type === 'confirm'">
				<button class="base-button cancel" @click="close">Cancel</button>
			</li>
			<li>
				<button class="base-button" @click="confirm">{{ type === 'confirm' ? 'Confirm' : 'OK' }}</button>
			</li>
		</menu>
	</base-dialog>
</template>

<script>
	import BaseDialog from './BaseDialog.vue';

	export default {
		name: 'BaseConfirm',
		components: { BaseDialog },
		data: () => ({
			title: 'Are you sure?',
			content: null,
			show: false,
			confirmCb: null,
			type: 'confirm' // NOTE: Valid values: 'confirm', 'ok'
		}),
		methods: {
			initialize() {
				this.title = 'Are you sure?';
				this.content = null;
				this.show = false;
				this.confirmCb = null;
				this.type = 'confirm';
			},
			confirm() {
				if (this.confirmCb) {
					this.confirmCb();
				}
				this.initialize();
			},
			close() {
				this.initialize();
			}
		}
	}
</script>

<style scoped>
	menu.controls {
		list-style: none;
		display: flex;
		justify-content: space-evenly;
		margin-top: var(--spacing-8);
	}

	button.cancel {
		background-color: var(--red);
	}
</style>
