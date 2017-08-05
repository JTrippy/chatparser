"use strict";

var textfile = null;

function downloadfile(file) {
    $("#downloadA").prop({'href':'data:text/plain;charset=utf-8,' + encodeURIComponent(file),'download':'chat.log'});
}

function parse(text, GTAMPParse, filter, selector, sub){
    var lines = text.split('\n');
    var filterWords;
    var selectorWords;
    var subWords;
    var parsedText = '';
    if (filter !== '') {
        filterWords = filter.split(',');
    }
    if (selector !== '') {
        selectorWords = selector.split(',');
    }
    if (sub !== '') {
        subWords = sub.split(';');
    }

    if ($("#output").val() !== '') {
        $("#output").val('');
    }
    for(var i = lines.length-1; i>=0; i--) {
        var filtered = false;
        if (filterWords !== undefined) {
            for (var j = 0; j < filterWords.length; j++) {
                if (lines[i].search(new RegExp(filterWords[j])) !== -1) {
                    lines.splice(i, 1);
                    filtered = true;
                    break;
                }
            }
        }
        if (!filtered && GTAMPParse.is(":checked")) {
            if (lines[i].search(/\[ClassicChat]/) !== -1) {
                lines[i] = lines[i].slice(37);
                if (lines[i].search('~') !== -1) {
                    if (lines[i].slice(0, 2).search('~#') !== -1) {
                        lines[i] = lines[i].slice(11)
                    }
                    else {
                        lines[i] = lines[i].replace(/~[A-Za-z]~/g, '')
                    }
                }
            }
            else {
                lines.splice(i, 1);
                filtered = true;
            }
        }
        if (!filtered && selectorWords !== undefined) {
            var findFlag = false;
            for (var k = 0; k < selectorWords.length; k++) {
                if(lines[i].search(new RegExp(selectorWords[k])) !== -1){
                    findFlag = true;
                    break;
                }
            }
            if (!findFlag) {
                lines.splice(i,1);
                filtered = true;
            }
        }
        if (!filtered && subWords !== undefined) {
            for (var n = 0; n < subWords.length; n++) {
                lines[i] = lines[i].replace(new RegExp(subWords[n].split(',')[0], 'g') , subWords[n].split(',')[1])
            }
        }
    }
    for (var l = 0; l < lines.length; l++) {
        parsedText += lines[l] + '\n';
    }
    $("#output").val(parsedText);
    textfile = parsedText;
    if (!$.trim($("#download").html())) {
        $("#download").append('<a id="downloadA"><img id="downloadFile" style="cursor:pointer;margin:0 auto;display:block;" src="multimedia/download.png"></a>');
        $("#download").append('<p style="font-family:'+"'Raleway', sans-serif;"+'color:white;font-size:20px;margin:2% 0 0 15%;"'+'>Download the log file</p>');
        $("#downloadFile").click(function(){
            $("#downloadA").click();
        });
    }
    downloadfile(textfile);
}

function main(){
    $("#title-container").offset({left:String($("#logo").offset().left + $("#logo").width()/4)});
    $(window).resize(function(){
        $("#title-container").offset({left:String($("#logo").offset().left + $("#logo").width()/4)});
    });
    $("#button").click(function(){
        if($("#input").val() !== ''){
            parse($("#input").val(), $("#gtamp"), $("#filter-words").val(), $("#exclusive-words").val(), $("#sub-words").val());
        }
    });
}


$(document).ready(function(){main()});