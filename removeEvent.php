<?php

require 'database.php';

header("Content-Type: application/json");

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

$username = $_SESSION['username'];
$user_id = $_SESSION['userID'];

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$event_id = $json_obj['id'];
$owner_username = $json_obj['owner'];
$share1_username = $json_obj['share1'];
$share2_username = $json_obj['share2'];
$empty = 0;

if ($username == $owner_username) {
    $stmt = $mysqli->prepare("DELETE from eventinfo WHERE eventID=?");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
    }
    $stmt->bind_param('i', $event_id);
    $stmt->execute();
    $stmt->close();

    $stmt = $mysqli->prepare("SELECT COUNT(*) FROM eventinfo WHERE eventID=?");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
    }
    $stmt->bind_param('i', $event_id);
    $stmt->execute();
    $stmt->bind_result($countAfterRemoval);
    $stmt->fetch();
    $stmt->close();

    if ($countAfterRemoval > 0) {
        echo json_encode(array(
            "success" => false,
            "message" => "Error, event not removed, Reason1"
        ));
    } else {
        echo json_encode(array(
            "success" => true,
            "message" => "Event removed!"
        ));
    }
} else if ($username == $share1_username) {
    $stmt = $mysqli->prepare("UPDATE eventinfo set sharedUserID1=? WHERE eventID=?");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
    }
    $stmt->bind_param('ii', $empty, $event_id);
    $stmt->execute();
    $stmt->close();

    $stmt = $mysqli->prepare("SELECT sharedUserID1 FROM eventinfo WHERE eventID=?");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
    }
    $stmt->bind_param('i', $event_id);
    $stmt->execute();
    $stmt->bind_result($zeroIfSuccessOne);
    $stmt->fetch();
    $stmt->close();

    if ($zeroIfSuccessOne != 0) {
        echo json_encode(array(
            "success" => false,
            "message" => "Error, event not removed, Reason2"
        ));
    } else {
        echo json_encode(array(
            "success" => true,
            "message" => "Event removed!"
        ));
    }
} else if ($username == $share2_username) {
    $stmt = $mysqli->prepare("UPDATE eventinfo set sharedUserID2=? WHERE eventID=?");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
    }
    $stmt->bind_param('ii', $empty, $event_id);
    $stmt->execute();
    $stmt->close();

    $stmt = $mysqli->prepare("SELECT sharedUserID2 FROM eventinfo WHERE eventID=?");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
    }
    $stmt->bind_param('i', $event_id);
    $stmt->execute();
    $stmt->bind_result($zeroIfSuccessTwo);
    $stmt->fetch();
    $stmt->close();

    if ($zeroIfSuccessTwo != 0) {
        echo json_encode(array(
            "success" => false,
            "message" => "Error, event not removed, Reason3"
        ));
    } else {
        echo json_encode(array(
            "success" => true,
            "message" => "Event removed!"
        ));
    }
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "Error, event not removed, Reason4",
        // "owner" => $owner_username,
        // "username" => $username,
        // "share1" => $share1_username,
        // "share2" => $share2_username
    ));
}
exit;


?>