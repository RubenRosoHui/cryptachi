<template>
	<div class="base-container">
		<header class="text-align-center">
			<h1>Contact Us</h1>
			<p class="bold">Before contacting us, please check the <router-link to="/faq">FAQ</router-link> as your question might have already been addressed there.</p>
		</header>
		<form @submit.prevent="submitForm">
			<div class="form-control">
				<label for="name" class="hidden">Name</label>
				<input id="name" type="text" name="name" placeholder="Name" v-model="form.fields.name.value" @input="validateName" />
				<p v-if="form.fields.name.errorMessage" class="error">{{ form.fields.name.errorMessage }}</p>
			</div>
			<div class="form-control">
				<label for="email" class="hidden">Email</label>
				<input id="email" type="email" name="email" placeholder="Email" v-model="form.fields.email.value" @input="validateEmail" />
				<p v-if="form.fields.email.errorMessage" class="error">{{ form.fields.email.errorMessage }}</p>
			</div>
			<div class="form-control">
				<label for="phone" class="hidden">Phone</label>
				<input id="phone" type="tel" name="phone" placeholder="Phone (optional)" v-model="form.fields.phone.value" @input="validatePhone" />
				<p v-if="form.fields.phone.errorMessage" class="error">{{ form.fields.phone.errorMessage }}</p>
			</div>
			<div class="form-control">
				<label for="message" class="hidden">Message</label>
				<textarea
					id="message"
					name="message"
					placeholder="Type your message here. To get an answer faster, please be as specific as possible. Provide important information such as the alias name, domain, or order ID."
					v-model="form.fields.message.value"
					@input="validateMessage"
				/>
				<p v-if="form.fields.message.errorMessage" class="error">{{ form.fields.message.errorMessage }}</p>
			</div>
			<div class="form-control text-align-right" id="form-buttons">
				<button type="submit" class="base-button" id="submit-button" :disabled="form.disableSubmitButton">Send Message</button>
			</div>
			<form-message
				v-if="form.message.isShown"
				:message="form.message.value"
				:type="form.message.type"
			/>
		</form>
	</div>
</template>

<script>
	import validator from 'validator';
	import { handleResponse } from '../../lib/exception.js';

	let showMessageTimeoutID;

	export default {
		name: 'ContactPage',
		data: () => ({
			form: {
				fields: {
					email: { value: '', errorMessage: '', isValid: false },
					name: { value: '', errorMessage: '', isValid: false },
					phone: { value: '', errorMessage: '', isValid: false },
					message: { value: '', errorMessage: '', isValid: false }
				},
				message: {
					value: '',
					type: 'error',
					isShown: false
				},
				isValid: false,
				disableSubmitButton: false
			}
		}),
		methods: {
			validateEmail() {
				const email = this.form.fields.email;

				if (validator.isEmpty(email.value))
					email.errorMessage = 'Email is required.';
				else if (!validator.isEmail(email.value))
					email.errorMessage = 'Invalid Email';
				else
					email.errorMessage = '';

				email.isValid = !email.errorMessage;
			},
			validateName() {
				const name = this.form.fields.name;

				if (validator.isEmpty(name.value))
					name.errorMessage = 'Name is required.';
				else if (!validator.isAlpha(name.value, 'en-US', { ignore: ' ' }))
					name.errorMessage = 'Name can only contain alphabetic characters.';
				else if (!validator.isLength(name.value, { max: 30 }))
					name.errorMessage = 'Name cannot exceed 30 characters.';
				else
					name.errorMessage = '';

				name.isValid = !name.errorMessage;
			},
			validatePhone() {
				const phone = this.form.fields.phone;

				if (phone.value && !validator.isMobilePhone(phone.value))
					phone.errorMessage = 'Not a valid mobile phone.';
				else
					phone.errorMessage = '';

				phone.isValid = !phone.errorMessage;
			},
			validateMessage() {
				const message = this.form.fields.message;
				const maxLength = 800;

				if (validator.isEmpty(message.value))
					message.errorMessage = 'Message is required.';
				else if (!validator.isLength(message.value, { max: maxLength }))
					message.errorMessage = `Message cannot exceed ${maxLength} characters.`;
				else
					message.errorMessage = '';

				message.isValid = !message.errorMessage;
			},
			validateForm() {
				this.validateEmail();
				this.validateName();
				this.validatePhone();
				this.validateMessage();

				this.form.isValid = Object.keys(this.form.fields).every(field => this.form.fields[field].isValid === true);

				const message = this.form.message;
				if(!this.form.isValid) {
					message.value = 'Some fields have errors.';
					message.type = 'error';
					message.isShown = true;

					if (showMessageTimeoutID) clearTimeout(showMessageTimeoutID);

					showMessageTimeoutID = setTimeout(() => {
						message.isShown = false;
					}, 10000);
				}
			},
			clearForm() {
				this.form.fields.email.value = '';
				this.form.fields.name.value = '';
				this.form.fields.phone.value = '';
				this.form.fields.message.value = '';
			},
			async submitForm() {
				this.validateForm();
				if (!this.form.isValid) return;

				this.form.disableSubmitButton = true;
				const formMessage = this.form.message;

				try {
					const response = await fetch('/api/contact', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							email: this.form.fields.email.value,
							name: this.form.fields.name.value,
							phone: this.form.fields.phone.value,
							message: this.form.fields.message.value
						})
					});

					const jsonResponse = await handleResponse(response);

					this.clearForm();
					formMessage.value = jsonResponse.message;
					formMessage.type = 'success';
				} catch(err) {
					formMessage.value = err.message;
					formMessage.type = 'error';
				} finally {
					formMessage.isShown = true;
					this.form.disableSubmitButton = false;

					if (showMessageTimeoutID) clearTimeout(showMessageTimeoutID);
					showMessageTimeoutID = setTimeout(() => {
						formMessage.isShown = false;
					}, 10000);
				}
			}
		}
	}
</script>

<style scoped>
	header > p,
	form {
		max-width: 500px;
		margin: 0 auto;
	}
	.form-control {
		margin-top: var(--spacing-4);
	}
	.form-control#form-buttons {
		margin-top: var(--spacing-8);
	}

	textarea {
		height: 300px;
	}
</style>
