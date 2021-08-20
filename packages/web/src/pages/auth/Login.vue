<template>
	<div class="base-container">
		<h1 class="text-align-center">Login</h1>
		<form @submit.prevent="login">
			<div class="form-control">
				<label for="email" class="hidden">Email</label>
				<input id="email" type="email" name="email" placeholder="Email" v-model="form.fields.email.value" @input="validateEmail" />
				<p v-if="form.fields.email.errorMessage" class="error text-align-center">{{ form.fields.email.errorMessage }}</p>
			</div>
			<div class="form-control">
				<label for="password" class="hidden">Password</label>
				<input id="password" type="password" name="password" placeholder="Password" v-model="form.fields.password.value" @input="validatePassword" />
				<p v-if="form.fields.password.errorMessage" class="error text-align-center">{{ form.fields.password.errorMessage }}</p>
				<p class="text-align-center margin-top-2">Forgot your password? Click <router-link to="/reset-password-link">here</router-link>.</p>
			</div>
			<div class="form-control text-align-right" id="form-buttons">
				<recaptcha-button
					ref="captchaBtn"
					:disabled="form.enableSubmit"
					@verify="onCaptchaVerify"
					@expire="onCaptchaExpire"
					@fail="onCaptchaFail"
				>LOGIN</recaptcha-button>
			</div>
		</form>
		<form-message v-show="form.message" :message="form.message" type="error" />
	</div>
</template>

<script>
	import validator from 'validator';
	import captchaMixin from '../../mixins/captcha.js';

	export default {
		name: 'LoginPage',
		mixins: [captchaMixin],
		data: () => ({
			form: {
				fields: {
					email: { value: '', errorMessage: '', isValid: false },
					password: { value: '', errorMessage: '', isValid: false }
				},
				isValid: false,
				message: '',
				enableSubmit: true
			}
		}),
		methods: {
			async onCaptchaVerify(response) {
				this.form.enableSubmit = false;
				this.captchaResponse = response;
				await this.login();
				this.captchaReset();
				this.form.enableSubmit = true;
			},
			onCaptchaFail() {
				this.form.message = 'Captcha verification failed. Please try again.';
				this.captchaReset();
			},
			validateEmail() {
				const email = this.form.fields.email;

				email.isValid = true;

				if (validator.isEmpty(email.value)) email.errorMessage = 'Email is required.';
				else if (!validator.isEmail(email.value)) email.errorMessage = 'Invalid Email';
				else email.errorMessage = '';

				if (email.errorMessage) email.isValid = false;
			},
			validatePassword() {
				const password = this.form.fields.password;

				password.isValid = true;

				if (validator.isEmpty(password.value))
					password.errorMessage = 'Password is required.';
				else if (!validator.isLength(password.value, { max: 100 }))
					password.errorMessage = 'Password cannot exceed 100 characters.';
				else
					password.errorMessage = '';

				if (password.errorMessage) password.isValid = false;
			},
			validateForm() {
				this.validateEmail();
				this.validatePassword();

				this.form.isValid = Object.keys(this.form.fields).every(field => this.form.fields[field].isValid === true);
			},
			async login() {
				this.validateForm();
				if (!this.form.isValid) return;

				try {
					await this.$store.dispatch('login', {
						email: this.form.fields.email.value,
						password: this.form.fields.password.value,
						captchaResponse: this.captchaResponse
					});

					this.$router.push('/account');
				} catch(err) {
					if (err.message === 'OTP is required' && err.name === 'AuthenticationError') {
						return this.$router.push({
							name: 'TwoFactor',
							params: {
								email: this.form.fields.email.value,
								password: this.form.fields.password.value
							}
						});
					}

					this.form.isValid = false;
					this.form.message = err.message;
				}
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
