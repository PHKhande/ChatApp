document.getElementById("buttonSend").addEventListener('click', validateMessage);
const form = document.querySelector('form');
const token = localStorage.getItem("token");

window.addEventListener("DOMContentLoaded", () => {

    async function autoReload() {

        try {
    
            const oldMessages = JSON.parse(localStorage.getItem("allMessages"));
            
            let lastId = 0
            if ( oldMessages ){
                lastId = oldMessages.slice(-1)[0].id ?? 0;
            }
            
            const responseMessage = await axios.get(`http://localhost:3000/chat/messages?lastid=${lastId}`, { headers: { "Authorization": token } });
            const newMessages = responseMessage.data.allMessages;
    
            const allMessages = oldMessages ? [...oldMessages, ...newMessages].slice(-10) : [...newMessages];

            document.getElementById("showMessages").innerHTML = '';
            allMessages.forEach(showMessages);
            localStorage.setItem("allMessages", JSON.stringify(allMessages));
    
        } catch (err) {
    
            console.log(err);
            document.body.innerHTML += `<h4 class="text-white"> Something went wrong </h4>`
            document.body.innerHTML += `<h4 class="text-white"> ${err.response.data.message}</h4>`
    
        }

    }
    
    autoReload();
    setInterval(autoReload, 5000);
});

function validateMessage(e) {

    const userMessage = document.getElementById("messageId").value;
    
    const obj = {
        userMessage
    }
    
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

const sendMessage = async(e, obj) => {

    try{

        e.preventDefault();
        form.reset();
        const response = await axios.post('http://localhost:3000/chat/user/message', obj, { headers: {"Authorization" : token} });
        showMessages(response.data.message);


    } catch (err) {

        console.log(err);
        document.body.innerHTML += `<h4 class="text-white"> Something went wrong </h4>`
        document.body.innerHTML += `<h4 class="text-white"> ${err.response.data.message}</h4>`

    }
    

} 

async function showMessages(obj) {

    const parentElem = document.getElementById("showMessages");
    const childElem = document.createElement("p");
    childElem.textContent = obj.message;
    parentElem.appendChild(childElem);

}