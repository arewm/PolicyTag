setupFunction = null;
var start_valid = false;
var msnry = new Masonry('.grid', {
    itemSelector: '.grid-item',
    columnWidth: 20
});

(function (interact) {

    'use strict';

    var transformProp;

    interact.maxInteractions(Infinity);

    // setup draggable elements.
    interact('.js-drag')
        .draggable({max: Infinity})
        .on('dragstart', function (event) {
            start_valid = event.target.style.left[0] === "-";
            event.interaction.x = parseInt(window.getComputedStyle(event.target).left.slice(0, -2), 10);
            event.interaction.y = parseInt(window.getComputedStyle(event.target).top.slice(0, -2), 10);
            //event.interaction.x = parseInt(event.target.getAttribute('data-x'), 10) || 1000;
            //event.interaction.y = parseInt(event.target.getAttribute('data-y'), 10) || 10;
            document.getElementById('saver_form_tag').setAttribute('value', event.target.getAttribute('id'));
            if (!start_valid) {
                //event.target.setAttribute('old-left', event.target.style.left);
                //event.target.setAttribute('old-top', event.target.style.top);
                //event.target.classList.add('grid-item')
            }
        })
        .on('dragmove', function (event) {
            event.interaction.x += event.dx;
            event.interaction.y += event.dy;

            if (transformProp) {
                event.target.style[transformProp] =
                    'translate(' + event.interaction.x + 'px, ' + event.interaction.y + 'px)';
            }
            else {
                event.target.style.left = event.interaction.x + 'px';
                event.target.style.top = event.interaction.y + 'px';
            }
        })
        .on('dragend', function (event) {
            //event.target.setAttribute('data-x', event.interaction.x);
            //event.target.setAttribute('data-y', event.interaction.y);
            if (event.target.getAttribute('valid') === 'false') {
                //event.target.style.left = event.target.getAttribute('old-left');
                //event.target.style.top = event.target.getAttribute('old-top');
                if (start_valid) {
                    num_policies++;
                    event.target.classList.add('grid-item');
                    msnry.appended(event.target);
                    msnry.reloadItems()
                } else {

                }
            } else {
                if (start_valid) {
                } else {
                    num_policies--;
                    event.target.classList.remove('grid-item');
                    msnry.reloadItems();
                    msnry.layout();
                }
            }
            console.log(num_policies);
            document.getElementById('next_button').disabled = num_policies !== 0;
            event.target.removeAttribute('valid');
            var frm = $('#rank_saver');
            $.ajax({
                type: frm.attr('method'),
                url: frm.attr('action'),
                data: frm.serialize(),
                success: function (data) {
                    document.getElementById('saver_form_tag').setAttribute('value', '');
                    document.getElementById('saver_form_rank').setAttribute('value', '-1');
                },
                error: function (data) {
                    alert("Something went wrong!" + data);
                }
            });
            return false;
        });


    /**
     * Setup a given element as a dropzone.
     *
     * @param {HTMLElement|String} el
     * @param {String} accept
     */
    function setupDropzone(el, accept) {
        interact(el)
            .dropzone({
                accept: accept,
                ondropactivate: function (event) {
                    addClass(event.relatedTarget, '-drop-possible');
                    event.relatedTarget.setAttribute('valid', 'false');
                },
                ondropdeactivate: function (event) {
                    removeClass(event.relatedTarget, '-drop-possible');
                }
            })
            .on('dropactivate', function (event) {
                var active = event.target.getAttribute('active') | 0;

                // change style if it was previously not active
                if (active === 0) {
                    addClass(event.target, '-drop-possible');
                    //event.target.textContent = 'Drop me here!';
                }

                event.target.setAttribute('active', active + 1);
            })
            .on('dropdeactivate', function (event) {
                var active = event.target.getAttribute('active') | 0;

                // change style if it was previously active
                // but will no longer be active
                if (active === 1) {
                    removeClass(event.target, '-drop-possible');
                    //event.target.textContent = 'Dropzone';
                }

                event.target.setAttribute('active', active - 1);
            })
            .on('dragenter', function (event) {
                addClass(event.target, '-drop-over');
                event.relatedTarget.setAttribute('valid', 'true');
                document.getElementById('saver_form_rank').setAttribute('value', event.target.getAttribute('id').slice(8));
                //event.relatedTarget.textContent = 'I\'m in';
            })
            .on('dragleave', function (event) {
                removeClass(event.target, '-drop-over');
                event.relatedTarget.setAttribute('valid', 'false');
                document.getElementById('saver_form_rank').setAttribute('value', '-1');
                //event.relatedTarget.textContent = 'Drag me…';
            })
            .on('drop', function (event) {
                removeClass(event.target, '-drop-over');
                if (event.relatedTarget.getAttribute('valid') === false) {

                }
                //event.relatedTarget.textContent = 'Dropped';
            });
    }

    function addClass(element, className) {
        if (element.classList) {
            return element.classList.add(className);
        }
        else {
            element.className += ' ' + className;
        }
    }

    function removeClass(element, className) {
        if (element.classList) {
            return element.classList.remove(className);
        }
        else {
            element.className = element.className.replace(new RegExp(className + ' *', 'g'), '');
        }
    }

    interact(document).on('ready', function () {
        transformProp = 'transform' in document.body.style
            ? 'transform' : 'webkitTransform' in document.body.style
                ? 'webkitTransform' : 'mozTransform' in document.body.style
                    ? 'mozTransform' : 'oTransform' in document.body.style
                        ? 'oTransform' : 'msTransform' in document.body.style
                            ? 'msTransform' : null;
    });

    setupFunction = setupDropzone;

}(window.interact));