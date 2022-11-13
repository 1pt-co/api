<?php
header("Content-Type:application/json");

$short = $_GET["url"];

$servername = getenv("HTTP_SERVERNAME");
$username = getenv("HTTP_USERNAME");
$password = getenv("HTTP_PASSWORD");
$dbname = getenv("HTTP_DBNAME");

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT long_url, timestamp, hits FROM 1pt WHERE short_url = '$short' LIMIT 1";
$result = $conn->query($sql);

$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    while($row = mysqli_fetch_assoc($result)) {
		// Check GoogleSafeBrowsing API
		$threatTypes = array("MALWARE", "SOCIAL_ENGINEERING", "POTENTIALLY_HARMFUL_APPLICATION", "UNWANTED_SOFTWARE");
		$platformTypes = array("ANY_PLATFORM", "WINDOWS", "LINUX", "OSX", "ALL_PLATFORMS", "CHROME", "ANDROID", "IOS");
		$threatEntryTypes = array("URL", "IP_RANGE");

		$url = 'https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyCeb9qkUdAp8UHj3LsCrWfs-L9Fw2sbyv0';
		$fields = array(
			'client' => array(
			  'clientId' => '1pt.co',
			  'clientVersion' => '3.0'
			),
			'threatInfo' => array(
			  'threatTypes' => $threatTypes,
			  'platformTypes' => $platformTypes,
			  'threatEntryTypes' => $threatEntryTypes,
			  'threatEntries' => array(
				'url' => $row["long_url"]
			  )
			)
		);

		$payload = json_encode($fields);

		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type:application/json')); curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $payload);
		$malicious = json_decode(curl_exec($curl), true);

		header("HTTP/1.1 200 OK");
		echo json_encode(array("status"=>200, "short"=> $short,"long"=>$row["long_url"], "date"=>$row["timestamp"], "hits"=>$row["hits"], "malicious"=>!empty($malicious)), JSON_UNESCAPED_SLASHES);

		curl_close($curl);
    }
} else {
	header("HTTP/1.1 404 Not found");
	echo json_encode(array("status"=> 404, "message"=> "URL doesn't exist!"));
}

?>
