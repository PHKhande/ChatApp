document.getElementById('buttonSubmit').addEventListener('click', validateForm);

function validateForm(e) {
    var name = document.getElementById("nameId").value;
    var email = document.getElementById("emailId").value;
    var email = document.getElementById("phnId").value;
    var password = document.getElementById("passwordId").value;

    if (name == "") {
      alert("Name must be filled out");
      return false;
    }
    
    if (email == "") {
      alert("Email must be filled out");
      return false;
    }

    if (email == "") {
        alert("Phone number must be filled out");
        return false;
    }

    if (password == "") {
      alert("Password must be filled out");
      return false;
    }

    else{
        signupFunc(e);
        form.reset();
    }
}


async function signupFunc(e){
    try{
        e.preventDefault();
        const name = document.getElementById("nameId").value;
        const email = document.getElementById("emailId").value;
        const phn = document.getElementById("phnId").value;
        const password = document.getElementById("passwordId").value;
    
        const obj = {
            name,
            email,
            phn,
            password
        }
        const newUser = await axios.post(`http://localhost:3000/chat/signup/user`, obj);
        // window.location.href = "../login/login.html";
        // console.log(newUser.data.newUserData);
        
    }
    catch (err) {
        console.log(err);
        document.body.innerHTML += `<h4> Something went wrong </h4>`
        document.body.innerHTML += `<h4> ${err.response.data.message}</h4>`
    }
}