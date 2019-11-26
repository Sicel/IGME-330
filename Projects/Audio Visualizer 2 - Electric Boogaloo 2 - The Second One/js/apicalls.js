function getData() {
    // YOUTUBE
    $.ajax({
        dataType: "json",
        url: `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${term}&type=video&maxResults=10&key=AIzaSyBCPZ85si77Z6EjGzx2jTljvneFX760l8Q`,
        success: youtubeLoaded
    });
}

function youtubeLoaded(obj) {
    if (!obj.items || obj.items.length == 0) {
        document.querySelector("#youtube").innerHTML = `<p class='result'><i>No results found for '${displayTerm}'</i></p>`;
        $("#youtube").fadeIn(500);
        return;
    }

    let results = obj.items;
    document.querySelector("#youtube").innerHTML = `<p class='result'><i>Here are ${results.length} ${displayTerm} videos</i></p>`;
    let bigString = "<div id='videos'>";

    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        let title = result.id.videoId;

        let videourl = `https://www.youtube.com/watch?v=${title}`;

        result = result.snippet;

        let thumbnail = result.thumbnails.default.url;

        let channel = `https://www.youtube.com/channel/${result.channelId}`;

        //debugger;
        let line = `<div class='youtuberesult'><title='${title}'/><a class='overlay' target='_blank' href=${videourl}></a><img class='youtubeimgs' src='${thumbnail}'><p><span class='youtubetitle'>${result.title}</span>`;
        line += `<br><a class='inner' target='_blank' href='${channel}'><span class='youtubeuser'>${result.channelTitle}</span></a></p></div>`;

        bigString += line;
    }
    bigString += "</div>";
    document.querySelector("#youtube").innerHTML += bigString;
    //$("#youtube").fadeIn(500);
}
