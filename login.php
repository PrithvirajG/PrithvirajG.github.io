#http://localhost/juilee_login/

#http://localhost/phpmyadmin/sql.php?server=1&db=userregistration&table=usertable&pos=0
<?php
session_start();
?>

<html>
<head>
    <title>User Login and Registration</title>
    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">"
    </head>
<style>
body{
    background: linear-gradient(rgba(0,0,50,0.5),rgba(0,0,50,0.5)),url(13.jpeg);
    background-size: cover;
    background-position: center;
}
.login-box{
    max-width: 700px;
    float: none;
    margin: 150px auto;
}
.login-left{
    background: rgba(211, 211,211, 0.5);
    padding: 30px;
}
.login-right{
    background: #fff;
    padding: 30px;

}
.form-control{
    background-color:transparent ! important;
}
</style>
<body>
    <div class="container">
        <div class="login-box">
            <div class="row">
            <div class="col-md-6 login-left">
                <h1>Login Here</h1>
                <form>
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" name="user" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" name="password" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>
            </div>

            <div class="col-md-6 login-right">
                <h1>Register Here</h1>
                <form>
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" name="user" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" name="password" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Register</button>
                </form>
            </div>
            </div>

        </div>
    </div>
</body>
</html>