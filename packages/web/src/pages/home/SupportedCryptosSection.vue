<template>
	<div class="section-container">
		<h1>Get aliases for several cryptocurrencies</h1>
		<div class="crypto-list-container">
			<img src="../../assets/logos/png/bitcoin-200.png" />
			<img src="../../assets/logos/png/monero-200.png" />
			<img src="../../assets/logos/png/ethereum-200.png" />
			<img src="../../assets/logos/svg/bitcoin-cash-bch-logo.svg" />
			<img src="../../assets/logos/svg/Cardano-RGB_Logo-Icon-White.svg" />
			<img src="../../assets/logos/svg/dogecoin-doge-logo.svg" />
			<img src="../../assets/logos/svg/litecoin-ltc-logo.svg" />
		</div>
		<p class="title-4">And much more coming soon...</p>
	</div>
</template>

<script>
	export default {
		name: 'SupportedCryptosSection'
	}
</script>

<style scoped>
	.section-container {
		padding: var(--spacing-16) var(--spacing-4);
		text-align: center;
		background-color: var(--background);
	}

	.crypto-list-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		padding: var(--spacing-8) 0;
		max-width: 800px;
		margin: 0 auto;
		gap: var(--spacing-24);
	}
	.crypto-list-container img {
		max-width: 100px;
	}
</style>
