<template>
  <h2>Step 2: <span class="white">Payment</span></h2>
	<div class="payment-container">
		<p class="instruction bold margin-top-4">
			Send a <span class="purple">single transaction</span> of <span class="yellow">{{ amount }} {{ currency }}</span> to <span class="underline font-xs wrap">{{ address }}</span>
		</p>
		<div class="qr-code-container">
			<span class="success" v-if="isCopyMessageVisible">Copied to clipboard</span>
			<qrcode-vue @click="copyAddressToClipboard" class="qr-code" :value="address" :size="250" level="H" background="#f8f8f2" foreground="#282a36" renderAs="svg" title="Copy to clipboard" />
		</div>
		<div class="progress-bar-container">
			<progress-bar :progress="currentConfirmations" :total="totalConfirmations" />
			<div class="status">
				<span v-if="currentConfirmations < totalConfirmations"><span class="green bold">{{ status }}</span> - Waiting for {{ remainingConfirmations }} more confirmations...</span>
				<span v-else><span class="green bold">{{ status }}</span> - Payment confirmed successfully!</span>
			</div>
		</div>
		<p class="return-message-container">
			An email with a <a :href="pageLink">link to this page</a> was sent to <span class="yellow bold">foster@test.com</span>
		</p>
		<!-- Button for testing confirmations
		<button class="base-button" @click="currentConfirmations++">Add Confirmation</button>
		-->
	</div>
</template>

<script>
	import ProgressBar from '../../components/ui/ProgressBar.vue';
	import QrcodeVue from 'qrcode.vue';

	export default {
		name: 'CheckoutPayment',
		components: { ProgressBar, QrcodeVue },
		beforeMount() {
			// TODO: Fetch order information from server
			this.address = '3rfYZI6WCZFy0ObAwNAO2arxzhj9yZ9R562ziooMotamakxbLpGsvwoOmXCEBw0tDOJLi1KGtytNUtRkYGoQ5uvte6nk8yT';
			//this.address = 'bc1JJWJoLmglBLD690e5FTf9WNZdzCovyO6jSwkuoz';
			this.amount = 0.002323233;
			this.currency = 'XMR';
			this.status = 'Payment Received';
			this.totalConfirmations = 10;
			this.currentConfirmations = 6;
			this.pageLink = 'https://www.cryptachi.com';
		},
		data: () => ({
			address: '',
			amount: 0,
			currency: '',
			status: '',
			totalConfirmations: 0,
			currentConfirmations: 0,
			pageLink: '',
			isCopyMessageVisible: false
		}),
		methods: {
			async copyAddressToClipboard() {
				await navigator.clipboard.writeText(this.address);

				this.isCopyMessageVisible = true;

				setTimeout(() => {
					this.isCopyMessageVisible = false;
				}, 3000);
			}
		},
		computed: {
			remainingConfirmations() {
				return this.totalConfirmations - this.currentConfirmations;
			}
		},
		watch: {
			currentConfirmations(newVal) {
				if (newVal > this.totalConfirmations) this.currentConfirmations = this.totalConfirmations;
			}
		}
	}
</script>

<style scoped>
	div.payment-container > * {
		margin-top: var(--spacing-8);
	}
	h2 {
			border-bottom: 1px solid var(--black-light);
	}
	h2, div.payment-container {
		text-align: center;
	}

	.qr-code {
		border: 15px solid var(--white);
		margin: 0 auto;
		cursor: pointer;
	}

	div.qr-code-container {
		position: relative;
	}
	div.qr-code-container span.success {
		position: absolute;
		margin: 0 auto;
		bottom: -20px;
	}
</style>
