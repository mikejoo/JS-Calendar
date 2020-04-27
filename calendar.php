<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <link rel="stylesheet" type="text/css" href="user.css">
    <link rel="stylesheet" type="text/css" href="calendar.css">
    <link rel="stylesheet" type="text/css" href="modal.css">
    <link rel="icon" href="data:;base64,iVBORw0KGgo=">
    <title>Calendar</title>
</head>
<body>

<div class="notLoggedIn">
    <button id="user">Log-In / Register</button>
    <!-- Modal Window adapted from w3school 'https://www.w3schools.com/howto/howto_css_modals.asp' -->
    <form id="userModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            Welcome!
            <br><br>
            <input type="text" id="username_login" placeholder="Username"/>
            <br><br>
            <input type="password" id="password_login" placeholder="Password"/>
            <br><br>
            <button id="authenticate" type="button">Log In</button>
            <br><br><br>
            New User?
            <br><br>
            <input type="text" id="username_regist" placeholder="New Username"/>
            <br><br>
            <input type="password" id="password_regist" placeholder="New Password"/>
            <br><br>
            <input type="password" id="password_regist_re" placeholder="Re-Enter Password"/>
            <br><br>
            <button id="register" type="button">Register</button>
        </div>
    </form>
    <!-- display empty calendar -->
</div>

<div class="loggedIn">
    <button id="logout">Logout</button>
    <button id="new_event">New Event</button>
    <br>
    <h3></h3>
    <div class="instructions">
    Click on "New Event" to add an event.
    <br><br>
    Click on an event in the calendar that you made to edit/remove it. You cannot edit events that someone else made and shared with you.
    <br>
    You can remove an event that someone else made and shared with you, but only from your own calendar.
    <br><br>
    Color Code: <button class="eventButton" type="button">Events</button>
    <button class="taskButton" type="button">Tasks</button>
    <button class="reminderButton" type="button">Reminders</button>
    </div>
    <form id="newEventModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            New Event
            <br><br>
            For Firefox users, enter the time in <br> [YYYY-MM-DD'T'HH:MM] format <br> (ex: 2020-03-18T21:00).
            <br><br>
            <input type="text" id="new_event_name" placeholder="Event Name"/>
            <input type="hidden" id="csrf_event" name="eventToken" value="<?php session_start(); echo $_SESSION['token'];?>" />
            <br><br>
            From <input type="datetime-local" id="new_event_start"/>
            <br><br>
            Until <input type="datetime-local" id="new_event_end"/>
            <br><br>
            <input type="radio" id="event" name="new_event_type" value="event" checked/>
            <label for="event">Event</label>
            <input type="radio" id="task" name="new_event_type" value="task"/>
            <label for="task">Task</label>
            <input type="radio" id="reminder" name="new_event_type" value="reminder"/>
            <label for="reminder">Reminder</label>
            <br><br>
            Share with
            <br><br>
            <input type="text" id="new_event_share1" placeholder="Username 1"/>
            <br><br>
            <input type="text" id="new_event_share2" placeholder="Username 2"/>
            <br><br>
            <button id="add_event" type="button">Add Event</button>
        </div>

    </form>

    <form id="viewEventModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            Event Details
            <br><br>
            For Firefox users, enter the time in <br> [YYYY-MM-DD'T'HH:MM] format <br> (ex: 2020-03-18T21:00).
            <br><br>
            <div id="view_event_id" hidden></div>
            <div id="view_event_owner"></div>
            <br>
            <input type="text" id="view_event_name"/>
            <input type="hidden" id="csrf_viewevent" name="eventToken_view" value="<?php echo $_SESSION['token'];?>" />
            <br><br>
            From <input type="datetime-local" id="view_event_start"/>
            <br><br>
            Until <input type="datetime-local" id="view_event_end"/>
            <br><br>
            <input type="radio" id="view_type_event" name="view_event_type" value="event"/>
            <label for="event">Event</label>
            <input type="radio" id="view_type_task" name="view_event_type" value="task"/>
            <label for="task">Task</label>
            <input type="radio" id="view_type_reminder" name="view_event_type" value="reminder"/>
            <label for="reminder">Reminder</label>
            <br><br>
            Shared with
            <br><br>
            <input type="text" id="view_event_share1" placeholder="Username 1"/>
            <br><br>
            <input type="text" id="view_event_share2" placeholder="Username 2"/>
            <br><br>
            <button id="edit_event" type="button">Edit Event</button>
            <button id="remove_event" type="button">Remove Event</button>
        </div>
    </form>
</div>

<div class="button_cal">
    <div class="month_buttons">
    <br>
    <button id="prev_month_btn">&#8249;</button>
    &emsp;&emsp;
    <h2 id="monthYear"></h2>
    &emsp;&emsp;
    <button id="next_month_btn">&#8250;</button>
    </div>
    <div class="today_btn">
    <button id="today">Today</button>
    </div>
    <br>
    <table class="table_cal" id="calendarBody">
        <thead id="calendarWeekday"></thead>
        <tbody id="calendarDay">
        </tbody>
    </table>
</div>

<script type="text/javascript" src="calendar.js"></script>
<script type="text/javascript" src="user.js"></script> 
<script type="text/javascript" src="event.js"></script>
</body>
</html>