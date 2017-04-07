
function hasClass(element, cls) {
    return (' ' + element.attr('class') + ' ').indexOf(' ' + cls + ' ') > -1;
}
$(document).ready(function () {
    $('.move-me').draggable({
        helper: "clone",
        revert: "invalid",
        appendTo: "body"
    }).click(function () {
        //var b = parseInt($(this).width());
        //$(this).css('width', b + 5);
    });
    $('.moved-me').draggable({

    });
    $('#workspace').droppable({
        accept: function(d) {
            if(d.hasClass("move-me")||(d.hasClass("moved-me"))||d.hasClass("removable")) {
                return true;
            }
        },
        drop: function (e, u) {
            src = u.draggable;
            var testId = "#drag-" + src.attr("id");
            if ($(testId).length){

            }
            else if (hasClass(src, 'move-me')) {
                var a = u.helper.clone().attr("id", "drag-" + src.attr("id"));
                a.removeClass('move-me');
                a.addClass('moved-me');
                console.log("INFO: Accepted: ", a.attr("class"));
                a.css("z-index", 1000);
                a.appendTo("#workspace");
                var formId = "pol-" + src.attr("id");
                var input = document.createElement("input");
                input.setAttribute("type", "hidden");
                input.setAttribute("name", "tag");
                input.setAttribute("id", formId);
                input.setAttribute("value", src.attr("id"));
                document.getElementById('policy_specification').appendChild(input);
                a.on("remove", function() {
                    var removeId = "#" + formId
                    $(removeId).remove();
                });
                a.draggable({
                    containment: "#workspace"
                });
            } else if (hasClass(src, 'moved-me')) {
                src.removeClass('moved-me');
                src.addClass('removable');
            }

        }

    });
    $('#trash').droppable({
        accept: '.removable',
        drop: function(event, ui) {
            ui.draggable.remove();
        }

    });
    $(document).click(function () {
        if ($(".dropped").length) {
            // Disabled Resize on all elements when #drop
            $(".ui-resizable").resizable("destroy");
        }
    });
});/**
 * Created by am on 4/7/17.
 */
