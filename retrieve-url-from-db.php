<?php

header('Content-Type: application/json');

$short = $_GET["url"];

$servername = getenv("HTTP_SERVERNAME");
$username = getenv("HTTP_USERNAME");
$password = getenv("HTTP_PASSWORD");
$dbname = getenv("HTTP_DBNAME");


$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT long_url FROM 1pt WHERE short_url = '$short'";
$result = $conn->query($sql);

$result = mysqli_query($conn, $sql);

// increment 'hits'
mysqli_query($conn, "UPDATE 1pt SET hits=hits+1 WHERE short_url='$short'");

if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
		header("HTTP/1.1 301 Moved Permanently");
		$output = array("status"=>301, "url"=>$row["long_url"]);
        echo json_encode($output, JSON_UNESCAPED_SLASHES);
    }
} else {
	header("HTTP/1.1 404 Not found");
	echo json_encode(array("status"=> 404, "message"=> "URL doesn't exist!"));
}

$conn->close();

?>
