<template>
	<h1 class="margin-bottom-2">Disable 2FA</h1>
	<p>You are about to disable 2FA for this account. Please enter the 6-digit code from your OTP app.</p>
	<form @submit.prevent="submitForm">
		<div class="form-control">
			<label for="verification-code" class="hidden">Verification Code</label>
			<input id="verification-code" type="text" name="authCode" placeholder="Verification Code" v-model="authCode.value" @focus="authCode.errorMessage = ''" />
			<p v-if="authCode.errorMessage" class="error">{{ authCode.errorMessage }}</p>
		</div>
		<div class="form-control text-align-right" id="form-buttons">
			<button type="submit" class="base-button">Submit</button>
		</div>
	</form>
</template>

<script>
	import { handleResponse } from '../../../lib/exception.js';

	export default {
		name: 'DisableAuth',
		emits: ['changeAuthComponent'],
		data: () => ({
			authCode: {
				value: '',
				isValid: false,
				errorMessage: ''
			}
		}),
		methods: {
			async submitForm() {
				try {
					const response = await fetch('/api/user/2fa/disable', {
						method: 'PATCH',
						headers: {
							Authorization: this.$store.getters['jwt'],
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							authCode: this.authCode.value.replaceAll(' ', '')
						})
					});

					await handleResponse(response);

					this.$store.dispatch('logout');
					this.$router.push('/login');
				} catch(err) {
					if (err instanceof Error && err.message) {
						this.authCode.errorMessage = err.message;
					}
				}
			}
		}
	}
</script>

<style scoped>
	#form-buttons {
		margin-top: var(--spacing-4);
	}
</style>
