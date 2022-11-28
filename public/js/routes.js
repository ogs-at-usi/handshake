

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

    const loginForm = document.querySelector('#loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.querySelector('#username_login').value;
        const password = document.querySelector('#password_login').value;

        // impo
        api.login(username, password).then((response) => {
            console.log(response);
            loadMain();
        }
        ).catch((error) => {
            console.log(error);
        }
        );

    });


}