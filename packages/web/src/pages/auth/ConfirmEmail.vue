<template>
	<div class="base-container text-align-center">
		<h1 class="margin-bottom-8">Email Confirmation</h1>
		<div v-if="isLoading">
			<loading-spinner :size="150" class="margin-bottom-4"/>
			<p class="yellow bold">Confirming email...</p>
		</div>
		<div v-else-if="isEmailConfirmed">
			<img src="../../assets/icons/svg/fi-rr-thumbs-up.svg" class="icon-150 green-light-filter margin-bottom-4"/>
			<p class="success">Your email was confirmed successfully. Redirecting to the login page in 10 seconds.</p>
		</div>
		<div v-else>
			<img src="../../assets/icons/svg/fi-rr-ban.svg" class="icon-150 red-filter margin-bottom-4"/>
			<p class="font-md red-light bold">ERROR</p>
			<p class="error">{{ errorMessage }}</p>
		</div>
	</div>
</template>

<script>
	import { handleResponse } from '../../lib/exception.js';

	export default {
		name: 'ConfirmEmail',
		props: {
			email: { type: String, required: true },
			token: { type: String, required: true },
		},
		data: () => ({
			isEmailConfirmed: null,
			errorMessage: '',
			isLoading: false
		}),
		async mounted() {
			const query = `email=${this.email}&token=${this.token}`;

			this.isLoading = true;
			try {
				const response = await fetch(`/api/auth/confirm-email?${query}`, { method: 'POST' });
				await handleResponse(response);
				this.isEmailConfirmed = true;

				setTimeout(() => {
					this.$router.push('/login');
				}, 10000);
			}
			catch(err) {
				this.errorMessage = err.message;
				this.isEmailConfirmed = false;
			}
			finally {
				this.isLoading = false;
			}
		}
	}
</script>
