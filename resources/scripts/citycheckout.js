  $("#country").change(function() {
    const country = $(this).find('option:selected').val();
    if (country == 'US') {
      taxValue = 0.00;
      $('#region').show();
      $('#caProvince').hide();
      $('#auProvince').hide();
      $('#usState').show();
      $('#countrySelect').addClass('col-sm-4').removeClass('col-sm-6');
      $('#postal').addClass('col-sm-4').removeClass('col-sm-6');
      $('#shippingRate').html(shippingRate.US[0].rate);
      $('#shippingValueInForm').html(shippingRate.US[0].rate);
      $("#usState").change(function() {
        const state = $(this).find('option:selected').val();
        if (state == 'CA') {
          $('#checkoutTaxLabel').show();
          $('#checkoutTaxValue').show();
          taxValue = parseFloat($('#product_price').html()) * .09;
          $('#checkoutTaxValue').html(taxValue);
          totalValue = parseFloat($('#product_price').html()) + parseFloat($('#shippingRate').html()) + taxValue;
          $('#totalprice').html(totalValue.toFixed(2));
          $('#amount').val(totalValue);
        }
        else {
          $('#checkoutTaxLabel').hide();
          $('#checkoutTaxValue').hide();
          taxValue = 0.00;
          totalValue = parseFloat($('#product_price').html()) + parseFloat($('#shippingRate').html()) + taxValue;
          $('#totalprice').html(totalValue.toFixed(2));
          $('#amount').val(totalValue);
        }
      })
      totalValue = parseFloat($('#product_price').html()) + parseFloat($('#shippingRate').html()) + taxValue;
      $('#totalprice').html(totalValue.toFixed(2));
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
    }
  });

  $("#billingCountry").change(function() {
    const billingCountry = $(this).find('option:selected').val();
    if (billingCountry == 'US') {
      $('#billingRegion').show();
      $('#billingCAProvince').hide();
      $('#billingAUProvince').hide();
      $('#billingUSState').show();
      $('#billingCountrySelect').addClass('col-sm-4').removeClass('col-sm-6');
      $('#billingPostal').addClass('col-sm-4').removeClass('col-sm-6');
    }
    else if (billingCountry == 'CA') {
      $('#billingRegion').show();
      $('#billingAUProvince').hide();
      $('#billingUSState').hide();
      $('#billingCAProvince').show();
      $('#billingCountrySelect').addClass('col-sm-4').removeClass('col-sm-6');
      $('#billingPostal').addClass('col-sm-4').removeClass('col-sm-6');
    }
    else if (billingCountry == 'AU') {
      $('#billingRegion').show();
      $('#billingCAProvince').hide();
      $('#billingUSState').hide();
      $('#billingAUProvince').show();
      $('#billingCountrySelect').addClass('col-sm-4').removeClass('col-sm-6');
      $('#billingPostal').addClass('col-sm-4').removeClass('col-sm-6');
    }
    else {
      $('#billingRegion').hide();
      $('#billingCountrySelect').addClass('col-sm-6').removeClass('col-sm-4');
      $('#billingPostal').addClass('col-sm-6').removeClass('col-sm-4');
    }
  });

  const apiUrl = 'https://dbh99ppw9f.execute-api.us-east-1.amazonaws.com/prod/api';
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

  $.get(`${apiUrl}/client-token`, successGetTK);

  function successGetTK(data, status){
    if (status == 'success') {
      braintree.client.create({authorization: data.clientToken}, successClient);
    }
    else {
      alert("We're having issue with network! Please try again!!");
      return;
    }
  }

  function successClient (err, clientInstance) {
    if (err) {
      console.log(err);
      return;
    }
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
    $('#submit').click(function (event) {
      event.preventDefault();
      hostedFieldsInstance.tokenize(function (err, payload) {
        if (err) {
          console.error(err);
          return;
        }else {
          var formdata = {};
          formdata.nonce = payload.nonce;
          formdata.amount = parseFloat($('#amount').val());
          formdata.nameoncard = $('#name-on-card').val();
          formdata.firstname = $('#fname').val();
          formdata.lastname = $('#lname').val();
          formdata.email = $('#email').val();
          formdata.company = $('#company').val();
          formdata.streetAddress = $('#shipping-address').val();
          formdata.extendedAddress = $('#extended-address').val();
          formdata.city = $('#city').val();
          formdata.country = $('#country').val();
          formdata.usState = $('#usState').val();
          formdata.caProvince = $('#caProvince').val();
          formdata.postalCode = $('#postal-code').val();
          formdata.phone = $('#phone').val();
          formdata.voluumClickID = "ABCD1234";
          formdata.product = {
            id: 44739029702,
            price: "35.00",
            sku: "CITYADVCLR-FULL-1x"
          };
          // console.log(payload.nonce);
          $.ajax({
              type: 'POST',
              data: JSON.stringify(formdata),
              contentType: 'application/json',
              crossDomain: true,
              url: `${apiUrl}/checkout`,
              success: function(data, status){
                window.location = `https://checkout.citybeauty.com/upsell.html?token=${data.transaction.creditCard.token}`;
              },
              error: function (data, status) {
                console.log(status);
                return;
              }
          })
        }
      });
    });
  }

  var shippingRate;
  $.get(`${apiUrl}/getFunnel`, successGetFN);
  function successGetFN(data, status) {
    if (status == 'success') {
      $('#product_name').html(data.checkouts[0].title);
      $('#product_price').html(data.checkouts[0].product.price);
      $('#subtotal').html(data.checkouts[0].product.price);
      shippingRate = data.shipRate;
    }
    else {
      alert("We're having issue with network! Please try again!!");
      return;
    }
  }

  $('input[type=radio][name=optradio]').change(function() {
        if (this.value == '0') {
            $('#billing_info').hide();
        }
        else if (this.value == '1') {
            $('#billing_info').show();
        }
    });
