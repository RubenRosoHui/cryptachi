<template>
	<div class="nav-container">
		<nav>
			<ul>
				<li>
					<router-link to="/account/aliases">
						<img src="../../assets/icons/svg/fi-rr-list-check.svg" class="icon-sm cyan-filter" />
						Aliases
					</router-link>
				</li>
				<li>
					<router-link to="/account/security">
						<img src="../../assets/icons/svg/fi-rr-shield.svg" class="icon-sm cyan-filter"/>
						Security
					</router-link>
				</li>
				<li>
					<router-link to="/account/purchases">
						<img src="../../assets/icons/svg/fi-rr-shopping-bag.svg" class="icon-sm cyan-filter"/>
						Purchases
					</router-link>
				</li>
			</ul>
		</nav>
	</div>
	<div class="base-container">
		<router-view />
	</div>
</template>

<script>
	export default {
		name: 'AccountPage'
	}
</script>

<style scoped>
	.base-container {
		padding-top: var(--spacing-4);
	}
	.nav-container {
		height: 50px;
		border-bottom: 1px solid var(--black);
	}

	nav,
	nav ul,
	nav ul li,
	nav ul li a {
		height: 100%;
	}
	nav {
		max-width: 1300px;
		margin: 0 auto;
		padding: 0 var(--spacing-4);
	}
	nav ul {
		display: flex;
		column-gap: var(--spacing-6);
		overflow-x: auto;
		overflow-y: hidden;
	}
	nav ul li a {
		display: flex;
		align-items: center;
		text-decoration: none;
	}
	nav ul li a:hover {
		color: var(--text);
		border-bottom: 3px solid var(--text);
	}

	nav ul li a img {
		margin-right: var(--spacing-2);
	}
	nav ul li a:hover img {
		filter: var(--white-filter);
	}

	nav ul li a.router-link-exact-active {
		border-bottom: 3px solid var(--yellow);
		color: var(--yellow);
		font-weight: bold;
	}
	nav ul li a.router-link-exact-active img {
		filter: var(--yellow-filter);
	}
</style>
