<template>
	<div class="base-container text-align-center">
		<h1 class="margin-bottom-4">Thank you for your purchase.</h1>
		<img src="../../assets/icons/svg/fi-rr-check.svg" class="icon-150 green-filter" />
		<p>Thank you for your recent purchase of <span class="yellow bold">{{ `${alias}.${domain}` }}</span>.</p>
		<br />
		<p>Please note that your alias will be available when your order has settled. An order is settled once the payment transaction has received enough blockchain confirmations. Allow up to 1 hour for an order to settle.</p>
		<br />
		<p>To view the status of your orders, go to the <router-link to="/account/orders">orders</router-link> section of your account page.</p>
	</div>
</template>

<script>
	export default {
		name: 'CheckoutSuccess',
		props: {
			alias: { type: String, required: true },
			domain: { type: String, required: true }
		}
	}
</script>

<style scoped>
	.base-container {
		max-width: 800px;
	}
</style>
