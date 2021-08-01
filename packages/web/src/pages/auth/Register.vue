<template>
	<div class="registration-section-container base-container">
		<div class="signup-section-container" id="signup-section">
			<h1>Sign Up</h1>
			<form @submit.prevent="submitForm">
				<div class="form-control">
					<label for="email" class="hidden">Email</label>
					<input id="email" type="email" name="email" placeholder="Email" v-model="form.fields.email.value" @input="validateEmail" />
					<p v-if="form.fields.email.errorMessage" class="error">{{ form.fields.email.errorMessage }}</p>
				</div>
				<div class="form-control">
					<label for="password" class="hidden">Password</label>
					<input id="password" type="password" name="password" placeholder="Password" v-model="form.fields.password.value" @input="validatePassword" />
					<p v-if="form.fields.password.errorMessage" class="error">{{ form.fields.password.errorMessage }}</p>
				</div>
				<div class="form-control">
					<label for="confirm-password" class="hidden">Confirm Password</label>
					<input id="confirm-password" type="password" name="confirmPassword" placeholder="Confirm Password" v-model="form.fields.confirmPassword.value" @input="validateConfirmPassword" />
					<p v-if="form.fields.confirmPassword.errorMessage" class="error">{{ form.fields.confirmPassword.errorMessage }}</p>
				</div>
				<div class="form-control">
					<search-alias-field
						ref="searchAliasField"
						@aliasChange="onAliasChange"
						@domainChange="onDomainChange"
						@validate="onAliasFieldValidate"
						:disable="form.fields.createAliasLater.value"
						:aliasRequired="!form.fields.createAliasLater.value"
					/>
				</div>
				<div class="form-control" id="checkboxes">
					<label for="create-alias-later" class="font-sm cyan bold checkbox-container">
						<input id="create-alias-later" type="checkbox" name="createAliasLater" v-model="form.fields.createAliasLater.value" />
						<span class="checkbox">Create Alias Later</span>
					</label>
				</div>
				<div class="form-control" id="form-buttons">
					<button type="submit" class="base-button" id="purchase-button" :disabled="form.fields.createAliasLater.value">PURCHASE ALIAS</button>
					<button type="submit" class="hollow-button" id="signup-button">FREE SIGN UP</button>
				</div>
			</form>
			<form-message v-show="form.message" :message="form.message" type="error" class="text-align-right" />
		</div>
		<div class="suggestions-section-container">
			<h1>Suggestions</h1>
			<p class="subtitle-2">Still making up your mind? Check out the ones below.</p>
			<div v-if="isLoadingSuggestions" class="text-align-center margin-top-16">
				<loading-spinner />
				<p class="yellow bold margin-top-4">Loading suggestions. Please standby...</p>
			</div>
			<ul v-else-if="suggestions.length > 0 && !form.fields.createAliasLater.value" class="suggestions-list">
				<li v-for="(suggestion, i) in suggestions" :key="i" @click="setAliasField(suggestion)">{{ suggestion }}</li>
			</ul>
			<div v-else class="text-align-center margin-top-16">
				<img src="../../assets/icons/svg/fi-rr-ban.svg" class="red-filter icon-100" />
				<p class="error margin-top-4">No suggestions to show.<br/>Start typing on the search box to get some suggestions.</p>
			</div>
		</div>
	</div>
</template>

