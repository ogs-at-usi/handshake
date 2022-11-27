


function loadMain(){
    
    const body = document.querySelector('body');
    // body.innerHTML = ejs.views_contactlist();

    body.innerHTML = ejs.views_chatComposer();

    console.log('loadMain()');
}


function loadLogin(){

    const body = document.querySelector('body');
    body.innerHTML = ejs.views_login();

    console.log('loadLogin()');


}



function init(){
    loadLogin();
}