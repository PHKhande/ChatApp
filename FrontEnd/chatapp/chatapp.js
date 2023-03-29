document.getElementById("buttonSend").addEventListener('click', validateMessage);
const form = document.querySelector('form');
const token = localStorage.getItem("token");

function validateMessage(e) {

    const userMessage = document.getElementById("messageId").value;
    
    const obj = {
        token,
        userMessage
    }
    console.log(obj)
    
    if (token == null) {
      alert("Not logged in");
      window.location.href = "../login/login.html";
    }

    if (userMessage == "") {
      alert("Type your message before sending");
      return false;
    }

    else{
        sendMessage(e, obj);
    }

}

const sendMessage= async(e, obj) => {

    try{

        e.preventDefault();
        form.reset();
        const response = await axios.post('http://localhost:3000/chat/user/message', obj);
        console.log(response);


    } catch (err) {
        console.log(err);
        document.body.innerHTML += `<h4 class="text-white"> Something went wrong </h4>`
        document.body.innerHTML += `<h4 class="text-white"> ${err.response.data.message}</h4>`
    }
    

} 