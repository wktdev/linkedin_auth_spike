const clientID = "";
const secretID = ""; 

const credentials = {
    client: {
        id: clientID, 
        secret: secretID , 
    },
    auth: {
        tokenHost: 'https://linkedin.com',
        tokenPath: "oauth/v2/accessToken",
        authorizePath: "oauth/v2/authorization"
    }
};



const querystring = require('querystring');
const oauth2 = require('simple-oauth2')
const express = require("express");
const app = express();
const request = require("request");
app.use(express.static("public"));


app.get('/', (req, res) => {

    res.sendFile('landing.html', {
        root: 'public'
    })

});



app.get('/auth/linkedin/redirect', (req, res) => {
    const redirectUri = oauth2.create(credentials).authorizationCode.authorizeURL({
        response_type: "code",
        redirect_uri: "http://localhost:3000/auth/linkedin/callback",
        state: "some-cryptic-stuff-98471871987981247"
    });


    res.redirect(redirectUri);


});


app.get('/auth/linkedin/callback', (req, res) => {


    //"https://www.linkedin.com/oauth/v2/accessToken?response_type=code&client_id=86ri7bqortc55g"

    // const data = {
    //     url:"https://www.linkedin.com/oauth/v2/accessToken",
    //     code: req.query.code,
    //     grant_type: "authorization_code",
    //     state: "some-cryptic-stuff-98471871987981247",
    //     client_id:clientID,
    //     redirect_uri: "http://localhost:3000",
    // };




    request.post("https://www.linkedin.com/oauth/v2/accessToken?response_type=code&client_id="+clientID+"&grant_type=authorization_code&redirect_uri=http://localhost:3000/auth/linkedin/callback&client_secret="+secretID+"&code=" +req.query.code+"", (err, response, body) => {

        const error = JSON.parse(body).error;
        const error_description = JSON.parse(body).error_description;

        console.log("OINK___" + body);
        if (error) {
            return res.json({ success: false, msg: error_description });
        } else {
            return res.json({ success: true });
        }

    });

    // res.redirect("/")


});




app.listen(3000, function(err) {
    console.log('Server works');
});