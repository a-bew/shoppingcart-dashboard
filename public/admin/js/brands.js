window.onload = brandFunc;

function brandFunc(){
  addBrandInput(label="Add A Brand", buttonClck="addBrand", btnLabel="Add a Brand")
  getbrands()
  getUserName()

}

function addBrandInput(label, buttonClck, btnLabel, value){
	console.log(value,"----");
	var content = "";
  	content += '<h2>Brands</h2>'   
    content += '<div class="add-a-brand-control">' 
    content += '<div class="col-md-4 col-sm-12 " style="padding: 10px 0;">'
    content += '<label class="control-label">'+ label +'</label>';                    		
    content += '</div>';
    content += '<div class=" col-md-4 col-sm-12">';
    content += '<input type="text" class="form-control" name="brand" id="aBrand" value="'+ (value?value:"")+'">'
    content += '</div>';
    content += '<div class="col-md-4 col-sm-12" >'
    content += '<input type="button" name="add-brand" class="btn btn-success" onclick="'+buttonClck+'(this)" value="'+btnLabel+'">'                    	
    content += '</div>';
    content += '</div>';

    $("#brand-input-box").html(content);
}

function brands(data) {
    loading()
    console.log(data)
    var brandsObj = data;
    var content = '';
          
    $.each(brandsObj, function(index, value) {
		content += '<li class="list-group-item mid">';
	    content += '<div class="pull-left">';
	    content += '<a class="" data-id="'+ value.id +'" onclick="edit(this)"><span class="fa fa-pencil"></span></a>'                    		
	    content += '</div>';
	    content += '<label>'+ value.name +'</label>';
	    content += '<div class="pull-right ">';
	    content += '<a name="" class="" id = "btnUpdateBrand" onclick = "brandDelete(this)" data-id="'+ value.id +'"><span class="fa fa-trash"></span></a>';                    	
	    content += '</div>';	              			            
	    content += '</li>';
    });

    // console.log(content)
    $('#ulist-brands').html(content);

}

function getbrands() {
    $(document).ready(function(){
        $.ajax({
          url: '/brands',
          type: 'GET', 
          success: function(data){
            brands(data)
          },
          error: function(error) {
            console.log(error);
          }
        })
        // JQuery code to be added in here.
    });
}

function brandValidation(){
  var errorCount = 0;
  var value = $('#aBrand').val();
  console.log(value)
  if(value === '') { errorCount++; }
  return errorCount;
}

function addBrand(){
  var error = brandValidation();
  if (!error){
	    $.ajax({
	        url: '/brands',
	        data: {
	            name: $('#aBrand').val(),
	        },
	        dataType: 'json',
	        type: 'POST',
	        success: function(data) {
             var path={
              linkpage:"admin/brand"
             } 
             navigatePage.call(path);

	            window.location.reload=true;
	        },
	        error: function(error) {
	            console.log(error);
	        }
	    });
  } else {
    alert('Please fill in all fields');
    return false;
  }
}

function edit(elm) {
//	console.log(elm)
    localStorage.setItem('brandId',$(elm).attr('data-id'));
    $.ajax({
        url: `/brands/${$(elm).attr("data-id")}`,
        type: 'GET',
        success: function(data) {
            //Populate the Pop up        
            addBrandInput(label="Edit A Brand", buttonClck="updateBrand", btnLabel="Submit", value=data['name'])
            // $('#aBrand').val();
             
        },
        error: function(error) {
            console.log(error);
        }
    });
}

// Update Event

function updateBrand(){
    $.ajax({
        url: `/brands/${localStorage.getItem('brandId')}`,
        data: {
            name: $('#aBrand').val(),
            id: localStorage.getItem('brandId')
        },
        dataType: 'json', 
        type: 'PUT',
        success: function(data) {
           var path={
            linkpage:"admin/brand"
           } 
           navigatePage.call(path);
           window.location.reload=true;
        },
        error: function(error) {
            console.log(error);
        }
    });
}


// Delete
function brandDelete(elm) {
    $.ajax({
        url: `/brands/${$(elm).attr('data-id')}`,
        type: 'DELETE',
        success: function(res) {
             var path={
              linkpage:"admin/brand"
             } 
             navigatePage.call(path);
        },
        error: function(error) {
            console.log(error);
        }
    });
}
