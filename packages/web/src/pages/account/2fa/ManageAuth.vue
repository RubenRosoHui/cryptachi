<template>
	<header>
		<h1>Manage 2FA</h1>
	</header>
	<div v-if="!isLoading">
		<p class="margin-top-2 margin-bottom-2">
			Two factor authentication is currently
			<span v-if="twoFactorAuthenticationEnabled" class="success">enabled</span>
			<span v-else class="error">disabled</span>
			on this account.
			To disable it, you must provide an OTP from your authenticator app.
			You can use the the one-time paper key that was given to you when 2FA was activated.
			If you lost your paper key, <router-link to="/contact">contact Cryptachi support</router-link>
			and we will get the 2FA deactivation process started.
		</p>
		<p class="yellow bold">Upon successfully disabling 2FA, all sessions for your user will be cleared requiring you to login again.</p>
		<div class="buttons-container margin-top-4 text-align-right">
			<button v-if="twoFactorAuthenticationEnabled" class="base-button deactivate" @click="$emit('changeAuthComponent', 'DisableAuth')">Disable</button>
			<button v-else class="base-button" @click="$emit('changeAuthComponent', 'EnableAuth')">Enable</button>
		</div>
	</div>
	<div class="text-align-center" v-else>
		<loading-spinner />
		<p class="bold yellow margin-top-2">Fetching user info...</p>
	</div>
</template>

<script>
	import { handleResponse } from '../../../lib/exception.js';

	export default {
		name: 'ManageAuth',
		emits: ['changeAuthComponent'],
		data: () => ({
			twoFactorAuthenticationEnabled: false,
			isLoading: false
		}),
		async beforeMount() {
			this.isLoading = true;
			try {
				await this.fetchUserInfo();
			} catch(err) {
				if (
					err.httpStatusCode === 401 ||
					(err.httpStatusCode === 500 && err.name === 'JsonWebTokenError')
				) {
					this.$store.dispatch('logout');
					return this.$router.replace('/login');
				}
			}
			this.isLoading = false;
		},
		methods: {
			async fetchUserInfo() {
				const response = await fetch('/api/user', {
					headers: { Authorization: this.$store.getters['jwt'] }
				});

				const jsonResponse = await handleResponse(response);

				this.twoFactorAuthenticationEnabled = jsonResponse.user.requireTwoFactor;
			}
		}
	};
</script>

<style scoped>
	button.deactivate {
		background-color: var(--red);
	}
</style>
