let map = [];       // tablica mapki
let n;              // wysokość n
let m;              // szerokość m
let mines;          // ilość min
let board;          // tabelka na stronie
let minesLeft;      // pozostałe miny
let clickedFields;  // ilość klikniętych pól
let start;          // rozpoczęcie odliczania czasu
let time = 0;           // dany czas

createInput();      // tworzy inputy z wysokością, szerokością i liczbą min

function startGame () {
    document.body.innerHTML = '';   // czyści stronę
    minesLeft = mines;              // przypisanie ilości min
    createArr(n, m);                // tworzy tablicę zer o wyskości n i szerokości m
    drawMap();                      // tworzy tabelkę z mapą do gry
    start = 0;                      // zeruje timer
}

function createInput () {
    document.body.innerHTML = '';
    n = '';
    m = '';
    mines = '';

    let height = document.createElement("input");
    let width = document.createElement("input");
    let minesE = document.createElement("input");
    let button = document.createElement("input");

    let heightLabel = document.createElement("label");
    let widthLabel = document.createElement("label");
    let minesLabel = document.createElement("label");

    height.setAttribute("type", "text");
    width.setAttribute("type", "text");
    minesE.setAttribute("type", "text");
    button.setAttribute("type", "button")

    height.setAttribute("id", "height");
    width.setAttribute("id", "width");
    minesE.setAttribute("id", "mines");
    button.setAttribute("id", "button");

    heightLabel.setAttribute("for", "height");
    heightLabel.setAttribute("for", "width");
    heightLabel.setAttribute("for", "mines");

    heightLabel.innerHTML = "Height&nbsp;&nbsp;";
    widthLabel.innerHTML = "Width&nbsp;&nbsp;&nbsp;";
    minesLabel.innerHTML = "Mines&nbsp;&nbsp;&nbsp;";

    button.setAttribute("value", "Generate");
    button.style.marginTop = "10px";

    document.body.appendChild(heightLabel);
    document.body.appendChild(height);
    document.body.appendChild(document.createElement("br"));

    document.body.appendChild(widthLabel);
    document.body.appendChild(width);
    document.body.appendChild(document.createElement("br"));

    document.body.appendChild(minesLabel);
    document.body.appendChild(minesE);
    document.body.appendChild(document.createElement("br"));

    document.body.appendChild(button);


    document.getElementById("button").addEventListener("click", function () {
        n = Math.round(document.getElementById("height").value);
        m = Math.round(document.getElementById("width").value);
        mines = Math.round(document.getElementById("mines").value);
        minesLeft = mines;
        if (isNaN(n) || isNaN(m) || isNaN(mines) || n == '' || m == '' || mines == '') {
            // console.log(`${isNaN(n)} ${isNaN(m)} ${isNaN(mines)}`);
            createInput();
        }
        else if (mines >= m * n) {
            alert("podałeś więcej min niż jest pól :P")
        }
        else {
            // console.log(`${isNaN(n)} ${isNaN(m)} ${isNaN(mines)}`);
            startGame();
        }
    });
}

function createArr (n, m) {
    for (let i = 0; i < n; i++) {
        map[i] = [];
        for (let j = 0; j < m; j++) {
            map[i][j] = 0;
        }
    }
}

