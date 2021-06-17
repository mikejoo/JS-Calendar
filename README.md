# Calendar Website using JavaScript/AJAX/JSON

## Functionalities
1. Users can register and log in to website.
2. Registered users can add/edit/delete their events.
3. Registered users can share their events to two different registered users. 
4. Users can remove themselves from an event that someone else created and shared to them, to prevent event invite spamming.

## Security Features
1. Website prevents XSS attacks by sanitizing JSON data on the client side.
2. Website prevents SQL injetion attacks with prepared queries.
3. Website passes tokens in forms to prevent CSRF attacks. 
4. User password information is salted and hashed when stored in SQL database.
