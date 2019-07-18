window.onload = productFunc;

function productFunc(){
  setTimeout(apiProductData(), 0); 
  
  //  Image Length - To track the last json db image id
  DbLastImageId()
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

const objEditProduct = (param, r)=>{
  dict[String(i++)] = param;
  if (i === r){
    populateEditProducts(dict);
    dict = {};
  }
}

function getProductView(){
  var tablePro = localStorage.getItem("productTableClass");
  var addPro = localStorage.getItem("addProductClass");
  var editPro = localStorage.getItem("editProductClass");
  return [tablePro, addPro, editPro]
}

function toogleProductView(tablePro, addPro, editPro){
  // Reset class 
  if (addPro == "hide"){
    // Add 'hide' to product Table
    document.querySelector("#products-list-table").classList.remove(addPro);   
    document.querySelector("#products-list-table").classList.add(addPro);   

    document.querySelector("#add-product").classList.remove(addPro);          

    localStorage.setItem("productTableClass", addPro);
    localStorage.setItem("addProductClass", "reset");
    localStorage.setItem("editProductClass", "reset");

  } else if (editPro == "hide"){
    // Add 'hide' to product Table
    document.querySelector("#products-list-table").classList.remove(editPro);   
    document.querySelector("#products-list-table").classList.add(editPro);   
  
    document.querySelector("#edit-product").classList.remove(editPro);          
    localStorage.setItem("productTableClass", editPro);
    localStorage.setItem("addProductClass", "reset");
    localStorage.setItem("editProductClass", "reset");
  }
}

function populateBrandCat(){
  getBrands("#editProductBrand")
  getParentCategory("#editProductParentCat")
}

function addProductEvents(){
  document.querySelector("#addProductTitle").addEventListener("change", collectInput.setTitle);
  document.querySelector("#addProductPrice").addEventListener("change", collectInput.setPrice);
  document.querySelector("#addProductListPrice").addEventListener("change", collectInput.setListPrice);
  document.querySelector("#addProductDesc").addEventListener("change", collectInput.setDesc);

  document.querySelector(".productBrand").addEventListener("change", collectInput.setBrandAttr);
  document.querySelector(".productParentCat").addEventListener("change", collectInput.setPParentAttr);
  document.querySelector("#productChildCat").addEventListener("change", collectInput.setChildCat);
  document.querySelector(".btnSubmittSizeQty").addEventListener("click", function(event){ event.preventDefault();collectInput.setSizessAndQtiesPrev("containerSizeAndqty", "#sizesAndQtiesPrev")});
}

function editProductEvents(){
  // Edit Product Event
      
  document.querySelector("#editProductTitle").addEventListener("change", collectInput.setTitle);
  document.querySelector("#editProductPrice").addEventListener("change", collectInput.setPrice);
  document.querySelector("#editProductPriceList").addEventListener("change", collectInput.setListPrice);
  document.querySelector("#editProductDesc").addEventListener("change", collectInput.setDesc);

  document.querySelector("#editProductBrand").addEventListener("change", collectInput.setBrandAttr);
  document.querySelector("#editProductParentCat").addEventListener("change", collectInput.setPParentAttr);
  document.querySelector("#editProductChildCat").addEventListener("change", collectInput.setChildCat);
  document.querySelector("#btnSubmittSizeQty").addEventListener("click", function(event){ event.preventDefault();collectInput.setSizessAndQtiesPrev("containerSizeAndqty", "#editSizesAndQtiesPrev")});

}

function apiProductData(){

  loading()

  var [tablePro, addPro, editPro] = getProductView()

  // initializing localStorage items to "reset"
  if (!tablePro && !addPro && !editPro || tablePro != "hide" && addPro != "hide" && editPro != "hide" ){
    localStorage.setItem("productTableClass", "hide");
    localStorage.setItem("addProductClass", "reset");
    localStorage.setItem("editProductClass", "reset");
    var [tablePro, addPro, editPro] = getProductView()
  }
  
  // Reset url to ending .html
  locateBaseUrl()

  if (addPro=="hide"){
    // store to update photo display div
    localStorage.setItem("displayPhotoId", "#fileUploads")
    localStorage.setItem("productChidId", "#productChildCat")

    // populateAddProductForm()
    getBrands("#productBrand")
    getParentCategory("#productParentCat")

    // Add Product Events
    addProductEvents() 
    toogleProductView(tablePro, addPro, editPro)

  } else if (editPro=="hide"){
      
    // store to update photo display div
    localStorage.setItem("displayPhotoId", "#editFileUploads")
    localStorage.setItem("productChidId", "#editProductChildCat")

    // Edit Product Events
    editProductEvents()

    // populate EditBrand and EditCategory
    populateBrandCat()

    // For Edit Product Page
    var editProductId = localStorage.getItem("updateEditProductId");

    //Populate 
    productsEditPageEndPoint(objEditProduct, `/api/products/${editProductId}`);    

    // Populate parent
    productsEditPageEndPoint(objEditProduct, `/api/brands`);

    // Populate users
    productsEditPageEndPoint(objEditProduct, `/api/categories`);

    productsEditPageEndPoint(objEditProduct, `/api/image_url`);

    toogleProductView(tablePro, addPro, editPro)

  } else if (tablePro == "hide"){
    // Turn off display photo Id
    localStorage.setItem("displayPhotoId", null)
    localStorage.setItem("productChidId", null)

    //Populate 
    productsPageEndPoint(objProduct, `/api/products`);    

    // Populate parent
    productsPageEndPoint(objProduct, `/api/parent`);

    // Populate users
    productsPageEndPoint(objProduct, `/api/categories`);

  }
  getUserName()

  localStorage.setItem("productTableClass", "reset");
  localStorage.setItem("addProductClass", "reset");
  localStorage.setItem("editProductClass", "reset");

}

function populateEditProducts(dict){

  var [product, brands, categories, images] = [dict["1"], dict["2"], dict["3"], dict["4"]];
  // input

  var categoryIndex = parseInt(product.category)-1
  var category = categories[categoryIndex]

//  if (product.name && product["brand"] && category["parent"]){

  try{
    document.querySelector("#editProductTitle").value = product.name;
    collectInput.title = product.name;
    
    // selected Brand
    var cat = document.querySelector("#editProductBrand");
    cat.options[parseInt(product["brand"])].selected = true; 
    collectInput.brand = product.brand
  
    var result = getSpecificCategoriesByIter(categories, id=category["parent"], category)
    // This is a check 

    if (!result){

     var path={
      linkpage:"admin/products"
     } 
     navigatePage.call(path);

    }
    
    // selected Parent
    cat = document.querySelector("#editProductParentCat");
    cat.options[parseInt(category["parent"])].selected = true; 
    collectInput.childCat = product.category  

    document.querySelector("#editProductPrice").value = product["price"];        
    document.querySelector("#editProductPriceList").value = product["list_price"];    
    document.querySelector("#editSizesAndQtiesPrev").value = product["size_qty"];
    document.querySelector("#editProductDesc").value = product["description"]
    
    // updating
    collectInput.price = product.price
    collectInput.listPrice = product.list_price
    collectInput["sold"] = product.sold
    collectInput.desc = product.description
    collectInput.featured = product.featured
    collectInput.parentCat = category.parent


    list = product["size_qty"].split(",");
    inputQtiesPrevForm(list, "#containerSizeAndqty")

    // displaying images
    imgIds = product.image_ids
    if (imgIds){
      
      ids = imgIds.split(";")

      ids.forEach(function(elm){
        img = images.find(img=>+img.id == +elm)
        if (img){

          // tag
          img["tag"] = "old"
          console.log(img)
          collectInput.productPhoto.push(img)   
        }
      })

    }

    console.log(imgIds, collectInput.productPhoto)
    console.log(product, brands, categories, images)

    if (collectInput.productPhoto.length>0){
      resetProductPhoto(Array.from(collectInput.productPhoto))
    }
   console.log(collectInput)
  } catch(e) {
    // This is another check 
   var path={
    linkpage:"admin/products"
   } 
   navigatePage.call(path);
  }
  dict = {};
}

function inputQtiesPrevForm(list, sqId){
  // target.preventDefault();
  var inputNodes = document.querySelectorAll(`${sqId} input[type='text']`)  
  var incrementByOne = 0
  var temp = list[0]
  var collectQandS = Array();
  if (!temp) return
  var item =  temp.split(":") 
  $.each(inputNodes, function(indx, node) {

    if (indx%2==0){
      temp = list[incrementByOne++]
      try{

        item = temp.split(":")

        console.log(incrementByOne, item)  

      } catch(e) {
        
        return
      }

    }

    if (indx%2==0 && item.length == 2){
      node.value = item[0]
    } 
    if (indx%2!=0  && item.length == 2){
      node.value = item[1]
      item = []
    }
    
  })
}

function getSpecificCategoriesByIter(categories, id, category){
  var arr = []
  categories.forEach(function(elm){
    if (elm.parent == id){
        arr.push(elm)

    }
  })

  var res = optionsParent(arr, "#editProductChildCat")
  var index = arr.findIndex(x=>x.name==category["name"])
  // selected Parent
  if (res == true){
    var catElm = document.querySelector("#editProductChildCat");
    console.log(index+1)
    catElm.options[index+1].selected = true; 
    return true    
  }
  return false
}

function populateProducts(dict) {
  var [products, parents, categories] = [dict["1"], dict["2"], dict["3"]];
  var content = "";
  var getLength = products.length
  var noteBreak = false
  console.log(getLength)
  $.each(products, function(index, elm) {
	    console.log(categories);
	    var value = elm["category"]-1
      // console.log(categories[value]["parent"]-1, parents)
      try{
        var cat = categories[elm["category"]-1]["name"];
      } catch(e) {
     var path={
      linkpage:"admin/products"
     } 
     navigatePage.call(path);
      }
        
      var catIndex = eval(categories[eval(elm["category"]-1)]["parent"]-1)
      var parent = parents[categories[elm["category"]-1]["parent"]-1]["name"];

      var product = elm["name"];
      var price = elm["price"];
      var category = `${parent}-${cat}`;
      var featured = elm.featured;
      var sold = elm.sold;

      var id = elm["id"];
           
      content += '<tr>';
      content += '<td><a rel='+ id +' onclick="showEditProductForm(this)"><span class="fa fa-pencil"></span></a>&nbsp&nbsp<a rel='+ id +' onclick="deleteProduct(this)"><span class="fa fa-archive"></span></a> </td>';
      content += '<td>' + product + '</td>';
      content += '<td>' + `$${price}` + '</td>';
      content += '<td>' + category + '</td>';
      content += '<td ><div class="row"><a data-featured="true" class="col-sm-20" onclick="isFeatured(this)"><strong>+&nbsp&nbsp</strong></a><span class="col-sm-80"></span></div></td>';
      content += '<td>' + sold + '</td>';
      content += '</tr>';    

    })

    $('#adminProducts table tbody').append(content);
    dict = {};
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

//Edit product
// $('#btnEditProduct').on('click', showEditProductForm);
$('#editBtnSubmitProduct').on('click', updateProductDb);
$('#editBtnCancelSubmitProduct').on('click', cancelEditProduct);


function DbLastImageId(){
    $(document).ready(function(){
        $.ajax({
          url: `/api/image_url`,
          type: 'GET', 
          success: function(data){
            localStorage.setItem("trackImageId", data.length);
            console.log("len-", data.length-1);
          },
          error: function(error) {
            console.log(error);
          }
        })
        // JQuery code to be added in here.
    });  
}

function showEditProductForm(evt){
    productId = evt.rel

    localStorage.setItem("updateEditProductId", productId)
     var path={
      linkpage:"admin/products",
      extra:"?edit=1"
     } 
     navigatePage.call(path);
    window.location.reload = false;

    localStorage.setItem("editProductClass", "hide");
    // localStorage.setItem("productTableClass", "hide");
    // getProductView()

    // document.querySelector("#products-list-table").classList.add("hide");   
    // document.querySelector("#add-product").classList.remove("hide");      

}

function showAddProductForm(){
     var path={
      linkpage:"admin/products",
      extra:"?add=1"
     } 
     navigatePage.call(path);

    window.location.reload = false;

    localStorage.setItem("addProductClass", "hide");
    // localStorage.setItem("productTableClass", "hide");
    // getProductView()

    // document.querySelector("#products-list-table").classList.add("hide");   
    // document.querySelector("#add-product").classList.remove("hide");      

}


// Submit Add Product Form
function  submitAddProduct(){
  // Submission processing method here 
  event.preventDefault();
  
  const { title, brand, parentCat, childCat, sizesAndQtiesPrev} = collectInput.outputCollectInput()
  
  if (!title || !brand || !parentCat || !childCat || !sizesAndQtiesPrev){
    return alert("Please fill in all asterisked* input box");
  }
    
  addProductToDb()

  apiProductData(); 
  document.querySelector("#products-list-table").classList.remove("hide");   
  document.querySelector("#add-product").classList.add("hide");  
   var path={
    linkpage:"admin/products"
   } 
   navigatePage.call(path);

}

function makeStr(arr, val){
  arr.forEach(function(elm){
     val += elm.join(":")+",";
  })
  return stripEnding(val);  
}

function makeString(arr, val){
  for (var elm of arr){
     val += elm.id+";";
  }
  return stripEnding(val); 
}

function addProductToDb(){
  const { sizesAndQtiesPrev, productPhoto, ...productsData } =  collectInput.outputCollectInput()
  let sAndQ = ""; 
  let pPhoto = "";
  sAndQ = makeStr(sizesAndQtiesPrev, sAndQ)
  pPhoto = makeString(productPhoto, pPhoto)    
  const { childCat:category, listPrice:list_price,  desc:description, sold, brand, title, price}  = productsData; 
//  alert('brand:'+brand+"\ncategory:"+category+"\nlist_price:"+list_price+"\ndescription:"+description+"\ntitle:"+title+"\nsold:"+sold+"\nfeaured:"+true+"\nbrand:"+brand+"\nprice"+price+"\nsAndQ:"+sAndQ+"\npPhoto:"+pPhoto)
  udata = {
    name: title,
    brand: brand,
    category: category,
    price: price,
    list_price: list_price,
    size_qty:  sAndQ,
    featured: false,
    sold: sold,
    image_ids: pPhoto,
    description: description
  }
  addProductEndpoint(udata)
}

function addProductEndpoint(udata){
  $(document).ready(function(){
      $.ajax({
        url: '/api/products',
        type: 'POST',
        data: udata,
        success: function(data){
             console.log(data)
        }, 
        error: function(error) {
        console.log(error);
      }
    })
  // JQuery code to be added in here.
  });   
}

function  cancelAddProduct(){
  // Submission processing method here
  document.querySelector("#products-list-table").classList.remove("hide");   
  document.querySelector("#add-product").classList.add("hide");    
   var path={
    linkpage:"admin/products"
   } 
   navigatePage.call(path);

  v = window.location.reload = false;
  return v
}

function updateProductDb(){

  const { title, brand, sold, parentCat, childCat, price, listPrice, featured, sizesAndQtiesPrev, productPhoto, desc} = collectInput.outputCollectInput()

  if (!title || !brand || !parentCat || !childCat || !sizesAndQtiesPrev){
    return alert("Please fill in all asterisked* input box");
  }

 var pPhoto = "";
 var sAndQ = ""; 
    sAndQ = makeStr(sizesAndQtiesPrev, sAndQ)
    pPhoto = makeString(productPhoto, pPhoto)    

//  alert('brand:'+brand+"\ncategory:"+childCat+"\nlist_price:"+listPrice+"\ndescription:"+desc+"\ntitle:"+title+"\nsold:"+sold+"\nfeaured:"+true+"\nbrand:"+brand+"\nprice"+price+"\nsAndQ:"+sAndQ+"\npPhoto:"+pPhoto)

  udata = {
    name: title,
    brand: brand,
    category: childCat,
    price: price,
    list_price: listPrice,
    size_qty:  sAndQ,
    featured: featured,
    sold: sold,
    image_ids: pPhoto,
    description: desc
  }

  setTimeout(makeUpdateProductDb(udata), 2000)    

  // Submission processing method here
  document.querySelector("#products-list-table").classList.remove("hide");   
  document.querySelector("#edit-product").classList.remove("hide");    
  document.querySelector("#edit-product").classList.add("hide");    

   var path={
    linkpage:"admin/products"
   } 
   navigatePage.call(path);

}

function  cancelEditProduct(){
  // Submission processing method here
  document.querySelector("#products-list-table").classList.remove("hide");   
  document.querySelector("#edit-product").classList.remove("hide");    
  document.querySelector("#edit-product").classList.add("hide");    

//  const { title, brand, sold, childCat, price, listPrice, sizesAndQtiesPrev, productPhoto, desc} = collectInput.outputCollectInput()
  const { productPhoto } = collectInput.outputCollectInput()

//  var pPhoto = "";
//  var sAndQ = ""; 
  
  var tagStatus = false;
  productFotos = Array();

  for (var objElm of productPhoto){
    if (objElm.tag == "new"){
      deleteImgFrmDb(objElm.id)
//      productFotos.push(objElm)
//      tagStatus = true;
    }
  }

   var path={
    linkpage:"admin/products"
   } 
   navigatePage.call(path);
}

function getProductToArchiv(id){

// Delete
    return $.ajax({
        url: `/api/products/${id}`,
        type: 'GET',
        success: function(data) {
          var {id, ...dbdata} = data
          archiveAProduct(dbdata, id)
          console.log(res)
                // window.location.href='/admin/categories.html';
                // window.location.reload=true;                
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function archiveAProduct(data, id){
    return $.ajax({
        url: `/api/archive`,
        type: 'POST',
        data: data,
        success: function(res) {
          deleteAtProduct(id)
          //console.log(res)
         var path={
          linkpage:"admin/categories"
         } 
         navigatePage.call(path);
          window.location.reload=true;                
        },
        error: function(error) {
            console.log(error);
        }
    });

}
function deleteProduct(evt){
  id = evt.rel
  return getProductToArchiv(id)
//  setTimeout(deleteAtProduct(id), 2000)

}

function deleteAtProduct(id){
// Delete
  return $.ajax({
        url: `/api/products/${id}`,
        type: 'DELETE',
        success: function(res) {
          console.log(res)
         var path={
          linkpage:"admin/products"
         } 
         navigatePage.call(path);

                // window.location.href='/admin/categories.html';
                // window.location.reload=true;                
        },
        error: function(error) {
            console.log(error);
        }
    });

}
// Submit Edit Product Form
function  submitAddProduct(){
  // Submission processing method here 
  event.preventDefault();
  
  const { title, brand, parentCat, childCat, sizesAndQtiesPrev} = collectInput.outputCollectInput()
  
  if (!title || !brand || !parentCat || !childCat || !sizesAndQtiesPrev){
    return alert("Please fill in all asterisked* input box");
  }
    
  addProductToDb()

  apiProductData(); 
  document.querySelector("#products-list-table").classList.remove("hide");   
  document.querySelector("#add-product").classList.add("hide");  
   var path={
    linkpage:"admin/products"
   } 
   navigatePage.call(path);

}

function makeUpdateProductDb(data){
  selected = localStorage.getItem("updateEditProductId")
  $(document).ready(function(){
      $.ajax({
        url: `/api/products/${selected}`,
        type: 'PUT',
        data: data, 
        success: function(data){
           console.log(data)
        },
        error: function(error) {
        console.log(error);
      }
    })
  // JQuery code to be added in here.
  });   
}

function makeUpdateProductDb(data){
  selected = localStorage.getItem("updateEditProductId")
  $(document).ready(function(){
      $.ajax({
        url: `/api/products/${selected}`,
        type: 'PUT',
        data: data, 
        success: function(data){
           console.log(data)
        },
        error: function(error) {
        console.log(error);
      }
    })
  // JQuery code to be added in here.
  });   
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
  var value = $('#catVal').val();
  if(value === '') { this.errorCount++; }
}

function imgInputValidation(){
  document.querySelectorAll('.three-col-add-product img.').forEach(function(val, index) {
    if(val.src === ''){this.errorCount++; }
  });
}

function textAreaValidation(){
  var value = $('#catVal').val();
  if(value === '') { this.errorCount++; }  
}

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
 featured: false,
 sizesAndQtiesPrev: Array(),
 productPhoto: Array(),
 desc: "",
 sold: 0,

 // setdata methods
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
}

function setPrice({target}){
  collectInput.price = target.value;       //as id   
}

function setListPrice({target}){
  collectInput.listPrice = target.value;       //as id   

}

function setDesc({target}){
  console.log(collectInput)
  collectInput.desc = target.value;       //as id   
}


function outputCollectInput(){
  return {title:this.title, 
          brand: this.brand, 
          parentCat: this.parentCat,
          childCat: this.childCat,
          price: this.price,
          listPrice: this.listPrice,
          sold : this.sold,
          sizesAndQtiesPrev: this.sizesAndQtiesPrev,
          productPhoto: this.productPhoto,
          desc: this.desc
        }
}

function setBrandAttr({target}){
  console.log("Brand")
  collectInput.brand = parseInt(target.value, 10);       //as id 
}

function setPParentAttr({target}){
  collectInput.parentCat = parseInt(target.value, 10);       //as id
  var catChildId = localStorage.getItem("productChidId")
  getSpecificCategories(catChildId, id=collectInput.parentCat)
}

function setChildCat({target}){
  collectInput.childCat = parseInt(target.value, 10);       //as id  
}

function setSizessAndQtiesPrev(sqId, id){
  // target.preventDefault();
  inputNodes = document.querySelectorAll(`#${sqId} input[type='text']`)  
  var sizesAndQtiesPrev = []
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
  this.sizesAndQtiesPrev = sizesAndQtiesPrev;

  let val = "";
  val = makeStr(sizesAndQtiesPrev, val)
  // sizesAndQtiesPrev.forEach(function(elm){
  //    val += elm.join(":")+",";
  // })  
  document.querySelector(id).value = val;

  closeSpanBtn();  

}

function stripEnding(input){
  // using regex to strip and replace white space i.e replace ' ' with '--'
  var re = /\b[,;]$/;   //select one or more ' '/space character

  return input.replace(re, function(matchingText){
    return ''
  })
}

function setProductPhoto(files){
  imgIdCurrentAtLoadTime=parseInt(localStorage.getItem("trackImageId"), 10)
  
  content = "";
  arr = Array.from(files);
  collectInput.productPhoto.push(...arr);
  console.log(collectInput.productPhoto)
  if (!collectInput.productPhoto) return
  
  let incrementingId = imgIdCurrentAtLoadTime
  
  $.each(collectInput.productPhoto, function(index, file){
    if (!collectInput.productPhoto[index]["id"]){

      incrementingId++;
      collectInput.productPhoto[index]["id"] = incrementingId; 
      collectInput.productPhoto[index]["tag"] = "new"; 

      localStorage.setItem("trackImageId", incrementingId)     
      content += '<div class="upload">' +
      '<img src="' + file.url + '" alt="logo"  width=100 height=100 style="margin: auto"><br> \
      <a rel='+index+' data-id='+ incrementingId+' onclick="removeSelectedImg(this)" style="cursor:pointer;"><em>remove</em></a></div>';

    } else {

      content += '<div class="upload">' +
      '<img src="' + file.url + '" alt="logo"  width=100 height=100 style="margin: auto"><br> \
      <a rel='+index+' data-id='+ file.id+' onclick="removeSelectedImg(this)" style="cursor:pointer;"><em>remove</em></a></div>';
    }
  });

  displayFotoId = localStorage.getItem("displayPhotoId")
  $(displayFotoId).html(content)
}

  // End
// Input Keeper Class

function resetProductPhoto(files){
  content = "";
  arr = Array.from(files);

  collectInput.productPhoto = Array();
  collectInput.productPhoto.push(...arr);
  console.log(collectInput.productPhoto)
  if (!collectInput.productPhoto) return
  $.each(collectInput.productPhoto, function(index, file){
    content += '<div class="upload">' +
      '<img src="' + file.url + '" alt="logo"  width=100 height=100 style="margin: auto"><br> \
      <a rel='+index+' data-id='+file.id+' onclick="removeSelectedImg(this)" style="cursor:pointer;"><em>remove</em></a></div>';    
  });

  displayFotoId = localStorage.getItem("displayPhotoId")
  $(displayFotoId).html(content)

  // $('#fileUploads').html(content)
}

function removeSelectedImg(evt){
  fileIndex = evt.rel;
  id = evt.getAttribute('data-id');
  console.log("id", id)
  ob = collectInput.productPhoto[fileIndex]
  removeImg(ob.deleteUrl)
  removeImg(ob.url)
  deleteImgFrmDb(id)
  DbLastImageId()
  collectInput.productPhoto.splice(fileIndex, 1)
}

function addAProduct(cat) {
  cat["name"] = $("#catVal").val();

  var error = new errorClass()
    
  if (!error){
   
    $(document).ready(function(){
        $.ajax({
          url: '/api/products',
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
function getBrands(htmlElementId) {
    console.log("seen")
    $(document).ready(function(){
        $.ajax({
          url: '/api/brands/',
          type: 'GET', 
          success: function(data){
            optionsParent(data, htmlElementId)
          },
          error: function(error) {
            console.log(error);
          }
        })
        // JQuery code to be added in here.
    });
}

// Populate ChildCat
function getSpecificCategories(catChildId, id) {
    console.log("specific")
    $(document).ready(function(){
        $.ajax({
          url: `/api/categories?parent=${id}`,
          type: 'GET', 
          success: function(data){
            console.log("success")
            optionsParent(data, catChildId)

          },
          error: function(error) {
            console.log(error);
          }
        })
        // JQuery code to be added in here.
    });
}


// Populate Parent

function getParentCategory(htmlElementId) {

    $(document).ready(function(){
        $.ajax({
          url: '/api/parent/',
          type: 'GET', 
          success: function(data){
            optionsParent(data, htmlElementId)
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
  return true
}

//ProductAdd Modal
$('#btnProductQtyAndSize').on('click', makeModal);

// ProductEdit Modal 
$('#btnEditProductQtyAndSize').on('click', makeModal);


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
  // $('productPhoto').on('click touchstart', function(){
  //   $(this).val('');
  // })

$('#productPhoto').fileupload({
    dataType: 'json',
    done: function(e, data){

//      console.log(data.result)
      setProductPhoto(data.result.files)
    }
});

$('#editProductPhoto').fileupload({
    dataType: 'json',
    done: function(e, data){
//      console.log(data.result)
      setProductPhoto(data.result.files)
    }
});

// Delete/Remove Img
function removeImg(url) {
  $.ajax({
    url: url,
    type: 'DELETE',
    success: function(res) {
      
      resetProductPhoto(Array.from(collectInput.productPhoto))
      console.log("Found", res)
    },
    error: function(error) {
      console.log(error);
    }
  });
}

function postImg(cat) {
    $.ajax({
      url: '/api/image_url/',
      type: 'POST',
      data: {
        name: obj.name,
        url: obj.url,
        size: obj.size,
        type: obj.type
      }, 
      success: function(data){
        console.log("img save to db")
      },
      error: function(error) {
        console.log(error);
      }
    })
    // JQuery code to be added in here.
}

// Delete
function deleteImgFrmDb(id) {
    $.ajax({
        url: `/api/image_url/${id}`,
        type: 'DELETE',
        success: function(res) {
          console.log('successful')
        },
        error: function(error) {
          console.log(error);
        }
    });
}