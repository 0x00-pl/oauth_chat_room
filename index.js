
window.config = {
    //api_server: 'http://nodejs-mongo-persistent-test-webapi.193b.starter-ca-central-1.openshiftapps.com'
    api_server: 'http://localhost:8080'
}
function login () {
    let cb = encodeURIComponent(location.protocol+'//'+location.host+'/login_cb.html')
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
	    } else {
		logout()
	    }
	})
}

function show_histoty(j){    
    let history = msg_list.map(a=>JSON.stringify(a))
	.then(l=>{
	    return `${l.name}: {l.msg}`
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
	    let history = msg_list.map(a=>JSON.stringify(a)).join('\n')
	    document.getElementById('history').textContent = history
	})
}
