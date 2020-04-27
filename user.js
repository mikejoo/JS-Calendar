//prevents logging out when refreshing
fetch("loginStatus.php", {
    method: 'POST',
    body: JSON.stringify(),
    headers: { 'content-type' : 'application/json' }
})
.then(response => response.json())
.then(data => loginStatus(data))
.catch(err => console.error(err));

function loginStatus(data) {
    if (data.success == true) {
        let temp5 = document.getElementsByTagName("h3")[0];
        temp5.innerHTML = "Hi, " + data.username;
        $('.notLoggedIn').toggle();
        $('.loggedIn').toggle();
        return true;  
    } else {
        return false;
    }
}


// Modal Window adapted from w3school 'https://www.w3schools.com/howto/howto_css_modals.asp'
let userModal = document.getElementById("userModal");
let userButton = document.getElementById("user");
let userSpan = document.getElementsByClassName("close")[0];

userButton.onclick = function() {
    userModal.style.display = "block";
}

userSpan.onclick = function() {
    userModal.style.display = "none";
}

document.getElementById("authenticate").addEventListener("click", authenticate, false);

// A function that deal with the user login, it send the info to the authenticate.php
function authenticate(event) {
    const username_login = document.getElementById("username_login").value;
    const password_login = document.getElementById("password_login").value;
    

    if (username_login === "" && password_login === "") {
        alert("Please enter username and password!");
        return;
    } else if (username_login === "") {
        alert("Please enter username");
        return;
    } else if (password_login === "") {
        alert("Please enter password");
        return;
    }

    const login_data = { 'username' : username_login, 'password' : password_login};
    fetch("authenticate.php", {
            method: 'POST',
            body: JSON.stringify(login_data),
            headers: { 'content-type' : 'application/json' }
        })
        // .then(response => response.text())
        // .then(text => console.log(text));
        .then(response => response.json())
        //.then(login_data => alert(login_data.success ? `${login_data.message}` : `${login_data.message}`))
        // After a successful login, we hide the login button section and display loggedIn section.
        .then(login_data => loggedIn(login_data))
        // .then(res => res.text())
        // .then(text => console.log(text))
        .catch(err => console.error(err));

    // alert(login_data.message);
}



// A function that show and hide the session based on whether a user is logged in or not.
function loggedIn(login_data) {
    if (login_data.success == true) {
        let temp5 = document.getElementsByTagName("h3")[0];
        temp5.innerHTML = "Hi, " + login_data.username;
        // Helped by TA on Friday 1100-1300
        var x = login_data.token;
        let csrf_temp = document.getElementById("csrf_event");
        csrf_temp.setAttribute("value", x);
        let csrf_viewEvent = document.getElementById("csrf_viewevent");
        csrf_viewEvent.setAttribute("value", x);
        $('.notLoggedIn').toggle();
        $('.loggedIn').toggle();    
        alert(`${login_data.message}`);
        document.getElementById("userModal").reset();
        updateCalendar(currentMonth.month, currentMonth.year);
    } else{
        alert(`${login_data.message}`);
    }
}

document.getElementById("register").addEventListener("click", register, false);

// A function deal with registration. It sends the user input to register.php
function register(event) {
    const username_regist = document.getElementById("username_regist").value;
    const password_regist = document.getElementById("password_regist").value;
    const password_regist_re = document.getElementById("password_regist_re").value;

    if (username_regist === "" || password_regist === "" || password_regist_re === "") {
        alert("Please enter all fields to register!");
        return;
    } else if (password_regist !== password_regist_re) {
        alert("Your passwords do not match. Please try again!");
        return;
    }

    const regist_data = { 'username' : username_regist, 'password' : password_regist};
    fetch("register.php", {
            method: 'POST',
            body: JSON.stringify(regist_data),
            headers: { 'content-type' : 'application/json' }
        })
        // .then(response => response.text())
        // .then(text => console.log(text));
        .then(response => response.json())
        .then(regist_data => regisEcho(regist_data))
        //.then(text => console.log(text))
        .catch(err => console.error(err));
    
    // alert(regist_data.message);
}

function regisEcho(regist_data){
    // if(regist_data.success == true){
    //     alert("Registration success, please log in.");
    // } else{
    //     //alert("Registration failed.")
    // }
    alert(`${regist_data.message}`);
}

document.getElementById("logout").addEventListener("click", logout, false);

function logout(event) {
    fetch("logout.php", {
        method: 'POST',
        body: JSON.stringify(),
        headers: { 'content-type' : 'application/json' }
    })
    // .then(response => response.text())
    // .then(text => console.log(text));
    .then(response => response.json())
    .then(data => loggedOut(data))
    .catch(err => console.error(err));
}

function loggedOut(data) {
    if (data.success == true) {
        $('.notLoggedIn').toggle();
        $('.loggedIn').toggle();
        userModal.style.display = "none"; 
        alert("Logout Success");
        updateCalendar(currentMonth.month, currentMonth.year);
    }
    else {
        alert("Logout Error");
    }
}