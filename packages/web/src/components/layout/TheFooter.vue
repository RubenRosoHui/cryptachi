<template>
	<div class="footer-container">
		<p>Website by <a href="https://www.fosterhangdaan.com" target="_blank">Foster Hangdaan</a> and <a href="https://percy.tech" target="_blank">Matthew Percy</a>.</p>
		<p class="google-terms font-sm white-dark">This site is protected by reCaptcha and the Google <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.</p>
	</div>
</template>>

<script>
	export default {
		name: 'TheFooter'
	};
</script>

<style scoped>
	.footer-container {
		text-align: center;
	}

	.google-terms {
		margin-top: var(--spacing-4);
	}
</style>
