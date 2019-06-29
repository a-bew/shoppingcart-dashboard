window.onload = productFunc;

function productFunc(){
  apiProductData(); 

  getBrands()
  getParentCategory()

document.querySelector("#addProductTitle").addEventListener("change", collectInput.setTitle);
document.querySelector("#addProductPrice").addEventListener("change", collectInput.setPrice);
document.querySelector("#addProductListPrice").addEventListener("change", collectInput.setListPrice);
document.querySelector("#addProductDesc").addEventListener("change", collectInput.setDesc);

  document.querySelector(".productBrand").addEventListener("change", collectInput.setBrandAttr);
  document.querySelector(".productParentCat").addEventListener("change", collectInput.setPParentAttr);
  document.querySelector("#productChildCat").addEventListener("change", collectInput.setChildCat);
  document.querySelector(".btnSubmittSizeQty").addEventListener("click", function(event){ event.preventDefault();collectInput.setSizessAndQtiesPrev()});
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

function getProductView(){
  var tablePro = localStorage.getItem("productTableClass");
  var addPro = localStorage.getItem("addProductClass");
  return [tablePro, addPro]
}

function toogleProductView(tablePro, addPro){
  // Reset class 
  if (tablePro == "hide"){
    document.querySelector("#products-list-table").classList.remove(tablePro);   
    document.querySelector("#add-product").classList.remove(tablePro);          
    document.querySelector("#products-list-table").classList.add(tablePro);   
    localStorage.setItem("productTableClass", tablePro);
    localStorage.setItem("addProductClass", "reset");
  } else if (addPro == "hide"){
    document.querySelector("#products-list-table").classList.remove(addPro);   
    document.querySelector("#add-product").classList.remove(addPro);          
    document.querySelector("#add-product").classList.add(addPro);          
  }
}

function apiProductData(){
  if (!localStorage.getItem("Userid")) return

  var [tablePro, addPro] = getProductView()

  if (!tablePro && !addPro){
    localStorage.setItem("productTableClass", "reset");
    localStorage.setItem("addProductClass", "reset");
    var [tablePro, addPro] = getProductView()
  }
  
  // Reset url to ending .html
  locateBaseUrl()
  toogleProductView(tablePro, addPro)


  //Populate 
  productsPageEndPoint(objProduct, `http://localhost:3000/products`);    

  // Populate parent
  productsPageEndPoint(objProduct, `http://localhost:3000/parent`);

  // Populate users
  productsPageEndPoint(objProduct, `http://localhost:3000/categories`);


  localStorage.setItem("productTableClass", "reset");
  localStorage.setItem("addProductClass", "reset");

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

// Add product
// Username link click
$('#btnAddProduct').on('click', showAddProductForm);
$('#btnSubmitProduct').on('click', submitAddProduct);
$('#btnCancelSubmitProduct').on('click', cancelAddProduct);


function showAddProductForm(){
  
    window.location.href = "/admin/products.html?add=1"
    window.location.reload = false;

    localStorage.setItem("addProductClass", "hide");
    localStorage.setItem("productTableClass", "hide");

    // getProductView()

    // document.querySelector("#products-list-table").classList.add("hide");   
    // document.querySelector("#add-product").classList.remove("hide");      


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

function  submitAddProduct(){
  // Submission processing method here 
  apiProductData(); 
  document.querySelector("#products-list-table").classList.remove("hide");   
  document.querySelector("#add-product").classList.add("hide");  
}

function  cancelAddProduct(){
  // Submission processing method here
  document.querySelector("#products-list-table").classList.remove("hide");   
  document.querySelector("#add-product").classList.add("hide");    
  window.location.href = "/admin/products.html"
  v = window.location.reload = false;
  return v
}

// Error Class
  // Start
function errorClass(){
  this.textValidation = textValidation;
  this.selectElm = selectElm;
  this.imgInputValidation = imgInputValidation;
  this.textAreaValidation = textAreaValidation;
  this.errorCount = 0
}

function textValidation(){
  document.querySelectorAll('#addProductForm input[type="text"]').forEach(function(val, index) {
    if(val.value === '') { this.errorCount++; }
  });
}

function selectElm(){
  var errorCount = 0;
  var value = $('#catVal').val();
  if(value === '') { this.errorCount++; }
}

function imgInputValidation(){}

function textAreaValidation(){}

  // End
// Error Class

// Input Keeper Class
  // Start
var input = function(attr){
  return attr;
}

var collectInput  = {
 // data
 title: "",
 brand: "",
 parentCat: "", 
 childCat: "",
 price: "",
 listPrice: "",
 sizesAndQtiesPrev: Array(),
 productPhoto: Array(),
 desc: "",

 // getdata methods
 setTitle: setTitle,
 setPrice: setPrice,
 setListPrice: setListPrice,
 setDesc: setDesc,

 setPParentAttr:setPParentAttr,
 setBrandAttr: setBrandAttr,
 
 setChildCat: setChildCat,
 setSizessAndQtiesPrev: setSizessAndQtiesPrev,
 setProductPhoto: setProductPhoto,
 outputCollectInput: outputCollectInput 
}


function setTitle({target}){
  collectInput.title = target.value;       //as id   
  console.log(collectInput.title)
  console.log(collectInput.outputCollectInput())
}

function setPrice({target}){
  collectInput.price = target.value;       //as id   

}

function setListPrice({target}){
  collectInput.listPrice = target.value;       //as id   

}

function setDesc({target}){
  collectInput.desc = target.value;       //as id   
}

function outputCollectInput(){
  return {title:this.title, 
          brand: this.brand, 
          parentCat: this.parentCat,
          childCat: this.childCat,
          price: this.price,
          listPrice: this.listPrice,
          sizesAndQtiesPrev: this.sizesAndQtiesPrev,
          productPhoto: this.productPhoto,
          desc: this.desc
        }
}

function setBrandAttr({target}){
  collectInput.brand = parseInt(target.value, 10);       //as id 
}

function setPParentAttr({target}){
  collectInput.parentCat = parseInt(target.value, 10);       //as id  
  getSpecificCategories(id=collectInput.parentCat)
}

function setChildCat({target}){

  collectInput.childCat = parseInt(target.value, 10);       //as id  
}

function setSizessAndQtiesPrev(){

  // target.preventDefault();
  inputNodes = document.querySelectorAll("#containerSizeAndqty input[type='text']")  
  var sizesAndQtiesPrev = this.sizesAndQtiesPrev
  var sub = [];

  $.each(inputNodes, function(indx, node) {
    var index = indx+1

    if (index%2!=0 && node.value){
      sub.push(node.value)
    } 
    if (index%2==0 && node.value){
      sub.push(node.value)
    }

    if (index%2==0 && sub.length==2){
      sizesAndQtiesPrev.push(sub)
      sub = [];
    }
  
  })
  this.sizesAndQtiesPrev = sizesAndQtiesPrev
  console.log(this.outputCollectInput())
  closeSpanBtn();  
}

function setProductPhoto({target}){

}

  // End
// Input Keeper Class

function addAProduct(cat) {
  cat["name"] = $("#catVal").val();

  var error = new errorClass()
    
  if (!error){
   
    $(document).ready(function(){
        $.ajax({
          url: 'http://localhost:3000/products/',
          type: 'POST',
          data: {
            name: cat.name,
            parent: cat.parent
          }, 
          success: function(data){
            reLoad()  
            catObj = {};
          },
          error: function(error) {
          console.log(error);
        }
      })
    // JQuery code to be added in here.
    });   

  } else {
    alert('Please fill in all fields');
    return false;   
  }
}

// Populate Brand
function getBrands() {
    console.log("seen")
    $(document).ready(function(){
        $.ajax({
          url: 'http://localhost:3000/brands/',
          type: 'GET', 
          success: function(data){
            optionsParent(data, "#productBrand")
          },
          error: function(error) {
            console.log(error);
          }
        })
        // JQuery code to be added in here.
    });
}

// Populate ChildCat
function getSpecificCategories(id) {
    console.log("specific")
    $(document).ready(function(){
        $.ajax({
          url: `http://localhost:3000/categories?parent=${id}`,
          type: 'GET', 
          success: function(data){

            optionsParent(data, "#productChildCat")

          },
          error: function(error) {
            console.log(error);
          }
        })
        // JQuery code to be added in here.
    });
}


// Populate Parent

function getParentCategory() {

    $(document).ready(function(){
        $.ajax({
          url: 'http://localhost:3000/parent/',
          type: 'GET', 
          success: function(data){
            optionsParent(data, "#productParentCat")
          },
          error: function(error) {
            console.log(error);
          }
        })
        // JQuery code to be added in here.
    });
}

const optionsParent = function(table, parentNodeId) {
    var optionElem = '';
  table.forEach((par, index) => {
        if (index == 0){
           optionElem += '<option value="" disabled selected></option>';
        }
        optionElem += '<option value="'+ (par.id) +'">'+ par.name +'</option>';
  });
  $(parentNodeId).html(optionElem);
}



// Modal
$('#btnProductQtyAndSize').on('click', makeModal);

function makeModal(){

  var span = document.getElementsByClassName("close")[0];

  openModal();

  var modal = document.getElementById("myModal");
  var keepOpen = document.getElementById("keepOpen");
  var span = document.getElementsByClassName("close")[0];

  var btnCancelPro = document.querySelector(".btnCancelSubmitSizeQty");

  modal.addEventListener('click', rootClick);
  span.addEventListener('click', closeSpanBtn);
  keepOpen.addEventListener('click', modalClick);

  btnCancelPro.addEventListener('click', closeSpanBtn);

}

function openModal(table) {
  var modal = document.getElementById("myModal");
  var white = document.getElementById("white");
  var captionText = document.getElementById("caption");
  modal.style.display = "block";
  white.style.backgroundColor = 'white';
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
