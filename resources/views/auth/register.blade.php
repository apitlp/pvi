<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    @vite(['resources/css/app.css', 'resources/css/auth.css'])
    <title>Register</title>
</head>
<body>
<form method="POST" action="/register">
    <h2>Register to Students</h2>

    @csrf

    <input name="first_name" placeholder="First Name" required />
    <input name="last_name" placeholder="Last Name" required />
    <input type="email" name="email" placeholder="Email" required />
    <input type="password" name="password" placeholder="Password" required />
    <input type="password" name="password_confirmation" placeholder="Confirm Password" required />

    <div class="controls">
        <a href="/login">Login</a>

        <button type="submit">Register</button>
    </div>

    @if ($errors->any())
        @foreach($errors->all() as $error)
            <pre>{{$error}}</pre>
        @endforeach
    @endif
</form>
</body>
</html>
