<template>
	<div class="base-container">
		<h1 class="text-align-center">Reset Password</h1>
		<form @submit.prevent="submitForm">
			<div class="form-control">
				<label for="password" class="hidden">New Password</label>
				<input id="password" type="password" name="password" placeholder="New Password" v-model="form.fields.password.value" />
			</div>
			<div class="form-control">
				<label for="confirm-password" class="hidden">Confirm New Password</label>
				<input id="confirm-password" type="password" name="confirmPassword" placeholder="Confirm New Password" v-model="form.fields.confirmPassword.value" />
			</div>
			<div class="form-control text-align-right" id="form-buttons">
				<button type="submit" class="base-button">Submit</button>
			</div>
		</form>
	</div>
</template>

<script>
	export default {
		name: 'ResetPassword',
		data: () => ({
			form: {
				fields: {
					password: { value: '' },
					confirmPassword: { value: '' }
				}
			}
		}),
		methods: {
			submitForm() {
				const formFields = this.form.fields;
				console.log(formFields.password.value);
				console.log(formFields.confirmPassword.value);
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
