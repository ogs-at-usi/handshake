


function loadMain(){
    
    const body = document.querySelector('body');
    // body.innerHTML = ejs.views_contactlist();

    body.innerHTML = ejs.views_chatComposer();

    console.log('loadMain()');

}



function init(){
    loadMain();
}