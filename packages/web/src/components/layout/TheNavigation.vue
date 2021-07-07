<template>
	<div class="navigation-container">
		<teleport to="body">
			<div class="backdrop" v-if="isMenuDisplayed" @click="sideMenu('close')" />
		</teleport>
		<h1 class="font-lg">Cryptachi</h1>
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
					<router-link to="/">
						<span class="link-label">Contact</span>
						<img title="Contact" src="../../assets/icons/svg/fi-rr-envelope.svg" />
					</router-link>
				</li>
				<li>
					<router-link to="/register">
						<span class="link-label">Sign Up</span>
						<img title="Sign Up" src="../../assets/icons/svg/fi-rr-form.svg" />
					</router-link>
				</li>
				<li>
					<router-link to="/">
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

	.backdrop {
		background: none;
	}

	h1 {
		flex: 1;
	}

	a {
		display: inline-flex;
		align-items: center;
	}

	li {
		text-align: right;
	}

	nav { z-index: 10 }

	ul {
		position: absolute;
		right: -7rem;
		padding: var(--spacing-4);
		opacity: 0;
		transition: all 0.3s linear;
	}
	ul.open {
		right: 0;
		opacity: 1;
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

	li img {
		margin: var(--spacing-2) 0 var(--spacing-2) 0;
	}

	.link-label {
		padding-right: var(--spacing-1);
	}

	@media (min-width: 700px) {
		.link-label {
			display: none;
		}
		img#dropdown-menu {
			display: none;
		}
		ul {
			display: flex;
			position: unset;
			opacity: 1;
			padding: 0;
			transition: none;
		}
		li img {
			margin: 0 var(--spacing-2) 0 var(--spacing-2);
		}
		li:first-child img {
			margin-left: 0;
		}
		li:last-child img {
			margin-right: 0;
		}
	}
</style>
