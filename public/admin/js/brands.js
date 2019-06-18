

function brands(data) {
    if (!localStorage.getItem("Userid")) return
    console.log(data)
    var brandsObj = data;
    var content = '';
          
    $.each(brandsObj, function(index, value) {
		content += '<li class="list-group-item ">';
	    content += '<div class="pull-left">';
	    content += '<a class="" href="" id="'+ value.id +'"><span class="fa fa-pencil"></span></a>'                    		
	    content += '</div>';
	    content += '<label>'+ value.name +'</label>';
	    content += '<div class="pull-right ">';
	    content += '<a href="" name="" class="" id="'+ value.id +'"><span class="fa fa-trash"></span></a>';                    	
	    content += '</div>';	              			            
	    content += '</li>';
    });

    console.log(content)
    $('#ulist-brands').append(content);

}

getbrands()
function getbrands() {
    $(document).ready(function(){
        $.ajax({
          url: 'http://localhost:3000/brands/',
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
	        url: 'http://localhost:3000/brands',
	        data: {
	            name: $('#aBrand').val(),
	        },
	        dataType: 'json',
	        type: 'POST',
	        success: function(data) {
	            window.location.href="/admin/brand.html";
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

