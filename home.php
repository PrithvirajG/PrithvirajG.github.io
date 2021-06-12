<?php
session_start();
if(!isset($_SESSION['username1'])){
    header('location:login.php')
}

?>

<html>
<head>
    <title>home page</title>
    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">"

</head>
<style>
body{
    background: linear-gradient(rgba(0,0,50,0.5),rgba(0,0,50,0.5)),url(13.jpeg);
    background-size: cover;
    background-position: center;
}
a{
    color:#fff !important;
    margin-top: -200px imp !important;
}
h1{
    color:#fff !important;
    margin-top: 200px !important;
    text-align:center;
    text-transform:uppercase;
}

</style>
<body>
    <div class="container">

<a class="float-right" href="logout.php">LOGOUT</a>
    <h1>Welcome <?php echo $_SESSION['username'];?></h1>

</body>
</html>

