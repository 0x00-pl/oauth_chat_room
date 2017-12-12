
window.config = {
    //api_server: '//nodejs-mongo-persistent-test-webapi.193b.starter-ca-central-1.openshiftapps.com'
    api_server: 'http://localhost:8080'
}
function login () {
    let cb = encodeURIComponent(location.protocol+'//'+location.host+location.pathname+'login_cb.html')
    window.location = window.config.api_server+'/oauth0?cb='+cb
}
function logout() {
    window.localStorage.removeItem('token')
    window.location.reload()
}
function api_get_global_token(){
    let token = localStorage.getItem('token')
    if(!token){
	login()
    } else {
	return token
    }
}
function get_username(){
    let token = api_get_global_token()
    fetch(config.api_server+'/api/user?token='+token).then(b=>b.json())
	.then(a=>{
	    if(a.login){
	        console.log('[debug] user:', a)
		console.log('[debug] username:', a.login)
		document.getElementById('my-name').textContent = a.login
	    } else {
                console.log(a)
		alert('can not get user name')
		logout()
	    }
	})
}

function show_history(j){
    let history = j.slice().reverse()
	.map(l=>{
	    return `${l.name}: ${l.msg}`
	})
	.join('\n')
    document.getElementById('history').textContent = history
}

function speak(){
    let token = api_get_global_token()
    let inputs = document.getElementById('inputs').value

    fetch(config.api_server+'/api/room/post?token='+token,
	  {method:'POST'
	   , body: JSON.stringify({msg: inputs})
	  }).then(b=>b.json())
	.then(msg_list=>{
	    console.log(msg_list)
	    show_history(msg_list)
	})
}
