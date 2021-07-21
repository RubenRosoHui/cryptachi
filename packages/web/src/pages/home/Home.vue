<template>
	<header-section />
	<supported-cryptos-section />
	<advantages-section />
	<available-plans-section />
	<signup-now-section />
</template>

<script>
	import HeaderSection from './HeaderSection.vue';
	import SupportedCryptosSection from './SupportedCryptosSection.vue';
	import AdvantagesSection from './AdvantagesSection.vue';
	import AvailablePlansSection from './AvailablePlansSection.vue';
	import SignupNowSection from './SignupNowSection.vue';

	export default {
		components: { HeaderSection, SupportedCryptosSection, AdvantagesSection, AvailablePlansSection, SignupNowSection },
		name: 'HomePage'
	};
</script>>

<style scoped>
</style>
