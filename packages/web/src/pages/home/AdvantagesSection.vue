<template>
	<div class="section-container">
		<header>
			<h1>Why Cryptachi?</h1>
			<p class="subtitle-2">Cryptachi uses <a href="https://openalias.org" target="_blank">OpenAlias</a> for all its subdomains. Since OpenAlias leverages the existing DNS system, it comes with all the benefits and security of existing infrastructure.</p>
		</header>
		<ul class="advantages-list">
			<li>
				<header>
					<img src="../../assets/icons/svg/fi-rr-eye-crossed.svg" />
					<h2>Private</h2>
				</header>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
			</li>
			<li>
				<header>
					<img src="../../assets/icons/svg/fi-rr-shield-check.svg" />
					<h2>Secure</h2>
				</header>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
			</li>
			<li>
				<header>
					<img src="../../assets/icons/svg/fi-rr-paper-plane.svg" />
					<h2>Simple</h2>
				</header>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
			</li>
			<li>
				<header>
					<img src="../../assets/icons/svg/fi-rr-refresh.svg" />
					<h2>Automatic</h2>
				</header>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
			</li>
			<li>
				<header>
					<img src="../../assets/icons/svg/fi-rr-infinity.svg" />
					<h2>Reliable</h2>
				</header>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
			</li>
			<li>
				<header>
					<img src="../../assets/icons/svg/fi-rr-rec.svg" />
					<h2>Placeholder</h2>
				</header>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: 'AdvantagesSection'
	}
</script>

<style scoped>
	.section-container {
		padding: var(--spacing-16) var(--spacing-4);
		text-align: center;
		background-color: var(--black-dark);
	}
	.section-container > header {
		margin-bottom: var(--spacing-16);
	}

	.advantages-list {
		text-align: left;
	}
	.advantages-list li {
		margin-top: var(--spacing-6);
	}
	.advantages-list li h2 {
		color: var(--yellow);
	}

	.advantages-list li header {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.advantages-list li header img {
		width: var(--icon-md);
		filter: var(--yellow-filter);
		margin-right: var(--spacing-2);
	}

	@media (min-width: 800px) {
		.section-container {
			padding-left: var(--spacing-32);
			padding-right: var(--spacing-32);
		}
	}

	@media (min-width: 1200px) {
		.section-container {
			padding-left: var(--spacing-32);
			padding-right: var(--spacing-32);
		}
		.advantages-list {
			display: flex;
			justify-content: space-evenly;
			flex-wrap: wrap;
			gap: var(--spacing-8);
		}
		.advantages-list li {
			margin-top: 0;
			max-width: 450px;
		}
	}

	@media (min-width: 1500px) {
		.section-container {
			padding-left: var(--spacing-36);
			padding-right: var(--spacing-36);
		}
	}
</style>
