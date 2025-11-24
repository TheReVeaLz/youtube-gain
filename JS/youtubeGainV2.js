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

if (!(!!document.getElementById('gainInput'))) {
    var video = document.querySelector('video');
    var vidTitle = document.querySelector('.ytd-watch-metadata');
    var gainVal = document.createElement('input');
    gainVal.id = "gainInput";
    gainVal.style = "width:25%;height:18px;font-size:18px;border-radius: 15px;padding:0px 8px;";
    gainVal.type = "text";
    gainVal.placeholder = "Gain Volume";
    gainVal.value = "1";
    gainVal.classList.add('yt-spec-button-shape-next--tonal', 'yt-spec-button-shape-next--mono');
    gainVal.onclick = function() {
        this.select()
    };

    function limitCheck(i) {
        if (i > 5) {
            return 5;
        } else if (i < 1) {
            return 1;
        }
        return i;
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
    vidTitle.insertBefore(gainVal, vidTitle.children[0]);
}
