<template>
	<div class="navigation-container">
		<teleport to="body">
			<div class="backdrop" v-if="isMenuDisplayed" @click="sideMenu('close')" />
		</teleport>
		<router-link to="/" id="brand">
			<h1 class="font-lg">Cryptachi</h1>
		</router-link>
		<nav class="font-family-mono font-sm bold">
			<img id="dropdown-menu" title="Menu" src="../../assets/icons/svg/fi-rr-menu-burger.svg" @click="sideMenu('toggle')" />
			<ul :class="dropdownStyles" @click="sideMenu('close')">
				<li>
					<router-link to="/">
						<span class="link-label">Home</span>
						<img title="Home" src="../../assets/icons/svg/fi-rr-home.svg" />
					</router-link>
				</li>
				<li>
					<router-link to="/contact">
						<span class="link-label">Contact</span>
						<img title="Contact" src="../../assets/icons/svg/fi-rr-envelope.svg" />
					</router-link>
				</li>
				<li>
					<router-link to="/faq">
						<span class="link-label">FAQ</span>
						<img title="FAQ" src="../../assets/icons/svg/fi-rr-interrogation.svg" />
					</router-link>
				</li>
				<li>
					<router-link to="/register">
						<span class="link-label">Sign Up</span>
						<img title="Sign Up" src="../../assets/icons/svg/fi-rr-form.svg" />
					</router-link>
				</li>
				<li>
					<router-link to="/login">
						<span class="link-label">Login</span>
						<img title="Login" src="../../assets/icons/svg/fi-rr-sign-in.svg" />
					</router-link>
				</li>
			</ul>
		</nav>
	</div>
</template>

<script>
	export default {
		name: 'TheNavigation',
		data: () => ({ isMenuDisplayed: false }),
		methods: {
			sideMenu(action) {
				switch(action) {
					case 'open':
						this.isMenuDisplayed = true;
						break;
					case 'close':
						this.isMenuDisplayed = false;
						break;
					case 'toggle':
						this.isMenuDisplayed = !this.isMenuDisplayed;
						break;
					default:
						this.isMenuDisplayed = false;
						break;
				}
			}
		},
		computed: {
			dropdownStyles() {
				const styles = {};
				styles.open = this.isMenuDisplayed;
				return styles;
			}
		}
	};
</script>

<style scoped>
	.navigation-container {
		display: flex;
		position: relative;
		align-items: center;
	}

	#brand {
		margin-right: auto;
	}

	a {
		display: inline-flex;
		align-items: center;
	}

	li {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	nav {
		z-index: 10;
	}

	nav ul {
		position: absolute;
		display: none;
		right: 0;
		padding: var(--spacing-4);
		animation: fade-in-left-keyframes 0.3s alternate;
	}
	nav ul.open {
		display: block;
	}
	a, a:visited {
		color: var(--text-light);
		text-decoration: none;
	}

	img#dropdown-menu, li img {
		width: var(--icon-md);
		filter: var(--cyan-filter);
	}
	img#dropdown-menu {
		cursor: pointer;
	}

	nav ul li img {
		margin: var(--spacing-2) 0 var(--spacing-2) 0;
	}

	.link-label {
		padding-right: var(--spacing-2);
	}

	@media (min-width: 700px) {
		.link-label {
			display: none;
		}
		img#dropdown-menu {
			display: none;
		}
		nav ul {
			display: flex;
			position: unset;
			opacity: 1;
			padding: 0;
			transition: none;
			transform: translateX(0);
		}
		nav ul li img {
			margin: 0 var(--spacing-2) 0 var(--spacing-2);
		}
		nav ul li:first-child img {
			margin-left: 0;
		}
		nav ul li:last-child img {
			margin-right: 0;
		}
	}
</style>
