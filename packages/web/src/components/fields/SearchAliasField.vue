<template>
	<div class="textbox-container">
		<div class="textbox">
			<div class="form-control ti-container">
				<label class="hidden" for="check-alias">Check Alias</label>
				<input id="check-alias" type="text" name="alias" @input="onAliasInput"/>
			</div>
			<div class="form-control sel-container">
				<label class="hidden" for="domains-dropdown">Select Domain</label>
				<select id="domains-dropdown" name="domain" ref="domainsDropdown" @change="onDomainChange">
					<option value="cryptachi.com" label=".cryptachi.com" selected />
					<option value="test.com" label=".test.com" />
				</select>
			</div>
		</div>
		<div v-if="alias" class="message">
			<p v-if="isAliasAvailable" class="success">Alias is available!</p>
			<p v-else class="error">Alias is taken!</p>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'SearchAliasField',
		emits: ['aliasChange', 'domainChange'],
		data: () => ({
			isAliasAvailable: true,
			domain: '',
			alias:''
		}),
		mounted() {
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
	}
	.textbox:focus-within {
		border-color: var(--cyan);
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
