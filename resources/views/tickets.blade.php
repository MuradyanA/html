<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>

    <title>Document</title>
</head>
<style>

    .infoPart {
        background-color: lightgray;
        width: 60%;
        text-align: center;
        border:1px solid gray;
        font-family: Arial, Helvetica, sans-serif;
    }
</style>

<body>
    <div>
        @foreach ($tickets as $ticket)
            <div style="justify-items: center; margin-bottom: 3%;">
                <div style="display: inline-block; border:1px solid gray;" class="qrPart">
                    <img src="data:image/png;base64, {!! base64_encode(
                        QrCode::format('png')->size(190)->generate(env('APP_URL')."/tickets/pass/".$ticket['uuid']),
                    ) !!} ">
                </div>
                <div style="display: inline-block;" class="infoPart">
                    <h2 style="font-size:1em;color:#3e3e40;font-weight: bold;"><span
                            style="">Movie Name: </span> {{ $ticket['movieName'] }}
                    </h2>
                        <p class="text-lg"
                            style="color:#3e3e40;font-weight: bold;"><span
                                style="font-weight: bold;">Seance Date:
                            </span>{{ $ticket['date'] }}</p>
                        <p style="color:#3e3e40;font-weight: bold;"><span
                                style="font-weight: bold;">Seance Start: </span>{{ $ticket['hour'] }}</p>
                        <p style="color:#3e3e40;font-weight: bold;"><span
                                style="font-weight: bold;">Hall: </span>{{ $ticket['hall'] }}</p>
                        <p style="color:#3e3e40;font-weight: bold;"><span
                            style="font-weight: bold;">Seat: </span>{{ $ticket['seat']}}, {{ $ticket['seatType'] }}</p>
                </div>
            </div>
        @endforeach
    </div>
</body>

</html>
