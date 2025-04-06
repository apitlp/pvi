<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    @vite(['resources/css/app.css', 'resources/css/auth.css'])
    <title>Login</title>
</head>
<body>
    <form method="POST" action="{{ url('login') }}">
        <h2>Login to Students</h2>

        @csrf

        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />

        <div class="controls">
            <a href="/register">Register</a>

            <button type="submit">Login</button>
        </div>
    </form>
</body>
</html>
