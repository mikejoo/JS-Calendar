<?php

require 'database.php';

ini_set("session.cookie_httponly", 1);
session_start();

if (!isset($_SESSION['username'])) {
    echo json_encode(
        array(
            "success" => false
        )
    );
    exit;
}

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$username = $_SESSION['username'];
$userID = $_SESSION['userID'];
$eventID = $json_obj['id'];

$stmt = $mysqli->prepare("SELECT * FROM eventinfo WHERE eventID = ?");
if (!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
}
$stmt->bind_param('i', $eventID);
$stmt->execute();
$stmt->bind_result($id, $name, $ownerID, $start, $end, $tag, $share1ID, $share2ID);
$stmt->fetch();
$stmt->close();

if ($ownerID == $userID) {
    $userIsOwner = true;
} else {
    $userIsOwner = false;
}

$stmt = $mysqli->prepare("SELECT username from users WHERE userID = ?");
if (!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
}
$stmt->bind_param('i', $ownerID);
$stmt->execute();
$stmt->bind_result($owner);
$stmt->fetch();
$stmt->close();

if ($share1ID > 0) {
    $stmt = $mysqli->prepare("SELECT username from users WHERE userID = ?");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
    }
    $stmt->bind_param('i', $share1ID);
    $stmt->execute();
    $stmt->bind_result($share1);
    $stmt->fetch();
    $stmt->close();
} else {
    $share1 = "none";
}

if ($share2ID > 0) {
    $stmt = $mysqli->prepare("SELECT username from users WHERE userID = ?");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
    }
    $stmt->bind_param('i', $share2ID);
    $stmt->execute();
    $stmt->bind_result($share2);
    $stmt->fetch();
    $stmt->close();
} else {
    $share2 = "none";
}

echo json_encode(array(
    "success" => true,

    // Security part 3, escape the XSS
    "id" => htmlentities($eventID),
    "owner" => htmlentities($owner),
    "name" => htmlentities($name),
    "start" => htmlentities($start),
    "end" => htmlentities($end),
    "share1" => htmlentities($share1),
    "share2" => htmlentities($share2),
    "type" => htmlentities($tag),
    "userIsOwner" => htmlentities($userIsOwner)
));
exit;

?>