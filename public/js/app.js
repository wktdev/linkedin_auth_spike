console.log("working from client");

function onSignInButtonClick() {
  // Open the Auth flow in a popup.
  window.open('/auth/linkedin/redirect', 'whatever', 'height=315,width=400');
};

var button = document.getElementById("auth-button");

button.addEventListener("click",function(){
    onSignInButtonClick();
});

