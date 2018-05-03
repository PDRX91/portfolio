$(document).ready(function() {
    $.fn.idle = function(time) {
        var o = $(this);
        o.queue(function() {
            setTimeout(function() {
                o.dequeue();
            }, time);
        });
        return this; //set idle function
    }

    $('.error').hide(); //Hide error messages 
    $('#MainResult').hide(); //we will hide this right now
    $('#form-wrapper').show(); //show main form
    $(".contact-btn").click(function() { //User clicks on Submit button
        
        // Fetch data from input fields.
        var js_name = $("#name").val();
        var js_email = $("#email").val();
        var js_phone = $("#phone").val();
        var js_message = $("#message").val();

        // Do a simple validation
        if (js_name == "") {
            $("#nameLb .error").fadeIn('slow').idle(1000).fadeOut('slow'); // If Field is empty, we'll just show error text inside <span> tag for 1 sec idle and then hide it with fade out.
            return false;
        }

        var hasError = false;
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;


        if (js_email == '') {
            $("#emailLb .error1").fadeIn('slow').idle(1000).fadeOut('slow');
            return false;
        }

        if (!emailReg.test(js_email)) {
            $("#emailLb .error2").fadeIn('slow').idle(1000).fadeOut('slow');
            return false;
        }

        // if (js_phone == "") {
        //     $("#phoneLb .error").fadeIn('slow').idle(1000).fadeOut('slow');
        //     return false;
        // }
        if (js_message == "") {
            $("#messageLb .error").fadeIn('slow').idle(1000).fadeOut('slow');
            return false;
        }

        //let's put all data together
        var myData = 'postName=' + js_name + '&postEmail=' + js_email + '&postPhone=' + js_phone + '&postMessage=' + js_message;
        var spinner = $('<div>',{
            class:'loader'
        });
        $(event.target).prepend(spinner);
        jQuery.ajax({
            type: "POST",
            url: "php_mailer/mail_handler.php",
            dataType: "html",
            data: myData,
            success: function(response) {
                $("#MainResult").html('<fieldset class="response">' + response + '</fieldset>').css('text-align','center');
                $("#MainResult").slideDown("slow"); //show Result 
                $("#MainContent").hide(); //hide form div slowly
                $(spinner).remove();
            },
            error: function(xhr, ajaxOptions, thrownError) {
                $("#ErrResults").html(thrownError);
                $(spinner).remove();
                $("#MyContactForm > .text-center").text('Sorry, there was an issue with the server, please try again later.').css('color', 'white');
                $(".contact-btn").remove();
            }
        });
        return false;
    });



    $('.newslettererror').hide(); //Hide error messages 
    $('#NewsletterResult').hide(); //we will hide this right now
    $('#newsletter-form-wrapper').show(); //show main form
    $(".newsletter-btn").click(function() { //User clicks on Submit button

        // Fetch data from input fields.
        var js_email = $("#newsletteremail").val();

        var hasError = false;
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;


        if (js_email == '') {
            $("#newsletteremailLb .error1").fadeIn('slow').idle(1000).fadeOut('slow');
            return false;
        }

        if (!emailReg.test(js_email)) {
            $("#newsletteremailLb .error2").fadeIn('slow').idle(1000).fadeOut('slow');
            return false;
        }

        //let's put all data together
        var myData = '&postEmail=' + js_email;

        jQuery.ajax({
            type: "POST",
            url: "php_mailer/mail_handler.php",
            dataType: "html",
            data: myData,
            success: function(response) {
                $("#NewsletterResult").html('<fieldset class="response">' + response + '</fieldset>');
                $("#NewsletterResult").slideDown("slow"); //show Result 
                $("#NewsletterContent").hide(); //hide form div slowly
            },
            error: function(xhr, ajaxOptions, thrownError) {
                $("#NewsletterErrResults").html(thrownError);
            }
        });
        return false;
    });


});