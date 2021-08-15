<template>
	<div class="base-container">
		<h1 class="text-align-center">Checkout</h1>
		<h2 class="yellow">Step 1: <span class="white">Enter Details</span></h2>
		<form @submit.prevent="submitForm">
			<div class="form-control-container alias">
				<h3>Alias</h3>
				<div class="form-control">
					<label for="alias" class="hidden">Alias</label>
					<input id="alias" type="text" name="alias" :value="`${alias}.${domain}`" disabled/>
				</div>
			</div>
			<div class="form-control-container">
				<h3>Choose a Plan</h3>
				<div class="form-control radio-buttons1 plan">
					<label for="plan-one">
						<input id="plan-one" type="radio" value="oneYear" name="plan" v-model="plan" />
						<div class="one-year hollow-button">1 year</div>
					</label>
					<label for="plan-two">
						<input id="plan-two" type="radio" value="twoYear" name="plan" v-model="plan">
						<div class="two-year hollow-button">2 years</div>
					</label>
					<label for="plan-three">
						<input id="plan-three" type="radio" value="threeYear" name="plan" v-model="plan">
						<div class="three-year hollow-button">3 years</div>
					</label>
					<label for="plan-four">
						<input id="plan-four" type="radio" value="fourYear" name="plan" v-model="plan">
						<div class="four-year hollow-button">4 years</div>
					</label>
					<label for="plan-five">
						<input id="plan-five" type="radio" value="fiveYear" name="plan" v-model="plan">
						<div class="four-year hollow-button">5 years</div>
					</label>
				</div>
			</div>
			<!--
			<div class="form-control-container">
				<h3>Payment</h3>
				<div class="form-control radio-buttons1 payment">
					<div>
						<label for="payment-monero">
							<img src="../../assets/logos/png/monero-64.png" />
							<input id="payment-monero" type="radio" value="xmr" name="payment" v-model="payment" />
							<div>Monero</div>
						</label>
					</div>
					<div>
						<label for="payment-bitcoin">
							<img src="../../assets/logos/png/bitcoin-64.png" />
							<input id="payment-bitcoin" type="radio" value="btc" name="payment" v-model="payment" />
							<div>Bitcoin</div>
						</label>
					</div>
					<div>
						<label for="payment-ethereum">
							<img src="../../assets/logos/png/ethereum-64.png" />
							<input id="payment-ethereum" type="radio" value="eth" name="payment" v-model="payment" />
							<div>Ethereum</div>
						</label>
					</div>
				</div>
			</div>
			-->
			<div class="form-control-container">
				<button type="submit" class="base-button" @click="onPaymentBtnClick">Make Payment</button>
			</div>
		</form>
	</div>
</template>

<script>
	import { handleResponse } from '../../lib/exception.js';

	export default {
		name: 'CheckoutDetails',
		props: {
			alias: { type: String, required: true },
			domain: { type: String, required: true }
		},
		data: () => ({
			plan: 'oneYear'
		}),
		methods: {
			async onPaymentBtnClick() {
				const user = this.$store.getters.user;

				try {
					const response = await fetch('/api/checkout/create-invoice', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							email: user.email,
							alias: this.alias,
							domain: this.domain,
							plan: this.plan
						})
					});

					const jsonResponse = await handleResponse(response);

					window.location.href = jsonResponse.url;
				} catch(err) {
					console.error(err);
				}

			}
		}
	}
</script>

<style scoped>
	.base-container {
		max-width: 800px;
	}

	h2 {
		text-align: center;
		border-bottom: 1px solid var(--black-light);
	}
	h3 {
		font-size: var(--font-lg);
	}
	h3:after {
		content: ":"
	}

	input[disabled] {
		font-size: var(--font-lg);
		font-family: var(--font-family-sans-serif);
		color: var(--text-light);
		border: none;
		background-color: initial;
		padding: 0;
		cursor: default;
	}

	.form-control-container {
		margin-top: var(--spacing-8);
	}
	.form-control-container:last-child {
		text-align: right;
		margin-top: var(--spacing-16);
	}

	.form-control,
	.form-control:last-child {
		margin-top: 0;
	}
	.form-control-container h3 {
		margin-bottom: var(--spacing-4);
	}

	.radio-buttons1 label {
		position: relative;
		text-align: center;
	}
	.radio-buttons1 input[type="radio"] {
		position: absolute;
		opacity: 0;
	}

	.radio-buttons1.plan input[type="radio"]:checked + div {
		border-color: var(--yellow);
		background-color: var(--yellow);
		color: var(--black-dark);
	}

	.radio-buttons1.payment {
		display: flex;
		justify-content: space-between;
	}
	.radio-buttons1.payment label {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.radio-buttons1.payment label:hover {
		cursor: pointer;
	}
	.radio-buttons1.payment input + div {
		transition: all 0.3s linear;
	}
	.radio-buttons1.payment input:checked + div {
		font-weight: bold;
		font-size: var(--font-md);
		color: var(--yellow);
	}

	@media only screen and (min-width: 600px) {
		.radio-buttons1.plan {
			display: flex;
			justify-content: space-between;
		}
		.radio-buttons1.plan label {
			width: initial;
		}

		.radio-buttons1.payment {
			justify-content: space-around;
		}
	}
</style>
