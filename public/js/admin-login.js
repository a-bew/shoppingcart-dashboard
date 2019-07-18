window.onload = utilityLoginInAdmin;

function utilityLoginInAdmin(){

  resetLocal() 

  $("#btnSubmit").click(apiData);
}

function Userdetails(){
  this.email = $('input#admin_email').val(),
  this.password = $('input#admin_password').val()
}

const loginToAdminHome = (dict)=>{
  var [userType, user] = [dict["1"], dict["2"]]
  var email = new Userdetails().email
  var password = new Userdetails().password
  user.forEach((elm, index)=>{
  	if (elm["email"] === email && elm["password"] === password){
  	 	type = userType[elm["user_type"]-1].name
      // console.log(elm["username"], elm["password"], type)
  	  localStorage.setItem('Userid', elm.id);
      return updateLastLogin(elm.id, type)
  	} else {
       var path={
        linkpage:""
       } 
       navigatePage.call(path);
    }
  })
}

const goToAdminHome = function(uiLocation){
    var uiLocation = "admin"
         var path={
      linkpage:`${uiLocation}`
     } 
     navigatePage.call(path);
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
    loginEndPoint(obj, `/api/user-type`);    
	// Populate .select-year-from
    loginEndPoint(obj, `/api/users`);
}

function updateLastLogin(id, type){
    $.ajax({
        url: `/updates/user/lastlogin/${id}`,
        data: {
            last_login: Date.now(),
            id: id
        },
        dataType: 'json', 
        type: 'PUT',
        success: function(data) {
          goToAdminHome(type)
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function resetLocal(){
  localStorage.removeItem("Userid")
}

