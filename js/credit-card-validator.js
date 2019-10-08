(function(){
    'use strict';

    var owner = $('#credit-card-holder');
    var cardNumber = $('#credit-card-number');
    var cardNumberField = $('#card-number-field');
    var CVV = $("#cvv-number");

    var expirationDate = $("#expiration-date");
    var confirmButton = $('#confirm-purchase');

    var visa = $("#visa");
    var amex = $("#amex");
    var mastercard = $("#mastercard");

    $(document).ready(function(){
        $("#alert").hide();

        let form = $('.bootstrap-form');


        cardNumber.payform('formatCardNumber');
        CVV.payform('formatCardCVC');


        // On form submit take action, like an AJAX call
        $(form).submit(function(e){

            if(this.checkValidity() == false) {
                $(this).addClass('was-validated');
                e.preventDefault();
                e.stopPropagation();
            }

            var isCardValid = $.payform.validateCardNumber(cardNumber.val());
            var isCvvValid = $.payform.validateCardCVC(CVV.val());
            let patternDate = /^(0[123456789]|10|11|12)([ / ])([1-2][0-9][0-9][0-9])$/;

            let patternOwner = /^([a-zA-Z]{2,24})$/;

            if(!patternOwner.test(owner.val())){
                $("#alert").removeClass("alert-error alert-success alert-info").hide();
                $("#alert").addClass("alert alert-error").fadeIn();
            } 
            else if (!isCardValid) {
                $("#alert").removeClass("alert-error alert-success alert-info").hide();
                $("#alert").addClass("alert alert-error").fadeIn();
            } 
            else if (!isCvvValid) {
                $("#alert").removeClass("alert-error alert-success alert-info").hide();
                $("#alert").addClass("alert alert-error").fadeIn();
            }
            else {
                $("#alert").removeClass("alert-error alert-success alert-info").hide();
            }

        });

        // On every :input focusout validate if empty
        $(':input').blur(function(){
            $('#infoNoMatchRegister').hide();
            let fieldName = $(this).attr("id");

            switch(fieldName){
                case 'credit-card-holder':
                    validateCreditCardHolder($(this));
                    break;
                case 'credit-card-number':
                    validateCreditCardNumber($(this));
                    break;
                case 'cvv-number':
                    validateCVVNumber($(this));
                    break;
                default:
                    break;
            }
        });


        // On every :input focusin remove existing validation messages if any
        $(':input').click(function(){

            $(this).removeClass('is-valid is-invalid');

        });

        // On every :input focusin remove existing validation messages if any
        $(':input').keydown(function(){

            $(this).removeClass('is-valid is-invalid');

        });

        // Reset form and remove validation messages
        $(':reset').click(function(){
            $(':input, :checked').removeClass('is-valid is-invalid');
            $(form).removeClass('was-validated');
        });

        expirationDate.datepicker({
            format: "mm/yyyy",
            viewMode: "months", 
            minViewMode: "months",
            start: "today"
        });

        expirationDate.on('change', function() {

            let fieldValue = $(this).val();
            let pattern = /^(0[123456789]|10|11|12)([/])([1-2][0-9][0-9][0-9])$/;

            var today, expdate;           
            today = new Date();

            let dd = today.getDate();
            let mm = today.getMonth(); 
            let yyyy = today.getFullYear();

            var fields = fieldValue.split('/'); 
            var month = fields[0]; 
            var year = fields[1];

            expdate = new Date(month+"/1/"+year);
            today = new Date(mm+'/'+dd+'/'+yyyy);

            console.log(today+"\t"+expdate);
            $(this).removeClass('is-valid is-invalid');

            if(pattern.test(fieldValue) && today < expdate) {
                $(this).addClass('is-valid');
            } 
            else {
                $(this).addClass('is-invalid');
            }
        });
    });

    // Validate the card holder name
    function validateCreditCardHolder(thisObj) {
        let fieldValue = thisObj.val();
        let pattern = /^([a-zA-Z]{2,24})$/;

        if(pattern.test(fieldValue)) {
            $(thisObj).addClass('is-valid');
        } else {
            $(thisObj).addClass('is-invalid');
        }
    }

    // Validate the expiration date
    function validateCVVNumber(thisObj) {
        let fieldValue = thisObj.val();
        let pattern = /^([0-9]{3})$/;

        if(pattern.test(fieldValue)) {
            $(thisObj).addClass('is-valid');
        } 
        else {
            $(thisObj).addClass('is-invalid');
        }
    }

    // Validate Select Multiple Tag
    function validateCreditCardNumber(thisObj) {
        let fieldValue = thisObj.val();

        amex.removeClass('transparent');
        visa.removeClass('transparent');
        mastercard.removeClass('transparent');

        var isCardValid = $.payform.validateCardNumber(cardNumber.val());
        var cardType = $.payform.parseCardType(cardNumber.val());

        if (isCardValid) {
            /*alert("Card Valid!");*/
            cardNumberField.removeClass('has-error');
            cardNumberField.addClass('has-success');
            $(thisObj).addClass('is-valid');
        } 
        else {
            cardNumberField.addClass('has-error');
            $(thisObj).addClass('is-invalid');
        }

        if (cardType == 'visa') {
            mastercard.addClass('transparent');
            amex.addClass('transparent');
        } 
        else if (cardType == 'amex') {
            mastercard.addClass('transparent');
            visa.addClass('transparent');
        } 
        else if (cardType == 'mastercard') {
            amex.addClass('transparent');
            visa.addClass('transparent');
        }
    }
})();
