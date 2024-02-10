// Author: Aaron Weeden, Shodor Education Foundation, 2013–2024

// Constants
var ID_TABLE = "table";
var ID_S_WORK_SIZE = "sWorkSize";
var ID_S_NUM_PAINTERS = "sNumPainters";
var ID_S_MAX_TIME = "sMaxTime";
var ID_S_MAX_SPACE = "sMaxSpace";
var SERIAL_BG_COLOR = "rgba(0, 0, 255, 0.2)";
var PARALLEL_BG_COLOR = "rgba(0, 255, 0, 0.2)";
var BLANK_BG_COLOR = "white";
var MIN_WORK_SIZE = 1;
var MAX_WORK_SIZE = 16;
var MIN_NUM_PAINTERS = 2;
var MAX_NUM_PAINTERS = 8;
var INIT_WORK_SIZE = 2;
var INIT_NUM_PAINTERS = 2;
var INIT_MAX_TIME = MAX_WORK_SIZE;
var INIT_MAX_SPACE = MAX_WORK_SIZE;
var HOUSE_WIDTH = 30;
var HOUSE_HEIGHT = 30;

// DOM elements
var table;
var trParallel = [];
var sWorkSize;
var sNumPainters;
var sMaxTime;
var sMaxSpace;

// Global variables
var WorkSize = INIT_WORK_SIZE;
var NumPainters = INIT_NUM_PAINTERS;
var MaxTime = INIT_MAX_TIME;
var MaxSpace = INIT_MAX_SPACE;

function initDOM() {
    var i;

    table = document.getElementById(ID_TABLE);
    for (i = 0; i < MAX_NUM_PAINTERS; i++) {
        trParallel[i] = document.getElementById("trParallel" + i);
    }
    sWorkSize = document.getElementById(ID_S_WORK_SIZE);
    sNumPainters = document.getElementById(ID_S_NUM_PAINTERS);
    sMaxTime = document.getElementById(ID_S_MAX_TIME);
    sMaxSpace = document.getElementById(ID_S_MAX_SPACE);
}

function fillSelect(s, min, max, val) {
    var i, opt;

    for (i = min; i <= max; i++) {
        opt = document.createElement("option");
        if (i == val) {
            opt.selected = true;
        }
        opt.text = i;
        s.add(opt);
    }
}

function fillSelects() {
    fillSelect(sWorkSize, MIN_WORK_SIZE, MAX_WORK_SIZE, WorkSize);
    fillSelect(sNumPainters, MIN_NUM_PAINTERS, MAX_NUM_PAINTERS, NumPainters);
    fillSelect(sMaxTime, MIN_WORK_SIZE, MAX_WORK_SIZE, MaxTime);
    fillSelect(sMaxSpace, MIN_WORK_SIZE, MAX_WORK_SIZE, MaxSpace);
}

function createParallelTd(houseId, painterId) {
    var td;

    td = document.createElement("td");
    td.id = "tdParallel" + painterId + "," + houseId;
    td.innerHTML =
        "<img id=\"iParallel" + painterId + "," + houseId +
        "\" src=\"house.gif\" width=\"" + HOUSE_WIDTH + "px\"/ height=\"" +
        HOUSE_HEIGHT + "px\" style=\"visibility: hidden;\">";
    td.style.backgroundColor = PARALLEL_BG_COLOR;
    document.getElementById("trParallel" + painterId).appendChild(td);
}

function setUpTable() {
    var i, j, tr, td;

    // Create "Serial" row
    tr = document.createElement("tr");
    td = document.createElement("td");
    td.id = "tdSerialHeader";
    td.innerHTML = "Serial Painter:";
    td.style.backgroundColor = SERIAL_BG_COLOR;
    tr.appendChild(td);
    for (i = 0; i < MAX_WORK_SIZE; i++) {
        td = document.createElement("td");
        td.id = "tdTime" + i;
        td.innerHTML = i;
        td.style.textAlign = "center";
        document.getElementById("trTime").appendChild(td);

        td = document.createElement("td");
        td.id = "tdSerial" + i;
        td.innerHTML =
            "<img id=\"iSerial" + i + "\" src=\"house.gif\" width=\"" +
            HOUSE_WIDTH + "px\"/ height=\"" +
            HOUSE_HEIGHT + "px\" style=\"visibility: hidden;\">";
        td.style.backgroundColor = SERIAL_BG_COLOR;
        tr.appendChild(td);
    }
    table.appendChild(tr);

    // Create "Parallel" rows
    tr = document.createElement("tr");
    tr.id = "trParallel0";
    table.appendChild(tr);
    for (i = 0; i < MAX_NUM_PAINTERS; i++) {
        if (i != 0) {
            tr = document.createElement("tr");
            tr.id = "trParallel" + i;
        }
        td = document.createElement("td");
        td.id = "tdParallelHeader" + i;
        td.style.backgroundColor = PARALLEL_BG_COLOR;
        tr.appendChild(td);
        table.appendChild(tr);
    }
    for (i = 0; i < MAX_WORK_SIZE; i++) {
        for (j = 0; j < MAX_NUM_PAINTERS; j++) {
            createParallelTd(i, j);
        }
    }
}

