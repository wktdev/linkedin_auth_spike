const clientID = ""; // LINKEDIN ClientID
const secretID = ""; //LINKEDIN SecretID 
let token = "";

const credentials = {
    client: {
        id: clientID,
        secret: secretID,
    },
    auth: {
        tokenHost: 'https://linkedin.com',
        tokenPath: "oauth/v2/accessToken",
        authorizePath: "oauth/v2/authorization"
    }
};

//___________________________________________________________

const request = require("request");
const makeRequest = require('request-promise');
const oauth2 = require('simple-oauth2').create(credentials)
const express = require("express");
const app = express();
const buildURL = require("build-url");
app.use(express.static("public"));

//___________________________________________________________


app.get('/', (req, res) => {

    res.sendFile('landing.html', {
        root: 'public'
    })

});



app.get('/auth/linkedin/redirect', (req, res) => {

    const redirectUri = oauth2.authorizationCode.authorizeURL({
        response_type: "code",
        redirect_uri: "http://localhost:3000/auth/linkedin/callback",
        state: "some-cryptic-stuff-98471871987981247"
    });


    res.redirect(redirectUri);


});


app.get('/auth/linkedin/callback', async (req, res) => {

    var options = {
        method: 'GET',
        uri: "https://www.linkedin.com/oauth/v2/accessToken",
     
          qs:{  response_type: "code",
            client_id: clientID,
            grant_type: "authorization_code",
            redirect_uri: "http://localhost:3000/auth/linkedin/callback",
            client_secret: secretID,
            code: req.query.code,
            state: "some-cryptic-stuff-98471871987981247"
        },
  
        json: true // Automatically stringifies the body to JSON
    };


    try {
        
      token = await makeRequest(options);

      return res.json({success:true})

      } catch (err) {

        return res.json({ success: false, msg: err.message});; // TypeError: failed to fetch
   
    }

});


app.get("/user",async (req,res)=>{

    console.log(token); // token object is available

     var options = {
        method: 'GET',
        url: "https://api.linkedin.com/v2/me",
        // documentation https://developer.linkedin.com/docs/oauth2#requests
        headers: {
          'Host': "api.linkedin.com",
          'Connection': "Keep-Alive",
          'Authorization': 'Bearer ' + token.access_token
        },
  
        json: true // Automatically stringifies the body to JSON
    };




    try {
        var response = await makeRequest(options);
        return res.json({success:true})

        } catch (err) {

        return res.json({ success: false, msg: err.message});; // TypeError: failed to fetch
    }


    
});




app.listen(3000, function(err) {
    console.log('Server works');
});


// NOTES
// Token POST URL
//"https://www.linkedin.com/oauth/v2/accessToken?response_type=code&client_id="+clientID+"&grant_type=authorization_code&redirect_uri=http://localhost:3000/auth/linkedin/callback&client_secret="+secretID+"&code=" +req.query.code+""
