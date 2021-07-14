<template>
	<base-dialog @close="onEditRecordClose" :show="form.isVisible">
		<template v-slot:header>
			<h1>{{ form.mode === 'add' ? 'Add' : 'Edit' }} Record</h1>
		</template>
		<form class="edit-record" @submit.prevent="">
			<div class="form-control">
				<label for="recipient-name">Recipient Name</label>
				<input id="recipient-name" type="text" name="recipientName" v-model="form.fields.recipientName.value" />
			</div>
			<div class="form-control">
				<label for="recipient-address">Recipient Address</label>
				<input id="recipient-address" type="text" name="recipientAddress" v-model="form.fields.recipientAddress.value" />
			</div>
			<div class="form-control">
				<label for="description">Description</label>
				<input id="description" type="text" name="description" v-model="form.fields.description.value" />
			</div>
			<div class="form-control" v-if="form.mode === 'add'">
				<label for="currency">Currency</label>
				<select id="currency" name="currency" v-model="form.fields.currency.value">
					<option v-for="currency in form.availableCurrencies" :key="currency" :value="currency">{{ currency.toUpperCase() }}</option>
					<!--
					<option value="btc">BTC</option>
					<option value="eth">ETH</option>
					<option value="xmr">XMR</option>
					-->
				</select>
			</div>
			<div class="form-control text-align-right" id="form-buttons">
				<button v-if="form.mode === 'edit'" type="submit" class="base-button" id="edit-button" @click="editRecord">EDIT</button>
				<button v-else type="submit" class="base-button" id="edit-button" @click="addRecord">ADD</button>
			</div>
		</form>
	</base-dialog>
	<base-confirm ref="confirmDialog" />
	<h1 class="hidden">Aliases</h1>
	<ul id="aliases-list">
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
</template>

<script>
	import AliasListItem from '../../components/lists/AliasListItem.vue';

	export default {
		name: 'AccountAliases',
		components: { AliasListItem },
		data: () => ({
			supportedCurrencies: ['xmr', 'btc', 'eth'],
			aliases: [
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
			],
			form: {
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
			}
		}),
		methods: {
			onEditRecordClose() {
				this.form.isVisible= false;
			},
			showEditRecordForm(payload) {
				const { record, aliasName, domain } = payload;
				const formFields = this.form.fields;

				this.form.mode = 'edit';
				formFields.aliasName = aliasName;
				formFields.domain = domain;
				formFields.currency.value = record.currency;
				formFields.recipientName.value = record.recipientName;
				formFields.recipientAddress.value = record.recipientAddress;
				formFields.description.value = record.description;

				this.form.isVisible = true;
			},
			editRecord() {
				const formFields = this.form.fields;

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
				this.form.isVisible = false;
			},
			showAddRecordForm({ aliasName, domain, currencies }) {
				if (currencies.length >= this.supportedCurrencies.length) {
					const confirmDialog = this.$refs.confirmDialog;
					confirmDialog.type = 'ok';
					confirmDialog.title = 'Maximum Reached';
					confirmDialog.content = 'You cannot add anymore records because you have used every supported currency.';
					confirmDialog.show = true;
				} else {
					this.form.mode = 'add';
					this.form.fields.aliasName = aliasName;
					this.form.fields.domain = domain;
					this.form.fields.recipientName.value = '';
					this.form.fields.recipientAddress.value = '';
					this.form.fields.description.value = '';
					this.form.availableCurrencies = this.supportedCurrencies.filter(sc => !currencies.includes(sc)).sort();
					this.form.fields.currency.value = this.form.availableCurrencies[0];
					this.form.isVisible = true;
				}
			},
			addRecord() {
				this.form.isVisible = false;

				const formFields = this.form.fields;

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

	form.edit-record .form-control {
		margin-top: var(--spacing-4);
	}
	form.edit-record .form-control:first-child {
		margin-top: 0;
	}
	form.edit-record .form-control label[for="currency"]:after {
		content: ": ";
	}
</style>
