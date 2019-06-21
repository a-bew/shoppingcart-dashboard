window.onload = productFunc;

function productFunc(){
  apiProductData();	
}


// populateProducts

dict = {};
var i=1;

const objProduct = (param, r)=>{
  dict[String(i++)] = param;
  if (i === r){
    populateProducts(dict);
    dict = {};
  }
}

function apiProductData(){
  if (!localStorage.getItem("Userid")) return

  //Populate 
  productsPageEndPoint(objProduct, `http://localhost:3000/products`);    

  // Populate parent
  productsPageEndPoint(objProduct, `http://localhost:3000/parent`);

  // Populate users
  productsPageEndPoint(objProduct, `http://localhost:3000/categories`);

}

function populateProducts(dict) {
  var [products, parents, categories] = [dict["1"], dict["2"], dict["3"]];
  var content = "";
  $.each(products, function(index, elm) {
  	    console.log(categories);
  	    value = elm["category"]-1
        console.log(categories[value]["parent"]-1, parents)

        cat = categories[elm["category"]-1]["name"];
        catIndex = eval(categories[eval(elm["category"]-1)]["parent"]-1)
        parent = parents[categories[elm["category"]-1]["parent"]-1]["name"];

        product = elm["name"];
        price = elm["price"];
        category = `${parent}-${cat}`;
        featured = elm.featured;
        sold = elm.sold;

        id = elm["id"];

             
        content += '<tr>';
        content += '<td><a data-id="'+ id +'" onclick="editProduct(this)"><span class="fa fa-pencil"></span></a>&nbsp&nbsp<a data-id="'+ id +'" onclick="deleteProduct(this)"><span class="fa fa-trash"></span></a></td>';
        content += '<td>' + product + '</td>';
        content += '<td>' + `$${price}` + '</td>';
        content += '<td>' + category + '</td>';
        content += '<td ><div class="row"><a data-featured="true" class="col-sm-20" onclick="isFeatured(this)"><strong>+&nbsp&nbsp</strong></a><span class="col-sm-80"></span></div></td>';
        content += '<td>' + sold + '</td>';
        content += '</tr>';    

    })

    $('#adminProducts table tbody').append(content);
}

function isFeatured(target){
	console.log(target.getAttribute("data-featured"));
	if (eval(target.getAttribute("data-featured"))){
		target.innerHTML = "<strong>+&nbsp&nbsp<strong>";
		target.nextSibling.textContent = ""; 
		target.setAttribute("data-featured", false)
	} else {
		target.innerHTML = "<strong>-&nbsp&nbsp</strong>"
		target.setAttribute("data-featured", true)
		target.nextSibling.textContent = "Featured-Product"; 
	}
}



// Modal

function makeModal(thisId){
	  // Get Index of object based on id value
  // var arrayPosition = userListData.findIndex(x => x.id === parseInt(thisId)) // map(function(arrayItem) { return arrayItem._id; }).indexOf(thisId);
  // var thisUserObject = userListData[arrayPosition];
//  console.log(thisId, arrayPosition, userListData)
   var span = document.getElementsByClassName("close")[0];

  openModal(thisUserObject);
  var modal = document.getElementById("myModal");
  var keepOpen = document.getElementById("keepOpen");
  var span = document.getElementsByClassName("close")[0];

  modal.addEventListener('click', rootClick);
  span.addEventListener('click', closeSpanBtn);
  keepOpen.addEventListener('click', modalClick);

}

function openModal(table) {
  var modal = document.getElementById("myModal");
  var white = document.getElementById("white");
  // var captionText = document.getElementById("caption");
  modal.style.display = "block";
  white.style.backgroundColor = 'white';
  // var g = document.querySelector('#myModal div.modal-content');
   // $('#myModal div.modal-content').html(modalShowCarInfoCreated(table));
  // captionText.innerHTML = "Hi there";
}

function rootClick() {
  var modal = document.getElementById("myModal");
  //modalRoot.classList.remove('visible');
  modal.style.display = "none";
}

function closeSpanBtn(){
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
}  

function modalClick(e) {
	e.preventDefault();
	e.stopPropagation();
	e.stopImmediatePropagation();
	return false;
}

function modalShowCarInfoCreated(table){
  var content = "";
    content += '<h2>Car Info</h2>';
    content += '<div class="floatCarInModalLeft">';
   content += '<img src="'+table.img+'" alt="'+table.name+'" width="30px" heigth="30px">'
    content += '</div>'
    content += '<div id="carInfo" class="floatCarInfoInModalRight">';

    content +='<p >'; 
    content += '<strong>Name of Car:</strong><span class = "carInfoName">'+table.name+'</span><br>';
    content += '<strong>Make of Car:</strong><span class = "carInfoMake">'+ table.make+'</span><br>';
    content += '<strong>Model of Car:</strong><span class = "carInfoModel">'+table.modelId+'</span><br>';
    content += '<strong>Year of Car Production:</strong><span class = "carInfoYrOfProduction">'+table.productionYr+'</span><br>';
    content += '<strong>Url Link of Car:</strong><span class = "carInfoUrl">'+table.img+'</span><br>';
    content +='<strong>Price of Create Car:</strong><span class = "carInfoPrice">'+table.Price+'</span><br>';    
    content +='</p>';
    content += '</div>';
    content += '<button class="btn btn-info btn-block clear-fix container btn-width" onclick="closeSpanBtn(this)">Close</button>'
  return content;
}