function drawMap () {
    let minesLeftDiv = document.createElement("div");
    let timerDiv = document.createElement("div");
    let recordsTable = document.createElement("table");
    let records = [];
    let decodedCookie = decodeURIComponent(document.cookie).split("; ");

    minesLeftDiv.innerText = "Mines left: " + minesLeft;
    minesLeftDiv.setAttribute("id", "minesLeft");
    document.body.appendChild(minesLeftDiv);

    timerDiv.setAttribute("id", "timer");
    timerDiv.innerText = `Time: 0s`;
    document.body.appendChild(timerDiv);

    recordsTable.classList.add("recordsTable");

    for (let i = 0; i < decodedCookie.length; i++) {
        if (decodedCookie[i].split("=")[0] == `${n}x${m}x${mines}`) {
            let pom;
            pom = decodedCookie[i].split("=")[1];
            records = pom.split("|");
        }
    }

    let tr = document.createElement("tr");
    let header = document.createElement("td");

    header.setAttribute("colspan", 3)
    header.innerText = "TOP 10"

    tr.appendChild(header);
    recordsTable.appendChild(tr);

    for (let i = 0; i < records.length; i++) {
        let tr = document.createElement("tr");
        let number = document.createElement("td")
        let tdNick = document.createElement("td");
        let tdTime = document.createElement("td");

        number.innerText = i + 1;
        tdNick.innerText = records[i].split(",")[0];
        tdTime.innerText = records[i].split(",")[1];

        tr.appendChild(number);
        tr.appendChild(tdNick);
        tr.appendChild(tdTime);

        recordsTable.appendChild(tr);
    }

    document.body.appendChild(recordsTable);

    console.table(records);

    board = document.createElement("table");

    for (let i = 0; i < n; i++) {
        let tr = document.createElement("tr");
        board.appendChild(tr);
        for (let j = 0; j < m; j++) {
            let td = document.createElement("td");
            td.setAttribute("id", `td${i}_${j}`)
            td.classList.add("hide");
            td.addEventListener("click", function () {
                // console.log("klik " + td.id);
                if (start == 0) {
                    drawBombs(i, j);    // losuje bomby po całej tablicy
                    drawNumbers();      // liczy cyfry 
                    start = Date.now();
                    let timer = setInterval(function () {
                        if (start == 0) {
                            clearInterval(timer);
                        }
                        else {
                            time = Math.round((Date.now() - start) / 1000);
                            document.getElementById("timer").innerText = `Time: ${time}s`;
                        }
                    }, 1000)
                }
                if (document.getElementById(`td${i}_${j}`).classList.contains("flag") || document.getElementById(`td${i}_${j}`).classList.contains("question") || document.getElementById(`td${i}_${j}`).classList.contains("rmClick")) {
                    console.log("nie mozna");
                }
                else {
                    uncoverEmpty(i, j);
                    isWin();
                }
            })
            let x = 0;
            td.addEventListener("contextmenu", function (e) {
                e.preventDefault();
                if (document.getElementById(`td${i}_${j}`).classList.contains("clicked") || document.getElementById(`td${i}_${j}`).classList.contains("rmClick")) {
                    console.log("klikniete");
                }
                else {
                    // console.log("nie klikniete");
                    if (x == 0) {
                        // console.log("flaga");
                        document.getElementById(`td${i}_${j}`).innerText = "🚩";
                        document.getElementById(`td${i}_${j}`).classList.add("flag");
                        minesLeft--;
                        minesLeftDiv.innerText = "Mines left: " + minesLeft;
                        isWin();
                        x = 1;
                    }
                    else if (x == 1) {
                        // console.log("pytajnik");
                        document.getElementById(`td${i}_${j}`).innerText = "❔";
                        document.getElementById(`td${i}_${j}`).classList.remove("flag");
                        document.getElementById(`td${i}_${j}`).classList.add("question");
                        minesLeft++;
                        minesLeftDiv.innerText = "Mines left: " + minesLeft;
                        isWin(i, j);
                        x = 2;
                    }
                    else {
                        // console.log("odklikoł sie");
                        document.getElementById(`td${i}_${j}`).innerText = "";
                        document.getElementById(`td${i}_${j}`).classList.remove("question");
                        x = 0;
                    }
                }

            })
            tr.appendChild(td);
        }
    }
    document.body.appendChild(board);
}

function isWin () {
    clickedFields = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if ((document.getElementById(`td${i}_${j}`).classList.contains("clicked") && map[i][j] != "X")) {
                clickedFields++;
            }
        }
    }
    if (clickedFields == n * m - mines) {
        minesLeft = 0;
        document.getElementById("minesLeft").innerText = "Mines left: " + minesLeft;
        let win = document.createElement("div");
        let napis = document.createElement("p");
        let playAgain = document.createElement("button");
        let changeParameters = document.createElement("button");

        napis.innerText = "YOU WIN :D";

        playAgain.setAttribute("id", "playAgain");
        playAgain.innerText = "Play again?";
        playAgain.addEventListener("click", function () { startGame(); });

        changeParameters.setAttribute("id", "changeParameters");
        changeParameters.innerText = "Change parameters";
        changeParameters.addEventListener("click", function () { createInput(); });

        win.classList.add("win");
        win.appendChild(napis);
        win.appendChild(playAgain);
        win.appendChild(changeParameters);

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                if (map[i][j] == "X") {
                    document.getElementById(`td${i}_${j}`).innerText = "🚩";
                    document.getElementById(`td${i}_${j}`).classList.add("flag");
                }
                document.getElementById(`td${i}_${j}`).classList.add("rmClick");
            }
        }
        document.body.appendChild(win);
        records(time);
        start = 0;

    }
}

function gameOver () {
    start = 0;
    let gameOver = document.createElement("div");
    let napis = document.createElement("p");
    let playAgain = document.createElement("button");
    let changeParameters = document.createElement("button");

    napis.innerText = "GAME OVER";

    playAgain.setAttribute("id", "playAgain");
    playAgain.innerText = "Try again?";
    playAgain.addEventListener("click", function () { startGame(); });

    changeParameters.setAttribute("id", "changeParameters");
    changeParameters.innerText = "Change parameters";
    changeParameters.addEventListener("click", function () { createInput(); });

    gameOver.classList.add("gameOver");
    gameOver.appendChild(napis);
    gameOver.appendChild(playAgain);
    gameOver.appendChild(changeParameters);

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (map[i][j] == "X") {
                document.getElementById(`td${i}_${j}`).innerText = "💣";
                document.getElementById(`td${i}_${j}`).classList.add("clicked");
                document.getElementById(`td${i}_${j}`).classList.replace("hide", "bomb");
            }
            else {
                document.getElementById(`td${i}_${j}`).classList.add("rmClick"); // żeby nie można było odsłaniać po przegranej
            }
        }
    }
    document.body.appendChild(gameOver);
}

