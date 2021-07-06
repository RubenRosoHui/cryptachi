<template>
	<div class="search-bar textbox">
		<div class="form-control ti-container">
			<label class="hidden" for="check-alias">Check Alias</label>
			<input id="check-alias" type="text" name="alias" />
		</div>
		<div class="form-control sel-container">
			<label class="hidden" for="domains-dropdown">Select Domain</label>
			<select id="domains-dropdown" name="domain">
				<option value="cryptachi.com" label=".cryptachi.com" selected />
			</select>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'SearchAliasForm'
	}
</script>

<style scoped>
	.search-bar {
		display: flex;
		flex-wrap: wrap;
		padding: var(--spacing-1);
		font-size: var(--font-sm);
	}
	.ti-container {
		flex: 1;
	}

	button {
		width: 50%;
	}

	@media (min-width: 500px){
		.search-bar {
			font-size: var(--font-md);
		}
	}
</style>
