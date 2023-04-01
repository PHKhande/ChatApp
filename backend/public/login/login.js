const backendAPIs = '3.145.106.103:3000/chat';

document.getElementById("btnLogin").addEventListener("click", validateForm);
const form = document.querySelector('form');

function validateForm(e) {

    const loginEmail = document.getElementById("emailId").value;
    const loginPassword = document.getElementById("passwordId").value;
    
    const obj = {
        loginEmail,
        loginPassword
    }
    
    if (loginEmail == "") {
      alert("Email must be filled out");
      return false;
    }

    if (loginPassword == "") {
      alert("Password must be filled out");
      return false;
    }

    else{
        login(e, obj);
    }

}

async function login(e, obj){

    try{

        e.preventDefault();
        const response = await axios.post(`${backendAPIs}/login/user`, obj);
        form.reset();
        alert("You are logged in successfully");
        window.location.href = "../home/home.html";
        localStorage.setItem("token", response.data.token);
           
    } catch (err) {

        console.log(err);
        document.body.innerHTML += `<h4 class="text-white"> Something went wrong </h4>`
        document.body.innerHTML += `<h4 class="text-white"> ${err.response.data.message}</h4>`

    }

}