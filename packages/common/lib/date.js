module.exports = {
  formatDate: function(date) {
		return new Intl.DateTimeFormat('en-US', {
			timeZone: 'America/Toronto',
			dateStyle: 'long'
		}).format(date);
  }
}
