<template>
	<div class="textbox-container">
		<div class="textbox" :class="textboxStyles">
			<div class="form-control ti-container">
				<label class="hidden" for="check-alias">Check Alias</label>
				<input id="check-alias" :value="alias" type="text" name="alias" @input="onAliasInput" :disabled="disable"/>
			</div>
			<div class="form-control sel-container">
				<label class="hidden" for="domains-dropdown">Select Domain</label>
				<select id="domains-dropdown" name="domain" ref="domainsDropdown" @change="onDomainChange" :disabled="disable">
					<option value="cryptachi.com" label=".cryptachi.com" selected />
					<option value="test.com" label=".test.com" />
				</select>
			</div>
		</div>
		<div v-if="alias && !disable" class="message">
			<p v-if="isAliasAvailable" class="success">Alias is available!</p>
			<p v-else class="error">Alias is taken!</p>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'SearchAliasField',
		emits: ['aliasChange', 'domainChange'],
		props: { disable: Boolean },
		data: () => ({
			isAliasAvailable: true,
			domain: '',
			alias: ''
		}),
		mounted() {
			this.domain = this.$refs.domainsDropdown.value;
			this.$emit('domainChange', this.$refs.domainsDropdown.value);
		},
		methods: {
			onAliasInput($event) {
				this.alias = $event.target.value;
				this.$emit('aliasChange', this.alias);
			},
			onDomainChange($event) {
				this.domain = $event.target.value;
				this.$emit('domainChange', this.domain);
			},
			setAlias(alias) {
				this.alias = alias;
				this.$emit('aliasChange', this.alias);
			}
		},
		computed: {
			textboxStyles() {
				return { disabled: this.disable };
			}
		}
	}
</script>

<style scoped>
	.textbox-container {
		position: relative;
	}
	.textbox {
		display: flex;
		flex-wrap: wrap;
		background-color: var(--black-darkest);
		border: 3px solid var(--black-light);
		padding: var(--spacing-1);
		font-size: var(--font-md);
		transition: border-color 0.3s linear;
	}
	.textbox:focus-within {
		border-color: var(--cyan);
	}
	.textbox.disabled {
		cursor: not-allowed;
		border-color: var(--black);
	}
	.textbox.disabled select {
		color: var(--black);
		background-color: var(--black-dark);
	}

	.form-control.sel-container,
	.form-control.ti-container {
		margin-top: 0;
	}

	select {
		font-size: inherit;
	}
	.ti-container {
		flex: 1;
	}
	.message {
		position: absolute;
		right: 0;
	}

	input[type="text"] {
		border: none;
		text-align: right;
		padding: 0 var(--spacing-2);
	}
</style>
