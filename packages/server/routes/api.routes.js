module.exports = (app) => {
    const controller = require('../controllers/api.controller.js'); 

    //QUERY DOMAINS
    app.get('/api/domains', );

    //ADD DOMAIN
    app.post('/api/domains', controller.addDomain);

    //REMOVE DOMAIN
    app.delete('/api/domains', );

    //ADD DOMAIN RECORD
    app.post('/api/domains/{subdomain}/records', );

    //REMOVE DOMAIN RECORD
    app.delete('/api/domains/{subdomain}/records', );

    //USER REGISTRATION
    app.post('/api/auth/register', );

    //USER LOGIN
    app.post('/api/auth/login', );

    //RESET LINK
    app.get('/api/auth/reset-password', );

    //RESET PASSWORD
    app.post('/api/auth/reset-password', );

    

}