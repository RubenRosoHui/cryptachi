<template>
	<header class="section-container">
		<div class="img-container">
			<img class="logo levitate" src="../../assets/logos/png/cryptachi-logo.png" />
		</div>
		<div class="text-container">
			<h1>Tired of using long and hard-to-remember crypto addresses?</h1>
			<p class="title-4">Sign up now and get your <span class="yellow">free</span> crypto alias</p>
		</div>
		<form @submit.prevent="submitForm">
			<search-alias-field class="search-box" @aliasChange="onAliasChange" @domainChange="onDomainChange" />
			<button class="base-button signup-button" type="submit">SIGN UP</button>
		</form>
	</header>
</template>

<script>
	import SearchAliasField from '../../components/fields/SearchAliasField.vue';

	export default {
		components: { SearchAliasField },
		name: 'HeaderSection',
		data: () => ({
			form: {
				aliasField: { value: '' },
				domainField: { value: '' }
			}
		}),
		methods: {
			onAliasChange(alias) {
				this.form.aliasField.value = alias;
			},
			onDomainChange(domain) {
				this.form.domainField.value = domain;
			},
			submitForm() {
				console.log('Submitting form.');
			}
		}
	}
</script>

<style scoped>
	header {
		padding: 0 var(--spacing-4) var(--spacing-16) var(--spacing-4);
		background-color: var(--black-dark);
		width: 100%;
		text-align: center;
	}
	.img-container {
		position: relative;
		width: 100%;
	}
	.logo {
		width: 100%;
		max-width: 400px;
	}

	form {
		max-width: 800px;
		margin: var(--spacing-8) auto 0 auto;
	}

	.signup-button {
		width: 100%;
		margin-top: var(--spacing-8);
	}

	@media (min-width: 600px) {
		form {
			display: flex;
			justify-content: center;
		}
		.signup-button {
			width: 200px;
			padding: var(--spacing-2);
			margin-top: 0;
			margin-left: var(--spacing-4);
		}
		.search-box {
			width: 100%;
		}
	}
</style>
