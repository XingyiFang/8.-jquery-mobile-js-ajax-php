<?php
include 'config.php';

$report_info =$_REQUEST["info"];
$image0 = $report_info['image0'];
$desc = $report_info['description'];
$rep_time = $report_info['rep_time'];

if (isset($report_info['lat'])) {
    $lat = $report_info['lat'];
}else{
	$lat = "null";
}
if (isset($report_info['lng'])) {
    $lng = $report_info['lng'];
}else{
	$lng = "null";
}
if (isset($report_info['image1'])) {
    $image1 = $report_info['image1'];
}else{
	$image1 = "";
}

$query = "INSERT INTO reports (image0, desciption, lat, lng, rep_time,image1) VALUES ('$image0', '$desc', $lat, $lng, '$rep_time', '$image1')";
pg_query($db, $query);


echo $query;


?>
