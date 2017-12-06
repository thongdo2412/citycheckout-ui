  const baseUrl = "https://checkout.citybeauty.com";
  const apiUrl = "https://dbh99ppw9f.execute-api.us-east-1.amazonaws.com/prod/api";
  var checkoutRoute;
  checkoutRoute = parseInt($('#checkoutRoute').val()) - 1;
  var nextpage = "";
  var tax_rate = 0.0;
  var taxValue = 0.0;
  var checkout = {};
  var shipping_rate = 0.0;
  // update the tax value, shipping value and total value
  $('#billingAddrChoice').val("0");
  $("#country").change(function() {
    const country = $(this).find('option:selected').val();
    if (country == 'US') {
      $('#totalprice').html("");
      $("#usState").prop('selectedIndex', 0);
      $('#region').show();
      $('#caProvince').hide();
      $('#auProvince').hide();
      $('#usState').show();
      $('#countrySelect').addClass('col-sm-4').removeClass('col-sm-6');
      $('#postal').addClass('col-sm-4').removeClass('col-sm-6');
      if (checkoutRoute == 0) {
        shipping_rate = parseFloat(shippingRate.US[0].rate);
        $('#shippingRate').html(shipping_rate);
        $('#shippingValueInForm').html(shipping_rate);
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
          tax_rate = 0.09;
          taxValue = parseFloat($('#product_price').html()) * tax_rate;
          $('#checkoutTaxValue').html(taxValue);
          totalValue = parseFloat($('#product_price').html()) + shipping_rate + taxValue;
          $('#totalprice').html(totalValue.toFixed(2));
          $('#amount').val(totalValue);
        }
        else if (state == "UT") {
          $('#checkoutTaxLabel').show();
          $('#checkoutTaxValue').show();
          tax_rate = 0.0676;
          taxValue = parseFloat($('#product_price').html()) * .0676;
          $('#checkoutTaxValue').html(taxValue.toFixed(2));
          totalValue = parseFloat($('#product_price').html()) + shipping_rate + taxValue;
          $('#totalprice').html(totalValue.toFixed(2));
          $('#amount').val(totalValue);
        }
        else {
          $('#checkoutTaxLabel').hide();
          $('#checkoutTaxValue').hide();
          totalValue = parseFloat($('#product_price').html()) + shipping_rate;
          $('#totalprice').html(totalValue.toFixed(2));
          $('#amount').val(totalValue);
        }
        $("input[name='merchant_defined_data8']").val(shipping_rate);        
        $("input[name='merchant_defined_data9']").val(tax_rate);
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
      shipping_rate = parseFloat(shippingRate.Canada);
      $('#shippingRate').html(shipping_rate);
      $('#shippingValueInForm').html(shipping_rate);
      $("#caProvince").change(function() {
        const state = $(this).find('option:selected').val();
        $('#regionValue').val(state);
      });
      totalValue = parseFloat($('#product_price').html()) + shipping_rate;
      $('#totalprice').html(totalValue.toFixed(2));
      $('#amount').val(totalValue);
      $("input[name='merchant_defined_data8']").val(shipping_rate);
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
      shipping_rate = parseFloat(shippingRate.International);
      $('#shippingRate').html(shipping_rate);
      $('#shippingValueInForm').html(shipping_rate);
      $("#auProvince").change(function() {
        const state = $(this).find('option:selected').val();
        $('#regionValue').val(state);
      });
      totalValue = parseFloat($('#product_price').html()) + shipping_rate;
      $('#totalprice').html(totalValue.toFixed(2));
      $('#amount').val(totalValue);
      $("input[name='merchant_defined_data8']").val(shipping_rate);
    }
    else {
      $('#region').hide();
      $('#countrySelect').addClass('col-sm-6').removeClass('col-sm-4');
      $('#postal').addClass('col-sm-6').removeClass('col-sm-4');
      shipping_rate = parseFloat(shippingRate.International);
      $('#shippingRate').html(shipping_rate);
      $('#shippingValueInForm').html(shipping_rate);
      totalValue = parseFloat($('#product_price').html()) + shipping_rate;
      $('#totalprice').html(totalValue.toFixed(2));
      $('#amount').val(totalValue);
      $('#regionValue').val("");
      $("input[name='merchant_defined_data8']").val(shipping_rate);
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

  const checkoutid = uniqid();
  function uniqid() {
    var ts=String(new Date().getTime()), i = 0, out = '';
    for(i=0;i<ts.length;i+=1) {        
       out+=Number(ts.substr(i, 2)).toString(36);    
    }
    return (Math.floor(Math.random() * 10)+out);
  }
  let clickid = "";
  clickid = getParameterByName('cid');

  $.get(`${apiUrl}/getFunnel`, successGetFN);
  function successGetFN(data, status) {
    if (status == 'success') {
      checkout = data.checkouts[checkoutRoute]
      $('#product_name').html(checkout.title);
      $('#product_price').html(checkout.product.price);
      $("input[name='merchant_defined_data7']").val(checkout.product.id);      
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
          $('#CS_payment').hide();
          $('#submit').hide();
          $('#paymentChoice').val("0");
          $('input[name=payment_method]').val("paypal");
      }
      else if (this.value == '1') {
          $('#CS_payment').show();
          $('#PP_payment').hide();
          $('#submit').show();
          $('#paymentChoice').val("1");
          $('input[name=payment_method]').val("card");
      }
  });

  $('#submit').click(function(event){
    event.preventDefault();
      //input the required fields
    $('input[name=transaction_uuid]').val(uniqid());
    $("input[name='reference_number']").val(new Date().getTime());
    // $("input[name='override_custom_receipt_page']").val(`${baseUrl}/src/fnl/${nextpage}.html?pid=${checkoutRoute}&checkoutid=${checkoutid}&chtx=${tax_rate}`);
    $("input[name='override_custom_receipt_page']").val(`https://citybeauty.com/scripts/aftersale.php`);
    $("input[name='merchant_defined_data5']").val(checkoutid);
    $("input[name='merchant_defined_data6']").val(clickid);
    $("input[name='merchant_defined_data8']").val(shipping_rate);
    $("input[name='merchant_defined_data9']").val(checkoutRoute);      
    $("input[name='signed_date_time']").val(new Date().toISOString().split('.')[0]+"Z");
    formSubmission();
  })

  function submitForm(action, method, values) {
    var form = $('<form/>', {
        id: "payment_confirmation",
        action: action,
        method: method
    });
    $.each(values, function(index, value) {
        form.append($('<input/>', {
            type: 'hidden',
            id: index,
            name: index,
            value: value
        }));    
    });
    form.appendTo('body').submit();
  }

  function formSubmission () {
    let formdata = {};
    formdata.access_key = $("input[name=access_key]").val();
    formdata.profile_id = $("input[name=profile_id]").val();
    formdata.reference_number = $("input[name=reference_number]").val();
    formdata.transaction_type = $("input[name=transaction_type]").val();
    formdata.currency = $("input[name=currency]").val();
    formdata.payment_method = $("input[name=payment_method]").val();
    formdata.transaction_uuid = $("input[name=transaction_uuid]").val();
    formdata.merchant_defined_data5 = $("input[name=merchant_defined_data5]").val();
    formdata.merchant_defined_data6 = $("input[name=merchant_defined_data6]").val();
    formdata.merchant_defined_data7 = $("input[name=merchant_defined_data7]").val();
    formdata.merchant_defined_data8 = $("input[name=merchant_defined_data8]").val();
    formdata.merchant_defined_data9 = $("input[name=merchant_defined_data9]").val();      
    formdata.signed_field_names = $("input[name=signed_field_names]").val();
    formdata.unsigned_field_names = $("input[name=unsigned_field_names]").val();
    formdata.signed_date_time = $("input[name=signed_date_time]").val();
    formdata.locale = $("input[name=locale]").val();
    formdata.amount = parseFloat($('#amount').val()).toFixed(2);
    formdata.tax_amount = tax_rate;

    //shipping address
    formdata.ship_to_forename = $('#fname').val();
    formdata.ship_to_surname = $('#lname').val();
    formdata.ship_to_company_name = $('#company').val();
    formdata.ship_to_address_line1 = $('#shipping_address').val();
    formdata.ship_to_address_line2 = $('#extended_address').val();
    formdata.ship_to_address_city = $('#city').val();
    formdata.ship_to_address_country = $('#country').val();
    formdata.ship_to_address_state = $('#regionValue').val();
    formdata.ship_to_address_postal_code = $('#postal_code').val();
    formdata.ship_to_phone = $('#phone').val();

    //billing address
    formdata.bill_to_email = $('#email').val();    
    if ($('#billingAddrChoice').val() == "0") {
      formdata.bill_to_forename = $('#fname').val();
      formdata.bill_to_surname = $('#lname').val();
      formdata.bill_to_company_name = $('#company').val();
      formdata.bill_to_address_line1 = $('#shipping_address').val();
      formdata.bill_to_address_line2 = $('#extended_address').val();
      formdata.bill_to_address_city = $('#city').val();
      formdata.bill_to_address_country = $('#country').val();
      formdata.bill_to_address_state = $('#regionValue').val();
      formdata.bill_to_address_postal_code = $('#postal_code').val();
    }else {
      formdata.bill_to_forename = $('#billingFname').val();
      formdata.bill_to_surname = $('#billingLname').val();
      formdata.bill_to_company_name = $('#billingCompany').val();
      formdata.bill_to_address_line1 = $('#billing_address').val();
      formdata.bill_to_address_line2 = $('#extended_billing_address').val();
      formdata.bill_to_address_city = $('#billingCity').val();
      formdata.bill_to_address_country = $('#billingCountry').val();
      formdata.bill_to_address_state = $('#billingRegionValue').val();
      formdata.bill_to_address_postal_code = $('#billingPostal_code').val();
    }
    formdata.override_custom_receipt_page =  $("input[name='override_custom_receipt_page']").val();
    // formdata.shipping_amount = parseFloat($('#shippingRate').html());
    // formdata.tax_rate = tax_rate;
    // console.log(payload.nonce);
    formdata.card_type = $('select[name=card_type]').val();
    formdata.card_number = $('input[name=card_number]').val();
    formdata.card_expiry_date = $('input[name=card_expiry_date]').val();

    const $modal = $('.js-loading-bar');
    const $bar = $modal.find('.progress-bar');
    $.ajax({
        type: 'POST',
        data: JSON.stringify(formdata),
        contentType: 'application/json',
        crossDomain: true,
        url: `${apiUrl}/getsignature`,
        beforeSend: function() {
          $modal.modal('show');
          $bar.addClass('animate');
        },
        success: function(data, status){
          $bar.removeClass('animate');
          $modal.modal('hide');
          formdata.signature = data.signature;
          $('input[name=signature]').val(data.signature);
          formdata.card_type = $('select[name=card_type]').val();
          formdata.card_number = $('input[name=card_number]').val();
          formdata.card_expiry_date = $('input[name=card_expiry_date]').val();
          
          //add another ajax call to CS endpoint
          submitForm('https://testsecureacceptance.cybersource.com/silent/pay','POST',formdata);
        },
        error: function (data, status) {
          alert("We're having network issue!! Please try again later!!");
          return;
        }
    });
  }
  
    // $("#submit").on('touchstart', function(event) {
    //   $(this).trigger('click');
    // });
  // Segment analytics section
  // analytics.page('City Checkout', {
  //   title: 'City Checkout',
  //   url: 'https://checkout.citybeauty.com/src/cbl001wwylt.html'
  // });
  // analytics.track('Email entered', {
  //   location: '#email',
  //   type: 'input'
  // });
  