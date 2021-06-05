<?php
$con=mysqli_connect('localhost','root','','remotelab');
if(!$con)
{
    echo "Connection error".mysqli_connect_error();
}
else
    echo "<h3>Data Base Connection Success</h3>"
?>