window.onload = utilityAdmins;

function utilityAdmins(){
  apiAdminData();
}

function adminDetails(dataSet, apiEndpoint){

   var data_file =  apiEndpoint;
   var http_request = new XMLHttpRequest();
   
   httpCrossBrowser(http_request);

   http_request.onreadystatechange = function(){
      if (http_request.readyState == 4) {
        // Javascript function JSON.parse to parse data
        var jsonObj = JSON.parse(http_request.responseText);

        console.log(".....................er")
            dataSet(jsonObj, 4);
      }
    } 

    http_request.open("GET", data_file, true);
    http_request.send();
}

function adminusers(dict) {
  var [permission, user, profile] = [dict["1"], dict["2"], dict["3"]];
  var tableContent = "";
  $.each(user, function(index, elm) {

    if (elm["user-type"] !== 3){

        type = permission[elm["user-type"]-1]["name"];
        try {
            firstname = profile[elm["profile"]-1].firstname;
            lastname = profile[elm["profile"]-1].lastname;
            fname = `${firstname} ${lastname}`;

            index = elm["profile"]-1
            profile.splice(index, 1)   // remove spotted index value 

        } catch (e){
            var fname = elm.username;    

        }
             
        tableContent += '<tr>';
        tableContent += '<td><a href="#" class="linkshowuser" rel="' + elm.id + '">' + fname + '</a></td>';
        tableContent += '<td>' + elm.password + '</td>';
        tableContent += '<td>' + elm.email + '</td>';
        tableContent += '<td>' + type + '</td>';
        tableContent += '</tr>';    
      }
    });

    $('#adminUsers table tbody').append(tableContent);

}

dict = {};
var i=1;

const obj = (param, r)=>{
   dict[String(i++)] = param;
    if (i === r){
      adminusers(dict);
    }
}

const apiAdminData = ()=>{
  if (!localStorage.getItem("Userid")) return

    //Populate user-type
    adminDetails(obj, `http://localhost:3000/user-type`);    
    // Populate users
    adminDetails(obj, `http://localhost:3000/users`);
    // Populate profile
    adminDetails(obj, `http://localhost:3000/profile`);
}

