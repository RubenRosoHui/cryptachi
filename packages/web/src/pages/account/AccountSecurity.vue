<template>
	<div class="outer-container">
		<div class="change-password-container">
			<h1>Change Password</h1>
			<form @submit.prevent="submitForm">
				<div class="form-control">
					<label for="old-password" class="hidden">Old Password</label>
					<input id="old-password" type="password" name="oldPassword" placeholder="Old password" v-model="form.fields.oldPassword.value" />
				</div>
				<div class="form-control">
					<label for="new-password" class="hidden">New Password</label>
					<input id="new-password" type="password" name="newPassword" placeholder="New Password" v-model="form.fields.newPassword.value" />
				</div>
				<div class="form-control">
					<label for="confirm-new-password" class="hidden">Confirm New Password</label>
					<input id="confirm-new-password" type="password" name="confirmNewPassword" placeholder="Confirm New Password" v-model="form.fields.confirmNewPassword.value" />
				</div>
				<div class="form-control text-align-right" id="form-buttons">
					<button type="submit" class="base-button" id="submit-button">Confirm</button>
				</div>
			</form>
		</div>
		<div class="activate-2fa-container">
			<header>
				<h1>Activate 2FA</h1>
				<span>Status: </span>
				<span v-if="twoFactorAuthenticationEnabled" class="success">Enabled</span>
				<span v-else class="error">Disabled</span>
			</header>
			<p class="margin-top-2 margin-bottom-2">
				Two factor authentication is currently <span>disabled</span> on this account.
				To deactivate it, you must provide an OTP from your authenticator app.
				You can use the the one-time paper key that was given to you when 2FA was activated.
				If you lost your paper key, <router-link to="/contact">contact Cryptachi support</router-link>
				and we will get the 2FA deactivation process started.
			</p>
			<p class="yellow bold">Upon successfully deactivating 2FA, all sessions for your user will be cleared.</p>
			<div class="buttons-container margin-top-4 text-align-right">
				<button v-if="twoFactorAuthenticationEnabled" class="base-button">Deactivate</button>
				<button v-else class="base-button">Activate</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'AccountSecurity',
		data: () => ({
			form: {
				fields: {
					oldPassword: { value: '' },
					newPassword: { value: '' },
					confirmNewPassword: { value: '' }
				},
				isValid: false,
				message: ''
			},
			twoFactorAuthenticationEnabled: false
		}),
		methods: {
			submitForm() {
				console.log('Submit Form');
			}
		}
	}
</script>

<style scoped>
	form > .form-control {
		margin-top: var(--spacing-4);
	}

	.change-password-container {
		padding-bottom: var(--spacing-4);
	}
	.activate-2fa-container {
		padding-top: var(--spacing-4);
	}

	@media (min-width: 600px) and (max-width: 900px) {
		.outer-container { padding: 0 1rem; }
	}

	@media (min-width: 900px) {
		.outer-container {
			display: table;
		}

		.change-password-container,
		.activate-2fa-container {
			display: table-cell;
			width: 50%;
		}
		.change-password-container {
			padding-bottom: 0;
			padding-right: var(--spacing-8);
		}
		.activate-2fa-container {
			padding-top: 0;
			padding-left: var(--spacing-8);
		}
	}
</style>
