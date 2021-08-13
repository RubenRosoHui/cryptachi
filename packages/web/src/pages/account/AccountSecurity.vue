<template>
	<div class="outer-container">
		<div class="change-password-container">
			<h1>Change Password</h1>
			<form @submit.prevent="submitChangePasswordForm">
				<div class="form-control">
					<label for="old-password" class="hidden">Old Password</label>
					<input id="old-password" type="password" name="oldPassword" placeholder="Old password" v-model="changePasswordForm.fields.oldPassword.value" @input="validateOldPassword" />
					<p v-if="changePasswordForm.fields.oldPassword.errorMessage" class="error">{{ changePasswordForm.fields.oldPassword.errorMessage }}</p>
				</div>
				<div class="form-control">
					<label for="new-password" class="hidden">New Password</label>
					<input id="new-password" type="password" name="newPassword" placeholder="New Password" v-model="changePasswordForm.fields.newPassword.value" @input="validateNewPassword" />
					<p v-if="changePasswordForm.fields.newPassword.errorMessage" class="error">{{ changePasswordForm.fields.newPassword.errorMessage }}</p>
				</div>
				<div class="form-control">
					<label for="confirm-new-password" class="hidden">Confirm New Password</label>
					<input id="confirm-new-password" type="password" name="confirmNewPassword" placeholder="Confirm New Password" v-model="changePasswordForm.fields.confirmNewPassword.value" @input="validateConfirmNewPassword"/>
					<p v-if="changePasswordForm.fields.confirmNewPassword.errorMessage" class="error">{{ changePasswordForm.fields.confirmNewPassword.errorMessage }}</p>
				</div>
				<div class="form-control text-align-right" id="form-buttons">
					<button type="submit" class="base-button" id="submit-button">Confirm</button>
				</div>
			</form>
			<form-message v-if="changePasswordForm.errorMessage" :message="changePasswordForm.errorMessage" type="error" class="text-align-right" />
			<form-message v-else-if="changePasswordForm.successMessage" :message="changePasswordForm.successMessage" type="success" class="text-align-right" />
		</div>
		<div class="activate-2fa-container">
			<component :is="authenticationComponent" @changeAuthComponent="onChangeAuthComponent" />
		</div>
	</div>
</template>

<script>
	import validator from 'validator';
	import { handleResponse } from '../../lib/exception.js';

	import Authenticator from './2fa/Authenticator.vue';
	import EnableAuth from './2fa/EnableAuth.vue';

	let changePasswordFormMessageTimeoutID;

	export default {
		name: 'AccountSecurity',
		components: { Authenticator, EnableAuth },
		data: () => ({
			changePasswordForm: {
				fields: {
					oldPassword: { value: '', isValid: false, errorMessage: '' },
					newPassword: { value: '', isValid: false, errorMessage: '' },
					confirmNewPassword: { value: '', isValid: false, errorMessage: '' }
				},
				isValid: false,
				errorMessage: '',
				successMessage: ''
			},
			authenticationComponent: 'Authenticator'
		}),
		methods: {
			async submitChangePasswordForm() {
				this.validateChangePasswordForm();
				if (!this.changePasswordForm.isValid) return;

				const oldPassword = this.changePasswordForm.fields.oldPassword.value;
				const newPassword = this.changePasswordForm.fields.newPassword.value;
				const confirmNewPassword = this.changePasswordForm.fields.confirmNewPassword.value;

				try {
					const response = await fetch('/api/user/change-password', {
						method: 'POST',
						headers: {
							Authorization: this.$store.getters['jwt'],
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							oldPassword,
							password: newPassword,
							confirmPassword: confirmNewPassword
						})
					});

					await handleResponse(response);

					this.clearChangePasswordFormFields();
					this.setChangePasswordFormMessage('success', 'Password changed successfully.')
				} catch (err) {
					if (err instanceof Error && err.message) {
						this.setChangePasswordFormMessage('error', err.message);
					}
				}
			},
			setChangePasswordFormMessage(msgType, message) {
				if (msgType === 'error') {
					this.changePasswordForm.successMessage = '';
					this.changePasswordForm.errorMessage = message;
				} else {
					this.changePasswordForm.successMessage = message;
					this.changePasswordForm.errorMessage = '';
				}

				if (changePasswordFormMessageTimeoutID) clearTimeout(changePasswordFormMessageTimeoutID);

				changePasswordFormMessageTimeoutID = setTimeout(() => {
					this.changePasswordForm.successMessage = '';
					this.changePasswordForm.errorMessage = '';
				}, 10000);
			},
			clearChangePasswordFormFields() {
				this.changePasswordForm.fields.oldPassword.value = '';
				this.changePasswordForm.fields.newPassword.value = '';
				this.changePasswordForm.fields.confirmNewPassword.value = '';
			},
			validateOldPassword() {
				const oldPassword = this.changePasswordForm.fields.oldPassword;

				if (validator.isEmpty(oldPassword.value))
					oldPassword.errorMessage = 'Old Password is required.';
				else if (!validator.isLength(oldPassword.value, { max: 100 }))
					oldPassword.errorMessage = 'Old Password cannot exceed 100 characters.';
				else
					oldPassword.errorMessage = '';

				oldPassword.isValid = !oldPassword.errorMessage;
			},
			validateNewPassword() {
				const password = this.changePasswordForm.fields.newPassword;

				if (validator.isEmpty(password.value))
					password.errorMessage = 'Password is required.';
				else if (!validator.isLength(password.value, { max: 100 }))
					password.errorMessage = 'Password cannot exceed 100 characters.';
				else if (!validator.isStrongPassword(password.value))
					password.errorMessage = 'Weak password. Passwords must have a minimum of 8 characters, 1 uppercase letter, 1 number, and 1 symbol.';
				else
					password.errorMessage = '';

				password.isValid = !password.errorMessage;

				this.validateConfirmNewPassword();
			},
			validateConfirmNewPassword() {
				const password = this.changePasswordForm.fields.newPassword;
				const confirmPassword = this.changePasswordForm.fields.confirmNewPassword;

				if (validator.isEmpty(confirmPassword.value))
					confirmPassword.errorMessage = 'Confirm Password is required.';
				else if (confirmPassword.value !== password.value)
					confirmPassword.errorMessage = 'Passwords do not match';
				else
					confirmPassword.errorMessage = '';

				confirmPassword.isValid = !confirmPassword.errorMessage;
			},
			validateChangePasswordForm() {
				this.validateOldPassword();
				this.validateNewPassword();

				this.changePasswordForm.isValid = Object.keys(this.changePasswordForm.fields).every(field => this.changePasswordForm.fields[field].isValid === true);
				const errorMessage = this.changePasswordForm.isValid ? '' : 'Some fields have errors.';

				this.setChangePasswordFormMessage('error', errorMessage);
			},
			onChangeAuthComponent(component) {
				this.authenticationComponent = component;
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
	.outer-container {
		width: 100%;
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
