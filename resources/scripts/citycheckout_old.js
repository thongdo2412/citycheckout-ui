  const baseUrl = "https://checkout.citybeauty.com";
  const apiUrl = "https://dbh99ppw9f.execute-api.us-east-1.amazonaws.com/prod/api";
  var checkoutRoute;
  checkoutRoute = parseInt($('#checkoutRoute').val()) - 1;
  var nextpage = "";
  var tax_rate = 0.0;
  var taxValue = 0.0;
  var checkout = {};
  var shippingRate = 0.0;
  // update the tax value, shipping value and total value
  $('#billingAddrChoice').val("0");
  $("#country").change(function() {
    const country = $(this).find('option:selected').val();
    if (country == 'US') {
      $('#region').show();
      $('#caProvince').hide();
      $('#auProvince').hide();
      $('#usState').show();
      $('#countrySelect').addClass('col-sm-4').removeClass('col-sm-6');
      $('#postal').addClass('col-sm-4').removeClass('col-sm-6');
      if (checkoutRoute == 0) {
        $('#shippingRate').html(shippingRate.US[0].rate);
        $('#shippingValueInForm').html(shippingRate.US[0].rate);
      }
      else {
        $('#shippingRate').html("0.00");
        $('#shippingValueInForm').html("Free");
      }
      $("#usState").change(function() {
        const state = $(this).find('option:selected').val();
        $('#regionValue').val(state);
        if (state == 'CA') {
          $('#checkoutTaxLabel').show();
          $('#checkoutTaxValue').show();
          tax_rate = 0.09
          taxValue = parseFloat($('#product_price').html()) * tax_rate;
          $('#checkoutTaxValue').html(taxValue);
          totalValue = parseFloat($('#product_price').html()) + parseFloat($('#shippingRate').html()) + taxValue;
          $('#totalprice').html(totalValue.toFixed(2));
          $('#amount').val(totalValue);
        }
        else if (state == "UT") {
          $('#checkoutTaxLabel').show();
          $('#checkoutTaxValue').show();
          tax_rate = 0.0676;
          taxValue = parseFloat($('#product_price').html()) * .0676;
          $('#checkoutTaxValue').html(taxValue.toFixed(2));
          totalValue = parseFloat($('#product_price').html()) + parseFloat($('#shippingRate').html()) + taxValue;
          $('#totalprice').html(totalValue.toFixed(2));
          $('#amount').val(totalValue);
        }
        else {
          $('#checkoutTaxLabel').hide();
          $('#checkoutTaxValue').hide();
          totalValue = parseFloat($('#product_price').html()) + parseFloat($('#shippingRate').html());
          $('#totalprice').html(totalValue.toFixed(2));
          $('#amount').val(totalValue);
        }
      });
    }else if (country == 'CA'){
      $('#region').show();
      $('#usState').hide();
      $('#auProvince').hide();
      $('#caProvince').show();
      $('#checkoutTaxLabel').hide();
      $('#checkoutTaxValue').hide();
      $('#countrySelect').addClass('col-sm-4').removeClass('col-sm-6');
      $('#postal').addClass('col-sm-4').removeClass('col-sm-6');
      $('#shippingRate').html(shippingRate.Canada);
      $('#shippingValueInForm').html(shippingRate.Canada);
      $("#caProvince").change(function() {
        const state = $(this).find('option:selected').val();
        $('#regionValue').val(state);
      });
      totalValue = parseFloat($('#product_price').html()) + parseFloat($('#shippingRate').html());
      $('#totalprice').html(totalValue.toFixed(2));
      $('#amount').val(totalValue);
    }
    else if (country == "AU") {
      $('#region').show();
      $('#usState').hide();
      $('#caProvince').hide();
      $('#auProvince').show();
      $('#checkoutTaxLabel').hide();
      $('#checkoutTaxValue').hide();
      $('#countrySelect').addClass('col-sm-4').removeClass('col-sm-6');
      $('#postal').addClass('col-sm-4').removeClass('col-sm-6');
      $('#shippingRate').html(shippingRate.International);
      $('#shippingValueInForm').html(shippingRate.International);
      $("#auProvince").change(function() {
        const state = $(this).find('option:selected').val();
        $('#regionValue').val(state);
      });
      totalValue = parseFloat($('#product_price').html()) + parseFloat($('#shippingRate').html());
      $('#totalprice').html(totalValue.toFixed(2));
      $('#amount').val(totalValue);
    }
    else {
      $('#region').hide();
      $('#countrySelect').addClass('col-sm-6').removeClass('col-sm-4');
      $('#postal').addClass('col-sm-6').removeClass('col-sm-4');
      $('#shippingRate').html(shippingRate.International);
      $('#shippingValueInForm').html(shippingRate.International);
      totalValue = parseFloat($('#product_price').html()) + parseFloat($('#shippingRate').html());
      $('#totalprice').html(totalValue.toFixed(2));
      $('#amount').val(totalValue);
      $('#regionValue').val("");
    }
  });

  // update billing address

  $("#billingCountry").change(function() {
    const billingCountry = $(this).find('option:selected').val();
    if (billingCountry == 'US') {
      $('#billingRegion').show();
      $('#billingCAProvince').hide();
      $('#billingAUProvince').hide();
      $('#billingUSState').show();
      $('#billingCountrySelect').addClass('col-sm-4').removeClass('col-sm-6');
      $('#billingPostal').addClass('col-sm-4').removeClass('col-sm-6');
      $("#billingUSState").change(function() {
        const state = $(this).find('option:selected').val();
        $('#billingRegionValue').val(state);
      });
    }
    else if (billingCountry == 'CA') {
      $('#billingRegion').show();
      $('#billingAUProvince').hide();
      $('#billingUSState').hide();
      $('#billingCAProvince').show();
      $('#billingCountrySelect').addClass('col-sm-4').removeClass('col-sm-6');
      $('#billingPostal').addClass('col-sm-4').removeClass('col-sm-6');
      $("#billingCAProvince").change(function() {
        const state = $(this).find('option:selected').val();
        $('#billingRegionValue').val(state);
      });
    }
    else if (billingCountry == 'AU') {
      $('#billingRegion').show();
      $('#billingCAProvince').hide();
      $('#billingUSState').hide();
      $('#billingAUProvince').show();
      $('#billingCountrySelect').addClass('col-sm-4').removeClass('col-sm-6');
      $('#billingPostal').addClass('col-sm-4').removeClass('col-sm-6');
      $("#billingAUProvince").change(function() {
        const state = $(this).find('option:selected').val();
        $('#billingRegionValue').val(state);
      });
    }
    else {
      $('#billingRegion').hide();
      $('#billingCountrySelect').addClass('col-sm-6').removeClass('col-sm-4');
      $('#billingPostal').addClass('col-sm-6').removeClass('col-sm-4');
      $('#billingRegionValue').val("");
    }
  });

  // styling for hosted fields

  const stylesConfig = {
    'input': {
      'font-size': '14px',
      'font-weight': 'lighter',
      'color': '#3a3a3a'
    },
    ':focus': {
      'color': 'black'
    }
  };
  const fieldsConfig = {
    number: {
      selector: '#card-number',
      placeholder: 'Card Number'
    },
    cvv: {
      selector: '#cvv',
      placeholder: 'CVV'
    },
    expirationDate: {
      selector: '#expiration-date',
      placeholder: 'Expiration Date'
    }
  };

  // api call for hosted fields
  $.get(`${apiUrl}/client-token`, successGetTK);

  function successGetTK(data, status){
    if (status == 'success') {
      braintree.client.create({authorization: data.clientToken}, successClient);
    }
    else {
      alert("We're having issue with network! Please try again later!!");
      return;
    }
  }

  function successClient (err, clientInstance) {
    if (err) {
      alert("We're having issue with network! Please try again later!!");
      return;
    }
      // Create a PayPal Checkout component.
      braintree.paypalCheckout.create({
        client: clientInstance
      }, function (paypalCheckoutErr, paypalCheckoutInstance) {

        // Stop if there was a problem creating PayPal Checkout.
        // This could happen if there was a network error or if it's incorrectly
        // configured.
        if (paypalCheckoutErr) {
          console.error('Error creating PayPal Checkout:', paypalCheckoutErr);
          return;
        }
        // Set up PayPal with the checkout.js library
        paypal.Button.render({
          env: 'sandbox', // or 'production'

          payment: function () {
            return paypalCheckoutInstance.createPayment({
              flow: 'vault',
              billingAgreementDescription: 'Your agreement description',
              enableShippingAddress: true,
              shippingAddressEditable: true,
              shippingAddressOverride: {
                recipientName: $('#fname').val()+ " " + $('#lname').val(),
                line1: $('#shipping_address').val(),
                line2: $('#extended_address').val(),
                city: $('#city').val(),
                countryCode: $('#country').val(),
                postalCode: $('#postal_code').val(),
                state: $('#regionValue').val(),
                phone: $('#phone').val()
              }
            });
          },

          onAuthorize: function (data, actions) {
            return paypalCheckoutInstance.tokenizePayment(data)
              .then(function (payload) {
                return checkoutBT(payload);
              });
          },

          onCancel: function (data) {
            console.log('checkout.js payment cancelled', JSON.stringify(data, 0, 2));
          },

          onError: function (err) {
            console.error('checkout.js error', err);
          }
        }, '#paypal-button').then(function () {
          // The PayPal button will be rendered in an html element with the id
          // `paypal-button`. This function will be called when the PayPal button
          // is set up and ready to be used.
        });

      });

      //braintree payment
      braintree.hostedFields.create({
        client: clientInstance,
        styles: stylesConfig,
        fields: fieldsConfig
      }, successHostedFields);
  }

  function successHostedFields (err, hostedFieldsInstance) {
    if (err) {
      console.log(err);
      return;
    }
    hostedFieldsInstance.on('validityChange', function (event) {
      var field = event.fields[event.emittedBy];

      if (field.isValid) {
        if (event.emittedBy === 'expirationMonth' || event.emittedBy === 'expirationYear') {
          if (!event.fields.expirationMonth.isValid || !event.fields.expirationYear.isValid) {
            return;
          }
        } else if (event.emittedBy === 'number') {
          $('#card-number').next('span').text('');
        }

        // Remove any previously applied error or warning classes
        $(field.container).parents('.form-group').removeClass('has-warning');
        $(field.container).parents('.form-group').removeClass('has-success');
        // Apply styling for a valid field
        $(field.container).parents('.form-group').addClass('has-success');
      } else if (field.isPotentiallyValid) {
        // Remove styling  from potentially valid fields
        $(field.container).parents('.form-group').removeClass('has-warning');
        $(field.container).parents('.form-group').removeClass('has-success');
        if (event.emittedBy === 'number') {
          $('#card-number').next('span').text('');
        }
      } else {
        // Add styling to invalid fields
        $(field.container).parents('.form-group').addClass('has-warning');
        // Add helper text for an invalid card number
        if (event.emittedBy === 'number') {
          $('#card-number').next('span').text('Looks like this card number has an error.');
        }
      }
    });

    hostedFieldsInstance.on('cardTypeChange', function (event) {
      // Handle a field's change, such as a change in validity or credit card type
      if (event.cards.length === 1) {
        $('#card-type').text(event.cards[0].niceType);
      } else {
        $('#card-type').text('Card');
      }
    });

    $('#order_form').submit(function (event) {
        // event.preventDefault();
        hostedFieldsInstance.tokenize(function (err, payload) {
            if (err) {
              console.error(err);
              return;
            }else {
              return checkoutBT(payload);
            }
          });
          event.preventDefault();
    });
    
  }

  function checkoutBT (payload) {
    var formdata = {};
    formdata.nonce = payload.nonce;
    formdata.checkoutID = checkoutID;
    formdata.amount = parseFloat($('#amount').val()).toFixed(2);
    formdata.nameoncard = $('#name-on-card').val();

    //shipping address
    formdata.firstname = $('#fname').val();
    formdata.lastname = $('#lname').val();
    formdata.email = $('#email').val();
    formdata.company = $('#company').val();
    formdata.streetAddress = $('#shipping_address').val();
    formdata.extendedAddress = $('#extended_address').val();
    formdata.city = $('#city').val();
    formdata.country = $('#country').val();
    formdata.region = $('#regionValue').val();
    formdata.postalCode = $('#postal_code').val();
    formdata.phone = $('#phone').val();

    //billing address
    if ($('#billingAddrChoice').val() == "0") {
      formdata.billingFirstName = $('#fname').val();
      formdata.billingLastName = $('#lname').val();
      formdata.billingCompany = $('#company').val();
      formdata.billingStreetAddress = $('#shipping_address').val();
      formdata.extendedBillingAddress = $('#extended_address').val();
      formdata.billingCity = $('#city').val();
      formdata.billingCountry = $('#country').val();
      formdata.billingRegion = $('#regionValue').val();
      formdata.BillingPostalCode = $('#postal_code').val();
    }else {
      formdata.billingFirstName = $('#billingFname').val();
      formdata.billingLastName = $('#billingLname').val();
      formdata.billingCompany = $('#billingCompany').val();
      formdata.billingStreetAddress = $('#billing_address').val();
      formdata.extendedBillingAddress = $('#extended_billing_address').val();
      formdata.billingCity = $('#billingCity').val();
      formdata.billingCountry = $('#billingCountry').val();
      formdata.billingRegion = $('#billingRegionValue').val();
      formdata.BillingPostalCode = $('#billingPostal_code').val();
    }

    formdata.clickID = clickID;
    formdata.product = checkout.product;
    formdata.shipAmount = parseFloat($('#shippingRate').html());
    formdata.tax_rate = tax_rate;
    // console.log(payload.nonce);
    const $modal = $('.js-loading-bar');
    const $bar = $modal.find('.progress-bar');
    $.ajax({
        type: 'POST',
        data: JSON.stringify(formdata),
        contentType: 'application/json',
        crossDomain: true,
        url: `${apiUrl}/checkout`,
        beforeSend: function() {
          $modal.modal('show');
          $bar.addClass('animate');
        },
        success: function(data, status){
          $bar.removeClass('animate');
          $modal.modal('hide');
          window.location = `${baseUrl}/src/fnl/${nextpage}.html?pid=${checkoutRoute}&token=${data.transaction.creditCard.token}&checkoutid=${checkoutID}&chtx=${tax_rate}`;
        },
        error: function (data, status) {
          alert("We're having network issue!! Please try again.");
          return;
        }
    });
  }

  const checkoutID = getCheckoutID();
  function getCheckoutID() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  $.get(`${apiUrl}/getFunnel`, successGetFN);
  function successGetFN(data, status) {
    if (status == 'success') {
      checkout = data.checkouts[checkoutRoute]
      $('#product_name').html(checkout.title);
      $('#product_price').html(checkout.product.price);
      $('#subtotal').html(checkout.product.price);
      nextpage = checkout.funnels[0].offers[0].pagename;
      shippingRate = data.shipRate;
      return;
    }
    else {
      alert("We're having issue with network! Please try again later!!");
      return;
    }
  }
  const clickID = getParameterByName('cid');

  function getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  $('input[type=radio][name=billingradio]').change(function() {
        if (this.value == '0') {
            $('#billing_info').hide();
            $('#billingAddrChoice').val("0");
        }
        else if (this.value == '1') {
            $('#billing_info').show();
            $('#billingAddrChoice').val("1");
        }
    });
    $('input[type=radio][name=paymentradio]').change(function() {
      if (this.value == '0') {
          $('#PP_payment').show();
          $('#BT_payment').hide();
          $('#submit').hide();
          $('#paymentChoice').val("0");
      }
      else if (this.value == '1') {
          $('#BT_payment').show();
          $('#PP_payment').hide();
          $('#submit').show();
          $('#paymentChoice').val("1");
      }
  });
    // $("#submit").on('touchstart', function(event) {
    //   $(this).trigger('click');
    // });
  // Segment analytics section
  analytics.page('City Checkout', {
    title: 'City Checkout',
    url: 'https://checkout.citybeauty.com/src/cbl001wwylt.html'
  });
  analytics.track('Email entered', {
    location: '#email',
    type: 'input'
  });
  