<template>
	<li>
		<header>
			<h2>
				{{ alias.name }}<span class="domain">.{{ alias.domain }}</span>
			</h2>
			<div class="tags">
				<span class="tag" :class="{ warning: calculateDaysRemaining(alias.expiration) < 7 }">
					Expires in: {{ calculateDaysRemaining(alias.expiration) }} days
				</span>
				<span class="tag free" v-if="!alias.paid">FREE</span>
			</div>
			<menu>
				<li class="menu-control delete-alias" v-if="!alias.paid">
					<img src="../../assets/icons/svg/fi-rr-trash.svg" title="Delete Alias" @click="deleteAlias" />
				</li>
				<li class="menu-control">
					<button v-if="calculateDaysRemaining(alias.expiration) < 7" class="text-button green" @click="onRenewClicked">RENEW</button>
					<button v-else-if="!alias.paid && alias.records.length > 0" class="text-button" @click="onUpgradeClicked">UPGRADE</button>
					<img v-else src="../../assets/icons/svg/fi-rr-plus.svg" title="Add Record" @click="addRecord" />
				</li>
				<li @click="toggleRecordsVisibility" class="menu-control" v-if="alias.records.length > 0">
					<img src="../../assets/icons/svg/fi-rr-angle-up.svg" v-if="isRecordsVisible" title="Hide Records" />
					<img src="../../assets/icons/svg/fi-rr-angle-down.svg" v-else title="Show Records" />
				</li>
			</menu>
		</header>
		<table class="records" v-if="isRecordsVisible && alias.records.length > 0">
			<thead>
				<tr>
					<th>Currency</th>
					<th>Recipient Name</th>
					<th>Recipient Address</th>
					<th>Description</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(record, i) in sortRecords(alias.records)" :key="i">
					<td class="currency">
						<img v-if="record.currency === 'btc'" src="../../assets/logos/png/bitcoin-200.png" />
						<img v-else-if="record.currency === 'xmr'" src="../../assets/logos/png/monero-200.png" />
						<img v-else-if="record.currency === 'eth'" src="../../assets/logos/png/ethereum-200.png" />
						{{ record.currency.toUpperCase() }}
					</td>
					<td class="recipient-name" :title="record.recipientName">{{ record.recipientName }}</td>
					<td class="recipient-address" :title="record.recipientAddress">{{ record.recipientAddress }}</td>
					<td class="description" :title="record.description">{{ record.description }}</td>
					<td class="actions">
						<img class="delete" src="../../assets/icons/svg/fi-rr-delete.svg" title="Delete Record" @click="deleteRecord(record.currency)" />
						<img class="edit" src="../../assets/icons/svg/fi-rr-edit.svg" title="Edit Record" @click="editRecord(record)" />
					</td>
				</tr>
			</tbody>
		</table>
	</li>
</template>

<script>
	export default {
		name: 'AliasListItem',
		props: ['alias'],
		emits: [
			'editRecord',
			'addRecord',
			'deleteRecord',
			'deleteAlias',
			'upgradeAlias',
			'renewAlias'
		],
		data: () => ({
			isRecordsVisible: false
		}),
		methods: {
			toggleRecordsVisibility() {
				this.isRecordsVisible = !this.isRecordsVisible;
			},
			truncateAddress(address, maxLength=42) {
				if (address.length > maxLength) {
					return address.slice(0, maxLength-3) + '...';
				}
				return address;
			},
			calculateDaysRemaining(date) {
				const now = new Date();
				const daysRemaining = Math.round((date - now) / 86400000);

				return daysRemaining < 0 ? 0 : daysRemaining;
			},
			editRecord(record) {
				this.$emit('editRecord', {
					record,
					aliasName: this.alias.name,
					domain: this.alias.domain
				});
			},
			addRecord() {
				this.$emit('addRecord', {
					aliasName: this.alias.name,
					domain: this.alias.domain,
					currencies: this.alias.records.map(record => record.currency),
					paid: this.alias.paid
				});
				this.isRecordsVisible = true;
			},
			deleteRecord(recordCurrency) {
				this.$emit('deleteRecord', {
					recordCurrency,
					aliasName: this.alias.name,
					domain: this.alias.domain
				});
			},
			deleteAlias() {
				this.$emit('deleteAlias', {
					aliasName: this.alias.name,
					domain: this.alias.domain
				});
			},
			sortRecords(records) {
				return records.concat().sort((current, next) => {
					if (current.currency > next.currency) {
						return 1;
					}
					return 0;
				});
			},
			onUpgradeClicked() {
				this.$emit('upgradeAlias', {
					alias: this.alias.name,
					domain: this.alias.domain
				});
			},
			onRenewClicked() {
				this.$emit('renewAlias', {
					alias: this.alias.name,
					domain: this.alias.domain
				})
			}
		}
	}
