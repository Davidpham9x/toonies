// QRCODE reader Copyright 2011 Lazar Laszlo
// http://www.webqr.com

var gCtx = null;
var gCanvas = null;
var c = 0;
var stype = 0;
var gUM = false;
var webkit = false;
var moz = false;
var v = null;

var imghtml = '<div id="qrfile"><canvas id="out-canvas" width="320" height="240"></canvas>' +
    '<div id="imghelp">drag and drop a QRCode here' +
    '<br>or select a file' +
    '<input type="file" onchange="handleFiles(this.files)"/>' +
    '</div>' +
    '</div>';

/*var vidhtml = '<video id="v" autoplay></video>';*/

function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
}

function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
}

function drop(e) {
    e.stopPropagation();
    e.preventDefault();

    var dt = e.dataTransfer;
    var files = dt.files;
    if (files.length > 0) {
        handleFiles(files);
    } else
    if (dt.getData('URL')) {
        qrcode.decode(dt.getData('URL'));
    }
}

function handleFiles(f) {
    var o = [];

    for (var i = 0; i < f.length; i++) {
        var reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(e) {
                gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);

                qrcode.decode(e.target.result);
            };
        })(f[i]);
        reader.readAsDataURL(f[i]);
    }
}

function initCanvas(w, h) {
    gCanvas = document.getElementById("qr-canvas");
    gCanvas.style.width = w + "px";
    gCanvas.style.height = h + "px";
    gCanvas.width = w;
    gCanvas.height = h;
    gCtx = gCanvas.getContext("2d");
    gCtx.clearRect(0, 0, w, h);
}


function captureToCanvas() {
    if (stype != 1)
        return;
    if (gUM) {
        try {
            gCtx.drawImage(v, 0, 0);
            try {
                qrcode.decode();
            } catch (e) {
                setTimeout(captureToCanvas, 500);
            };
        } catch (e) {
            setTimeout(captureToCanvas, 500);
        };
    }
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function read(a) {
    if (a.indexOf("http://") === 0 || a.indexOf("https://") === 0) {
        toonies.Global.countScan = toonies.Global.countScan + 1;

        clearInterval(toonies.Global.timeOut);
        clearInterval(toonies.Global.timeInterval);
        $.event.trigger({
            type: "scan_result",
            dataScan: a,
            resultScan: true,
            countScan: toonies.Global.countScan,
            time: new Date()
        });
    }
}

function isCanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

function success(stream) {
    if (webkit)
        v.src = window.URL.createObjectURL(stream);
    else
    if (moz) {
        v.mozSrcObject = stream;
        v.play();
    } else
        v.src = stream;
    gUM = true;
    setTimeout(captureToCanvas, 500);
}

function error(error) {
    gUM = false;
    return;
}

function load() {
    if (typeof navigator.getUserMedia == 'undefined' && typeof navigator.webkitGetUserMedia == 'undefined' && typeof navigator.mozGetUserMedia == 'undefined') {
        toonies.Global.initModalUpgrade();
        return false;
    }

    if (isCanvasSupported() && window.File && window.FileReader) {
        initCanvas(800, 600);
        qrcode.callback = read;
        document.getElementById("mainbody").style.display = "inline";
        setwebcam();
    } else {
        document.getElementById("mainbody").style.display = "inline";
        document.getElementById("mainbody").innerHTML = '<p id="mp1">QR code scanner for HTML5 capable browsers</p><br>' +
            '<br><p id="mp2">sorry your browser is not supported</p><br><br>' +
            '<p id="mp1">try <a href="http://www.mozilla.com/firefox"><img src="firefox.png"/></a> or <a href="http://chrome.google.com"><img src="chrome_logo.gif"/></a> or <a href="http://www.opera.com"><img src="Opera-logo.png"/></a></p>';
    }
}

function setwebcam() {
    var options = { video: true };
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        try {
            navigator.mediaDevices.enumerateDevices()
                .then(function(devices) {
                    var device = devices.filter(function(device) {
                        var deviceLabel = device.label.split(',')[1];
                        if (device.kind == "videoinput") {
                            return device;
                        }
                    });

                    if (device.length > 1) {
                        var constraints = {
                            video: {
                                mandatory: {
                                    sourceId: device[1].deviceId ? device[1].deviceId : null
                                }
                            },
                            audio: false
                        };

                        setwebcam2(constraints);
                    } else if (device.length) {
                        var constraints = {
                            video: {
                                mandatory: {
                                    sourceId: device[0].deviceId ? device[0].deviceId : null
                                }
                            },
                            audio: false
                        };

                        setwebcam2(constraints);
                    } else {
                        setwebcam2({ video: true });
                    }
                });
        } catch (e) {}
    } else {
        setwebcam2(options);
    }
}

function setwebcam2(options) {
    /*options = { 'deviceId': { 'exact': device.deviceId }, 'facingMode': 'environment' };*/
    document.getElementById("result").innerHTML = "Đang quét";
    if (stype == 1) {
        setTimeout(captureToCanvas, 500);
        return;
    }
    var n = navigator;
    /*document.getElementById("outdiv").innerHTML = vidhtml;*/
    v = document.getElementById("video");


    if (n.getUserMedia) {
        webkit = true;
        n.getUserMedia(options, success, error);
    } else
    if (n.webkitGetUserMedia) {
        webkit = true;
        n.webkitGetUserMedia(options, success, error);
    } else
    if (n.mozGetUserMedia) {
        moz = true;
        n.mozGetUserMedia(options, success, error);
    }

    document.getElementById("qrimg").style.opacity = 0.2;
    document.getElementById("webcamimg").style.opacity = 1.0;

    stype = 1;
    setTimeout(captureToCanvas, 500);
}

function setimg() {
    document.getElementById("result").innerHTML = "";
    if (stype == 2)
        return;
    document.getElementById("outdiv").innerHTML = imghtml;
    //document.getElementById("qrimg").src="qrimg.png";
    //document.getElementById("webcamimg").src="webcam2.png";
    document.getElementById("qrimg").style.opacity = 1.0;
    document.getElementById("webcamimg").style.opacity = 0.2;
    var qrfile = document.getElementById("qrfile");
    qrfile.addEventListener("dragenter", dragenter, false);
    qrfile.addEventListener("dragover", dragover, false);
    qrfile.addEventListener("drop", drop, false);
    stype = 2;
}
