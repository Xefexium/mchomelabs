//// https://github.com/nailujx86/mcmotdparser

const classes = {
    "bold": "mc_bold",
    "italic": "mc_italic",
    "underlined": "mc_underlined",
    "strikethrough": "mc_strikethrough",
    "obfuscated": "mc_obfuscated"
};
const colors = {
    '§0': 'black',
    '§1': 'dark_blue',
    '§2': 'dark_green',
    '§3': 'dark_aqua',
    '§4': 'dark_red',
    '§5': 'dark_purple',
    '§6': 'gold',
    '§7': 'gray',
    '§8': 'dark_gray',
    '§9': 'blue',
    '§a': 'green',
    '§b': 'aqua',
    '§c': 'red',
    '§d': 'light_purple',
    '§e': 'yellow',
    '§f': 'white',
};
const extras = {
    '§k': 'obfuscated',
    '§l': 'bold',
    '§m': 'strikethrough',
    '§n': 'underline',
    '§o': 'italic'
};

function parseJsonToHTML(jsonPart) {
    let toParse = Array.isArray(jsonPart) ? jsonPart : [jsonPart];
    let output
    toParse.forEach(parsePart => {
        let classlist = "";
        let styleList = "";
        let text = "";
        for (var key of Object.keys(parsePart)) {
            if (key === "text") {
                text += parsePart.text;
                continue;
            }
            if (classes.hasOwnProperty(key)) {
                classlist += " " + classes[key];
                continue;
            }
            if (key === "color") {
                if (jsonPart[key].startsWith('#')) {
                    styleList += "color: " + parsePart[key];
                } else {
                    classlist += " mc_" + parsePart[key];
                }
                continue;
            }
            if (key === "extra") {
                for (var jsonPartExtra of parsePart.extra) {
                    text += parseJsonToHTML(jsonPartExtra);
                }
            }
        }
        output = {class: classlist.trim(), style: styleList.trim, text: text}
    })
    return output;
}

function jsonToHtml(json, callback) {
    const promise = new Promise((resolve, _reject) => {
        json = JSON.parse(JSON.stringify(json).split('\\n').join("<br>"));
        let output = parseJsonToHTML(json);
        output = {class: 'mc', text: output}
        resolve(output)
    })

    if (callback && typeof callback === 'function') {
        promise.then(callback.bind(null, null), callback);
    }
    return promise;
}

function textToJson(text, callback) {
    const promise = new Promise((resolve, _reject) => {
        let jsonObj = { text: "", extra: [] };
        let curObj = jsonObj;
        let arr = text.split("");
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] !== '§') {
                curObj.text += arr[i];
            } else if (arr[i + 1] === 'r') {
                let innerObj = { text: "", extra: [] };
                jsonObj.extra.push(innerObj);
                curObj = innerObj;
                i++;
            } else {
                let codeStr = '§' + arr[i + 1];
                let innerObj = { text: "", extra: [] };
                if (colors.hasOwnProperty(codeStr)) {
                    innerObj.color = colors[codeStr];
                }
                if (extras.hasOwnProperty(codeStr)) {
                    innerObj[extras[codeStr]] = true;
                }
                curObj.extra.push(innerObj);
                curObj = innerObj;
                i++;
            }
        }
        resolve(jsonObj);
    })
    
    if (callback && typeof callback === 'function') {
        promise.then(callback.bind(null, null), callback);
    }
    return promise;
}

export function toHtml(motd, callback) {
    const promise = new Promise((resolve, reject) => {
        if (typeof motd === 'object') {
            return jsonToHtml(motd)
                .then(resolve)
                .catch(reject)
        } else if (typeof motd === 'string') {
            return textToJson(motd)
                .then(jsonToHtml)
                .then(resolve)
                .catch(reject)
        }
    })

    if (callback && typeof callback === 'function') {
        promise.then(callback.bind(null, null), callback);
    }
    return promise;
}