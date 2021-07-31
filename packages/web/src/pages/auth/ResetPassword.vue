<template>
	<div class="base-container">
		<h1 class="text-align-center">Reset Password</h1>
		<form @submit.prevent="submitForm">
			<div class="form-control">
				<label for="password" class="hidden">New Password</label>
				<input id="password" type="password" name="password" placeholder="New Password" v-model="form.fields.password.value" @input="validatePassword"/>
				<p v-if="form.fields.password.errorMessage" class="error">{{  form.fields.password.errorMessage }}</p>
			</div>
			<div class="form-control">
				<label for="confirm-password" class="hidden">Confirm New Password</label>
				<input id="confirm-password" type="password" name="confirmPassword" placeholder="Confirm New Password" v-model="form.fields.confirmPassword.value" @input="validateConfirmPassword"/>
				<p v-if="form.fields.confirmPassword.errorMessage" class="error">{{  form.fields.confirmPassword.errorMessage }}</p>
			</div>
			<div class="form-control text-align-right" id="form-buttons">
				<button type="submit" class="base-button" :disabled="!form.enableSubmit">Submit</button>
			</div>
		</form>
		<div v-if="isMessageVisible" class="text-align-center margin-top-8">
			<p v-if="form.successMessage" class="success">SUCCESS: {{ form.successMessage }}</p>
			<p v-if="form.errorMessage" class="error">ERROR: {{ form.errorMessage }}</p>
		</div>
	</div>
</template>

<script>
	import validator from 'validator';
	import { handleResponse } from '../../lib/exception.js';

	export default {
		name: 'ResetPassword',
		props: {
			token: { type: String, required: true },
			email: { type: String, required: true }
		},
		data: () => ({
			form: {
				fields: {
					password: { value: '', errorMessage: '', isValid: false },
					confirmPassword: { value: '', errorMessage: '', isValid: false }
				},
				successMessage: '',
				errorMessage: '',
				isValid: false,
				enableSubmit: true
			},
			isMessageVisible: false,

		}),
		methods: {
			async submitForm() {
				this.validateForm();
				if (!this.form.isValid) return;

				const password = this.form.fields.password.value;
				const confirmPassword = this.form.fields.confirmPassword.value;

				try {
					const response = await fetch('/api/auth/reset', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							email: this.email,
							token: this.token,
							password,
							confirmPassword
						})
					});

					await handleResponse(response);

					const jsonResponse = await response.json();

					this.form.errorMessage = '';
					this.form.successMessage = `${jsonResponse.message}. You will be redirected to the login page in 10 seconds...`;
					this.form.enableSubmit = false;
				}
				catch (err) {
					this.form.errorMessage = err.message;
					this.form.successMessage = '';
				}

				this.isMessageVisible = true;

				setTimeout(() => {
					this.isMessageVisible = false;
					if (this.form.successMessage) {
						this.$router.push('/login');
					}
				}, 10000);
			},
			validatePassword() {
				const password = this.form.fields.password;

				if (validator.isEmpty(password.value)) {
					password.errorMessage = 'Password is required.';
				}
				else if (!validator.isLength(password.value, { max: 100 })) {
					password.errorMessage = 'Password cannot exceed 100 characters.';
				}
				else if (!validator.isStrongPassword(password.value)) {
					password.errorMessage = 'Weak password. Passwords must have a minimum of 8 characters, 1 uppercase letter, 1 number, and 1 symbol.';
				}
				else {
					password.errorMessage = '';
				}

				password.isValid = !password.errorMessage;

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

				confirmPassword.isValid = !confirmPassword.errorMessage;
			},
			validateForm() {
				this.validatePassword();

				this.form.isValid = Object.keys(this.form.fields).every(field => this.form.fields[field].isValid === true);
				this.form.message = this.form.isValid ? '' : 'Some fields have errors.';
			}
		}
	}
</script>

<style scoped>
	form {
		max-width: 500px;
		margin: 0 auto;
	}
	.form-control {
		margin-top: var(--spacing-4);
	}
	.form-control:last-child {
		margin-top: var(--spacing-8);
	}
</style>
