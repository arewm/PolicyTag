/**
 * Created by am on 4/7/17.
 */
function divClicked() {
    var divHtml = $(this).html();
    var editableText = $("<textarea />");
    editableText.val(divHtml);
    $(this).replaceWith(editableText);
    editableText.focus();
    // setup the blur event for this new textarea
    editableText.blur(editableTextBlurred);
}

function editableTextBlurred() {
    var html = $(this).val();
    var viewableText = $("<div>");
    viewableText.html(html);
    $(this).replaceWith(viewableText);
    // setup the click event for this new div
    viewableText.click(divClicked);
}

$(document).ready(function() {
    $("div").click(divClicked);
});