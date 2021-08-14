<template>
	<div class="base-container text-align-center">
		<h1>Email Confirmation Required</h1>
		<img src="../../assets/icons/svg/fi-rr-envelope.svg" class="icon-150 margin-top-4 green-filter"/>
		<div class="margin-top-4">
			<p class="yellow bold">You must verify your email before you can access your account.</p>
			<p class="margin-top-2">A confirmation email should have been sent to your email address.</p>
			<p>If not, click the button below to resend the confirmation email.</p>
			<button class="base-button margin-top-4" @click="sendEmailConfirmation">Send Confirmation Email</button>
		</div>
		<div class="margin-top-4">
			<p class="success" v-if="successMessage">{{ successMessage }}</p>
			<p class="error" v-if="errorMessage">{{ errorMessage }}</p>
		</div>
	</div>
</template>

<script>
	import { handleResponse } from '../../lib/exception.js';

	let redirectTimeoutID;

	export default {
		name: 'EmailUnconfirmed',
		data: () => ({
			errorMessage: '',
			successMessage: ''
		}),
		methods: {
			async sendEmailConfirmation() {
				try {
					const response = await fetch('/api/user/resend-email-confirmation', {
						headers: { Authorization: this.$store.getters['jwt'] }
					});

					const jsonResponse = await handleResponse(response);

					this.errorMessage = '';
					this.successMessage = jsonResponse.message;
				} catch(err) {
					this.successMessage = '';
					this.errorMessage = err.message;

					if (err.message === 'Email is already confirmed.') {
						this.errorMessage = `${this.errorMessage} \nRedirecting to account page in 10 seconds...`;

						if (redirectTimeoutID) clearTimeout(redirectTimeoutID);

						redirectTimeoutID = setTimeout(() => {
							this.$router.push('/account');
						}, 10000);
					}
				}
			}
		}
	}
</script>

<style scoped>
</style>
