window.onload = archiveFunc;

function archiveFunc(){
  $(document).ready(function() {

    setTimeout(apiArchiveData(), 0); 
  })
  // $("#productPhoto").change(function(event){ collectInput.setProductPhoto(event)});
}

dict = {};
var i=1;

function apiArchiveData(){
	
  loading();

	//Populate 
	productsPageEndPoint(objArchive, `/api/archive`);    

	// Populate parent
	productsPageEndPoint(objArchive, `/api/parent`);

	// Populate users
	productsPageEndPoint(objArchive, `/api/categories`);	

  getUserName()

}

const objArchive = (param, r)=>{
  dict[String(i++)] = param;
  if (i === r){
    populateArchive(dict);
    dict = {};
  }
}

function populateArchive(dict) {
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
            linkpage:"admin/archive"
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
        content += '<td><a rel='+ id +' onclick="deleteProductInArchive(this)"><span class="fa fa-trash" style="cursor:pointer"></span></a></td>';
        content += '<td>' + product + '</td>';
        content += '<td>' + `$${price}` + '</td>';
        content += '<td>' + category + '</td>';
        content += '<td ><div class="row"><span class="col-sm-80"></span></div></td>';
        content += '<td>' + sold + '</td>';
        content += '</tr>';    

    })
    $('#adminArchive table tbody').append(content);
    dict = {};
}

function getArchivProductImgId(id){
 
// Delete
// 
    return $.ajax({
        url: `/api/archive/${id}`,
        type: 'GET',
        success: function({ image_ids }) {
          console.log(image_ids)
          deleteImgFromDb(image_ids)
          deleteProductItemInAchive(id)

                // window.location.href='/admin/categories.html';
                // window.location.reload=true;                
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function getImage(id){

// Delete
    return $.ajax({
        url: `/api/image_url/${id}`,
        type: 'GET',
        success: function({ url }) {

          deleteImgFrmDb(url)

          var url = `/api/image_url/${id}`
          deleteImgFrmDb(url)
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function deleteImgFromDb(imgIds){
    // displaying images

    if (imgIds){
      
      ids = imgIds.split(";")

      ids.forEach(function(id){
        getImage(id)
        
      })	
    }
}

function deleteProductInArchive(evt){
  // get product images data That is, image ID(1,2,3)
  // get image Id details and retrieve image url
  // delete images from source(say with url)
  // delete archive product items from db with (id)

  id = evt.rel
  getArchivProductImgId(id)

}

function deleteProductItemInAchive(id){
// Delete
  return $.ajax({
        url: `/api/archive/${id}`,
        type: 'DELETE',
        success: function(res) {
          console.log(res)
           var path={
            linkpage:"admin/archive"
           } 
           navigatePage.call(path);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

// Delete
function deleteImgFrmDb(url) {
    $.ajax({
    	url: url,
        type: 'DELETE',
        success: function(res) {
          console.log('successful')
        },
        error: function(error) {
          console.log(error);
        }
    });
}