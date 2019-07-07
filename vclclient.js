
var open = require('open'),

        os = require("os"),
        fs = require("fs"),
         WebSocket = require('ws'),
        axios = require("axios"),
        moment = require("moment"),
        appdata = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : process.env.HOME + "/.local/share"),
        localStorage = new require('node-localStorage').LocalStorage('./scratch'),
        host = 'http://localhost:3000/',
        wshost = 'ws://localhost:8080',

        lib = {};


    lib.storedir = __dirname + '\\temp',
    lib.keyFileName = 'clkey.dat',
    require('../bckcomp')(lib);

    lib.getTasks = function () {
        return new Promise(function (resolve, reject) {
            axios.get(host + 'clkey/' + lib.key, {json: true}).then(function (resp) {
                console.log("task data:", resp.data);
                resolve(resp.data);
            }, reject);
        });
    };


const ws = new WebSocket(wshost, {
  perMessageDeflate: false
});
ws.on('open', function open() {
  ws.send('wa opened');
});

ws.on('message', function incoming(data) {
    console.log(data);
    if (data.startsWith(lib.key)) {
        console.log('command:', data);

    }
});

/*
lib.backup({
    server: '.\\SQLEXPRESS',
    user: 'sa',
    password: 'vega1234',
    db: 'wince'
}).then(function () {
    console.log("işlem tamamlandı");
}, function (err) {
    console.log("ERROR", err);
})
*/
lib.main = function () {
    return new Promise(function (resolve, reject) {
        lib.checkKey().then(function () {
            lib.getTasks().then(function (tasks) {
                console.log("tasks:", tasks);
                resolve();
            });
        }, function () {
            var fn = os.tmpdir() + '/vegacloudkey.html', html = `<!doctype html>
    <html lang="tr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <title>VCloud Key</title>
    </head>
    <body>

        <div class="bs-example" data-example-id="simple-jumbotron">
            <div class="jumbotron">
              <h1>VCloud anahtarı</h1>
              <p>Aşağıda cloud anahtarınız bulunmaktadır. Bunu sisteme giriş yaparak bilgisayar ekle seçeneği ile ekleyebilirsiniz.</p>
              <p>Aşağıdaki anahtarı seçin ve kopyalayın. Sisteme giriş yapın ve menüden <b>Bilgisayar Ekle</b> seçin. Kod alanına yapıştırın ve sunucu adını girerek kayıtlı sunucularınıza ekleyin. Sonrasında sunucuya yedekleme görevleri tanımlayabilirsiniz.
              <h2>${lib.key}</h2>                      
            </div>
        </div>

        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

    </body></html>`;
            fs.writeFile(fn, html, function () {
                open('file:///' + fn);
                resolve();
            });
        }, reject);
    });
};

lib.getKey().then(function (key) {
    try {
        lib.main().then(function () {
            setTimeout(lib.main, 60000);
        });
    } catch(err) {
        lib.main().then(function () {
            setTimeout(lib.main, 60000);
        }); 
    };
}, console.log);