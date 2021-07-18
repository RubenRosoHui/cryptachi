const fetch = require("node-fetch")
const { sendEmail } = require("./email")

//Create record in DNSimple and retrun the records ID
exports.addRecord = async function(alias,domain,currency,address) {

	//add zone record
	let id;
	await fetch(`${process.env.DNSIMPLE_DOMAIN}/${process.env.DNSIMPLE_ACCOUNTID}/zones/${process.env.DNSIMPLE_ZONE}/records`, {
		headers: {
			'Authorization' : `Bearer ${process.env.DNSIMPLE_TOKEN}`,
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({
			name: alias,
			type: 'TXT',
			content: `oa1:${currency} recipient_address=${address};`
		})

	}).then((res) => res.json()).then(responseData => {
		console.log(responseData)
		id = responseData.data.id
	})
	return id;
}
exports.deleteRecord = async function(id) {
		await fetch(`${process.env.DNSIMPLE_DOMAIN}/${process.env.DNSIMPLE_ACCOUNTID}/zones/${process.env.DNSIMPLE_ZONE}/records/${id}`, {
			headers: {
				'Authorization' : `Bearer ${process.env.DNSIMPLE_TOKEN}`,
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'DELETE'
	
		}).then(res => console.log(res))
}