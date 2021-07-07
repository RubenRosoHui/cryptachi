<template>
	<section>
		<h1>Get aliases for several cryptocurrencies</h1>
		<div class="crypto-list-container">
			<img src="../../assets/logos/png/bitcoin-200.png" />
			<img src="../../assets/logos/png/monero-200.png" />
			<img src="../../assets/logos/png/ethereum-200.png" />
		</div>
		<p class="title-4">And much more...</p>
	</section>
</template>

<script>
	export default {
		name: 'SupportedCryptosSection'
	}
</script>

<style scoped>
	section {
		padding: var(--spacing-16) var(--spacing-4);
		text-align: center;
	}

	.crypto-list-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		padding: var(--spacing-8) 0;
		max-width: 800px;
		margin: 0 auto;
	}
	.crypto-list-container img {
		max-width: 100px;
	}
</style>>
