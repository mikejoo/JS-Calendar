let newEventModal = document.getElementById("newEventModal");
let newEventButton = document.getElementById("new_event");
let newEventSpan = document.getElementsByClassName("close")[1];

let viewEventModal = document.getElementById("viewEventModal");
let viewEventSpan = document.getElementsByClassName("close")[2];

viewEventSpan.onclick = function () {
    viewEventModal.style.display = "none";
    document.getElementById('view_event_id').textContent = "";
    document.getElementById('view_event_owner').textContent = "";
    document.getElementById('view_event_name').value = "";
    document.getElementById('view_event_start').value = "";
    document.getElementById('view_event_end').value = "";
    document.getElementById('view_event_share1').value = "";
    document.getElementById('view_event_share2').value = "";
}

function eventModalInfo(id) {
    const view_event_data = { 'id': id };
    fetch('getEventInfo.php', {
        method: 'POST',
        body: JSON.stringify(view_event_data),
        headers: { 'content-type': 'application/json' }
    })
        // .then(response=>response.text())
        // .then(text=>console.log(text));
        .then(response => response.json())
        .then(view_event_data => {
            if (view_event_data.success) {
                document.getElementById('view_event_id').textContent = view_event_data.id;
                document.getElementById('view_event_owner').textContent += "Owned By: ";
                document.getElementById('view_event_owner').textContent += view_event_data.owner;
                document.getElementById('view_event_name').value = view_event_data.name;

                let start_datetime = view_event_data.start.substring(0, 10) + 'T' + view_event_data.start.substring(11, 16);
                let end_datetime = view_event_data.end.substring(0, 10) + 'T' + view_event_data.end.substring(11, 16);

                document.getElementById('view_event_start').value = start_datetime;
                document.getElementById('view_event_end').value = end_datetime;

                if (view_event_data.share1 !== "none") {
                    document.getElementById('view_event_share1').value = view_event_data.share1;
                }

                if (view_event_data.share2 !== "none") {
                    document.getElementById('view_event_share2').value = view_event_data.share2;
                }

                if (view_event_data.type === 'event') {
                    document.getElementById('view_type_event').checked = true;
                    document.getElementById('view_type_task').checked = false;
                    document.getElementById('view_type_reminder').checked = false;
                } else if (view_event_data.type === 'task') {
                    document.getElementById('view_type_event').checked = false;
                    document.getElementById('view_type_task').checked = true;
                    document.getElementById('view_type_reminder').checked = false;
                } else if (view_event_data.type === 'reminder') {
                    document.getElementById('view_type_event').checked = false;
                    document.getElementById('view_type_task').checked = false;
                    document.getElementById('view_type_reminder').checked = true;
                }
            }

            if (view_event_data.userIsOwner) {
                document.getElementById('view_event_name').disabled = false;
                document.getElementById('view_event_start').disabled = false;
                document.getElementById('view_event_end').disabled = false;
                document.getElementById('view_event_share1').disabled = false;
                document.getElementById('view_event_share2').disabled = false;
                document.getElementById('view_type_event').disabled = false;
                document.getElementById('view_type_task').disabled = false;
                document.getElementById('view_type_reminder').disabled = false;
                document.getElementById('edit_event').disabled = false;
                document.getElementById('remove_event').disabled = false;
            } else {
                document.getElementById('view_event_name').disabled = true;
                document.getElementById('view_event_start').disabled = true;
                document.getElementById('view_event_end').disabled = true;
                document.getElementById('view_event_share1').disabled = true;
                document.getElementById('view_event_share2').disabled = true;
                document.getElementById('view_type_event').disabled = true;
                document.getElementById('view_type_task').disabled = true;
                document.getElementById('view_type_reminder').disabled = true;
                document.getElementById('edit_event').disabled = true;
                document.getElementById('remove_event').disabled = false;
            }
        })
        .catch(err => console.error(err));
}

newEventButton.onclick = function () {
    newEventModal.style.display = "block";
}

newEventSpan.onclick = function () {
    newEventModal.style.display = "none";
}

document.getElementById("add_event").addEventListener("click", addEvent, false);

function addEvent(event) {
    const event_name = document.getElementById("new_event_name").value;
    const event_start = document.getElementById("new_event_start").value;
    const event_end = document.getElementById("new_event_end").value;
    const event_share1 = document.getElementById("new_event_share1").value;
    const event_share2 = document.getElementById("new_event_share2").value;
    const event_token = document.getElementById("csrf_event").value;


    let event_type = "";
    if (document.getElementById("event").checked) {
        event_type = "event";
    } else if (document.getElementById("task").checked) {
        event_type = "task";
    } else if (document.getElementById("reminder").checked) {
        event_type = "reminder";
    }

    if (event_name === "") {
        alert("Please enter event name!");
        return;
    } else if (event_start === "" || event_end === "") {
        alert("Event times are invalid. Please fully enter event start and end times!");
        return;
    } else if (event_start > event_end) {
        alert("Event times are invalid. Your event seems to end before it starts!");
        return;
    }

    const new_event_data = {
        'name': event_name, 'start': event_start, 'end': event_end,
        'type': event_type, 'share1': event_share1, 'share2': event_share2, 
        'token': event_token
    };
    fetch("addEvent.php", {
        method: 'POST',
        body: JSON.stringify(new_event_data),
        headers: { 'content-type': 'application/json' }
    })
        // .then(response => response.text())
        // .then(text => console.log(text));
        .then(response => response.json())
        .then(new_event_data => newEventEcho(new_event_data))
        .catch(err => console.error(err));
}

