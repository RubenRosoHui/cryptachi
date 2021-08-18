<template>
	<div class="base-container text-align-center">
		<h1 class="margin-bottom-4">Two Factor Authentication</h1>
		<p>Enter the 6-digit code from your authenticator app.</p>
		<form @submit.prevent="login">
			<div class="form-control">
				<label for="otp" class="hidden">OTP</label>
				<input id="otp" type="text" name="otp" placeholder="6-digit Code" v-model="otp.value" />
				<p v-if="otp.errorMessage" class="error text-align-left">{{ otp.errorMessage }}</p>
			</div>
			<div class="form-control text-align-right">
				<recaptcha-button
					ref="captchaBtn"
					:disabled="!enableSubmit"
					@verify="onCaptchaVerify"
					@expire="onCaptchaExpire"
					@fail="onCaptchaFail"
				>Submit</recaptcha-button>
			</div>
		</form>
	</div>
</template>

<script>
	import captchaMixin from '../../mixins/captcha.js';

	export default {
		name: 'TwoFactor',
		mixins: [captchaMixin],
		props: {
			email: { type: String, required: true },
			password: { type: String, required: true }
		},
		data: () => ({
			otp: { value: '', errorMessage: '' },
			enableSubmit: false
		}),
		methods: {
			async onCaptchaVerify(response) {
				this.enableSubmit = false;
				this.captchaResponse = response;
				await this.login();
				this.captchaReset();
				this.enableSubmit = true;
			},
			onCaptchaFail() {
				this.otp.errorMessage = 'Captcha verification failed. Please try again.';
				this.captchaReset();
			},
			async login() {
				try {
					await this.$store.dispatch('login', {
						email: this.email,
						password: this.password,
						authCode: this.otp.value.replaceAll(' ', ''),
						captchaResponse: this.captchaResponse
					});

					this.$router.push('/account');
				} catch(err) {
					this.otp.errorMessage = err.message;
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
