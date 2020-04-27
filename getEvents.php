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
$year = $json_obj['year'];
$month = $json_obj['month'];
$day = $json_obj['day'];


$minDateString = $year.'/'.$month.'/'.$day.' 00:00:00';
$maxDateString = $year.'/'.$month.'/'.$day.' 23:59:59';

$minDatetime = date("Y-m-d H:i:s", strtotime($minDateString));
$maxDatetime = date("Y-m-d H:i:s", strtotime($maxDateString));

$eventIDArray = array();
$eventNameArray = array();
$eventStartTimeArray = array();
$eventTagArray = array();

$stmt = $mysqli->prepare("SELECT eventID, eventName, startDateTime, eventTag 
                            from eventinfo 
                            WHERE 
                                (startDateTime between ? and ?)
                                AND (ownerID = ? or sharedUserID1 = ? or sharedUserID2 = ?)
                            ORDER BY startDateTime asc");
if (!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}
$stmt->bind_param('ssiii', $minDatetime, $maxDatetime, $userID, $userID, $userID);
$stmt->execute();
$stmt->bind_result($eventID, $eventName, $startDateTime, $eventTag);
while ($stmt->fetch()) {
    // Solution to XSS attack
    array_push($eventIDArray, htmlentities($eventID));
    array_push($eventNameArray, htmlentities($eventName));
    array_push($eventStartTimeArray, htmlentities($startDateTime));
    array_push($eventTagArray, htmlentities($eventTag));
}
$stmt->close();

echo json_encode(
    array(
        "success" => true,
        // "year" => $year,
        // "month" => $month,
        // "startDay" => $day,
        // "minDatetime" => $minDatetime,
        // "maxDatetime" => $maxDatetime,
        "eventIDs" => $eventIDArray,
        "eventNames" => $eventNameArray,
        "eventStartTimes" => $eventStartTimeArray,
        "eventTags" => $eventTagArray
    )
);
exit;

?>