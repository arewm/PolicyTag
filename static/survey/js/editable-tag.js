var lastTag = null;
var customCount = 0;

// save off last tag, get input entered, create a new tag before last tag with this input, create standard name/id

function divClicked() {
    lastTag = $(this);
    var editableText = $("<textarea />");
    editableText.val("");
    $(this).replaceWith(editableText);
    editableText.focus();
    // setup the blur event for this new textarea
    editableText.blur(editableTextBlurred);
}

function editableTextBlurred() {
    var html = $(this).val();
    var viewableText = lastTag.clone();
    // setup the click event for this new div
    lastTag.click(divClicked);
    if (html !== "") {
        var newId = viewableText.attr("id") + "-" + customCount++;
        viewableText.html(html);
        viewableText.removeClass("write-in-me");
        viewableText.addClass("move-me");
        viewableText.attr("id", newId);
        console.log(viewableText);
        console.log(lastTag);
        console.log($(this).parent());
        $(this).replaceWith(viewableText);
        var nextLI = $(this).parent().clone();
        console.log(nextLI);
        nextLI.empty();
        nextLI.append(lastTag);
        console.log(nextLI);
        $(this).parent().parent().append(nextLI);
    } else {
        $(this).replaceWith(lastTag);
    }
    lastTag = null;
}

$(document).ready(function() {
    $(".write-in-me").click(divClicked);
});