function whichColor (i, j) { // w zależności od znaku pokoloruj na dany kolor
    let field = document.getElementById(`td${i}_${j}`);
    if (map[i][j] == 0) {
        field.innerText = "";
        field.classList.add("clicked");
        field.classList.replace("hide", "zero");
    }
    else if (map[i][j] == 1) {
        field.innerText = map[i][j];
        field.classList.add("clicked");
        field.classList.replace("hide", "one");
    }
    else if (map[i][j] == 2) {
        field.innerText = map[i][j];
        field.classList.add("clicked");
        field.classList.replace("hide", "two");
    }
    else if (map[i][j] == 3) {
        field.innerText = map[i][j];
        field.classList.add("clicked");
        field.classList.replace("hide", "three");
    }
    else if (map[i][j] == 4) {
        field.innerText = map[i][j];
        field.classList.add("clicked");
        field.classList.replace("hide", "four");
    }
    else if (map[i][j] == 5) {
        field.innerText = map[i][j];
        field.classList.add("clicked");
        field.classList.replace("hide", "five");
    }
    else if (map[i][j] == 6) {
        field.innerText = map[i][j];
        field.classList.add("clicked");
        field.classList.replace("hide", "six");
    }
    else if (map[i][j] == 7) {
        field.innerText = map[i][j];
        field.classList.add("clicked");
        field.classList.replace("hide", "seven");
    }
    else if (map[i][j] == 8) {
        field.innerText = map[i][j];
        field.classList.add("clicked");
        field.classList.replace("hide", "eight");
    }
    else { // przegrana
        gameOver();
    }
}

function uncoverEmpty (i, j) {
    if (map[i]?.[j] == 0) { // jeśli klikamy na puste pole
        for (let k = -1; k < 2; k++) {
            for (let l = -1; l < 2; l++) {
                if (map[i + k]?.[j + l] != undefined && map[i + k]?.[j + l] != "X" && document.getElementById(`td${i + k}_${j + l}`).classList.contains("clicked") == false && document.getElementById(`td${i + k}_${j + l}`).classList.contains("flag") == false && document.getElementById(`td${i + k}_${j + l}`).classList.contains("question") == false) {
                    whichColor(i + k, j + l); // odsłania pole i sprawdza jaki kolor dać
                    uncoverEmpty(i + k, j + l); // wywołuje samą siebie
                }
            }
        }
    }
    else { // jeśli klikniemy na cokolwiek innego np na jedynkę, dwójkę lub bombę
        whichColor(i, j);
    }
}


function drawBombs (i, j) { // losowanko bomb
    let pom = mines;
    while (pom > 0) {
        let x = Math.floor(Math.random() * m);
        let y = Math.floor(Math.random() * n);
        if (x == j && y == i) {
            continue;
        }
        else if (map[y][x] != "X") {
            map[y][x] = "X";
            pom--;
        }
    }
}

function drawNumbers () {
    for (let i = 0; i < n; i++) { // idzie po wierszach mapki
        for (let j = 0; j < m; j++) { // idzie po kolumnach mapki
            for (let k = -1; k < 2; k++) { // sprawdza wokół pola (i,j) czy jest bomba
                for (let l = -1; l < 2; l++) {
                    if (map[i + k]?.[j + l] == "X" && map[i][j] != "X") { // sprawdza czy nie wyszliśmy poza tablicę oraz czy sprawdzane pole (i,j) nie jest bombą
                        map[i][j]++;
                    }
                }
            }
        }
    }

}

function records () {
    let mapParameters = `${n}x${m}x${mines}`; // wysokość x szerokość x ilość min
    let nickname = prompt("Nickname:", "Player");
    let decodedCookie = decodeURIComponent(document.cookie).split("; "); // rozdziela ciasteczka
    let data = [];
    let isAdded = false;
    let cookie;

    for (let i = 0; i < decodedCookie.length; i++) { // idzie po każdym ciasteczku
        if (mapParameters == decodedCookie[i].split("=")[0]) { // sprawdza czy "nazwa" ciasteczka jest równa mapParameters
            data = decodedCookie[i].split("=")[1]; // wpisuje do tablicy data nicki i czasy graczy
            data = data.split("|");
            break;
        }
    }

    for (let i = 0; i < data.length; i++) {
        if (time < data[i].split(",")[1]) {
            data.splice(i, 0, `${nickname},${time}`);
            isAdded = true; // jesli wynik jest lepszy niz najgorszego użytkownika to daje na true, a jeśli jest najgorszy z wszystkich to pozostanie false
            break;
        }
    }

    if (isAdded == false) { // pushuje wynik jesli jest najgorszy
        data.push(`${nickname},${time}`);
    }

    while (data.length > 10) {
        data.pop(); // wywala wynik jeśli już jest 10 rekordów a jest jeszcze gorszy niż 10
    }

    cookie = `${mapParameters}=${data.join("|")}`; // sklejone
    document.cookie = cookie;

}
