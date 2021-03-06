window.onload = changePassFunc;

function changePassFunc(){
  $(document).ready(function() {
    addChangePassEvents();
  })
}

function fill(classV, clear_fill){
  if (clear_fill){
    const clear = "";
    document.querySelector(classV).value = clear;
  } else {
    return document.querySelector(classV).value         
  } 
}

function data_collector(clear){
  oldPassword =fill("#change-user-old-password", clear),
  newPassword = fill("#change-user-password", clear),
  confirmedNewPassword = fill("#change-user-confirm-password", clear)
}

function outputInputs(){
  return {
    oldPassword: this.oldPassword,
    password: this.newPassword,
    confirmedPassword: this.confirmedNewPassword
  }
}

function errorChecker(addUser){
  errorCount = 0
  Object.values(addUser).forEach(function(value){
    console.log(value)
    if(value === '') { this.errorCount++; }
  })
  return errorCount
}

function changePass(pass){
  const { password, confirmedPassword } = pass;
  if (password === confirmedPassword){
    return true
  } 
  return false
}

function validatePassword(){

  $(document).ready(function(){

    loading.call({msg:"You are not logged in"})

    const pass = outputInputs.call(data_collector(false))  
    const changepass = changePass(pass)
    const error = errorChecker(pass)
    console.log(error)
    if (error>0){
      alert("Please Fill in all entries")
      outputInputs.call(data_collector(true))
      return
    }

    if (!changepass){
        alert("New password error. Please try again!")
        outputInputs.call(data_collector(true))
        return
    }

      const userId = localStorage.getItem("Userid")
      $.ajax({
        url: `/api/users/${userId}`,
        type: 'GET',
        success: function(data){
          const pass = outputInputs.call(data_collector(false))  
          const { oldPassword, password } = pass;
          if (data.password === oldPassword){
            submitChangePassword(password)
          } else{
            alert("Invalid password")
            outputInputs.call(data_collector(true))

          }
        },
        error: function(error) {
          console.log(error);
        }
      })
  })
}

function submitChangePassword(passcode){
    const userId = localStorage.getItem("Userid")

  $(document).ready(function(){
    $.ajax({
      url: `/updates/user/${userId}/${passcode}`,
      type: 'PUT',
      data: {
        password:passcode
      },
      success: function(data){
       var path={
        linkpage:"admin/users"
       } 
       navigatePage.call(path);
      },
      error: function(error) {
        console.log(error);
      }
    })
  })
}

function addChangePassEvents(){
  loading();
  document.querySelector("#btnSubmitChangePassword").addEventListener("click", function(event){ event.preventDefault(); validatePassword()});
  outputInputs.call(data_collector(true))
  getUserName()
}
