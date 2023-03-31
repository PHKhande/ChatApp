document.getElementById("buttonSend").addEventListener('click', validateMessage);
document.getElementById("groupBtn").addEventListener('click', () => window.location.href = "../group/group.html");
const form = document.querySelector('form');


const token = localStorage.getItem("token");
const grpName = localStorage.getItem('GroupName');
const grpId = localStorage.getItem('GroupId')


window.addEventListener("DOMContentLoaded", () => {

    async function autoReload() {

        try {
    
            let oldMessages = JSON.parse(localStorage.getItem("allMessages"));
            
            let lastId = oldMessages?.slice(-1)?.[0]?.id || 0;

            let group = oldMessages?.slice(-1)?.[0]?.groupId || -1;

            if (group != grpId){

                oldMessages = []

            } 
            
            const responseMessage = await axios.get(`http://localhost:3000/chat/messages?lastid=${lastId}&groupid=${grpId}`, { headers: { "Authorization": token } });
            const newMessages = responseMessage.data.allMessages;
            
            const allMessages = oldMessages ? [...oldMessages, ...newMessages].slice(-10) : [...newMessages];

            // document.getElementById("showMessages").innerHTML = '';
            const ul = document.getElementById('showMessages');
            while (ul.firstChild) {
                ul.removeChild(ul.firstChild);
            }

            
            allMessages.forEach( ele => {
                if (ele.currentUser) {

                    showMyMessages(ele);

                } else {
                    showOtherMessages(ele);
                }

            });
            
            localStorage.setItem("allMessages", JSON.stringify(allMessages));
    
        } catch (err) {
    
            console.log(err);
            document.body.innerHTML += `<h4 class="text-white"> Something went wrong </h4>`
            document.body.innerHTML += `<h4 class="text-white"> ${err.response.data.message}</h4>`
    
        }

    }
    
    autoReload();
    // setInterval(autoReload, 5000);
});

function validateMessage(e) {

    const userMessage = document.getElementById("messageId").value;
    
    const obj = {
        userMessage,
        grpId,
        grpName
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
        showMyMessages(response.data.message);


    } catch (err) {

        console.log(err);
        document.body.innerHTML += `<h4 class="text-white"> Something went wrong </h4>`
        document.body.innerHTML += `<h4 class="text-white"> ${err.response.data.message}</h4>`

    }
    

} 

async function showMyMessages(obj) {

    const parentElem = document.getElementById("showMessages");
    const childElem = document.createElement("li");
    childElem.className = "list-group-item text-dark text-right";
    childElem.textContent = obj.message;
    parentElem.appendChild(childElem);

}

async function showOtherMessages(obj) {

    const parentElem = document.getElementById("showMessages");
    const childElem = document.createElement("li");
    childElem.className = "list-group-item text-dark text-left";
    childElem.textContent = obj.message;
    parentElem.appendChild(childElem);

}
