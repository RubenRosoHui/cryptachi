<template>
	<table>
		<thead>
			<tr>
				<th>Date</th>
				<th>Order ID</th>
				<th>Alias</th>
				<th>Plan</th>
				<th>Payment</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(purchase, i) in purchases" :key="purchase.id" :class="{ 'dark-background': i % 2 === 0 ? false : true }">
				<td>{{ formatDate(purchase.createdAt) }}</td>
				<td>{{ purchase.id }}</td>
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
		text-align: center;
	}
	thead {
		background-color: var(--cyan-dark);
		font-family: var(--font-family-sans-serif);
	}
	thead tr th,
	tbody tr td{
		padding: var(--spacing-2) var(--spacing-1);
	}

	.dark-background {
		background-color: rgba(0, 0, 0, 0.2);
	}
</style>
