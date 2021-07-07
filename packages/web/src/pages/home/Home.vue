<template>
	<header-section />
	<supported-cryptos-section />
	<advantages-section />
</template>

<script>
	import HeaderSection from './HeaderSection.vue';
	import SupportedCryptosSection from './SupportedCryptosSection.vue';
	import AdvantagesSection from './AdvantagesSection.vue';

	export default {
		components: { HeaderSection, SupportedCryptosSection, AdvantagesSection },
		name: 'HomePage'
	};
</script>>

<style scoped>
</style>
