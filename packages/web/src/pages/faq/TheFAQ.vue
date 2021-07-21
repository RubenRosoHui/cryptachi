<template>
	<div class="base-container">
		<header>
			<h1>Frequently Asked Questions</h1>
		</header>
		<ul class="faq-list">
			<li>
				<h2>What is Cryptachi?</h2>
				<p>Cryptachi provides aliases (or names) for your crypto addresses. With an alias, you can give your sender a memorable name instead of a long and forgettable crypto address.</p>
				<br />
				<p>For the technically proficient, aliases are subdomains under our domain names. The payment information of aliases are stored as DNS TXT records using the <a href="https://openalias.org" target="_blank">OpenAlias</a> system. OpenAlias provides a standard for storing crypto payment information and is supported by several crypto wallets.</p>
			</li>
			<li>
				<h2>Why Cryptachi?</h2>
				<p>Typically you can create crypto aliases yourself by making subdomains within a domain you own. However, to obtain your own domain, you are legally required to provide accurate contact information to your registrar sacrificing your personal privacy.</p>
				<br />
				<p>At Cryptachi, all of our domains are registered under our information. As a result, we do not require your contact information when obtaining an alias letting you stay anonymous. We only require an email to sign up for a user account where it will be used for account management and payment related tasks such as sending password resets and receipts.</p>
				<br />
				<p>As an additional layer of security, all Cryptachi domains (both free and paid) are equipped with DNSSEC at no additional cost. DNSSEC is designed to protect transactions sent to your alias from being redirected to a malicious address owned by a hijacker.</p>
				<br />
				<p>With Cryptachi, you can obtain an affordable, secure and privacy-respecting alias in a few simple steps.</p>
			</li>
			<li>
				<h2>What are records?</h2>
				<p>A record is attached to an alias and stores the type of currency, recipient name, and recipient address. An alias may have multiple records where each record is for a specific currency but may only have one record per currency. <span class="yellow bold">Note</span> that free aliases are limited to 1 record and expire every 30 days.</p>
				<br />
				<p>You may edit these records at any time. Any changes to a record may take up to 24 hours to take effect.</p>
			</li>
			<li>
				<h2>Which cryptocurrencies are supported?</h2>
				<p>We currently support the following currencies with plans of adding many more:</p>
				<ul class="base-list">
					<li>Bitcoin</li>
					<li>Ethereum</li>
					<li>Monero</li>
				</ul>
			</li>
			<li>
				<h2>Which wallets support OpenAlias?</h2>
				<p>Crypto wallets with OpenAlias support are listed below. Refer to the <a target="_blank" href="https://openalias.org">OpenAlias</a> site for an up-to-date list.</p>
				<ul class="base-list">
					<li><a target="_blank" href="https://www.getmonero.org">Monero Core</a></li>
					<li><a target="_blank" href="https://electrum.org">Electrum</a></li>
					<li><a target="_blank" href="https://mymonero.com/">MyMonero</a></li>
					<li><a target="_blank" href="https://coin.space/">Coin.Space</a></li>
					<li><a target="_blank" href="https://github.com/nabijaczleweli/openalias.rs">openalias.rs</a></li>
				</ul>
			</li>
			<li>
				<h2>What type of payments are accepted?</h2>
				<p>We accept crypto payments for the following currencies: Bitcoin, Monero, and Ethereum</p>
				<br />
				<p>We currently do not accept credit and debit card payments.</p>
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

	ul.faq-list > li {
		margin-top: var(--spacing-8);
	}
	ul.faq-list > li:first-child {
		margin-top: 0;
	}

	@media (min-width: 1000px) {
		.base-container {
			padding-left: var(--spacing-32);
			padding-right: var(--spacing-32);
		}
	}
</style>
