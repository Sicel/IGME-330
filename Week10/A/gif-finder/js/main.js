import {
    GiphyResult
} from "./classes.js";

let limit;
let term;
let url;
let displayTerm;
let offset = 0;

const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";
const GIPHY_KEY = "dc6zaTOxFJmzC";

// 1
export function init() {
    term = document.querySelector("#searchterm").value;
    limit = document.querySelector("#limit").value;
    document.querySelector("#next").disabled = true;

    document.querySelector("#limit").onchange = e => {
        limit = e.target.value;
        console.log(limit);
    };

    document.querySelector("#searchterm").onchange = e => {
        term = e.target.value;
    };

    document.querySelector("#search").onclick = _ => {
        getLink();
        getData();
        offset = 0;
        document.querySelector("#next").disabled = false;
    };

    document.querySelector("#next").onclick = _ => {
        offset += parseInt(limit);
        console.log(offset);
        getLink();
        getData();
    }
};

// 3
function getData() {
    //console.log("getData() called");
    //console.log(jQuery);
    //console.log($);

    $.ajax({
        dataType: "json",
        url: url,
        data: null,
        success: jsonLoaded
    });

    $("#content").fadeOut(100);
}

function jsonLoaded(obj) {
    console.log("obj = " + obj.data);
    //console.log("obj stringified = " + JSON.stringify(obj));

    if (!obj.data || obj.data.length == 0) {
        document.querySelector("#content").innerHTML = `<p><i>No results found for '${displayTerm}'</i></p>`;
        $("#content").fadeIn(500);
        return;
    }

    let results = obj.data;
    console.log("results.length = " + results.length);
    let bigString = "<p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";

    for (let i = 0; i < results.length; i++) {
        let result = results[i];
        let gr = new GiphyResult(result);

        bigString += gr.line;
    }

    document.querySelector("#content").innerHTML = bigString;

    $("#content").fadeIn(500);
}

function getLink() {
    url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    displayTerm = term;
    term = term.trim();
    term = encodeURIComponent(term);

    // Returns error "Illegal Return Statement" if this if statement is not in a function
    function check() {
        if (term.length < 1)
            return;
    }
    check();

    url += "&q=" + term;
    url += "&limit=" + limit;
    url += "&offset=" + offset;

    document.querySelector("#content").innerHTML = "<b>Searching for " + displayTerm + "</b>";


    console.log(url);
}
