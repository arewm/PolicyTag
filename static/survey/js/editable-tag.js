var lastTag = null;

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
    var viewableText = lastTag;
    if (html !== "") {
        viewableText.html(html);
        viewableText.removeClass("write-in-me");
        viewableText.addClass("move-me");
        $(this).replaceWith(viewableText);
        // setup the click event for this new div
        viewableText.click(divClicked);
    }
    $(this).parentElement().append(lastTag)
    lastTag = null;
}

$(document).ready(function() {
    $(".write-in-me").click(divClicked);
});