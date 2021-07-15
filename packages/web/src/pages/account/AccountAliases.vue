<template>
	<base-dialog @close="recordForm.isVisible = false" :show="recordForm.isVisible">
		<template v-slot:header>
			<h1>{{ recordForm.mode === 'add' ? 'Add' : 'Edit' }} Record</h1>
		</template>
		<form class="edit-record" @submit.prevent="">
			<div class="form-control">
				<label for="recipient-name">Recipient Name</label>
				<input id="recipient-name" type="text" name="recipientName" v-model="recordForm.fields.recipientName.value" />
			</div>
			<div class="form-control">
				<label for="recipient-address">Recipient Address</label>
				<input id="recipient-address" type="text" name="recipientAddress" v-model="recordForm.fields.recipientAddress.value" />
			</div>
			<div class="form-control">
				<label for="description">Description</label>
				<input id="description" type="text" name="description" v-model="recordForm.fields.description.value" />
			</div>
			<div class="form-control" v-if="recordForm.mode === 'add'">
				<label for="currency">Currency</label>
				<select id="currency" name="currency" v-model="recordForm.fields.currency.value">
					<option v-for="currency in recordForm.availableCurrencies" :key="currency" :value="currency">{{ currency.toUpperCase() }}</option>
				</select>
			</div>
			<div class="form-control text-align-right form-buttons">
				<button v-if="recordForm.mode === 'edit'" type="submit" class="base-button" id="edit-button" @click="editRecord">EDIT</button>
				<button v-else type="submit" class="base-button" id="edit-button" @click="addRecord">ADD</button>
			</div>
		</form>
	</base-dialog>
	<base-dialog @close="aliasForm.isVisible = false" :show="aliasForm.isVisible">
		<template v-slot:header>
			<h1>Add Alias</h1>
		</template>
		<form @submit.prevent="addAlias">
			<div class="form-control">
				<search-alias-field
					@aliasChange="alias => aliasForm.fields.aliasName = alias"
					@domainChange="domain => aliasForm.fields.domain = domain"
				/>
			</div>
			<div class="form-control alias-select-type">
				<label for="alias-type">Type</label>
				<select id="alias-type" name="type" v-model="aliasForm.fields.type">
					<option value="upgraded">Upgraded</option>
					<option value="free">Free</option>
				</select>
			</div>
			<div class="form-control text-align-right form-buttons">
				<button type="submit" class="base-button">Add</button>
			</div>
		</form>
	</base-dialog>
	<base-confirm ref="confirmDialog" />
	<h1 class="hidden">Aliases</h1>
	<ul id="aliases-list" v-if="aliases.length > 0">
		<alias-list-item
			class="aliases-list-item"
			v-for="(alias, i) in aliases"
			:key="i"
			:alias="alias"
			@editRecord="showEditRecordForm"
			@addRecord="showAddRecordForm"
			@deleteRecord="deleteRecord"
			@deleteAlias="deleteAlias"
		/>
	</ul>
	<div id="empty-aliases" v-else>
		<h1 class="red">No Aliases</h1>
		<img class="red-filter" src="../../assets/icons/svg/fi-rr-list.svg" />
		<p class="red-light bold">You have 0 aliases. Go and add one with the button below.</p>
	</div>
	<div class="page-controls">
		<button class="base-button add-alias" @click="aliasForm.isVisible = true">
			<img src="../../assets/icons/svg/fi-rr-add.svg">
			<span>Add Alias</span>
		</button>
	</div>
</template>

