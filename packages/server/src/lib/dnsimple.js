const fetch = require("node-fetch")
const { sendEmail } = require("./email")

exports.addRecord = async (req,res,next) => {
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
	//add zone record
	await fetch(`${process.env.DNSIMPLE_DOMAIN}/${process.env.DNSIMPLE_ACCOUNTID}/zones/${process.env.DNSIMPLE_ZONE}/records`, {
		headers: {
			'Authorization' : `Bearer ${process.env.DNSIMPLE_TOKEN}`,
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({
			name: "test",
			type: 'TXT',
			content: 'XMR=afsehjfkasfwas'
		})

	}).then((res) => res.json()).then(responseData => {
		console.log(responseData)
	})
	//console.log(response.json())

}