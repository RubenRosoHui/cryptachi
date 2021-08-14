<template>
	<div class="base-container text-align-center">
		<h1 class="margin-bottom-4">Two Factor Authentication</h1>
		<p>Enter the 6-digit code from your authenticator app.</p>
		<form @submit.prevent="login">
			<div class="form-control">
				<label for="otp" class="hidden">OTP</label>
				<input id="otp" type="text" name="otp" placeholder="6-digit Code" v-model="otp.value" />
				<p v-if="otp.errorMessage" class="error text-align-left">{{ otp.errorMessage }}</p>
			</div>
			<div class="form-control text-align-right">
				<button class="base-button">Submit</button>
			</div>
		</form>
	</div>
</template>

<script>
	export default {
		name: 'TwoFactor',
		props: {
			email: { type: String, required: true },
			password: { type: String, required: true }
		},
		created() {
			console.log('Email: ', this.email);
			console.log('Password: ', this.password);
		},
		data: () => ({
			otp: { value: '', errorMessage: '' }
		}),
		methods: {
			async login() {
				try {
					await this.$store.dispatch('login', {
						email: this.email,
						password: this.password,
						authCode: this.otp.value.replaceAll(' ', '')
					});

					this.$router.push('/account');
				} catch(err) {
					this.otp.errorMessage = err.message;
				}
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
