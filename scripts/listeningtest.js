// Globals
const directory = "./resources/";
const delimOpen = "\\(\\(";
const delimClose = "\\)\\)";
const regexp = new RegExp("(.*?)(" + delimOpen + ")(.+?)(" + delimClose + ")(.*)$", "ms");
const yaRegexp = /^(\s*)(\S+)(.*)$/ms;
const jsonRegexp = /^([\d\.]+):([\d\.]+):(.*)$/ms;

var parmList = null;
var data;
var seq = 0;
var audioNo = 0;
var wsArray = [];
var downNo = 0;

function convertItems(parm) {
  var result = "";
  while (true) {
    var tmatch = parm.match(yaRegexp);
    if (tmatch == null) {
      break;
    }
    result += tmatch[1];
    seq += 1;
    var quoteEscape = tmatch[2].replaceAll("'", "\\'");
    var chkf = "onBlur=\"festival('" + quoteEscape + "', " + seq + ");\"";
    result += '<input type="text" id="t' + seq + '" autocomplete="off" size="4" value="" onFocus="this.select();"  onInput="inputChar(' + seq + ');" ' + chkf + '>';
    result += '<span id="s' + seq + '" style="display:none">';
    result += tmatch[2];
    result += '</span>';
    parm = tmatch[3];
  }
  result += parm;
  return result;
}

function process(data) {
  var result = "";
  while (true) {
    workChunk = data.match(regexp);
    if (workChunk == null) {
      break;
    }
    result += workChunk[1];
    result += convertItems(workChunk[3]);
    data = workChunk[5];
  }
  result += data;
  var sentence = document.createElement("p");
  sentence.innerHTML = result;
  document.getElementById("qArea").appendChild(sentence);
}

function festival(wrd, no) {
  var inp = document.getElementById("t" + no);
  if (inp.value == wrd) {
    inp.style = "display: none";
    document.getElementById("s" + no).style = "visibility:visible";
    downNo += 1;
    if (downNo >= seq) {
      petalStart();
    }
  } else if ((inp.value == "??????????") && (getParm("GU") == "YES")) {
    inp.style = "display: none";
    document.getElementById("s" + no).style = "visibility: visible;color: red;";
  }
}

function inputChar(currentId) {
  var elem = document.getElementById("t" + currentId);
  var val = elem.value;
  if (val == "") return;
  if (val.charAt(val.length-1) == " ") {
    elem.value = val.trim();
  } else {
    elem.size = Math.max(val.length, 1);
  }
}

function getParm(key) {
  if (parmList == null) {
    parmList = [];
    var arg = location.search.substring(1);
    if (arg != "") {
      var args = arg.split("&");
      for(i = 0; i < args.length; i++) {
        parmPair = args[i].split("=");
        parmList[parmPair[0]] = parmPair[1];
      }
    } else {
      alert("Hmmm, some parameters are missing...");
    }
  }
  if (key in parmList) {
    return parmList[key];
  } else {
    return "";
  }
}

function getData(prefix, filename) {
  var dpath = prefix + filename + ".json";
  var req = new XMLHttpRequest();
  req.open("GET", dpath);
  req.responseType = "json";
  req.send();
  return req;
}



function addPlayer(pname) {
  var aArea = document.getElementById("audioArea");
  var div = document.createElement("div");
  audioNo += 1;
  div.id = "wf" + audioNo;
  div.size = "1px";
  aArea.appendChild(div);
  var ws = WaveSurfer.create({container: "#wf" + audioNo, backend: "MediaElement"});
  ws.load(directory + pname);
  ws.setHeight(0);
  ws.on("ready", function () {});
  ws.on("play", function () {
    document.getElementById("speedController").disabled = true;
//    disableAllPlayButton(true);
  });
  ws.on("finish", function () {
    document.getElementById("speedController").disabled = false;
//    disableAllPlayButton(false);
  });
  ws.on("pause", function () {
    document.getElementById("speedController").disabled = false;
//    disableAllPlayButton(false);
  });
  wsArray.push(ws);
}

function addQButton(audioId, start, end) {
  var bField = document.getElementById("qArea");
  var button = document.createElement("input");
  button.type = "button";
  button.className = "playButton";
  button.value = "Play";
  button.onclick = function () {
    partialPlay(audioId, start, end);
  };
  bField.appendChild(document.createElement("hr"));
  bField.appendChild(button);
}

function disableAllPlayButton(boolValue) {
  for(i of document.getElementsByClassName("playButton")) {
    i.disabled = boolValue;
  }
}

async function partialPlay(audioId, start, stop) {
  var player = wsArray[audioId - 1];
  player.setPlaybackRate(Number(document.getElementById("speedController").value));
  player.play(start, stop);
}


function processJSON(data) {
  for (i = 0; i < data.length; i++) {
    var rec = data[i];
    addPlayer(rec["audioResource"]);
    var chunks = rec["chunks"];
    for (j = 0; j < chunks.length; j++) {
      var entry = orNotToBe(chunks[j]);
      var mt = entry.match(jsonRegexp);
      addQButton(audioNo, Number(mt[1]), Number(mt[2]));
      process(mt[3]);
    }
  }
}

function orNotToBe(ec) {
  binary = atob(ec)
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint16Array(bytes.buffer));
}


function main() {
  if (getParm("SC") == "YES") {
    document.getElementById("speedController").style = "visibility: visible";
  } else {
    document.getElementById("speedController").style = "display: none";  // to prevent html tampering.
  }
  var req = getData(directory, getParm("Q"));
  req.onload = function () {
    try {
      data = req.response;
      processJSON(data);
    } catch (e) {
      alert("Error reading JSON file:" + e);
    }
  }
}
