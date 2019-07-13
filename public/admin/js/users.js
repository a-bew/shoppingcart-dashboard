window.onload = usersFunc;

function usersFunc(){
  setTimeout(apiUsersData(), 0); 
  // $("#productPhoto").change(function(event){ collectInput.setProductPhoto(event)});
}

// populateUsers

var dict = {};
var i=1;

const obj = (param, r)=>{
   dict[String(i++)] = param;
   if (i === r){
      populateUsers(dict);
      dict={}
   }
}

function populateUsers(dict) {
  var [permit, user] = [dict["1"], dict["2"]];
  var content = "";
  $.each(user, function(index, elm) {

    // try {

     //    firstname = profile[elm["profile"]-1].firstname;
     //    lastname = profile[elm["profile"]-1].lastname;
     //    name = `${firstname} ${lastname}`;

     //    index = elm["profile"]-1
     //    profile.splice(index, 1)   // remove spotted index value 

	    // console.log(permit)

    // } catch (e){
    //     var name = elm.username;    
    // }

    var name = elm.fullname
    var permission = permit[elm["user_type"]-1]["name"];

    var email = elm["email"];
    
    join = new Date(+elm["join_date"])
    last = new Date(+elm["last_login"])
    var join_date = join.toDateString()+" "+join.toLocaleTimeString();
      var last_login = last.toDateString()+" "+last.toLocaleTimeString();
    if (join_date == "Invalid Date Invalid Date"){
      join_date = "Never"
    } else if (last_login  == "Invalid Date Invalid Date"){
      last_login = "Never"
    }
//    var permission = elm["user_type"];
    var id = elm["id"];


    content += '<tr>';
    content += '<td><a rel='+ id +' onclick="deleteUserAcct(this)"><span class="fa fa-trash"></span></a></td>';
    content += '<td>' + name + '</td>';
    content += '<td>' + email + '</td>';
    content += '<td>' + join_date + '</td>';
    content += '<td ><div class="row">' + last_login + '</div></td>';
    content += '<td>' + permission + '</td>';
    content += '</tr>';    
         
  });

    $('#adminUsers table tbody').append(content);
    dict = {};
}

function getUserView(){
  var tableUser = localStorage.getItem("userTableClass");
  var addUser = localStorage.getItem("addUserClass");
  return [tableUser, addUser]
}

function addUserEvents(){
  document.querySelector("#btnSubmitAddUser").addEventListener("click", function(event){ event.preventDefault(); submitAddUser()});
  document.querySelector("#btnCancelAddUser").addEventListener("click", function(event){ event.preventDefault(); cancelAddUser()});

  outputInputs.apply(data_collector(true), [])
}

function fill(classV, clear_fill){
    if (clear_fill){
      document.querySelector(classV).value = "";
//      console.log("cleared", document.querySelector(classV).value)

    } else {
      if (classV == "#user-permission"){
    	elm = document.querySelector(classV);
	    const { selectedIndex } = elm.options;
		return selectedIndex
	  }
	  return document.querySelector(classV).value    	    
    } 
}
$('#btnAddUser').on('click', showAddUserForm);

function showAddUserForm(){
   console.log("whatup")
   window.location.href = "/admin/users.html?add=1"
   window.location.reload = false;
   localStorage.setItem("addUserClass", "hide");
}

function data_collector(clear){
  fname = fill("#user-fname", clear),
  email =fill("#user-email", clear),
  password = fill("#user-password", clear),
  userConfirmPassword = fill("#user-confirm-password", clear),
  userPermission = +fill("#user-permission", clear)==0?"":fill("#user-permission", clear)
}

function outputInputs(){
  return {
  	fullname: this.fname,
  	email: this.email,
  	password: this.password,
  	confirm_password: this.userConfirmPassword,
  	user_type: this.userPermission,
  	join_date: new Date().valueOf(),  // .toString()   .toDateString()
  	last_login: "Never"
  }
}

function errorChecker(addUser){
  errorCount = 0
  Object.values(addUser).forEach(function(value){
  	console.log(value)
    if(value === '') { this.errorCount++; }
  })
  return errorCount
}

function submitAddUser(){
  const addUser = outputInputs.apply(data_collector(false), [])  
  const error = errorChecker(addUser)
  if (!error>0){
    $(document).ready(function(){
        $.ajax({
          url: 'http://localhost:3000/users/',
          type: 'POST',
          data: addUser, 
          success: function(data){
          	window.location.href = "http://localhost:3000/admin/users.html"
          },
          error: function(error) {
          console.log(error);
        }
      })
    })
  } 
}

function cancelAddUser(){
  outputInputs.apply(data_collector(clear=true), [])  
  window.location.href = "http://localhost:3000/admin/users.html"
}

function toogleUserView(tableUser, addUser){
  // Reset class 

  if (addUser == "hide"){
    // Add 'hide' to product Table
    document.querySelector("#users-list-table").classList.remove(addUser);   
    document.querySelector("#users-list-table").classList.add(addUser);   

    document.querySelector("#add-users").classList.remove(addUser);          

    localStorage.setItem("userTableClass", addUser);
    localStorage.setItem("addUserClass", "reset");

  }
}

function apiUsersData(){

  if (!localStorage.getItem("Userid")) return

  var [tableUser, addUser] = getUserView()

  // initializing localStorage items to "reset"
  if (!tableUser && !addUser || tableUser != "hide" && addUser != "hide"){
    localStorage.setItem("userTableClass", "hide");
    localStorage.setItem("addUserClass", "reset");
    var [tableUser, addUser] = getUserView()
  }
  
  // Reset url to ending .html
  locateBaseUrl()

  if (addUser=="hide"){

    // Add Product Events
    addUserEvents() 
    toogleUserView(tableUser, addUser)
      
  } else if (tableUser == "hide"){

    adminDetails(obj, `http://localhost:3000/user-type`);    
    // Populate users
    adminDetails(obj, `http://localhost:3000/users`);
 
  }

  localStorage.setItem("userTableClass", "reset");
  localStorage.setItem("addUserClass", "reset");

}

// Delete
function deleteUserAcct({ rel }) {
    $.ajax({
        url: `http://localhost:3000/users/${rel}`,
        type: 'DELETE',
        success: function(res) {
          window.location.href = "http://localhost:3000/admin/users.html"
          console.log('successful')
        },
        error: function(error) {
          console.log(error);
        }
    });
}