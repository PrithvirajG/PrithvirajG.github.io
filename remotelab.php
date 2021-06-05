<?php
$con=mysqli_connect('sql6.freemysqlhosting.net','sql6417206','JzGIHWBdqg');
if(!$con)
{
    echo "Connection error".mysqli_connect_error();
}
else
    echo "<h3>Data Base Connection Success</h3>"
?>