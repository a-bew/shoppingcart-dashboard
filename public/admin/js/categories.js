window.onload = catFunc;

function catFunc(argument) {
    $(document).ready(function() {

    // populate select element
    getParentCategories();

    // populate categories/parent table
    apiCatData()

    // get selected category value
    document.querySelector(".selectCat").addEventListener("change", getCatAttr);

    // post submitCategoriesData
    document.querySelector("#btnSubmitCat").addEventListener("click", function(){postToCat(catObj)});

    getUserName()
  })
}

// Populate Parent

function getParentCategories() {

    $(document).ready(function(){
        $.ajax({
          url: '/api/parent/',
          type: 'GET', 
          success: function(data){
            optionsParent(data)
          },
          error: function(error) {
            console.log(error);
          }
        })
        // JQuery code to be added in here.
    });
}

const optionsParent = function(table) {
    var optionElem = '';
	table.forEach((par, index) => {
        optionElem += '<option value="'+ (par.id) +'">'+ par.name +'</option>';
	});
	$("#setParent").append(optionElem);
}

function validateParInput(){
  var errorCount = 0;
  var value = $('#catVal').val();
  if(value === '') { errorCount++; }
  return errorCount;
}

// To post categories
var catObj = {} 

function reLoad(){
   var path={
    linkpage:"admin/categories",
   } 
   navigatePage.call(path);
}

function getCatAttr({target}){
  catObj["parent"] = parseInt(target.value, 10);       //as id
}

function postToCat(cat) {
     cat["name"] = $("#catVal").val();

    var valid = validateParInput()
    
    if (cat.parent && cat.name){
   
	    $(document).ready(function(){
	        $.ajax({
	          url: '/api/categories/',
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

// populateCatTable

dict = {};
var i=1;

const objCat = (param, r)=>{
  dict[String(i++)] = param;
  if (i === r){
    populateCat(dict);
    dict = {};
  }
}

function apiCatData(){
  loading()

  //Populate 
  accessEndPoint(objCat, `/api/parent`);    
  // Populate users
  accessEndPoint(objCat, `/api/categories`);
}

function populateCat(dict) {
  var content = "";
  var [parents, categories] = [dict["1"], dict["2"]];  
  var genr = {};

  $.each(Array.from(categories), function(index, elm) {
    var par = parents[elm["parent"]-1]["name"];
    var cat = elm['name'];
    var id = elm['id'];
    if(!genr.hasOwnProperty(par)){
      genr[par] = [];
      genr[par].push([id, cat]);
    } else {
      genr[par].push([id, cat]);
    }
  })
  var keys = Object.keys(genr)

  for (var key of keys){

	  $.each(genr[key], function(index, elm) {

     	    par = key;
	        cat = elm[1];
	        id = elm[0];
            
            if (index == 0){
	    	    content += '<tr style="background:green">';
		        content += '<td>'+par+'</td>';
			    content += '<td>Parent</td>';
			    content += '<td><a><span class="fa fa-pencil" ></span></a>&nbsp&nbsp<a><span class="fa fa-trash"></span></a></td>'
			    content += '</tr>';           	                	
            }         
    	    content += '<tr>';
	        content += '<td>'+cat+'</td>';
		    content += '<td>'+par+'</td>';
		    content += '<td><a data-id="'+ id +'" onclick="editCat(this)"><span class="fa fa-pencil" style="cursor:pointer"></span></a>&nbsp&nbsp<a data-id="'+ id +'" onclick="deleteCat(this)"><span class="fa fa-trash" style="cursor:pointer"></span></a></td>'
		    content += '</tr>';           	    
	  })
   }
   $('#product-cat-table table tbody').html(content);

}

// Edit

function editCat(elm) {
//	console.log(elm)
    id = $(elm).attr('data-id')
    localStorage.setItem('cataId', id);
    $.ajax({
        url: `/api/categories/${id}`,
        type: 'GET',
        success: function(data) {

            //Populate the Pop up  
            setInputForEdit(data)
            // $('#aBrand').val();             
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function setInputForEdit(data){

  // selected parent
  cat = document.querySelector(".selectCat");
  cat.options[data.parent].selected = true; 
  
  // input
  document.querySelector("#catVal").value = data.name;
  
  // Title 
  $("h5.h5-cat-title").html("Edit Category");
  var content = '<div class="panel-body-panel btn-add-cat">'
  content += '<input id="btnUpdateCat" class="btn btn-primary" value="Update Category">&nbsp&nbsp'
  content +='<input id="btnCancelCat" class="btn btn-default" value="Cancel">'  
  content += '</div>'
  // Btn
  $('.btn-add-cat').html(content);

  // post updateCategoriesData
  document.querySelector("#btnUpdateCat").addEventListener("click", function(){updateCat(catObj)});

  // Cancel update
  document.querySelector("#btnCancelCat").addEventListener("click", cancelUpdate)
  
}

// Cancel update

function cancelUpdate(){
	var content = "";
	content += '<h5 class="h5-cat-title"> Add A Category</h5>';
    content += '<div class="grid panel-body-panel">'
    content += '<label for="cat-parent"><h6>Parent</h6></label>';
    content += '<select id="setParent" name="selectCat" class="form-control selectCat">';
    content += '<option value="" disabled selected>Please select an option</option>';
    content += '</select>';
    content += '</div>'
    content += '<div class="grid panel-body-panel">'
    content += '<label for="cat-categories"><h6>Category</h6></label>'
    content += '<input class="form-control selectCat" type="text" id="catVal" name="catVal" placeholder="Category"/>';
    content += '</div>'
    content += '<div class="panel-body-panel btn-add-cat">';
    content += '<input id="btnSubmitCat" class="btn btn-primary" value="Add a category">';          
    content += '</div>';

    $(".grid").html(content);

    getParentCategories();
}

// Update Event

function updateCat(cat){
  elm = document.querySelector(".selectCat");
	var target = elm.options.selectedIndex;
  cat.parent = target
  cat["name"] = $("#catVal").val();

  console.log(cat)

    if (cat.parent && cat.name){

	    $.ajax({
	        url: `/api/categories/${localStorage.getItem('cataId')}`,
	        data: {
	        	name: cat.name,
	        	parent: cat.parent
	        }, 
	        dataType: 'json', 
	        type: 'PUT',
	        success: function(data) {
                reLoad()  
	            catObj = {};
                console.log("Success")
	        },
	        error: function(error) {
	            console.log(error);
	        }
	    });
    }  else {
	    alert('Please fill in all fields');
	    return false;  	
    }
}



// Delete
function deleteCat(elm) {
    $.ajax({
        url: `/api/categories/${$(elm).attr('data-id')}`,
        type: 'DELETE',
        success: function(res) {
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

