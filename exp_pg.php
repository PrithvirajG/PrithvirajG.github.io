<?php
include('remotelab.php');
    $SpeedValue = 1;
    $Temperatre = 30;
    if(isset($_POST['speed1']))
    {
        $SpeedValue = 1;
        $query = "UPDATE `Remote DATA` SET Speed = '$SpeedValue'";
        $run = mysqli_query($con,$query);
    }
    elseif(isset($_POST['speed2']))
    {
        $SpeedValue = 0;
        $query = "UPDATE `Remote DATA` SET Speed = '$SpeedValue'";
        $run = mysqli_query($con,$query);
            
    }
    if($run)
            {
                echo "values inserted";
            }
            else
            {
                echo "not inserted";
                echo mysqli_query_error($con);
            }
?>