// Takes <select>, returns integer value of selected option.
function getSelectedInt(s) {
    return parseInt(s.options[s.selectedIndex].text, 10);
}

function update() {
    var taskSize, taskSizeLimit, i, j;

    // Update values
    WorkSize = getSelectedInt(sWorkSize);
    NumPainters = getSelectedInt(sNumPainters);
    MaxTime = getSelectedInt(sMaxTime);
    MaxSpace = getSelectedInt(sMaxSpace);

    // Display time steps
    for (i = 0; i < MaxTime; i++) {
        document.getElementById("tdTime" + i).innerHTML = i;
    }
    for (i = MaxTime; i < MAX_WORK_SIZE; i++) {
        document.getElementById("tdTime" + i).innerHTML = "";
    }

    // Highlight painters that are active
    for (i = 0; i < NumPainters; i++) {
        document.getElementById("tdParallelHeader" + i).style.backgroundColor =
            PARALLEL_BG_COLOR;
    }
    for (i = NumPainters; i < MAX_NUM_PAINTERS; i++) {
        document.getElementById("tdParallelHeader" + i).style.backgroundColor =
            BLANK_BG_COLOR;
    }

    // Highlight table cells for the space available for each painter
    for (i = 0; i < MaxSpace; i++) {
        document.getElementById("tdSerial" + i).style.backgroundColor =
            SERIAL_BG_COLOR;
        for (j = 0; j < NumPainters; j++) {
            document.getElementById("tdParallel" + j + "," + i).
                style.backgroundColor = PARALLEL_BG_COLOR;
        }
        for (j = NumPainters; j < MAX_NUM_PAINTERS; j++) {
            document.getElementById("tdParallel" + j + "," + i).
                style.backgroundColor = BLANK_BG_COLOR;
        }
    }
    for (i = MaxSpace; i < MAX_WORK_SIZE; i++) {
        document.getElementById("tdSerial" + i).style.backgroundColor =
            BLANK_BG_COLOR;
        for (j = 0; j < MAX_NUM_PAINTERS; j++) {
            document.getElementById("tdParallel" + j + "," + i).
                style.backgroundColor = BLANK_BG_COLOR;
        }
    }

    // Display houses for the serial painter
    taskSize = Math.min(MaxTime, MaxSpace);
    taskSize = Math.min(taskSize, WorkSize);
    for (i = 0; i < taskSize; i++) {
        document.getElementById("iSerial" + i).style.visibility = "";
    }
    for (i = taskSize; i < MAX_WORK_SIZE; i++) {
        document.getElementById("iSerial" + i).style.visibility = "hidden";
    }
    var serialTaskSize = taskSize;

    // Display houses for the parallel painters
    var parallelTaskSize = 0;
    for (i = 0; i < NumPainters; i++) {
        document.getElementById("tdParallelHeader" + i).innerHTML =
            "Parallel Painter " + i + ":";
        taskSize = Math.floor(WorkSize / NumPainters);
        taskSizeLimit = Math.min(MaxTime, MaxSpace);
        if (taskSize >= taskSizeLimit) {
            taskSize = taskSizeLimit;
        } else if (i < WorkSize % NumPainters) {
            taskSize++;
        }
        if (taskSize > parallelTaskSize) {
            parallelTaskSize = taskSize;
        }
        for (j = 0; j < taskSize; j++) {
            document.getElementById("iParallel" + i + "," + j).
                style.visibility = "";
        }
        for (j = taskSize; j < MAX_WORK_SIZE; j++) {
            document.getElementById("iParallel" + i + "," + j).
                style.visibility = "hidden";
        }
    }
    for (i = NumPainters; i < MAX_NUM_PAINTERS; i++) {
        document.getElementById("tdParallelHeader" + i).innerHTML = "";
        for (j = 0; j < MAX_WORK_SIZE; j++) {
            document.getElementById("iParallel" + i + "," + j).
                style.visibility = "hidden";
        }
    }
    document.getElementById("speedup").innerHTML =
        serialTaskSize / parallelTaskSize;
}

onload = function () {
    initDOM();
    fillSelects();
    setUpTable();
    update();
};
