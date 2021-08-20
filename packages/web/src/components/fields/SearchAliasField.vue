<template>
	<div class="textbox-container">
		<div class="textbox" :class="textboxStyles">
			<div class="form-control ti-container">
				<label class="hidden" for="check-alias">Check Alias</label>
				<input id="check-alias" :value="alias.value" type="text" name="alias" @input="onAliasInput" :disabled="disable"/>
			</div>
			<div class="form-control sel-container">
				<label class="hidden" for="domains-dropdown">Select Domain</label>
				<select id="domains-dropdown" name="domain" ref="domainsDropdown" @change="onDomainChange" :disabled="disable" v-model="domain">
					<option v-for="(domain, i) in availableDomains" :key="i" :value="domain" :label="'.' + domain" />
				</select>
			</div>
		</div>
		<div v-if="!disable" class="message">
			<p v-if="alias.successMessage && alias.value" class="success">{{ alias.successMessage }}</p>
			<p v-else-if="alias.errorMessage" class="error">{{ alias.errorMessage }}</p>
		</div>
	</div>
</template>

<script>
	import validator from 'validator';
	import { supported }from '@cryptachi/common'

	export default {
		name: 'SearchAliasField',
		emits: ['aliasChange', 'domainChange', 'validate'],
		props: {
			disable: Boolean,
			aliasRequired: { type: Boolean, default: true }
		},
		data: () => ({
			domain: '',
			alias: {
				value: '',
				errorMessage: '',
				successMessage: '',
				isValid: false,
				isAvailable: true
			},
			availableDomains: []
		}),
		beforeMount() {
			if (process.env.ACTUAL_ENV === 'production') {
				this.availableDomains = supported.domains;
			} else {
				this.availableDomains = ['cryptachi.com', 'cryptachitest.com'];
			}
		},
		mounted() {
			this.domain = this.availableDomains[0];
			this.$emit('domainChange', this.domain);
		},
		methods: {
			async onAliasInput($event) {
				this.alias.value = $event.target.value;
				await this.validateAlias();
				this.$emit('aliasChange', this.alias.value);
			},
			async onDomainChange($event) {
				this.domain = $event.target.value;
				await this.validateAlias();
				this.$emit('domainChange', this.domain);
			},
			setAlias(alias) {
				this.alias.value = alias;
				this.$emit('aliasChange', this.alias.value);
			},
			setDomain(domain) {
				this.domain = domain;
				this.$emit('domainChange', this.domain);
			},
			async validateAlias() {
				const alias = this.alias;

				if (this.aliasRequired && validator.isEmpty(alias.value)) {
					alias.errorMessage = 'Alias is required.';
					alias.successMessage = '';
					alias.isValid = false;
				}
				else if (alias.value && !validator.isAlphanumeric(alias.value)) {
					alias.errorMessage = 'Alias can only contain alphanumeric characters.';
					alias.successMessage = '';
					alias.isValid = false;
				}
				else if (alias.value && !(await this.checkAvailability())) {
					alias.isValid = false;
				}
				else {
					alias.errorMessage = '';
					alias.isValid = true;
				}

				this.$emit('validate', { isValid: alias.isValid, errorMessage: alias.errorMessage });
			},
			async checkAvailability() {
				// REVIEW: Make this more efficient by only running this check when
				// the user has stopped typing. You could probably use setTimeout.

				const domain = this.domain;
				const alias = this.alias.value;

				const user = this.$store.getters.user;
				const email = user ? this.$store.getters.user.email : '';

				const query = `names=${alias}&domain=${domain}&email=${email}`;

				const response = await fetch(`/api/aliases?${query}`, { method: 'GET' });

				if (!response.ok) throw Error('Unable to check alias availability.');

				const availableAliases = await response.json();

				if (availableAliases.includes(alias.toLowerCase())) {
					this.alias.errorMessage = '';
					this.alias.isAvailable = true;
					this.alias.successMessage = 'Alias is available.';
					return true;
				} else {
					this.alias.successMessage = '';
					this.alias.isAvailable = false;
					this.alias.errorMessage = 'Alias is taken.';
					return false;
				}
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
		left: 0;
	}

	input[type="text"] {
		border: none;
		text-align: right;
		padding: 0 var(--spacing-2);
	}
</style>
