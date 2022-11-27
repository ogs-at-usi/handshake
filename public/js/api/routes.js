


function loadMain(){
    
    const body = document.querySelector('body');
    body.innerHTML = ejs.views_chatcontainer();
    console.log('loadMain()');

}



function init(){
    loadMain();
}