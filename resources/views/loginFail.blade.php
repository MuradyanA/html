<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
    @if (session('error'))
    <?php dd($session); ?>
        <div class="alert alert-danger">
            {{ session('error') }}
        </div>
    @endif
</body>

</html>
