<?php
$json=array();
include 'config.php';

$query = "SELECT * from reports";
$result = pg_query($db, $query);
$rowNumber = pg_num_rows($result);
while ($row = pg_fetch_row($result)) {
	$categories = array('image0'=>$row[3],'image1'=>$row[4],'description'=>$row[5], 'rep_time'=>$row[6], 'id'=>$row[0],'lat'=>$row[1],'lng'=>$row[2]);
		array_push($json,$categories);		
}
echo '{"items":'. json_encode($json) .'}';

?>