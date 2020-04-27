<?php
require 'database.php';

header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$username_temp = $json_obj['username'];
$password_temp = $json_obj['password'];


// Security part 3, escaping the query
$username = addslashes($username_temp);
$password = addslashes($password_temp);

$stmt = $mysqli->prepare("SELECT COUNT(*), userID, pw_hash FROM users WHERE username=?");
if (!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
}
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($cnt, $user_id, $pw_hash);
$stmt->fetch();

if ($cnt == 1 && password_verify($password, $pw_hash)) {
    ini_set("session.cookie_httponly", 1);
    session_start();
    $_SESSION['username'] = $username;
    // Security part 2: Cross-Site Request Forgery
    $_SESSION['token'] = bin2hex(random_bytes(32));
    $_SESSION['userID'] = $user_id;
    $token = $_SESSION['token'];

    echo json_encode(array(
        "success" => true,
        "message" => "Welcome!",

        // Security part 3, escape the XSS
        "username" => htmlentities($_SESSION['username']),
        "token" => $token
    ));
    exit;
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "Incorrect username or password!"
    ));
    exit;
}

?>