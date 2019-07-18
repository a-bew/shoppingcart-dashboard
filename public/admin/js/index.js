window.onload = utilityAdmins;

function utilityAdmins(){
  apiAdminData();
}

function adminusers(dict) {
  var [permission, user] = [dict["1"], dict["2"]];
  var tableContent = "";
  $.each(user, function(index, elm) {

    if (elm["user-type"] !== 3){

        type = permission[elm["user_type"]-1]["name"];
        fname = elm.fullname;
             
        tableContent += '<tr>';
        tableContent += '<td><a href="#" class="linkshowuser" rel="' + elm.id + '">' + fname + '</a></td>';
        tableContent += '<td>' + elm.password + '</td>';
        tableContent += '<td>' + elm.email + '</td>';
        tableContent += '<td>' + type + '</td>';
        tableContent += '</tr>';    
      }
    });

    $('#adminUsers table tbody').append(tableContent);
    // Extra for setting Admin Name
    getUserName()

}

dict = {};
var i=1;

const obj = (param, r)=>{
   dict[String(i++)] = param;
   if (i === r){
      adminusers(dict);
      dict={}
   }
}

const apiAdminData = ()=>{
    loading()
    //Populate user-type
    
    adminDetails(obj, `/api/user-type`);    
    // Populate users
    adminDetails(obj, `/api/users`);
}

