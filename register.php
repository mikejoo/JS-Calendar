<?php
//session_start();
require 'database.php';

header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$username_temp = $json_obj['username'];
$password_temp = $json_obj['password'];

// Security part 3: escaping the input
$username = addslashes($username_temp);
$password = addslashes($password_temp);

//check if username exists
$stmt = $mysqli->prepare("SELECT COUNT(*) FROM users WHERE username=?");
if (!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
}
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($cnt);
$stmt->fetch();
$stmt->close();

if ($cnt == 1) {
    echo json_encode(array(
        "success" => false,
        "message" => "Username already exists!"
    ));
    exit;
} else if(!preg_match('/^[\w_\.\-]+$/', $username)) {
    echo json_encode(array(
        "success" => false,
        "message" => "Invalid Username!"
    ));
    exit;
} else {
    echo json_encode(array(
        "success" => true,
        "message" => "Registration successful. Please Log-In!"
    ));
    $sq_hash = "sq_hash";
    $stmt = $mysqli->prepare("INSERT into users (username, pw_hash, sq_hash) values (?,?,?)");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
    }
    // set the pw_hash as the php  is complaining we're not pass a variable and that causes the website
    // not alert the registration message properly.

    // Security part 2: store the password securely.
    $pw_hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt->bind_param('sss', $username, $pw_hash, $sq_hash);
    $stmt->execute();
    $stmt->close();
    exit;
}

?>