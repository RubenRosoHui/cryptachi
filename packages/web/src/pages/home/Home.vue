<template>
	<header-section />
	<supported-cryptos-section />
	<advantages-section />
	<signup-now-section />
</template>

<script>
	import HeaderSection from './HeaderSection.vue';
	import SupportedCryptosSection from './SupportedCryptosSection.vue';
	import AdvantagesSection from './AdvantagesSection.vue';
	import SignupNowSection from './SignupNowSection.vue';

	export default {
		components: { HeaderSection, SupportedCryptosSection, AdvantagesSection, SignupNowSection },
		name: 'HomePage'
	};
</script>>

<style scoped>
</style>