<script>
	import AliasListItem from '../../components/lists/AliasListItem.vue';
	import SearchAliasField from '../../components/fields/SearchAliasField.vue';

	export default {
		name: 'AccountAliases',
		components: { AliasListItem, SearchAliasField },
		beforeMount() {
			// TODO: Fetch aliases from server.
			this.aliases = [
				{
					name: 'foster',
					domain: 'cryptachi.com',
					paid: false,
					expiration: new Date('August 4, 2021'),
					records: [
						{
							currency: 'xmr',
							recipientName: 'foster',
							recipientAddress: '3rfYZI6WCZFy0ObAwNAO2arxzhj9yZ9R562ziooMotamakxbLpGsvwoOmXCEBw0tDOJLi1KGtytNUtRkYGoQ5uvte6nk8yT',
							description: 'My monero alias'
						}
					]
				},
				{
					name: 'matthew',
					domain: 'cryptachi.com',
					paid: true,
					expiration: new Date('January 19, 2022'),
					records: [
						{
							currency: 'xmr',
							recipientName: 'matthew',
							recipientAddress: '3rfYZI6WCZFy0ObAwNAO2arxzhj9yZ9R562ziooMotamakxbLpGsvwoOmXCEBw0tDOJLi1KGtytNUtRkYGoQ5uvte6nk8yT',
							description: "Matthew's monero alias"
						},
						{
							currency: 'btc',
							recipientName: 'matthew',
							recipientAddress: 'btcbbc',
							description: "Matthew's bitcoin alias"
						}
					]
				},
				{
					name: 'reallyreallyreallylongalias',
					domain: 'cryptachi.com',
					paid: true,
					expiration: new Date('December 25, 2021'),
					records: [
						{
							currency: 'xmr',
							recipientName: 'matthew',
							recipientAddress: '3rfYZI6WCZFy0ObAwNAO2arxzhj9yZ9R562ziooMotamakxbLpGsvwoOmXCEBw0tDOJLi1KGtytNUtRkYGoQ5uvte6nk8yT',
							description: "monero alias"
						},
						{
							currency: 'btc',
							recipientName: 'matthew',
							recipientAddress: 'bc1JJWJoLmglBLD690e5FTf9WNZdzCovyO6jSwkuoz',
							description: "Matthew's bitcoin alias"
						},
						{
							currency: 'eth',
							recipientName: 'matthewreallyreallyreallyreallyreallyreallyreallyreallylongname',
							recipientAddress: '0x23cb385f1511Ea6B1A2E5B58eCA573Fbc72Bb86E',
							description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
						}
					]
				}
			];
		},
		data: () => ({
			supportedCurrencies: ['xmr', 'btc', 'eth'],
			aliases: [],
			recordForm: {
				mode: 'edit', // NOTE: Valid values are: 'edit', 'add'
				isVisible: false,
				availableCurrencies: [],
				fields: {
					aliasName: '',
					domain: '',
					currency: { value: 'btc' },
					recipientName: { value: '' },
					recipientAddress: { value: '' },
					description: { value: '' }
				}
			},
			aliasForm: {
				isVisible: false,
				fields: {
					aliasName: '',
					domain: '',
					type: 'upgraded'
				}
			}
		}),
		methods: {
			showEditRecordForm(payload) {
				const { record, aliasName, domain } = payload;
				const formFields = this.recordForm.fields;

				this.recordForm.mode = 'edit';
				formFields.aliasName = aliasName;
				formFields.domain = domain;
				formFields.currency.value = record.currency;
				formFields.recipientName.value = record.recipientName;
				formFields.recipientAddress.value = record.recipientAddress;
				formFields.description.value = record.description;

				this.recordForm.isVisible = true;
			},
			editRecord() {
				const formFields = this.recordForm.fields;

				const newRecord = {
					currency: formFields.currency.value,
					recipientName: formFields.recipientName.value,
					recipientAddress: formFields.recipientAddress.value,
					description: formFields.description.value
				};

				const alias = this.aliases.find(alias => alias.name === formFields.aliasName && alias.domain === formFields.domain);
				const record = alias.records.find(record => record.currency === formFields.currency.value);

				// TODO: Update on the server side.

				if (record) {
					record.currency = newRecord.currency;
					record.recipientName = newRecord.recipientName;
					record.recipientAddress = newRecord.recipientAddress;
					record.description = newRecord.description;
				} else {
					record.push(newRecord);
				}
				this.recordForm.isVisible = false;
			},
			showAddRecordForm({ aliasName, domain, currencies }) {
				if (currencies.length >= this.supportedCurrencies.length) {
					const confirmDialog = this.$refs.confirmDialog;
					confirmDialog.type = 'ok';
					confirmDialog.title = 'Maximum Reached';
					confirmDialog.content = 'You cannot add anymore records because you have used all available currencies.';
					confirmDialog.show = true;
				} else {
					this.recordForm.mode = 'add';
					this.recordForm.fields.aliasName = aliasName;
					this.recordForm.fields.domain = domain;
					this.recordForm.fields.recipientName.value = '';
					this.recordForm.fields.recipientAddress.value = '';
					this.recordForm.fields.description.value = '';
					this.recordForm.availableCurrencies = this.supportedCurrencies.filter(sc => !currencies.includes(sc)).sort();
					this.recordForm.fields.currency.value = this.recordForm.availableCurrencies[0];
					this.recordForm.isVisible = true;
				}
			},
			addRecord() {
				this.recordForm.isVisible = false;

				const formFields = this.recordForm.fields;

				const newRecord = {
					currency: formFields.currency.value,
					recipientName: formFields.recipientName.value,
					recipientAddress: formFields.recipientAddress.value,
					description: formFields.description.value
				};

				const alias = this.aliases.find(alias => alias.name === formFields.aliasName && alias.domain === formFields.domain);

				// TODO: Add new alias record on the server side.

				alias.records.push(newRecord);
			},
			deleteRecord({recordCurrency, aliasName, domain}) {
				this.$refs.confirmDialog.title = 'Delete Record';
				this.$refs.confirmDialog.content = `You are about to delete the ${recordCurrency.toUpperCase()} record of ${aliasName}.${domain}.`;
				this.$refs.confirmDialog.confirmCb = () => {
				const alias = this.aliases.find(alias => alias.name === aliasName && alias.domain === domain);

					// TODO: Delete alias record on the server side.

					alias.records = alias.records.filter(record => record.currency !== recordCurrency);
				};
				this.$refs.confirmDialog.show = true;
			},
			deleteAlias({aliasName, domain}) {
				const confirmDialog = this.$refs.confirmDialog;
				confirmDialog.title = 'Delete Alias';
				confirmDialog.content = `You are about to delete ${aliasName}.${domain}.`;
				confirmDialog.confirmCb = () => {
					// TODO: Delete alias on the server side.
					this.aliases = this.aliases.filter(alias => `${alias.name}.${alias.domain}` !== `${aliasName}.${domain}`);
				};
				confirmDialog.show = true;
			},
			addAlias() {
				this.aliasForm.isVisible = false;

				// TODO: Add and check the server if alias is available.

				this.aliases.push({
					name: this.aliasForm.fields.aliasName,
					domain: this.aliasForm.fields.domain,
					paid: this.aliasForm.fields.type === 'free' ? false : true,
					expiration: new Date(Date.now() + 2592000000), // 30 days from now.
					records: []
				});
			}
		}
	}
</script>

<style scoped>
	.aliases-list-item {
		margin-top: var(--spacing-8);
	}
	.aliases-list-item:first-child {
		margin-top: 0;
	}

	form .form-control {
		margin-top: var(--spacing-4);
	}
	form .form-control:first-child {
		margin-top: 0;
	}
	form .form-control:last-child {
		margin-top: var(--spacing-8);
	}
	form .form-control label[for="currency"]:after,
	form .form-control label[for="alias-type"]:after {
		content: ": ";
	}
	form .form-control.alias-select-type {
		margin-top: var(--spacing-8);
	}

	.page-controls {
		margin-top: var(--spacing-16);
	}
	button.add-alias {
		display: flex;
		align-items: center;
		margin: 0 auto;
		column-gap: var(--spacing-2);
	}
	button.add-alias img {
		width: var(--icon-md);
	}

	#empty-aliases {
		text-align: center;
	}
	#empty-aliases img {
		width: var(--icon-100);
		margin: var(--spacing-4) 0;
	}
</style>
