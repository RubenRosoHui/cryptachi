<template>
	<div class="base-container">
		<h1 class="text-align-center">Login</h1>
		<form @submit.prevent="login">
			<div class="form-control">
				<label for="email" class="hidden">Email</label>
				<input id="email" type="email" name="email" placeholder="Email" v-model="form.fields.email.value" />
			</div>
			<div class="form-control">
				<label for="password" class="hidden">Password</label>
				<input id="password" type="password" name="password" placeholder="Password" v-model="form.fields.password.value" />
				<p class="text-align-center margin-top-2">Forgot your password? Click <router-link to="/reset-password-link">here</router-link>.</p>
			</div>
			<div class="form-control text-align-right" id="form-buttons">
				<button type="submit" class="base-button" id="login-button">LOGIN</button>
			</div>
		</form>
	</div>
</template>

<script>
	export default {
		name: 'LoginPage',
		data: () => ({
			form: {
				fields: {
					email: { value: '' },
					password: { value: '' }
				}
			}
		}),
		methods: {
			login() {
				this.$router.push('/account');
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
