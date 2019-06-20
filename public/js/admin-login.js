window.onload = utilityLoginInAdmin;

function utilityLoginInAdmin(){
  $("#btnSubmit").click(apiData);
}


function Userdetails(){
  this.username = $('input#admin_username').val(),
  this.password = $('input#admin_password').val()
}

const loginToAdminHome = function(dict){
  var [userType, user] = [dict["1"], dict["2"]]
  username = new Userdetails().username
  password = new Userdetails().password
  user.forEach((elm, index)=>{
	 if (elm["username"] === username && elm["password"] === password){
	 	type = userType[elm["user-type"]-1].name
        // console.log(elm["username"], elm["password"], type)
	    localStorage.setItem('Userid', elm.id);
	 	return goToAdminHome(type);
	 }
  })
}

const goToAdminHome = function(uiLocation){
    window.location.href = `http://localhost:3000/${uiLocation}/index.html`;
    window.location.reload = true;
}

dict = {};
var i=1;

const obj = (param, r)=>{
   dict[String(i++)] = param;
	if (i === r){
	  loginToAdminHome(dict);
	}
}

const apiData = ()=>{
    //Populate .select-make
    loginEndPoint(obj, `http://localhost:3000/user-type`);    
	// Populate .select-year-from
    loginEndPoint(obj, `http://localhost:3000/users`);
}

