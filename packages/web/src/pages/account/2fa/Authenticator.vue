<template>
	<header>
		<h1>Activate 2FA</h1>
	</header>
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
</template>

<script>
	export default {
		name: 'Authenticator',
		emits: ['enable-auth', 'disable-auth'],
		data: () => ({
			// TODO: Fetch this state from the server.
			twoFactorAuthenticationEnabled: false
		})
	};
</script>

<style scoped>
</style>
