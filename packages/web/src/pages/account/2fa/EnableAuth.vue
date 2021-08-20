<template>
	<h1>Enable Authentication</h1>
	<ol class="margin-left-8 steps">
		<li>
			<header>Download an authenticator app or a password manager with TOTP:</header>
			<ul class="">
				<li>Microsoft Authenticator for <a href="https://go.microsoft.com/fwlink/?Linkid=825072">Android</a> or <a href="https://go.microsoft.com/fwlink/?Linkid=825073">iOS</a>.</li>
				<li>Google Authenticator for <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en">Android</a> or <a href="https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8">iOS</a>.</li>
				<li>
					KeepassXC for
					<a href="https://keepassxc.org/download/#linux">Linux</a>, <a href="https://keepassxc.org/download/#mac">Mac</a> or <a href="https://keepassxc.org/download/#windows">Windows</a>.
				</li>
			</ul>
		</li>
		<li class="text-align-center">
			<header class="text-align-left">Scan the QR Code or enter the following key into your authenticator app:</header>
			<div v-if="otp.secret">
				<p class="totp-secret">{{ otp.secret }}</p>
				<div class="qrcode-container margin-top-4">
					<qrcode-vue class="qr-code" :value="otp.url" :size="250" level="H" background="#f8f8f2" foreground="#282a36" renderAs="svg" title="Copy to clipboard" />
				</div>
			</div>
			<div v-else>
				<loading-spinner />
				<p class="yellow bold margin-top-2">Fetching secret key. Please wait...</p>
			</div>
		</li>
		<li>
			<header>Your authenticator app will provide you with a 6-digit code. Enter the code in the confirmation box below:</header>
			<form @submit.prevent="submitForm">
				<div class="form-control">
					<label for="verification-code" class="hidden">Verification Code</label>
					<input id="verification-code" type="text" name="authCode" placeholder="Verification Code" v-model="authCode.value" @input="validateAuthCode" />
					<p v-if="authCode.errorMessage" class="error">{{ authCode.errorMessage }}</p>
				</div>
				<div class="form-control text-align-right" id="form-buttons">
					<button type="submit" class="base-button">Verify</button>
				</div>
			</form>
		</li>
	</ol>
</template>

<script>
	import { handleResponse } from '../../../lib/exception.js';

	import QrcodeVue from 'qrcode.vue';

	export default {
		name: 'EnableAuth',
		inheritAttrs: false,
		components: { QrcodeVue },
		emits: ['changeAuthComponent'],
		data: () => ({
			otp: {
				secret: '',
				url: ''
			},
			authCode: {
				value: '',
				isValid: false,
				errorMessage: ''
			}
		}),
		beforeMount() {
			this.fetchAuthenticatorSecret();
		},
		methods: {
			async fetchAuthenticatorSecret() {
				const response = await fetch('/api/user/2fa', {
					headers: { Authorization: this.$store.getters['jwt'] }
				});

				const jsonResponse = await handleResponse(response);

				this.otp.secret = jsonResponse.secret;
				this.otp.url = jsonResponse.otpauthurl;
			},
			async submitForm() {
				try {
					const response = await fetch('/api/user/2fa/enable', {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
							Authorization: this.$store.getters['jwt']
						},
						body: JSON.stringify({
							authCode: this.authCode.value.replaceAll(' ', '')
						})
					});

					await handleResponse(response);

					this.$emit('changeAuthComponent', 'ManageAuth');
				} catch(err) {
					if (err instanceof Error && err.message) {
						this.authCode.errorMessage = err.message;
					}
				}
			}
		}
	};
</script>

<style scoped>
	ul {
		list-style: initial;
		margin-left: var(--spacing-4);
	}
	.qr-code {
		border: 15px solid var(--white);
		margin: 0 auto;
	}

	p.totp-secret {
		width: 100%;
		background-color: var(--surface-dark);
		border: 2px solid var(--black);
		font-weight: bold;
		color: var(--yellow);
		padding: var(--spacing-1);
	}

	ol.steps > li {
		margin-top: var(--spacing-8);
	}
	ol.steps > li:first-child {
		margin-top: var(--spacing-4);
	}

	ol.steps > li > header {
		margin-bottom: var(--spacing-4);
	}

	div.form-control {
		margin-top: var(--spacing-4);
	}
</style>
