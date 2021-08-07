const fetch = require("node-fetch")
const { sendEmail } = require("./email")

//Create record in DNSimple and retrun the records ID
exports.addRecord = async function (alias, domain, currency, recipientAddress, recipientName) {
	//Override domain if zone has been specified in .env. This is due to DNSimples sandbox not allowing the registration of existing domains
	if (['development', 'staging'].includes(process.env.ACTUAL_ENV) && process.env.DNSIMPLE_ZONE) domain = process.env.DNSIMPLE_ZONE;

	//add zone record
	let id;
	const response = await fetch(`${process.env.DNSIMPLE_DOMAIN}/${process.env.DNSIMPLE_ACCOUNTID}/zones/${domain}/records`, {
		headers: {
			'Authorization': `Bearer ${process.env.DNSIMPLE_TOKEN}`,
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({
			name: alias,
			type: 'TXT',
			content: `oa1:${currency} recipient_address=${recipientAddress}; recipient_name=${recipientName};`
		})
	});

  const responseData = await response.json();

  id = responseData.data.id;

	return id;
}
exports.deleteRecord = async function (id, domain) {
	if (['development', 'staging'].includes(process.env.ACTUAL_ENV) && process.env.DNSIMPLE_ZONE) domain = process.env.DNSIMPLE_ZONE;

	await fetch(`${process.env.DNSIMPLE_DOMAIN}/${process.env.DNSIMPLE_ACCOUNTID}/zones/${domain}/records/${id}`, {
		headers: {
			'Authorization': `Bearer ${process.env.DNSIMPLE_TOKEN}`,
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		method: 'DELETE'
	})//.then(res => console.log(res))
}
exports.editRecord = async function(id, currency, domain, recipientAddress, recipientName) {
	if (['development', 'staging'].includes(process.env.ACTUAL_ENV) && process.env.DNSIMPLE_ZONE) domain = process.env.DNSIMPLE_ZONE;

  const response = await fetch(`${process.env.DNSIMPLE_DOMAIN}/${process.env.DNSIMPLE_ACCOUNTID}/zones/${domain}/records/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${process.env.DNSIMPLE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: `oa1:${currency} recipient_address=${recipientAddress}; recipient_name=${recipientName};`
    })
  });

  if (!response.ok) throw Error('Failed to edit record.');

  const jsonResponse = await response.json();

  return jsonResponse;
}
