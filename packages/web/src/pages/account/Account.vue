<template>
	<div class="nav-container">
		<nav>
			<ul>
				<li><router-link to="/account/aliases">Aliases</router-link></li>
				<li><router-link to="/account/security">Security</router-link></li>
				<li><router-link to="/account/purchases">Purchases</router-link></li>
			</ul>
		</nav>
	</div>
	<div class="base-section">
		<router-view />
	</div>
</template>

<script>
	export default {
		name: 'AccountPage'
	}
</script>

<style scoped>
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
		column-gap: var(--spacing-4);
	}
	nav ul li {
	}
	nav ul li a {
		display: flex;
		align-items: center;
	}
</style>
