<template>
	<div class="registration-section-container base-container">
		<div class="signup-section-container" id="signup-section">
			<h1>Sign Up</h1>
			<form @submit.prevent="submitForm">
				<div class="form-control">
					<label for="email" class="hidden">Email</label>
					<input id="email" type="email" name="email" placeholder="Email" v-model="form.fields.email.value" />
				</div>
				<div class="form-control">
					<label for="password" class="hidden">Password</label>
					<input id="password" type="password" name="password" placeholder="Password" v-model="form.fields.password.value" />
				</div>
				<div class="form-control">
					<label for="confirm-password" class="hidden">Confirm Password</label>
					<input id="confirm-password" type="password" name="confirmPassword" placeholder="Confirm Password" v-model="form.fields.confirmPassword.value" />
				</div>
				<div class="form-control">
					<search-alias-field ref="searchAliasField" @aliasChange="onAliasChange" @domainChange="onDomainChange" :disable="form.fields.createAliasLater.value"/>
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
		</div>
		<div class="suggestions-section-container">
			<h1>Suggestions</h1>
			<p class="subtitle-2">Still making up your mind? Check out the ones below.</p>
			<ul class="suggestions-list">
				<li v-for="(suggestion, i) in suggestions" :key="i" @click="setAliasField(suggestion)">{{ suggestion }}</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import SearchAliasField from '../../components/fields/SearchAliasField.vue';

	export default {
		name: 'RegistrationPage',
		components: { SearchAliasField },
		data: () => ({
			form: {
				fields: {
					email: { value: '', isValid: false, errorMessage: '' },
					password: { value: '', isValid: false, errorMessage: '' },
					confirmPassword: { value: '', isValid: false, errorMessage: '' },
					alias: { value: '', isValid: false, errorMessage: '' },
					domain: { value: '' },
					createAliasLater: { value: false }
				},
				isValid: false,
				errorMessage: ''
			},
			suggestions: ['faster', 'fester', 'feaster', 'pfister', 'fastr', 'fuster', 'foister', 'fosterer', 'fasta', 'foerster', 'falster', 'feister', 'fest', 'fetter', 'festers', 'festered', 'festa', 'fessed', 'fenster']
		}),
		methods: {
			onAliasChange(alias) {
				this.form.fields.alias.value = alias;
			},
			onDomainChange(domain) {
				this.form.fields.domain.value = domain;
			},
			setAliasField(suggestion) {
				this.$refs.searchAliasField.setAlias(suggestion);
				this.$router.push('#signup-section');
			},
			submitForm($event) {
				if ($event.submitter.innerText === 'PURCHASE ALIAS') console.log('You want to purchase this alias!');
				else console.log('You want to sign up for free!');
			}
		}
	}
</script>

<style scoped>
	.registration-section-container {
		padding: var(--spacing-10) var(--spacing-4);
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
		transition-property: color;
		transition-duration: 0.3s;
		transition-timing-function: linear;
		cursor: pointer;
		width: 50%;
	}
	.suggestions-list > li:hover {
		color: var(--yellow);
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
