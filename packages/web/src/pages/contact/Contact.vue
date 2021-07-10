<template>
	<div class="base-container">
		<h1 class="text-align-center">Contact Us</h1>
		<form @submit.prevent="submitForm">
			<div class="form-control">
				<label for="name" class="hidden">Name</label>
				<input id="name" type="text" name="name" placeholder="Name" v-model="form.fields.name.value" />
			</div>
			<div class="form-control">
				<label for="email" class="hidden">Email</label>
				<input id="email" type="email" name="email" placeholder="Email" v-model="form.fields.email.value" />
			</div>
			<div class="form-control">
				<label for="phone" class="hidden">Phone</label>
				<input id="phone" type="tel" name="phone" placeholder="Phone" v-model="form.fields.phone.value" />
			</div>
			<div class="form-control">
				<label for="message" class="hidden">Message</label>
				<textarea id="message" name="message" placeholder="message" v-model="form.fields.message.value"/>
			</div>
			<div class="form-control text-align-right" id="form-buttons">
				<button type="submit" class="base-button" id="submit-button">Send Message</button>
			</div>
		</form>
	</div>
</template>

<script>
	export default {
		name: 'ContactPage',
		data: () => ({
			form: {
				fields: {
					email: { value: '' },
					name: { value: '' },
					phone: { value: '' },
					message: { value: '' }
				}
			}
		}),
		methods: {
			submitForm() {
				console.log('Submit Form');
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

	textarea {
		height: 300px;
	}
</style>
