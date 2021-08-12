<template>
	<table>
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
				<td>{{ purchase.status }}</td>
				<td><span class="yellow">{{ purchase.alias.name }}</span>.{{ purchase.alias.domain }}</td>
				<td>{{ `${purchase.plan.duration.amount} ${purchase.plan.duration.unit}` }}</td>
				<td>{{ `${purchase.payment.value} ${purchase.payment.currency.toUpperCase()}` }}</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
	import { date as dateLib } from '@cryptachi/common';

	export default {
		name: 'AccountPurchases',
		data: () => ({
			purchases: [
				{
					id: 'abcdefghijklmnopqrstuvwxyz1',
					status: 'Processing',
					createdAt: new Date,
					alias: {
						name: 'payme',
						domain: 'cryptachi.com'
					},
					plan: {
						duration: {
							amount: 5,
							unit: 'year'
						}
					},
					payment: {
						value: 0.0001,
						currency: 'xmr'
					}
				},
				{
					id: 'abcdefghijklmnopqrstuvwxyz2',
					status: 'Created',
					createdAt: new Date,
					alias: {
						name: 'payme2',
						domain: 'cryptachi.com'
					},
					plan: {
						duration: {
							amount: 3,
							unit: 'year'
						}
					},
					payment: {
						value: 0.00001,
						currency: 'btc'
					}
				},
				{
					id: 'abcdefghijklmnopqrstuvwxyz3',
					status: 'Settled',
					createdAt: new Date,
					alias: {
						name: 'payme3',
						domain: 'cryptachi.com'
					},
					plan: {
						duration: {
							amount: 2,
							unit: 'year'
						}
					},
					payment: {
						value: 0.001,
						currency: 'eth'
					}
				},
				{
					id: 'abcdefghijklmnopqrstuvwxyz4',
					createdAt: new Date,
					status: 'Expired',
					alias: {
						name: 'payme4',
						domain: 'cryptachi.com'
					},
					plan: {
						duration: {
							amount: 4,
							unit: 'year'
						}
					},
					payment: {
						value: 0.000001,
						currency: 'btc'
					}
				}
			]
		}),
		methods: {
			formatDate: dateLib.formatDate
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

	@media only screen and (max-width: 760px), (min-device-width: 768px) and (max-device-width: 1024px) {
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
		tbody td:nth-of-type(3):before { content: "Alias:"; }
		tbody td:nth-of-type(4):before { content: "Plan:"; }
		tbody td:nth-of-type(5):before { content: "Payment:"; }
	}
</style>
