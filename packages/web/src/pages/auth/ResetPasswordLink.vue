<template>
	<div class="base-container">
		<h1 class="text-align-center">Reset Password Link</h1>
		<form @submit.prevent="submitForm">
			<div class="form-control">
				<label for="email" class="hidden">Email</label>
				<input id="email" type="email" name="email" placeholder="Email" v-model="form.fields.email.value" />
			</div>
			<div class="form-control text-align-right" id="form-buttons">
				<button type="submit" class="base-button">Send Link</button>
			</div>
		</form>
	</div>
</template>

<script>
	export default {
		name: 'ResetPasswordLink',
		data: () => ({
			form: {
				fields: {
					email: { value: '' }
				}
			}
		}),
		methods: {
			submitForm() {
				console.log(this.form.fields.email.value);
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
