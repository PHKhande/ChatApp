const backendAPIs ="http://localhost:3000/chat"

document.getElementById("buttonSend").addEventListener('click', validateMessage);
document.getElementById("groupBtn").addEventListener('click', () => window.location.href = "../group/group.html");
const form = document.querySelector('form');


const token = localStorage.getItem("token");
const grpName = localStorage.getItem('GroupName');
const grpId = localStorage.getItem('GroupId')


window.addEventListener("DOMContentLoaded", async() => {

    document.getElementById("grpName").textContent = `${grpName}`;

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

    const groupUsersArray = await axios.get(`http://localhost:3000/chat/user/group?groupid=${grpId}`, { headers: {"Authorization" : token} });
    const users = groupUsersArray.data.allUsers
    users.forEach(showUser);

    const groupAdminsArray = await axios.get(`http://localhost:3000/chat/admin/group?groupid=${grpId}`, { headers: {"Authorization" : token} });
    const admins = groupAdminsArray.data.allAdmins
    admins.forEach(showAdmin);


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
        const response = await axios.post('http://localhost:3000/chat/user/message', obj, { headers: {"Authorization" : token} });
        showMyMessages(response.data.message);
        document.getElementById('msgReset').reset();


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



document.getElementById("addUser").addEventListener('click', SearchPeople);

async function SearchPeople(e){

    try{

        e.preventDefault();

        const email = document.getElementById("emailId").value;
    
        const obj = {
            email,
            grpId
        }
    
        const searchResponse = await axios.post(`${backendAPIs}/addUser`, obj , { headers: { 'Authorization': token } });
        showUser(searchResponse.data.addedUser);
        document.getElementById('reset').reset();

    } catch (err) {

        console.log(err);    
        document.body.innerHTML += `<h4> Something went wrong</h4>`;

    }

}


function showUser(obj){

    const parentElem = document.getElementById('isUser');
    const newChild = document.createElement('li');
    newChild.textContent = obj.name;
    newChild.className = "list-group-item text-dark";

    const adminBtn = document.createElement('button');
    adminBtn.className = 'btn text-info border border-info float float-right';
    adminBtn.appendChild(document.createTextNode(" + "));
    newChild.appendChild(adminBtn);
    parentElem.appendChild(newChild);

    adminBtn.onclick = async(e) => {
        e.preventDefault();

        try{

            await axios.get(`${backendAPIs}/user/to/admin?groupid=${grpId}&userid=${obj.id}`, { headers: {"Authorization" : token} });
            showAdmin(obj)
            parentElem.removeChild(newChild)

        } catch (err) {

            console.log(err);    
            document.body.innerHTML += `<h4> Something went wrong</h4>`;

        }
    }

}

function showAdmin(obj){

    const parentElem = document.getElementById('isAdmin');
    const newChild = document.createElement('li');
    newChild.textContent = obj.name;
    newChild.className = "list-group-item text-dark";

    const userBtn = document.createElement('button');
    userBtn.className = 'btn text-danger border border-danger float float-right';
    userBtn.appendChild(document.createTextNode(" - "));
    newChild.appendChild(userBtn);
    parentElem.appendChild(newChild);

    userBtn.onclick = async(e) => {
        e.preventDefault();

        try{

            await axios.get(`${backendAPIs}/admin/to/user?groupid=${grpId}&userid=${obj.id}`, { headers: {"Authorization" : token} });
            showUser(obj)
            parentElem.removeChild(newChild)

        }
        catch (err) {

            console.log(err);    
            document.body.innerHTML += `<h4> Something went wrong</h4>`;

        }
    }

}


document.getElementById("sendFileBtn").addEventListener('click', sendFile);
















//Sidebar opening and closing
const homeHamburgerMenu = document.querySelector('.hamburger-menu');
const sideHamburgerMenu = document.getElementById("sideHam");
const sidebar = document.querySelector(".sidebar");
const homeBody = document.getElementById('homeBody')

homeHamburgerMenu.addEventListener("click", openSB);
sideHamburgerMenu.addEventListener("click", closeSB);

function openSB() {
    sidebar.classList.add("active-sidebar");
    homeHamburgerMenu.classList.add('active-homeHam');
    homeBody.classList.toggle('show-sidebar');
}

function closeSB() {
    sidebar.classList.remove("active-sidebar");
    homeHamburgerMenu.classList.remove('active-homeHam');
}