<?php
include('remotelab.php');
    $SpeedValue = 1;
    $Temperatre = 30;
    if(isset($_POST['speed1']))
    {
        $SpeedValue = 1;
        $query = "UPDATE `labdata` SET Speed = '$SpeedValue'";
        $run = mysqli_query($con,$query);
    }
    elseif(isset($_POST['speed2']))
    {
        $SpeedValue = 2;
        $query = "UPDATE `labdata` SET Speed = '$SpeedValue'";
        $run = mysqli_query($con,$query);
            
    }
    elseif(isset($_POST['speed3']))
    {
        $SpeedValue = 3;
        $query = "UPDATE `labdata` SET Speed = '$SpeedValue'";
        $run = mysqli_query($con,$query);
            
    }
    elseif(isset($_POST['speed4']))
    {
        $SpeedValue = 4;
        $query = "UPDATE `labdata` SET Speed = '$SpeedValue'";
        $run = mysqli_query($con,$query);
            
    }
    elseif(isset($_POST['speed5']))
    {
        $SpeedValue = 5;
        $query = "UPDATE `labdata` SET Speed = '$SpeedValue'";
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