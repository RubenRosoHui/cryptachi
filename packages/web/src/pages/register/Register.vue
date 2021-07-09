<template>
	<div class="registration-section-container">
		<div class="signup-section-container">
			<h1>Sign Up</h1>
			<form @submit.prevent="">
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
					<search-alias-field @aliasChange="onAliasChange" @domainChange="onDomainChange" :disable="form.fields.createAliasLater.value"/>
				</div>
				<div class="form-control">
					<label for="create-alias-later" class="font-sm cyan bold checkbox-container">
						<input id="create-alias-later" type="checkbox" name="createAliasLater" v-model="form.fields.createAliasLater.value" />
						<span class="checkbox">Create Alias Later</span>
					</label>
				</div>
				<div class="form-control">
					<button type="submit" class="base-button" :disabled="form.fields.createAliasLater.value">PURCHASE ALIAS</button>
					<button type="submit" class="hollow-button">FREE SIGN UP</button>
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
			suggestions: ['faster', 'fester', 'feaster', 'pfister', 'fastr', 'fuster', 'foister', 'fosterer', 'fasta', 'foerster', 'falster']
		}),
		methods: {
			onAliasChange(alias) {
				this.form.fields.alias.value = alias;
			},
			onDomainChange(domain) {
				this.form.fields.domain.value = domain;
			},
			setAliasField(suggestion) {
				// TODO: Move window focus to alias field
				console.log(suggestion);
			}
		},
		components: { SearchAliasField }
	}
</script>

<style scoped>
	.registration-section-container {
		padding: var(--spacing-10) var(--spacing-4);
		background-color: var(--black-dark);
	}
	.suggestions-section-container {
		margin-top: var(--spacing-8);
		padding-top: var(--spacing-4);
		border-top: 1px solid var(--black);
	}

	.suggestions-list > li {
		border: 1px solid var(--cyan);
		color: var(--cyan);
		text-align: center;
		padding: var(--spacing-3);
		margin-top: var(--spacing-4);
		user-select: none;
		font-weight: bold;
		transition-property: border-color, color;
		transition-duration: 0.3s;
		transition-timing-function: linear;
		cursor: pointer;
		width: 50%;
	}
	.suggestions-list > li:hover {
		border-color: var(--yellow);
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
</style>
