<template>
	<header>
		<h1>Activate 2FA</h1>
	</header>
	<div v-if="!isLoading">
		<p class="margin-top-2 margin-bottom-2">
			Two factor authentication is currently
			<span v-if="twoFactorAuthenticationEnabled" class="success">enabled</span>
			<span v-else class="error">disabled</span>
			on this account.
			To deactivate it, you must provide an OTP from your authenticator app.
			You can use the the one-time paper key that was given to you when 2FA was activated.
			If you lost your paper key, <router-link to="/contact">contact Cryptachi support</router-link>
			and we will get the 2FA deactivation process started.
		</p>
		<p class="yellow bold">Upon successfully deactivating 2FA, all sessions for your user will be cleared requiring you to login again.</p>
		<div class="buttons-container margin-top-4 text-align-right">
			<button v-if="twoFactorAuthenticationEnabled" class="base-button" @click="$emit('changeAuthComponent', 'DisableAuth')">Deactivate</button>
			<button v-else class="base-button" @click="$emit('changeAuthComponent', 'EnableAuth')">Activate</button>
		</div>
	</div>
	<div class="text-align-center" v-else>
		<loading-spinner />
		<p class="bold yellow margin-top-2">Fetching user info...</p>
	</div>
</template>

<script>
	export default {
		name: 'Authenticator',
		emits: ['changeAuthComponent'],
		data: () => ({
			twoFactorAuthenticationEnabled: false,
			isLoading: false
		}),
		async beforeMount() {
			this.isLoading = true;
			await this.fetchUserInfo();
			this.isLoading = false;
		},
		methods: {
			async fetchUserInfo() {
				const response = await fetch('/api/user', {
					headers: { Authorization: this.$store.getters['jwt'] }
				});

				if (!response.ok) throw Error('Failed to fetch user info.');

				const jsonResponse = await response.json();

				this.twoFactorAuthenticationEnabled = jsonResponse.user.requireTwoFactor;
			}
		}
	};
</script>

<style scoped>
</style>
