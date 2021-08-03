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
			@upgradeAlias="upgradeAlias"
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
	import { handleResponse } from '../../lib/exception.js';

	import AliasListItem from '../../components/lists/AliasListItem.vue';
	import SearchAliasField from '../../components/fields/SearchAliasField.vue';

	export default {
		name: 'AccountAliases',
		components: { AliasListItem, SearchAliasField },
		async beforeMount() {
			await this.loadAliases();
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
			async editRecord() {
				this.recordForm.isVisible = false;
				const formFields = this.recordForm.fields;

				const newRecord = {
					currency: formFields.currency.value,
					recipientName: formFields.recipientName.value,
					recipientAddress: formFields.recipientAddress.value,
					description: formFields.description.value
				};

				const alias = this.aliases.find(alias => alias.name === formFields.aliasName && alias.domain === formFields.domain);
				const record = alias.records.find(record => record.currency === formFields.currency.value);

				try {
					const response = await fetch(`/api/user/aliases/${formFields.aliasName}/records`, {
						method: 'PATCH',
						headers: {
							Authorization: this.$store.getters['jwt'],
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ ...newRecord, domain: formFields.domain })
					});

					await handleResponse(response);

					if (record) {
						record.currency = newRecord.currency;
						record.recipientName = newRecord.recipientName;
						record.recipientAddress = newRecord.recipientAddress;
						record.description = newRecord.description;
					} else {
						record.push(newRecord);
					}
				} catch(err) {
					if (err instanceof Error && err.message) {
						const confirmDialog = this.$refs.confirmDialog;
						confirmDialog.title = 'Error';
						confirmDialog.content = err.message;
						confirmDialog.type = 'ok';
						confirmDialog.show = true;
					}
				}
			},
			async addRecord() {
				this.recordForm.isVisible = false;

				const formFields = this.recordForm.fields;

				const newRecord = {
					currency: formFields.currency.value,
					recipientName: formFields.recipientName.value,
					recipientAddress: formFields.recipientAddress.value,
					description: formFields.description.value
				};

				const alias = this.aliases.find(alias => alias.name === formFields.aliasName && alias.domain === formFields.domain);

				try {
					const response = await fetch(`/api/user/aliases/${formFields.aliasName}/records`, {
						method: 'POST',
						headers: {
							Authorization: this.$store.getters['jwt'],
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ ...newRecord, domain: formFields.domain })
					});

					await handleResponse(response);

					alias.records.push(newRecord);
				} catch(err) {
					if (err instanceof Error && err.message) {
						const confirmDialog = this.$refs.confirmDialog;
						confirmDialog.title = 'Error';
						confirmDialog.content = err.message;
						confirmDialog.type = 'ok';
						confirmDialog.show = true;
					}
				}
			},
			deleteRecord({recordCurrency, aliasName, domain}) {
				this.$refs.confirmDialog.title = 'Delete Record';
				this.$refs.confirmDialog.content = `You are about to delete the ${recordCurrency.toUpperCase()} record of ${aliasName}.${domain}.`;
				this.$refs.confirmDialog.confirmCb = async () => {
					const alias = this.aliases.find(alias => alias.name === aliasName && alias.domain === domain);

					try {
						const response = await fetch(`/api/user/aliases/${aliasName}/records`, {
							method: 'DELETE',
							headers: {
								Authorization: this.$store.getters['jwt'],
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({ currency: recordCurrency, domain })
						});

						await handleResponse(response);

						alias.records = alias.records.filter(record => record.currency !== recordCurrency);
					} catch(err) {
						if (err instanceof Error && err.message) {
							const confirmDialog = this.$refs.confirmDialog;
							confirmDialog.title = 'Error';
							confirmDialog.content = err.message;
							confirmDialog.type = 'ok';
							confirmDialog.show = true;
						}
					}
				};
				this.$refs.confirmDialog.show = true;
			},
			async deleteAlias({aliasName, domain}) {
				const confirmDialog = this.$refs.confirmDialog;
				confirmDialog.title = 'Delete Alias';
				confirmDialog.content = `You are about to delete ${aliasName}.${domain}. This action cannot be undone. Are you sure?`;

				try {
					confirmDialog.confirmCb = async () => {
						const query = `domain=${domain}`
						const response = await fetch(`/api/user/aliases/${aliasName}?${query}`, {
							method: 'DELETE',
							headers: { Authorization: this.$store.getters['jwt'] }
						});

						await handleResponse(response);
						const jsonResponse = await response.json();

						console.log(jsonResponse.message);

						this.aliases = this.aliases.filter(alias => `${alias.name}.${alias.domain}` !== `${aliasName}.${domain}`);
					};
				} catch(err) {
					if (err instanceof Error && err.message) {
						const confirmDialog = this.$refs.confirmDialog;
						confirmDialog.title = 'Error';
						confirmDialog.content = err.message;
						confirmDialog.type = 'ok';
						confirmDialog.show = true;
					}
				}

				confirmDialog.show = true;
			},
			async addAlias() {
				this.aliasForm.isVisible = false;

				const name = this.aliasForm.fields.aliasName;
				const domain = this.aliasForm.fields.domain;
				const aliasType = this.aliasForm.fields.type;

				if (aliasType === 'upgraded') {
					return this.$router.push({
						path: '/checkout/details',
						query: { alias: name, domain }
					})
				}

				try {
					const query = `domain=${domain}`;
					const response = await fetch(`/api/user/aliases/${name}?${query}`, {
						method: 'POST',
						headers: { Authorization: this.$store.getters['jwt'] }
					});

					await handleResponse(response);

					const jsonResponse = await response.json();
					const newAlias = jsonResponse.alias;

					this.aliases.push({
						name: newAlias.alias,
						domain: newAlias.domain,
						paid: newAlias.paid,
						expiration: new Date(newAlias.expiration),
						records: newAlias.records
					});
				} catch(err) {
					if (err instanceof Error && err.message) {
						const confirmDialog = this.$refs.confirmDialog;
						confirmDialog.title = 'Error';
						confirmDialog.content = err.message;
						confirmDialog.type = 'ok';
						confirmDialog.show = true;
					}
				}
			},
			upgradeAlias({ alias, domain }) {
				this.$router.push({
					path: '/checkout/details',
					query: { alias, domain }
				});
			},
			async loadAliases() {
				const response = await fetch('/api/user/aliases', {
					headers: { 'Authorization': this.$store.getters['jwt'] }
				});

				await handleResponse(response);

				const jsonResponse = await response.json();

				this.aliases = jsonResponse.aliases.map(alias => ({
					...alias,
					id: alias._id,
					name: alias.alias,
					expiration: new Date(alias.expiration)
				}));
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
