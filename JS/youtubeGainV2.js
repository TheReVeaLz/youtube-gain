function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

async function InitGain() {
    await waitForElm('.ytd-watch-metadata');
    var video = document.querySelector('video');
    try {
        var audioCtx = new AudioContext();
        var source = audioCtx.createMediaElementSource(video);
        var gainNode = audioCtx.createGain();
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        gainState = 0;
    } catch {
        executionState = 0;
    }

    if (!document.getElementById('gainInput')) {
        var video = document.querySelector('video');
        var vidTitle = document.querySelector('.ytd-watch-metadata');
        var gainVal = document.createElement('input');
        gainVal.id = "gainInput";
        gainVal.style.cssText = "width:25%;height:18px;font-size:18px;border-radius: 15px;padding:0px 8px;";
        gainVal.type = "text";
        gainVal.placeholder = "Gain Volume";
        gainVal.value = "1";
        gainVal.classList.add('ytSpecButtonShapeNextTonal', 'ytSpecButtonShapeNextMono');
        gainVal.onclick = function() {
            this.select()
        };

        function limitCheck(i) {
            return Math.min(5, Math.max(1, i));
        }

        gainVal.onmousewheel = function(e) {
            e.preventDefault();
            if (e.deltaY < 0) {
                this.value++;
            } else {
                this.value--;
            }
            this.value = limitCheck(this.value);
            gainNode.gain.value = gainVal.value;
        }

        gainVal.onchange = function() {
            this.blur();
            gainVal.value = limitCheck(this.value);
            gainNode.gain.value = gainVal.value;
        }

        gainVal.onkeydown = function(e) {
            switch(e.key) {
                case "ArrowUp":
                    e.preventDefault();
                    this.value++;
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    this.value--;
                    break;
            }

            this.value = limitCheck(this.value);
            gainNode.gain.value = gainVal.value;
        }

        vidTitle.insertBefore(gainVal, vidTitle.children[0]);
    }
}
InitGain();