<?php
$http_origin = $_SERVER['HTTP_ORIGIN'];
header('Content-Type: application/json');

if ($http_origin == "https://1pt.co" || $http_origin == "http://code.param.me")
{
    header("Access-Control-Allow-Origin: " . $http_origin);
}

function urlExists($url){
	$conn = new mysqli(getenv("HTTP_SERVERNAME"), getenv("HTTP_USERNAME"), getenv("HTTP_PASSWORD"), getenv("HTTP_DBNAME"));

	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

	$sql = "SELECT short_url FROM 1pt";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		// output data of each row
		while($row = $result->fetch_assoc()) {
			if($row["short_url"] == $url){
				return true;
			}
		}
		$conn->close();
	}
}

function generateRandomString($length) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyz';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
	if(urlExists($randomString)){
		generateRandomString(4);
	} else {
		return $randomString;
	}
}

$long = $_GET["url"];
$custom = $_GET["cu"];

if($custom==null ||  urlExists($custom)){
        $short = generateRandomString(5);
} else {
        $short = $custom;
}


$conn = mysqli_connect(getenv("HTTP_SERVERNAME"), getenv("HTTP_USERNAME"), getenv("HTTP_PASSWORD"), getenv("HTTP_DBNAME"));
if (!$conn) {die("Connection failed: " . mysqli_connect_error());}

$sql = "INSERT INTO 1pt (short_url, long_url) VALUES ('$short', '$long')";

if ($conn->query($sql) === TRUE) {
	header("HTTP/1.1 201 Created");
	echo json_encode(array("status"=>201, "message"=> "Added!","short"=>$short, "long"=>$long), JSON_UNESCAPED_SLASHES);
} else {
	header("HTTP/1.1 400 Bad request");
	echo json_encode(array("status"=>400, "message"=> "Bad request: The provided URL is malformed"));
}

$conn->close();

?>
