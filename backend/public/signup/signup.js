const backendAPIs = '3.145.106.103:3000/chat';

document.getElementById('buttonSubmit').addEventListener('click', validateForm);
const form = document.querySelector('form');

function validateForm(e) {
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

    if (name == "") {
      alert("Name must be filled out");
      return false;
    }
    
    if (email == "") {
      alert("Email must be filled out");
      return false;
    }

    if (phn == "") {
        alert("Phone number must be filled out");
        return false;
    }

    if (password == "") {
      alert("Password must be filled out");
      return false;
    }

    else{
        signupFunc(e, obj);
    }
}


async function signupFunc(e, obj){

    try{
        
        e.preventDefault();
        await axios.post(`${backendAPIs}/signup/user`, obj);
        form.reset();
        alert("Successfully signed up");
        window.location.href = "../login/login.html";
        
    }
    catch (err) {
        console.log(err);
        document.body.innerHTML += `<h4 class="text-white"> Something went wrong </h4>`
        document.body.innerHTML += `<h4 class="text-white"> ${err.response.data.message}</h4>`
    }

}