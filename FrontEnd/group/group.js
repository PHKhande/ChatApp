const backendAPIs = 'http://localhost:3000/chat';

document.getElementById("homeBtn").addEventListener('click', () => window.location.href = "../home/home.html");
document.getElementById("createGroup").addEventListener('click', validateMessage);

const form = document.querySelector('form');
const token = localStorage.getItem("token");

window.addEventListener("DOMContentLoaded", async () => {
    try{
        const myGroups = await axios.get(`${backendAPIs}/group/mygroups`, { headers: {"Authorization" : token} });   
        for (let i = 0; i < myGroups.data.myGroupsDB.length; i++){
            showMyGroups(myGroups.data.myGroupsDB[i]);
        }

        const otherGroups = await axios.get(`${backendAPIs}/group/othergroups`, { headers: {"Authorization" : token} });
        for (let i = 0; i < otherGroups.data.otherGroupsDB.length; i++){
            showOtherGroups(otherGroups.data.otherGroupsDB[i]);
        }
    }
    catch (err) {
        console.log(err);
        document.body.innerHTML += `<h4> Something went wrong</h4>`
    }
});

function validateMessage(e) {

const groupName = document.getElementById("groupnameId").value;

const obj = {
    groupName
}

if (groupName == "") {
    alert("Type group name");
    return false;
}

else{
    createGroup(e, obj);
}

}

async function createGroup(e, obj){
    e.preventDefault();
    const createdGroup = await axios.post(`${backendAPIs}/create/group`, obj, { headers: {"Authorization" : token} });
    showMyGroups(createdGroup.data.myGroupsDB)
    form.reset();
}

function showMyGroups(obj) {
    const parentElem = document.getElementById('myGroups');
    const newChild = document.createElement('li');
    newChild.textContent = obj.GroupName;
    newChild.className = "list-group-item text-dark";

    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-danger delete float float-right';
    delBtn.appendChild(document.createTextNode(" Delete "));
    newChild.appendChild(delBtn);
    parentElem.appendChild(newChild);

    delBtn.onclick = async(e) => {
        e.stopPropagation();

        try{

            const delResponse = await axios.delete(`${backendAPIs}/group/delete/${obj.id}`, { headers: {"Authorization" : token} });
            alert(delResponse.data.message);
            parentElem.removeChild(newChild)

        }
        catch (err) {

            console.log(err);
            alert("Failed! Only admin can delete groups");    
            document.body.innerHTML += `<h4> Something went wrong</h4>`;

        }
    }

    newChild.onclick = async() => {
        localStorage.setItem('GroupName', obj.GroupName);
        localStorage.setItem('GroupId', obj.id);
        window.location.href = "../groupchat/groupchat.html"

    }

    
    
}

function showOtherGroups(obj){
    const otherParenElem = document.getElementById('otherGroups');
    const otherChildElem = document.createElement('li');
    otherChildElem.textContent = obj.GroupName;
    otherChildElem.className = "list-group-item text-dark";

    const joinBtn = document.createElement('button');
    joinBtn.className = 'btn btn-success edit float float-right';
    joinBtn.appendChild(document.createTextNode(" Join "));
    otherChildElem.appendChild(joinBtn);
    otherParenElem.appendChild(otherChildElem);

    joinBtn.onclick = async() => {

        try{
            
            const joinResponse = await axios.get(`${backendAPIs}/group/join/${obj.id}`, { headers: {"Authorization" : token} });
            alert(joinResponse.data.message);
            showMyGroups(obj);            
            otherParenElem.remove(otherChildElem);

        }
        catch (err) {
            console.log(err);
            document.body.innerHTML += `<h4> Something went wrong</h4>`
        }
    }

}


