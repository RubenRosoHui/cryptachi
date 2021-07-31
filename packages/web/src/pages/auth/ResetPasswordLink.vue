<template>
	<div class="base-container">
		<h1 class="text-align-center">Reset Password Link</h1>
		<form @submit.prevent="submitForm">
			<div class="form-control">
				<label for="email" class="hidden">Email</label>
				<input id="email" type="email" name="email" placeholder="Email" v-model="form.fields.email.value" @input="validateEmail" />
				<p v-if="form.fields.email.errorMessage" class="error">{{ form.fields.email.errorMessage }}</p>
			</div>
			<div class="form-control text-align-right" id="form-buttons">
				<button type="submit" class="base-button">Send Link</button>
			</div>
		</form>
		<div v-if="isMessageVisible" class="margin-top-8 text-align-center">
			<p v-if="form.successMessage" class="success">{{ form.successMessage }}</p>
			<p v-if="form.errorMessage" class="error">{{ form.errorMessage }}</p>
		</div>
	</div>
</template>

<script>
	import validator from 'validator';
	import { handleResponse } from '../../lib/exception.js';

	export default {
		name: 'ResetPasswordLink',
		data: () => ({
			form: {
				fields: {
					email: {
						value: '',
						errorMessage: '',
						isValid: false
					}
				},
				errorMessage: '',
				successMessage: ''
			},
			isMessageVisible: false
		}),
		methods: {
			async submitForm() {
				this.validateEmail();
				const email = this.form.fields.email;
				if (!email.isValid) return;

				try {
					const response = await fetch(`/api/auth/reset?email=${email.value}`);

					await handleResponse(response);

					const jsonResponse = await response.json();

					this.form.successMessage = jsonResponse.message;
					this.form.errorMessage = '';
					this.form.fields.email.value = '';
				} catch (err) {
					this.form.successMessage = '';
					this.form.errorMessage = err.message;
				}

				this.showMessage();
			},
			validateEmail() {
				const email = this.form.fields.email;

				if (validator.isEmpty(email.value)) {
					email.errorMessage = 'Email is required.';
				}
				else if (!validator.isEmail(email.value)) {
					email.errorMessage = 'Invalid email.';
				}
				else {
					email.errorMessage = '';
				}

				email.isValid = !email.errorMessage;
			},
			showMessage() {
				this.isMessageVisible = true;

				setTimeout(() => {
					this.isMessageVisible = false;
				}, 10000);
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

	.success:before {
		content: "SUCCESS: ";
	}
	.error:before {
		content: "ERROR: ";
	}
</style>
