const fetch = require("node-fetch")
const { sendEmail } = require("./email")

//Create record in DNSimple and retrun the records ID
exports.addRecord = async function(alias,domain,currency,address) {

	//add zone record
	let e;
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
		e = responseData.data.id
		//return e;
	})
	return e;
	//console.log(e)
	//console.log(response.json())
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

/*
	await fetch(`${process.env.DNSIMPLE_DOMAIN}/whoami`, {
		headers: {
			'Authorization' : `Bearer ${process.env.DNSIMPLE_TOKEN}`
		}

	}).then((res) => res.json()).then(responseData => {
		console.log(responseData)
		//let {email,id} = responseData.data.user;
		//console.log(email)
		//console.log(id)

	})
	//list zone records
	await fetch(`${process.env.DNSIMPLE_DOMAIN}/${process.env.DNSIMPLE_ACCOUNTID}/zones/${process.env.DNSIMPLE_ZONE}/records`, {
		headers: {
			'Authorization' : `Bearer ${process.env.DNSIMPLE_TOKEN}`
		}

	}).then((res) => res.json()).then(responseData => {
		console.log(responseData)
		//let {email,id} = responseData.data.user;
		//console.log(email)
		//console.log(id)

	})
	*/