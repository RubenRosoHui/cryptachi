<template>
	<div class="navigation-container">
		<teleport to="body">
			<div class="backdrop" v-if="isMenuDisplayed" @click="sideMenu('close')" />
		</teleport>
		<router-link to="/" id="brand">
			<h1 class="font-lg">Cryptachi</h1>
		</router-link>
		<p v-if="isAuthenticated" class="font-xs margin-right-8" id="login-display">
			Logged in as: <span class="yellow bold">{{ user.email }}</span>
		</p>
		<nav class="font-family-mono font-sm bold">
			<img id="dropdown-menu" title="Menu" src="../../assets/icons/svg/fi-rr-menu-burger.svg" @click="sideMenu('toggle')" />
			<ul :class="dropdownStyles" @click="sideMenu('close')">
				<li>
					<router-link to="/" class="link-item">
						<span class="link-label">Home</span>
						<img title="Home" src="../../assets/icons/svg/fi-rr-home.svg" />
					</router-link>
				</li>
				<li>
					<router-link to="/contact" class="link-item">
						<span class="link-label">Contact</span>
						<img title="Contact" src="../../assets/icons/svg/fi-rr-envelope.svg" />
					</router-link>
				</li>
				<li>
					<router-link to="/faq" class="link-item">
						<span class="link-label">FAQ</span>
						<img title="FAQ" src="../../assets/icons/svg/fi-rr-interrogation.svg" />
					</router-link>
				</li>
				<li v-if="!isAuthenticated">
					<router-link to="/register" class="link-item">
						<span class="link-label">Sign Up</span>
						<img title="Sign Up" src="../../assets/icons/svg/fi-rr-form.svg" />
					</router-link>
				</li>
				<li v-else>
					<router-link to="/account" class="link-item">
						<span class="link-label">Account</span>
						<img title="Account" src="../../assets/icons/svg/fi-rr-user.svg" />
					</router-link>
				</li>
				<li v-if="!isAuthenticated">
					<router-link to="/login" class="link-item">
						<span class="link-label">Login</span>
						<img title="Login" src="../../assets/icons/svg/fi-rr-sign-in.svg" />
					</router-link>
				</li>
				<li v-else @click="logout" class="logout">
					<div class="link-item">
						<span class="link-label">Logout</span>
						<img title="Logout" src="../../assets/icons/svg/fi-rr-sign-out.svg" class="logout" />
					</div>
				</li>
			</ul>
		</nav>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';

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
			},
			logout() {
				this.$store.dispatch('logout');
				this.$router.push('/');
			}
		},
		computed: {
			dropdownStyles() {
				const styles = {};
				styles.open = this.isMenuDisplayed;
				return styles;
			},
			...mapGetters(['isAuthenticated', 'user'])
		}
	};
</script>

<style scoped>
	#login-display { display: none; }

	.navigation-container {
		display: flex;
		position: relative;
		align-items: center;
	}

	#brand {
		margin-right: auto;
	}

	.link-item {
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

	li:hover img,
	li.logout:hover img {
		filter: var(--yellow-filter);
	}

	img#dropdown-menu, li img {
		width: var(--icon-md);
		filter: var(--cyan-filter);
	}
	img#dropdown-menu {
		cursor: pointer;
	}

	li img.logout {
		filter: var(--red-filter);
		transition: filter 0.5s linear;
	}
	li.logout {
		cursor: pointer;
	}

	nav ul li img {
		transition: filter 0.5s linear;
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

	@media (min-width: 1000px) {
		#login-display { display: initial; }
	}
</style>
