<template>
	<div class="section-container">
		<h1>Available Plans</h1>
		<ul class="plans">
			<li class="free">
				<h2 class="blue">Free</h2>
				<p class="price">$0</p>
				<ul class="features">
					<li>DNSSEC Secured</li>
					<li>DDoS Protection</li>
					<li class="unfeature">One record limit</li>
					<li class="unfeature">Expires every 30 days</li>
				</ul>
			</li>
			<li class="one-year">
				<h2 class="pink">One Year</h2>
				<p class="price">$3.00</p>
				<div>
					<p class="discount bg-red-dark">Save 0%</p>
				</div>
				<ul class="features">
					<li>DNSSEC Secured</li>
					<li>DDoS Protection</li>
					<li>Unlocked record limit</li>
				</ul>
			</li>
			<li class="two-year">
				<h2 class="yellow">Two Years</h2>
				<p class="price">$5.70</p>
				<div>
					<p class="discount bg-green-dark">Save 5%</p>
				</div>
				<ul class="features">
					<li>DNSSEC Secured</li>
					<li>DDoS Protection</li>
					<li>Unlocked record limit</li>
				</ul>
			</li>
			<li class="three-year">
				<h2 class="red">Three Years</h2>
				<p class="price">$8.10</p>
				<div>
					<p class="discount bg-green-dark">Save 10%</p>
				</div>
				<ul class="features">
					<li>DNSSEC Secured</li>
					<li>DDoS Protection</li>
					<li>Unlocked record limit</li>
				</ul>
			</li>
			<li class="four-year">
				<h2 class="purple">Four Years</h2>
				<p class="price">$10.20</p>
				<div>
					<p class="discount bg-green-dark">Save 15%</p>
				</div>
				<ul class="features">
					<li>DNSSEC Secured</li>
					<li>DDoS Protection</li>
					<li>Unlocked record limit</li>
				</ul>
			</li>
			<li class="five-year">
				<h2 class="cyan">Five Years</h2>
				<p class="price">$12.00</p>
				<div>
					<p class="discount bg-green-dark">Save 1 year</p>
				</div>
				<ul class="features">
					<li>DNSSEC Secured</li>
					<li>DDoS Protection</li>
					<li>Unlocked record limit</li>
				</ul>
			</li>
		</ul>
		<p>All prices are in CAD.</p>
	</div>
</template>

<script>
	export default {
		name: 'AvailablePlansSection'
	}
</script>

<style scoped>
	.section-container {
		padding: var(--spacing-16) var(--spacing-4);
		text-align: center;
		background-color: var(--background);
	}

	.section-container > * {
		margin-top: var(--spacing-8);
	}
	.section-container > *:first-child {
		margin-top: 0;
	}

	ul.features {
		display: inline-flex;
		flex-direction: column;
		align-items: flex-start;
	}
	ul.features > li:before {
		display: inline-block;
		content: url('../../assets/icons/svg/fi-rr-check.svg');
		width: 16px;
		filter: var(--green-filter);
		margin-right: var(--spacing-2);
	}
	ul.features > li.unfeature:before {
		content: url('../../assets/icons/svg/fi-rr-cross.svg');
		filter: var(--red-filter);
	}

	ul.plans .price {
		font-size: var(--font-xl);
		font-weight: bold;
	}
	ul.plans > li {
		border-width: 3px;
		border-style: solid;
		padding: var(--spacing-4);
		margin-top: var(--spacing-4);
	}
	ul.plans > li:first-child {
		margin-top: 0;
	}
	ul.plans > li > * {
		margin-top: var(--spacing-2);
	}
	ul.plans > li > *:first-child {
		margin-top: 0;
	}
	ul.plans > .free { border-color: var(--blue); }
	ul.plans > .one-year { border-color: var(--pink); }
	ul.plans > .two-year { border-color: var(--yellow); }
	ul.plans > .three-year { border-color: var(--red); }
	ul.plans > .four-year { border-color: var(--purple); }
	ul.plans > .five-year { border-color: var(--cyan); }

	.discount {
		display: inline-block;
		font-weight: bold;
		padding: var(--spacing-2);
	}

	@media only screen and (min-width: 800px) {
		ul.plans {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			gap: var(--spacing-4);
		}
		ul.plans > li {
			margin-top: 0;
			width: 270px;
			height: 250px;
		}
	}
</style>
