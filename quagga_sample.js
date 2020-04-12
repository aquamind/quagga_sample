$(function () {
    let App = {
        init: function () {
            let self = this;
            Quagga.init(self.state, function (err) {
                if (err) {
                    return self.handleError(err);
                }
                Quagga.start();
                Quagga.onDetected(function (result) {
                    let code = result.codeResult.code;
                    if (App.degitCheck(code)) {
                        Quagga.stop();
                        alert(code);
                    }
                });
            });
        },
        state: {
            inputStream: {
                name: "Live",
                type: "LiveStream",
                constraints: {
                    width: $("#interactive").width(),
                    height: $("#interactive").height(),
                    facingMode: "environment",
                },
            },
            locator: {
                patchSize: "x-small",
                halfSample: false,
            },
            numOfWorkers: 2,
            frequency: 10,
            decoder: {
                readers: [
                    {
                        format: "ean_reader",
                        config: {},
                    },
                ],
            },
            // 画像内のバーコードの位置を指定できる場合はfalse
            locate: false,
        },
        handleError: function (err) {
            console.log(err);
        },
        degitCheck: function (code) {
            let checkCode = code;
            switch (code.length) {
                case 8:
                    checkCode = "00000" + code;
                    break;
                case 13:
                    break;
                default:
                    return false;
            }
            let a = 0;
            let b = 0;
            let checkDedit = Number(checkCode[12]);
            for (let i = 0; i < 12; i++) {
                let number = Number(checkCode[11 - i]);
                if (i % 2 === 0) {
                    a += number;
                } else {
                    b += number;
                }
            }
            return (10 - ((a * 3 + b) % 10)) % 10 === checkDedit;
        },
    };

    App.init();
});
