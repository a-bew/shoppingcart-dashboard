<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">	
	<title>Admin Users</title>
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="../css/font-awesome.min.css" />
	<link rel="stylesheet" type="text/css" href="../css/style.css">

</head>
<body>
<main> 
     		<nav class="col-sm-2">
	          	<ul class="branding">
	          		<li><a href="#"><img src="" alt="logo"></a></li>
	            </ul>     			
     		</nav>
          <nav class="col-sm-10 nav-text-center">
          	<ul class="navbar">
          		<li class=""><a href="../admin/brand.html">Brand</a></li>
          		<li class=""><a href="../admin/categories.html">Categories</a></li>
          		<li class=""><a href="../admin/products.html">Products</a></li>
          		<li class=""><a href="../admin/archive.html">Archived</a></li>
                <li class=""><a href="../admin/users.html">Users</a></li>
          		<li class="">
                <select style="border: none;">
                  <option value="Hello Adetola">Hello Adetola</option>
                  <option><a href="../admin/users.html">Change Password</a></option>
                  <option>Logout</option>
              </select>
              </li>              
          	</ul>          	
          </nav> 
              <!-- Clear float -->
	          <div class="clr"></div>
</main>

  <!-- Add A User -->

    <div id="add-product" class="container top-margin-20">
      <div class="text-center" style="position: relative;">
        <h2>Change Password</h2>
      </div>
          <form id="change-user-password-form" class="grid-qty-size  container top-margin-20" method="post" >
       <div id="container-change-password" > <!-- upper layer -->
            <div class=" two-col-add-product">
              <div class="grid panel-body-panel">
                <label for="change-user-password"><h6>New Password*:</h6></label>
                <input type="password" class="form-control full-95 cat-categories" id="change-user-password" name="change-user-password" placeholder="Password"/>
              </div>
              <div class="grid panel-body-panel">
                <label for="change-user-confirm-password"><h6>Confirmed New Password*:</h6></label>
                <input type="password" class="form-control full-95 cat-categories" id="change-user-confirm-password" name="change-user-confirm-password" placeholder="Confirm New Password" />
              </div>
                
             </div>
             <div class="row container">
                <div class="margin-20">
                  
                    <input type="button" id="btnSubmittSizeQty" name="add-product-btn" class="btn btn-success btn-block col-sm-12 col-md-12 btnSubmitChangePassword" value="Submit" style="letter-spacing: 1.6px; font-weight: bold;">
                  
               </div>
                
              </div>

          </form>

    </div>


    <script src='../js/jquery.js'></script>
    <script src='../vendor/jqfu/js/jquery.ui.widget.js'></script>
    <script src='../vendor/jqfu/js/jquery.iframe-transport.js'></script>
    <script src='../vendor/jqfu/js/jquery.fileupload.js'></script>
    <script src='../js/ajax.js'></script>
    <script src='./js/users.js'></script>

</body>
</html>