<script>
	import validator from 'validator';

	import SearchAliasField from '../../components/fields/SearchAliasField.vue';

	let suggestionsTimeoutID;

	export default {
		name: 'RegistrationPage',
		components: { SearchAliasField },
		data: () => ({
			suggestions: [],
			isLoadingSuggestions: false,
			form: {
				fields: {
					email: { value: '', isValid: false, errorMessage: '' },
					password: { value: '', isValid: false, errorMessage: '' },
					confirmPassword: { value: '', isValid: false, errorMessage: '' },
					alias: { value: '', isValid: false, required: false },
					domain: { value: '', isValid: true },
					createAliasLater: { value: false, isValid: true }
				},
				isValid: false,
				message: ''
			}
		}),
		mounted() {
			this.$refs.searchAliasField.setAlias(this.$route.query.alias || '');

			if (this.$route.query.domain)
				this.$refs.searchAliasField.setDomain(this.$route.query.domain);
		},
		methods: {
			onAliasFieldValidate({ isValid }) {
				this.form.fields.alias.isValid = isValid;
			},
			onAliasChange(alias) {
				this.form.fields.alias.value = alias;

				if (suggestionsTimeoutID) {
					clearTimeout(suggestionsTimeoutID);
				}

				suggestionsTimeoutID = setTimeout(async () => {
					this.isLoadingSuggestions = true;
					this.suggestions = await this.getSuggestions(alias, this.form.fields.domain.value);
					this.isLoadingSuggestions = false;
				}, 1000);
			},
			onDomainChange(domain) {
				this.form.fields.domain.value = domain;
			},
			async setAliasField(value) {
				this.$refs.searchAliasField.setAlias(value);
				await this.$refs.searchAliasField.validateAlias();
				this.$router.push('#signup-section');
			},
			validateEmail() {
				const email = this.form.fields.email;

				email.isValid = true;

				if (validator.isEmpty(email.value))
					email.errorMessage = 'Email is required.';
				else if (!validator.isEmail(email.value))
					email.errorMessage = 'Invalid Email';
				else
					email.errorMessage = '';

				if (email.errorMessage) email.isValid = false;
			},
			validatePassword() {
				const password = this.form.fields.password;

				password.isValid = true;

				if (validator.isEmpty(password.value))
					password.errorMessage = 'Password is required.';
				else if (!validator.isLength(password.value, { max: 100 }))
					password.errorMessage = 'Password cannot exceed 100 characters.';
				else if (!validator.isStrongPassword(password.value))
					password.errorMessage = 'Weak password. Passwords must have a minimum of 8 characters, 1 uppercase letter, 1 number, and 1 symbol.';
				else
					password.errorMessage = '';

				if (password.errorMessage) password.isValid = false;

				this.validateConfirmPassword();
			},
			validateConfirmPassword() {
				const password = this.form.fields.password;
				const confirmPassword = this.form.fields.confirmPassword;

				if (validator.isEmpty(confirmPassword.value))
					confirmPassword.errorMessage = 'Confirm Password is required.';
				else if (confirmPassword.value !== password.value)
					confirmPassword.errorMessage = 'Passwords do not match';
				else
					confirmPassword.errorMessage = '';

				confirmPassword.isValid = confirmPassword.errorMessage ? false : true;
			},
			async validateForm() {
				this.validateEmail();
				this.validatePassword();
				await this.$refs.searchAliasField.validateAlias();

				this.form.isValid = Object.keys(this.form.fields).every(field => this.form.fields[field].isValid === true);
				this.form.message = this.form.isValid ? '' : 'Some fields have errors.';
			},
			async submitForm($event) {
				await this.validateForm();
				if (!this.form.isValid) return;

				const alias = this.form.fields.alias.value;
				const domain = this.form.fields.domain.value;

				try {
					if ($event.submitter.innerText === 'PURCHASE ALIAS') {
						// User wants to purchase an alias.
						await this.$store.dispatch('register', {
							email: this.form.fields.email.value,
							password: this.form.fields.password.value,
							confirmPassword: this.form.fields.confirmPassword.value,
							alias,
							domain
						});

						this.$router.push(`/checkout/details?alias=${alias}&domain=${domain}`);
					}
					else {
						// User wants to sign up for free.
						const createAliasLater = this.form.fields.createAliasLater.value;

						await this.$store.dispatch('register', {
							email: this.form.fields.email.value,
							password: this.form.fields.password.value,
							confirmPassword: this.form.fields.confirmPassword.value,
							alias: createAliasLater ? undefined : alias,
							domain: createAliasLater ? undefined : domain
						});

						this.$router.push('/login');
					}
				} catch(err) {
					if (err instanceof Error) {
						this.form.message = err.message;
					} else {
						console.error(err);
					}
				}
			},
			async getSuggestions(alias, domain) {
				if (!alias || !domain) return [];

				// Pull list of suggestions from datamuse.
				const dmResponse = await fetch(`https://api.datamuse.com/words?sl=${alias}`);
				if (!dmResponse.ok) throw Error('Failed to get list of suggestion from Datamuse.');
				const dmSuggestions = await dmResponse.json();

				// Send the list to the server to determine availability.
				const query = `names=${dmSuggestions.map(s => s.word).join(',')}&domain=${domain}`;
				const serverResponse = await fetch(`/api/aliases?${query}`);
				if (!serverResponse.ok) throw Error('Failed to get list of suggestions from server.');
				const serverSuggestions = await serverResponse.json();

				return serverSuggestions
					.filter(suggestion => suggestion.toLowerCase() !== alias.toLowerCase() && validator.isAlphanumeric(suggestion))
					.slice(0, 21);
			}
		}
	}
</script>

<style scoped>
	.registration-section-container {
		width: 100%;
		height: 100%;
	}
	.suggestions-section-container {
		margin-top: var(--spacing-8);
		padding-top: var(--spacing-4);
		border-top: 1px solid var(--black);
	}

	.suggestions-list > li {
		background-color: var(--black-darkest);
		border-radius: 10px;
		color: var(--text-light);
		text-align: center;
		padding: var(--spacing-3);
		margin-top: var(--spacing-4);
		user-select: none;
		font-weight: bold;
		transition-property: color, background-color;
		transition-duration: 0.3s;
		transition-timing-function: linear;
		cursor: pointer;
		width: 50%;
	}
	.suggestions-list > li:hover {
		color: var(--yellow);
		background-color: var(--yellow-dark);
	}

	.form-control {
		margin-top: var(--spacing-4);
	}
	.form-control:nth-last-child(2) {
		margin-top: var(--spacing-8);
	}

	button[type="submit"] {
		display: block;
		width: 100%;
		margin-top: var(--spacing-8);
	}
	button[type="submit"]:last-of-type {
		margin-top: var(--spacing-4);
	}

	@media (min-width: 900px) {
		.registration-section-container {
			display: table;
		}
		.signup-section-container, .suggestions-section-container {
			display: table-cell;
			width: 50%;
		}
		.signup-section-container {
			padding-right: var(--spacing-4);
		}
		.suggestions-section-container {
			border-top: none;
			padding-top: 0;
			border-left: 1px solid var(--black);
			padding-left: var(--spacing-4);
		}
		.suggestions-list {
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
			column-gap: 0.5rem;
		}
		.suggestions-list > li {
			width: 200px;
		}

		#form-buttons {
			display: flex;
			justify-content: flex-end;
			margin-top: var(--spacing-8);
		}
		#signup-button, #purchase-button {
			margin-top: 0;
			width: 200px;
		}
		#signup-button {
			margin-left: var(--spacing-4);
		}
	}
</style>
