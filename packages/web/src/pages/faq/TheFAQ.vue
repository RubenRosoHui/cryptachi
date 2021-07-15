<template>
	<div class="base-container">
		<header>
			<h1>Frequently Asked Questions</h1>
		</header>
		<ul class="faq-list">
			<li>
				<h2>What is Cryptachi?</h2>
				<p>Placeholder</p>
			</li>
			<li>
				<h2>Why Cryptachi?</h2>
				<p>Placeholder</p>
			</li>
			<li>
				<h2>What are records?</h2>
				<p>Placeholder</p>
			</li>
			<li>
				<h2>Are the aliases secure?</h2>
				<p>Placeholder</p>
			</li>
			<li>
				<h2>Which cryptocurrencies are supported?</h2>
				<p>Placeholder</p>
			</li>
			<li>
				<h2>Which wallet supports OpenAlias?</h2>
				<p>Placeholder</p>
			</li>
			<li>
				<h2>What type of payments are accepted?</h2>
				<p>Placeholder</p>
			</li>
			<li>
				<h2>What is your refund policy?</h2>
				<p>No refunds.</p>
			</li>
		</ul>
		<footer>
			<p class="font-md">Still have questions? <router-link to="/contact">Contact us</router-link>.</p>
		</footer>
	</div>
</template>

<script>
	export default {
		name: 'TheFAQ'
	}
</script>

<style scoped>
	header, footer {
		text-align: center;
	}
	footer > p {
		font-weight: bold;
	}

	ul.faq-list {
		margin-top: var(--spacing-16);
		margin-bottom: var(--spacing-16);
	}

	ul.faq-list li {
		margin-top: var(--spacing-8);
	}
	ul.faq-list li:first-child {
		margin-top: 0;
	}

	@media (min-width: 1000px) {
		.base-container {
			padding-left: var(--spacing-32);
			padding-right: var(--spacing-32);
		}
	}
</style>