function newEventEcho(new_event_data) {
    alert(`${new_event_data.message}`);
    if (new_event_data.success) {
        newEventModal.style.display = "none";
        document.getElementById("newEventModal").reset();
    }
    updateCalendar(currentMonth.month, currentMonth.year);
}

document.getElementById("edit_event").addEventListener("click", editEvent, false);

function editEvent(event) {
    const edit_event_ID = document.getElementById('view_event_id').textContent;
    const edit_event_name = document.getElementById('view_event_name').value;
    const edit_event_start = document.getElementById('view_event_start').value;
    const edit_event_end = document.getElementById('view_event_end').value;
    const edit_event_share1 = document.getElementById('view_event_share1').value;
    const edit_event_share2 = document.getElementById('view_event_share2').value;
    const edit_event_token = document.getElementById("csrf_viewevent").value;


    let edit_event_type = "";
    if (document.getElementById("view_type_event").checked) {
        edit_event_type = "event";
    } else if (document.getElementById("view_type_task").checked) {
        edit_event_type = "task";
    } else if (document.getElementById("view_type_reminder").checked) {
        edit_event_type = "reminder";
    }

    if (edit_event_name === "") {
        alert("Please enter event name!");
        return;
    } else if (edit_event_start === "" || edit_event_end === "") {
        alert("Event times are invalid. Please fully enter event start and end times!");
        return;
    } else if (edit_event_start > edit_event_end) {
        alert("Event times are invalid. Your event seems to end before it starts!");
        return;
    }

    const edit_event_data = {
        'id': edit_event_ID, 'name': edit_event_name, 'start': edit_event_start, 'end': edit_event_end,
        'type': edit_event_type, 'share1': edit_event_share1, 'share2': edit_event_share2, 'token': edit_event_token
    };
    fetch("editEvent.php", {
        method: 'POST',
        body: JSON.stringify(edit_event_data),
        headers: { 'content-type': 'application/json' }
    })
        // .then(response => response.text())
        // .then(text => console.log(text));
        .then(response => response.json())
        .then(edit_event_data => editEventEcho(edit_event_data))
        .catch(err => console.error(err));
}

function editEventEcho(edit_event_data) {
    alert(`${edit_event_data.message}`);
    if (edit_event_data.success) {
        viewEventModal.style.display = "none";
        document.getElementById('view_event_id').textContent = "";
        document.getElementById('view_event_owner').textContent = "";
        document.getElementById('view_event_name').value = "";
        document.getElementById('view_event_start').value = "";
        document.getElementById('view_event_end').value = "";
        document.getElementById('view_event_share1').value = "";
        document.getElementById('view_event_share2').value = "";
        document.getElementById("viewEventModal").reset();
    }
    updateCalendar(currentMonth.month, currentMonth.year);
}

document.getElementById("remove_event").addEventListener("click", removeEvent, false);

function removeEvent(event) {
    if (confirm("Are you sure you want to remove this event?")) {
        const remove_event_id = document.getElementById('view_event_id').textContent;
        const remove_event_owner = document.getElementById('view_event_owner').textContent.substr(10);
        const remove_event_share1 = document.getElementById('view_event_share1').value;
        const remove_event_share2 = document.getElementById('view_event_share2').value;
        //const remove_event_token = document.getElementById("csrf_viewevent").value;
        const remove_event_data = { 'id': remove_event_id, 'owner' : remove_event_owner, 'share1' : remove_event_share1 , 'share2' : remove_event_share2};
        
        fetch("removeEvent.php", {
            method: 'POST',
            body: JSON.stringify(remove_event_data),
            headers: { 'content-type': 'application/json' }
        })
        // .then(response => response.text())
        // .then(text => console.log(text));
        .then(response => response.json())
        .then(remove_event_data => removeEventEcho(remove_event_data))
        .catch(err => console.error(err));
    }
}

function removeEventEcho(remove_event_data) {
    alert(`${remove_event_data.message}`);
    if (remove_event_data.success) {
        viewEventModal.style.display = "none";
        document.getElementById('view_event_id').textContent = "";
        document.getElementById('view_event_owner').textContent = "";
        document.getElementById('view_event_name').value = "";
        document.getElementById('view_event_start').value = "";
        document.getElementById('view_event_end').value = "";
        document.getElementById('view_event_share1').value = "";
        document.getElementById('view_event_share2').value = "";
        document.getElementById("viewEventModal").reset();
    }
    updateCalendar(currentMonth.month, currentMonth.year);
}