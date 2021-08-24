<template>
	<div class="text-align-center" v-if="isLoading">
		<loading-spinner />
		<p class="yellow bold">Loading orders...</p>
	</div>
	<table v-else-if="!isLoading && purchases.length > 0">
		<thead>
			<tr>
				<th>Date</th>
				<th>Order ID</th>
				<th>Status</th>
				<th>Alias</th>
				<th>Plan</th>
				<th>Payment</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="purchase in purchases" :key="purchase.id">
				<td>{{ formatDate(purchase.createdAt) }}</td>
				<td>{{ purchase.id }}</td>
				<td>
					<span :class="statusStyles(purchase.status)" class="bold">{{ purchase.status }}</span>
					<router-link
						to="/contact"
						v-if="purchase.status === 'Expired' && purchase.partiallyPaid"
						title="This order was paid but has expired. Please contact support to resolve this issue."
					>
						Contact Support
					</router-link>
				</td>
				<td><span class="yellow">{{ purchase.alias }}</span>.{{ purchase.domain }}</td>
				<td>{{ `${purchase.plan.duration} ${purchase.plan.unit}` }}</td>
				<td>
					<div class="payment-list__container">
						<span v-for="payment in purchase.payments" :key="payment._id">{{ `${payment.paid} ${payment.currency.toUpperCase()}` }}<br /></span>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
	<div class="text-align-center" v-else>
		<h1 class="red margin-bottom-4">No Orders</h1>
		<img src="../../assets/icons/svg/fi-rr-circle.svg" class="icon-100 red-filter margin-bottom-4" />
		<p class="error">There are 0 orders to display.</p>
	</div>
</template>

<script>
	import { date as dateLib } from '@cryptachi/common';
	import { handleResponse } from '../../lib/exception.js';

	export default {
		name: 'AccountPurchases',
		data: () => ({
			isLoading: false,
			purchases: []
		}),
		async beforeMount() {
			this.isLoading = true;
			await this.fetchInvoices();
			this.isLoading = false;
		},
		methods: {
			formatDate: dateLib.formatDate,
			statusStyles(status) {
				const statusMappings = { Settled: 'green-light', Expired: 'red-light' };

				return statusMappings[status];
			},
			async fetchInvoices() {
				const planDurationMappings = { oneYear: 1, twoYear: 2, threeYear: 3, fourYear: 4, fiveYear: 5 };

				try {
					const response = await fetch('/api/user/invoices', {
						headers: { Authorization: this.$store.getters.jwt }
					});

					const jsonResponse = await handleResponse(response);

					const mappedPurchases = jsonResponse.invoices.map(invoice => ({
						...invoice,
						status: invoice.status.replace('Invoice', ''),
						createdAt: new Date(invoice.createdAt),
						plan: {
							duration: planDurationMappings[invoice.plan.name],
							unit: planDurationMappings[invoice.plan.name] > 1 ? 'years' : 'year'
						}
					}));

					this.purchases = mappedPurchases;
				} catch(err) {
					if (
						err.httpStatusCode === 401 ||
						(err.httpStatusCode === 500 && err.name === 'JsonWebTokenError')
					) {
						this.$store.dispatch('logout');
						this.$router.replace('/login');
					}
				}
			}
		}
	}
</script>

<style scoped>
	table {
		width: 100%;
		border-collapse: collapse;
	}
	thead {
		background-color: var(--cyan-dark);
		font-family: var(--font-family-sans-serif);
	}
	thead tr th,
	tbody tr td {
		text-align: center;
		padding: var(--spacing-2) var(--spacing-1);
	}

	tbody tr:nth-of-type(odd) {
		background-color: rgba(0, 0, 0, 0.2);
	}

	@media only screen and (max-width: 768px), (min-device-width: 768px) and (max-device-width: 1024px) {
		tbody tr td {
			text-align: left;
		}

		/* NOTE: Force tables to not be like tables anymore */
		table, thead, tbody, th, td, tr {
			display: block;
		}

		/* NOTE: Hide Table headers (but not display:none for accessibilty) */
		thead tr {
			position: absolute;
			top: -100%;
			left: -100%;
		}

		.payment-list__container {
			display: inline-block;
		}

		tbody td {
			/* Behave like a row */
			border: none;
			border-bottom: 1px solid var(--black);
			position: relative;
			padding-left: 50%;
		}

		tbody tr { border: 1px solid var(--black) }

		tbody td:before {
			/* Now like a table header */
			display: inline-block;

			/* Top/left values mimic padding */
			width: 25%;
			padding-right: 10px;
			white-space: nowrap;
			font-weight: bold;
		}

		/* NOTE: Label the data */
		tbody td:nth-of-type(1):before { content: "Date:"; }
		tbody td:nth-of-type(2):before { content: "ID:"; }
		tbody td:nth-of-type(3):before { content: "Status:"; }
		tbody td:nth-of-type(4):before { content: "Alias:"; }
		tbody td:nth-of-type(5):before { content: "Plan:"; }
		tbody td:nth-of-type(6):before { content: "Payment:"; }
	}
</style>
