// function adminLogin(logic, apiEndpoint){
//     $.ajax({
//         url: apiEndpoint,
//         type: 'GET',
//         success: function(data) {
//             // Parse the received JSON string\
//             console.log(data)
//             .//var jsonObj = JSON.parse(res)
//             logic(data, 3);
//         },
//         error: function(error) {
//             console.log(error);
//         }
//     });
// }


// DOM Ready =============================================================
  
function httpCrossBrowser(http_request){
  try{
    // Opera 8.0+, Firefox, Chrome, Safari
    http_request = new XMLHttpRequest();
  }catch (e) {
  // Internet Explorer Browsers
  try{
    http_request = new ActiveXObject("Msxml2.XMLHTTP");   
  }catch (e) {  
    try{
      http_request = new ActiveXObject("Microsoft.XMLHTTP");
    }catch (e) {
      // Something went wrong
      alert("Your browser broke!");
      return false;
    }       
  }
  }
  return http_request
}

function accessEndPoint(dataSet, apiEndpoint){

   var data_file =  apiEndpoint;
   var http_request = new XMLHttpRequest();
   
   httpCrossBrowser(http_request);

   http_request.onreadystatechange = function(){
      if (http_request.readyState == 4) {
        // Javascript function JSON.parse to parse data
        var jsonObj = JSON.parse(http_request.responseText);

        // jsonObj variable now contains the data structure and can 
        // be accessed as jsonObj.name and json.country

        // document.getElementById("Name").textContent = jsonObj.name;
        // document.getElementById('Country').textContent = jsonObj.country;
        console.log(".....................er")
//        http_request.status === 200 ? console.log(http_request.responseText) : console.error('error')
//          dataSet(eval(http_request.responseText))
            dataSet(jsonObj, 3);
      }
    } 

    http_request.open("GET", data_file, true);
    http_request.send();
}

function loginEndPoint(dataSet, apiEndpoint){

   var data_file =  apiEndpoint;
   var http_request = new XMLHttpRequest();
   
   httpCrossBrowser(http_request);

   http_request.onreadystatechange = function(){
      if (http_request.readyState == 4) {
        // Javascript function JSON.parse to parse data
        var jsonObj = JSON.parse(http_request.responseText);

        // jsonObj variable now contains the data structure and can 
        // be accessed as jsonObj.name and json.country

        // document.getElementById("Name").textContent = jsonObj.name;
        // document.getElementById('Country').textContent = jsonObj.country;
        console.log(".....................er")
//        http_request.status === 200 ? console.log(http_request.responseText) : console.error('error')
//          dataSet(eval(http_request.responseText))
            dataSet(jsonObj, 3);
      }
    } 

    http_request.open("GET", data_file, true);
    http_request.send();
}

function adminDetails(dataSet, apiEndpoint){

   var data_file =  apiEndpoint;
   var http_request = new XMLHttpRequest();
   
   httpCrossBrowser(http_request);

   http_request.onreadystatechange = function(){
      if (http_request.readyState == 4) {
        // Javascript function JSON.parse to parse data
        var jsonObj = JSON.parse(http_request.responseText);

            dataSet(jsonObj, 3);
      }
    } 

    http_request.open("GET", data_file, true);
    http_request.send();
}

function productsPageEndPoint(dataSet, apiEndpoint){

   var data_file =  apiEndpoint;
   var http_request = new XMLHttpRequest();
   
   httpCrossBrowser(http_request);

   http_request.onreadystatechange = function(){
      if (http_request.readyState == 4) {
        // Javascript function JSON.parse to parse data
        var jsonObj = JSON.parse(http_request.responseText);
            dataSet(jsonObj, 4);
      }
    } 

    http_request.open("GET", data_file, true);
    http_request.send();
}


function productsEditPageEndPoint(dataSet, apiEndpoint){

   var data_file =  apiEndpoint;
   var http_request = new XMLHttpRequest();
   
   httpCrossBrowser(http_request);

   http_request.onreadystatechange = function(){
      if (http_request.readyState == 4) {
        // Javascript function JSON.parse to parse data
        var jsonObj = JSON.parse(http_request.responseText);
            dataSet(jsonObj, 5);
      }
    } 

    http_request.open("GET", data_file, true);
    http_request.send();
}


// General
function navigationType(){
  var result;
  var p;
  if (window.performance.navigation){
    result = window.performance.navigation;
    if (result=225){result=4}
  }

  if (window.performance.getEntriesByType("navigation")){
    p = window.performance.getEntriesByType("navigation")[0].type;
    if (p=='navigate'){result=0}
    if (p=='reload'){result=1}
    if (p=='back_forward'){result=2}
    if (p=='prerender'){result=3}
  }
  return result;
}

function locateBaseUrl(){
   if (navigationType() == 1 || navigationType() == 2){
      getHref = window.location.href;
      getHref = getHref.split("");
      v = getHref.splice(getHref.indexOf("?"), getHref.length)
      console.log(getHref.join(), v, )
      getHref = getHref.join("");
      if (getHref.endsWith("l")){
        window.location.href = getHref;
      }
   }  
}


function getUserName(){
  $(document).ready(function(){

    if (!localStorage.getItem("Userid")){
     document.querySelector("#hello-world").textContent = `Hello, World`          
      return
    }
    rel = localStorage.getItem("Userid")
    $.ajax({
        url: `/api/users/${rel}`,
        type: 'GET',
        success: function({ fullname }) {
          name = fullname.split(' ');
          document.querySelector("#hello-world").textContent = `Welcome, ${name.split(",")[0]}`          
        },
        error: function(error) {
          console.log(error);
        }
    });

  })
}

function navigatePage(){
  if (!this.linkpage){
    window.location.href = `/`;
    window.location.reload = true;

    return;
  }
  if (this.extra){
//    window.location.href = `/${this.linkpage}.html${this.extra}`
    window.location.href = `/${this.linkpage}${this.extra}`
    window.location.reload = true;

    return
  }
//  window.location.href = `/${this.linkpage}.html`

  window.location.href = `/${this.linkpage}`
  window.location.reload = true;

}

function logout(evt){
//  evt.preventDefault();
  localStorage.removeItem("Userid") 
   var path={
    linkpage:""
   } 
   navigatePage.call(path);
}

//page404
function loading(){
  if (!localStorage.getItem("Userid")) {
     var path={
      linkpage:`404`
     } 
     if (this.msg){
       alert(this.msg)  
       return false
     }

    navigatePage.call(path);
    return false
  }
  return true
}