</script>

<style scoped>
	header {
		display: flex;
		align-items: center;
		width: 100%;
		background-color: var(--black);
		padding: var(--spacing-2);
		flex-wrap: wrap;
		column-gap: var(--spacing-4);
		row-gap: var(--spacing-2);
	}
	header > h2 {
		font-size: var(--font-md);
		word-wrap: break-word;

		/* NOTE: Prevents the heading from clamping to a minimum size. */
		min-width: 0;
	}
	header > .tags {
		margin-right: auto;
	}
	.domain {
		color: var(--white);
	}

	.text-button.green {
		color: var(--green);
	}

	menu {
		display: flex;
		list-style: none;
		background-color: var(--black);
	}
	.menu-control {
		display: flex;
		align-items: center;
		cursor: pointer;
		margin-right: var(--spacing-4);
	}
	.menu-control img {
		width: var(--icon-md);
		filter: var(--cyan-filter);
	}

	.menu-control.delete-alias img {
		filter: var(--red-filter);
	}
	.menu-control:last-child {
		margin-right: 0;
	}

	table {
		background-color: var(--black-darkest);
		width: 100%;
		padding: 0 var(--spacing-2) var(--spacing-1) var(--spacing-2);
	}
	table thead th {
		padding: var(--spacing-2) 0;
	}
	table tbody td {
		padding: var(--spacing-1) 0;
		color: var(--text-dark);
	}
	table td img {
		width: var(--icon-md);
	}
	table td.currency img {
		margin-right: var(--spacing-1);
	}
	table.records tbody tr:hover td {
		color: var(--yellow);
		font-weight: bold;
	}
	table tbody td.actions img {
		vertical-align: middle;
		cursor: pointer;
		margin-left: var(--spacing-4);
	}
	table tbody td.actions img.edit {
		filter: var(--cyan-filter);
	}
	table tbody td.actions img.delete {
		filter: var(--red-filter);
	}
	table tbody td:first-of-type {
		display: flex;
	}
	table tbody td:last-of-type {
		text-align: right;
	}
	td.recipient-address,
	td.recipient-name,
	td.description {
		max-width: 150px;
		padding-right: var(--spacing-8);
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	@media only screen and (max-width: 768px), (min-device-width: 768px) and (max-device-width: 1024px) {
		table {
			padding: 0;
		}
		tbody tr td {
			text-align: left;
		}
		td.recipient-address,
		td.recipient-name,
		td.description {
			max-width: initial;
			padding-right: 0;
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

		table tbody td {
			/* Behave like a row */
			border: none;
			border-bottom: 1px solid var(--black);
			padding-left: 1rem;
			padding-right: 1rem;
			position: relative;
		}

		table tbody td:last-child {
			text-align: center;
		}

		tbody tr { border: 1px solid var(--black) }

		tbody td:before {
			/* Now like a table header */
			display: inline-block;

			/* Top/left values mimic padding */
			width: 180px;
			padding-right: 10px;
			white-space: nowrap;
			font-weight: bold;
		}

		/* NOTE: Label the data */
		tbody td:nth-of-type(1):before { content: "Currency:"; }
		tbody td:nth-of-type(2):before { content: "Recipient Name:"; }
		tbody td:nth-of-type(3):before { content: "Recipient Address:"; }
		tbody td:nth-of-type(4):before { content: "Description:"; }
	}
</style>
