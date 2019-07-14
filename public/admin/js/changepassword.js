window.onload = changePassFunc;

function changePassFunc(){
  addChangePassEvents();
}

function fill(classV, clear_fill){
  if (clear_fill){
    const clear = "";
    document.querySelector(classV).value = clear;
//      console.log("cleared", document.querySelector(classV).value)
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

  $(document).ready(function(){
    const userId = localStorage.getItem("Userid")
    $.ajax({
      url: `http://localhost:3000/users/${userId}`,
      type: 'GET',
      success: function(data){
        const pass = outputInputs.call(data_collector(false))  
        const { oldPassword, password } = pass;
        if (data.password === oldPassword){
          alert("Passed")
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
      url: `http://localhost:3000/updates/user/${userId}/${passcode}`,
      type: 'PUT',
      data: {
        password:passcode
      },
      success: function(data){
        window.location.href = "http://localhost:3000/admin/users.html"
      },
      error: function(error) {
        console.log(error);
      }
    })
  })

}

// function cancelAddUser(){
//   outputInputs.call(data_collector(clear=true))  
//   window.location.href = "http://localhost:3000/admin/users.html"
// }

function addChangePassEvents(){
  document.querySelector("#btnSubmitChangePassword").addEventListener("click", function(event){ event.preventDefault(); validatePassword()});
  outputInputs.call(data_collector(true))
}
