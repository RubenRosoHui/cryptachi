<template>
	<header class="section-container">
		<div class="img-container">
			<!--
				TODO: Replace with this image after left and right logo animation is done and do a sway
				<img class="logo" src="../../assets/logos/png/cryptachi-logo-v4.png" />
			-->
			<img class="logo logo-left" src="../../assets/logos/png/cryptachi-logo-left.png" />
			<img class="logo logo-right" src="../../assets/logos/png/cryptachi-logo-right.png" />
		</div>
		<div class="text-container">
			<h1>Tired of using long and hard-to-remember crypto addresses?</h1>
			<p class="title-4">Sign up now and get your <span class="yellow">free</span> crypto alias</p>
		</div>
		<form @submit.prevent="submitForm">
			<search-alias-field
				class="search-box"
				@aliasChange="onAliasChange"
				@domainChange="onDomainChange"
				@validate="onAliasValidate"
				:aliasRequired="false"
			/>
			<button class="base-button signup-button" type="submit" :disabled="isSignupButtonDisabled">SIGN UP</button>
		</form>
	</header>
</template>

<script>
	import SearchAliasField from '../../components/fields/SearchAliasField.vue';

	export default {
		components: { SearchAliasField },
		name: 'HeaderSection',
		data: () => ({
			alias: '',
			domain: '',
			isAliasValid: false,
			isSignupButtonDisabled: false
		}),
		methods: {
			onAliasChange(alias) {
				this.alias = alias;
			},
			onDomainChange(domain) {
				this.domain = domain;
			},
			onAliasValidate({ isValid }) {
				this.isAliasValid = isValid;
				this.isSignupButtonDisabled = !isValid;
			},
			submitForm() {
				this.$router.push({
					path: '/register',
					query: {
						alias: this.alias || undefined,
						domain: this.alias ? this.domain : undefined // Only assign domain if alias was also provided.
					}
				});
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
		margin-top: var(--spacing-8);
	}
	.logo {
		width: 100%;
		max-width: 400px;
		/*transform: rotate(20deg);*/
	}
	.logo-left {
		animation: slide-from-left 2s forwards;
		animation-timing-function: ease-out;
	}
	.logo-right {
		animation: slide-from-right 2s forwards;
		animation-timing-function: ease-out;
	}
	@keyframes slide-from-left {
		0% {
			transform: translateX(0) translateY(500px);
			opacity: 0;
		}
		75% {
			opacity: 0.01;
		}
		100% {
			transform: translateX(200px);
			opacity: 1;
		}
	}
	@keyframes slide-from-right {
		0% {
			transform: translateX(0) translateY(-500px);
			opacity: 0;
		}
		75% {
			opacity: 0.01;
		}
		100% {
			transform: translateX(-200px);
			opacity: 1;
		}
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
