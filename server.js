var express = require("express")
var app = express()
const PORT = 80;
var path = require("path")

app.use(express.static('static'))
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

accounts = [
    { id: 0, log: 'tomek', passw: 't1', wiek: 11, uczen: 'on', plec: 'm' },
    { id: 1, log: 'adam', passw: 'a1', wiek: 19, uczen: 'on', plec: 'm' },
    { id: 2, log: 'aga', passw: 'g1', wiek: 15, uczen: 'on', plec: 'k' },
    { id: 3, log: 'julka', passw: 'j1', wiek: 19, uczen: 'undefined', plec: 'k' }
]
var activeAccount = []
//Przesyłanie formularzy
const errorPage = "<style>body{margin: 0px;width: 100%;height: 100px;background-color: red;color: white;}</style>"
const positivePage = "<style>body{margin: 0px;width: 100%;height: 100px;background-color: green;color: white;}</style>"

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"))
    console.log("Strona Główna Wysłana")
})

app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/register.html"))
    console.log("Strona Rejestracji Wysłana")
})

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/login.html"))
    console.log("Strona Loginu Wysłana")
})

app.get("/admin", function (req, res) {
    if (activeAccount.length == 0) {
        res.sendFile(path.join(__dirname + "/static/admin.html"))
    } else {
        res.sendFile(path.join(__dirname + "/static/adminActive.html"))
    }
    console.log("Strona Administratora Wysłana")
})

app.get("/logOut", function (req, res) {
    activeAccount = []
    res.redirect("../")
})
//Odpowiedzi na panel admina 
var sort = true
const side = "<style>body {margin: 0px;padding: 0px;background-color: gray;color: white;}.line {width: 80%;padding-left: 20px;font-size: 30px;}td{border: 2px solid orange;}.boxOfOption {margin: 0px;width: 100%;height: 50;background-color: dimgray;color: white;}.boxOfOption>a {padding-left: 20px;color: white;text-decoration: none;font-size: 30px;font-weight: bold;}.boxOfOption>a:hover {padding-left: 20px;color: red;text-decoration: none;font-size: 30px;font-weight: bold;}</style><div class=\"boxOfOption\"><a href=\"/sort\">Sort</a><a href=\"/gender\">Gender</a><a href=\"/show\">Show</a><a href=\"/admin\">Admin</a></div></body>"
app.get("/sort", function (req, res) {
    if (activeAccount.length == 0) {
        res.redirect("../admin")
    } else {
        mainSide = "<form action=\"/changeSort\" method=\"POST\">"
        if (sort) {
            console.log("Rosnąco")
            mainSide += "<input type=\"radio\" value=\"rosnaco\" name=\"value\" onchange=\"this.form.submit()\"checked>rosnaco<input type=\"radio\" value=\"malejaco\" name=\"value\"onchange=\"this.form.submit()\">malejaco</form>"
            mainSide += "<table class=\"line\">"
            accounts.sort(function (a, b) { return a.wiek - b.wiek; });
            for (item of accounts) {
                string = "<tr><td>" + "Id: " + item.id + "</td>" + "<td>" + "User: " + item.log + " - " + item.passw + "</td>" + "<td>" + "Wiek: " + item.wiek + "</td></tr>"
                mainSide += string
            }
        } else {
            console.log("Malejaco")
            mainSide += "<input type=\"radio\" value=\"rosnaco\" name=\"value\" onchange=\"this.form.submit()\">rosnaco<input type=\"radio\" value=\"malejaco\" name=\"value\"onchange=\"this.form.submit()\"checked>malejaco</form>"
            mainSide += "<table class=\"line\">"
            accounts.sort(function (a, b) { return b.wiek - a.wiek; });
            for (item of accounts) {
                string = "<tr><td>" + "Id: " + item.id + "</td>" + "<td>" + "User: " + item.log + " - " + item.passw + "</td>" + "<td>" + "Wiek: " + item.wiek + "</td></tr>"
                mainSide += string
            }
        }
        res.send(side + mainSide + "</table>")
    }
})

app.post("/changeSort", function (req, res) {
    if (req.body.value == "rosnaco") {
        sort = true
    } else {
        sort = false
    }
    res.redirect("../sort")
})

app.get("/gender", function (req, res) {
    if (activeAccount.length == 0) {
        res.redirect("../admin")
    } else {
        mainSide = ""
        mainSide += "<table class=\"line\">"
        accounts.sort(function (a, b) { return b.wiek - a.wiek; });
        var genderM = []
        var genderK = []
        for (item of accounts) {
            if (item.plec == "k") {
                genderK.push(item)
            } else if (item.plec == "m") {
                genderM.push(item)
            }
        }
        for (item of genderK) {
            string = "<tr><td>" + "Id: " + item.id + "</td>" + "<td>" + "User: " + item.log + " - " + item.passw + "</td>" + "<td>" + "Płeć: " + item.plec + "</td></tr>"
            mainSide += string
        }
        mainSide += "<tr style=\"height: 50px;\"></tr>"
        for (item of genderM) {
            string = "<tr><td>" + "Id: " + item.id + "</td>" + "<td>" + "User: " + item.log + " - " + item.passw + "</td>" + "<td>" + "Płeć: " + item.plec + "</td></tr>"
            mainSide += string
        }
        res.send(side + mainSide + "</table>")
    }
})

app.get("/show", function (req, res) {
    if (activeAccount.length == 0) {
        res.redirect("../admin")
    } else {
        mainSide = ""
        div = "<table class=\"line\">"
        accounts.sort(function (a, b) { return a.id - b.id; });
        for (item of accounts) {
            string = "<tr><td>" + "Id: " + item.id + "</td>" + "<td>" + "User: " + item.log + " - " + item.passw + "</td>" + "<td>" + "Wiek: " + item.wiek + "</td>" + "<td>" + "Uczeń: " + item.uczen + "</td>" + "<td>" + "Płeć: " + item.plec + "</td></tr>"
            mainSide += string
        }
        res.send(side + div + mainSide + "</table>")
    }
})

//Część zapisu i odpowiedzi

count = 4
app.post("/registerFORM", function (req, res) {
    var form = req.body
    if (form.uczen == undefined) {
        box = ""
    } else {
        box = form.uczen
    }
    if (form.gender == undefined) {
        plec = ""
    } else {
        plec = form.gender
    }
    var newAccount = { id: count, log: form.login, passw: form.passw, wiek: parseInt(form.wiek), uczen: box, plec: plec }
    if (checkExist(newAccount.log)) {
        accounts.push(newAccount)
        res.send(positivePage + "<h1 style=\"margin-left:20px;\">Twoje konto: " + newAccount.log + " zostało pomyślnie utworzone!</h1>")
        count++
    } else {
        res.send(errorPage + "<h1>Taki użytkownik już istnieje.</h1>")
    }
})

app.post("/loginFORM", function (req, res) {
    var form = req.body
    if (activeAccount.length != 0) {
        res.send(errorPage + "<h1>Jestes już zalogowany.</h1>")
    } else {
        if (checkLogin(form)) {
            activeAccount = [form.login, form.passw]
            res.redirect("../admin")
        } else {
            res.send("Nieudane logownaie dla: " + form.login + "!")
        }
    }
})

//Użyteczne skrypty
function checkExist(name) {
    for (item of accounts) {
        if (item.log == name) {
            return false
        }
    }
    return true
}
function checkLogin(form) {
    for (account of accounts) {
        if (account.log == form.login && account.passw == form.passw) {
            return true
        }
    }
    return false
}
//Główny nasłuch
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})