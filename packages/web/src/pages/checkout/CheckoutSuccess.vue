<template>
	<div class="base-container text-align-center">
		<div v-if="!isLoading">
			<h1 class="margin-bottom-4" :class="pageTitleStyle">{{ pageTitle }}</h1>
			<img v-if="isCheckoutSuccess" src="../../assets/icons/svg/fi-rr-check.svg" class="icon-150 green-filter" />
			<img v-else src="../../assets/icons/svg/fi-rr-cross.svg" class="icon-150 red-filter" />
			<div class="margin-top-4">
				<div v-if="isCheckoutSuccess">
					<p>Thank you for your recent purchase of <span class="yellow bold">{{ `${alias}.${domain}` }}</span>.</p>
					<br />
					<p>Please note that your alias will be available when your order has settled. An order is settled once the payment transaction has received enough blockchain confirmations. Allow up to 1 hour for an order to settle.</p>
					<br />
					<p>To view the status of your orders, go to the <router-link to="/account/orders">orders</router-link> section of your account page.</p>
				</div>
				<div v-else>
					<p>Your recent purchase of <span class="yellow bold">{{ `${alias}.${domain}` }}</span> failed.</p>
					<p>Please try again.</p>
					<div class="margin-top-8">
						<button class="base-button" @click="homeButtonClicked">Go back home.</button>
						<button class="hollow-button margin-left-16" @click="contactSupportClicked">Contact Support</button>
					</div>
				</div>
			</div>
		</div>
		<div v-else>
			<loading-spinner />
			<p class="bold yellow">Loading page...</p>
		</div>
	</div>
</template>

<script>
	import { handleResponse } from '../../lib/exception.js';

	export default {
		name: 'CheckoutSuccess',
		props: {
			alias: { type: String, required: true },
			domain: { type: String, required: true },
			invoiceID: { type: String, required: true }
		},
		data: () => ({
			isCheckoutSuccess: null,
			isLoading: false
		}),
		async created() {
			this.isLoading = true;
			await this.getInvoice();
			this.isLoading = false;
		},
		methods: {
			async getInvoice() {
				const response = await fetch(`/api/checkout/get-invoice?invoiceId=${this.invoiceID}`);

				let jsonResponse;
				try {
					jsonResponse = await handleResponse(response);
				} catch(err) {
					this.isCheckoutSuccess = false;
				} finally {
					this.isLoading = false;
				}

				const state = jsonResponse.invoice.state;

				this.isCheckoutSuccess = state === 'InvoiceSettled' || state === 'InvoiceProcessing';
			},
			homeButtonClicked() {
				this.$router.push('/');
			},
			contactSupportClicked() {
				this.$router.push('/contact');
			}
		},
		computed: {
			pageTitle() {
				return this.isCheckoutSuccess ? 'Thank you for your purchase.' : 'Payment Failure';
			},
			pageTitleStyle() {
				return this.isCheckoutSuccess ? ['green'] : ['red'];
			}
		}
	}
</script>

<style scoped>
	.base-container {
		max-width: 800px;
	}
</style>
