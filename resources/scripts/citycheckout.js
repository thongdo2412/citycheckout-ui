// declaration
const baseUrl = "https://checkout.citybeauty.com";
const apiUrl = "https://dbh99ppw9f.execute-api.us-east-1.amazonaws.com/prod/api";
let nextpage = "";
let product_title = "";
let tax_rate = 0.0;
let taxValue = 0.0;
let checkout = {};
let shipping_rate = 0.0;
let shipping_info;
let productVariantId;
let expiry_date;
let funnelRoute;
let quantity = 0;
let discount_amt = 0.0;

// handles small screen collapse price bar
if ($(document).width() < 992) {
  $('#price_breakdown').addClass("collapse");
}
else {
  $('#price_breakdown').removeClass("collapse");
}

$(window).resize(function(){
  if ($(this).width() < 992) {
    $('#price_breakdown').addClass("collapse");
  }
  else {
    $('#price_breakdown').removeClass("collapse");
  }
})

// default billing address choice same with shipping
$('#billingAddrChoice').val("0");

//functions to update and display total amount, shipping amount, and tax amount
function update_total_amount(amount,shipping_rate,tax_value) {
  let totalValue = amount + shipping_rate + tax_value;
  $('#totalprice').html(totalValue.toFixed(2));
  $('#collapse_btn_price').html(totalValue.toFixed(2)); 
  $('#amount').val(totalValue);
}

function display_shipping_rate(shipping_rate) {
  if (shipping_rate == 0.00) {
    $('#shippingRate').html("&mdash;");
    $('#shippingValueInForm').html("Free");
  }
  else {
    $('#shippingRate').html(shipping_rate);
    $('#shippingValueInForm').html(`$${shipping_rate}`);
  }        
}

function update_tax_amount(tax_rate) {
  taxValue = parseFloat($('#product_price').html()) * tax_rate;
  $('#checkoutTaxValue').html(taxValue.toFixed(2));
  return taxValue;
}

//handles country change and updates total amount, shipping amount, tax amount
$("#country").change(function() {
  const country = $(this).find('option:selected').val();
  tax_rate = 0.0;
  taxValue = 0.0;
  shipping_rate = 0.0;
  $('#regionValue').val("");  // reset hidden input to hold region value for US states, CA provinces, or AU states
  if (country == 'US') { // handles country = US
    $('#region').show();
    $('#caProvince').hide();
    $('#auProvince').hide();
    $('#usState').show();
    $('#usState').prop('selectedIndex',0);
    $('#countrySelect').addClass('col-sm-4').removeClass('col-sm-6');
    $('#postal').addClass('col-sm-4').removeClass('col-sm-6');
    $('#usState').prop('required', true);
    $("#caProvince").prop('required', false);
    // $("#usState").change(function() {
    //   const state = $(this).find('option:selected').val();
    //   $('#regionValue').val(state);
    // });
    if (currentPageName == 'cbl001') {
      shipping_rate = parseFloat(shipping_info.US[0].rate);
      display_shipping_rate(shipping_rate);
    }
    else {
      display_shipping_rate(0.00);
    }
    update_total_amount(parseFloat($('#product_price').html()),shipping_rate,taxValue);
  }else if (country == 'CA'){ // handles country = Canada
    $('#region').show();
    $('#usState').hide();
    $('#auProvince').hide();
    $('#caProvince').show();
    $('#caProvince').prop('selectedIndex',0);
    $('#checkoutTaxLabel').hide();
    $('#checkoutTaxValue').hide();
    shipping_rate = parseFloat(shipping_info.Canada);
    display_shipping_rate(shipping_rate);
    $('#countrySelect').addClass('col-sm-4').removeClass('col-sm-6');
    $('#postal').addClass('col-sm-4').removeClass('col-sm-6');
    $("#caProvince").prop('required', true);
    $('#usState').prop('required', false);
    // $("#caProvince").change(function() {
    //   const state = $(this).find('option:selected').val();
    //   $('#regionValue').val(state);
    // });
    update_total_amount(parseFloat($('#product_price').html()),shipping_rate,taxValue);
  }
  else if (country == "AU") { // handles country = Australia
    $('#region').show();
    $('#usState').hide();
    $('#caProvince').hide();
    $('#auProvince').show();
    $('#auProvince').prop('selectedIndex',0);
    $("#caProvince").prop('required', false);
    $('#usState').prop('required', false);
    $('#checkoutTaxLabel').hide();
    $('#checkoutTaxValue').hide();
    shipping_rate = parseFloat(shipping_info.International);
    display_shipping_rate(shipping_rate);
    $('#countrySelect').addClass('col-sm-4').removeClass('col-sm-6');
    $('#postal').addClass('col-sm-4').removeClass('col-sm-6');
    // $("#auProvince").change(function() {
    //   const state = $(this).find('option:selected').val();
    //   $('#regionValue').val(state);
    // });
    update_total_amount(parseFloat($('#product_price').html()),shipping_rate,taxValue);
  }
  else { // handles country  = somewhere else
    $("#caProvince").prop('required', false);
    $('#usState').prop('required', false);
    $('#region').hide();
    $('#countrySelect').addClass('col-sm-6').removeClass('col-sm-4');
    $('#postal').addClass('col-sm-6').removeClass('col-sm-4');
    $('#checkoutTaxLabel').hide();
    $('#checkoutTaxValue').hide();
    shipping_rate = parseFloat(shipping_info.International);
    display_shipping_rate(shipping_rate);
    update_total_amount(parseFloat($('#product_price').html()),shipping_rate,taxValue);
  }
});

//set validator for US state
$('#usState').prop('required', true);

//update total amount with tax amount based on US state selected
$("#usState").change(function() {
  const state = $(this).find('option:selected').val();
  $('#regionValue').val(state);
  if (state == 'CA') {
    $('#checkoutTaxLabel').show();
    $('#checkoutTaxValue').show();
    tax_rate = 0.09;
    taxValue = update_tax_amount(tax_rate);          
    update_total_amount(parseFloat($('#product_price').html()),shipping_rate,taxValue);
  }
  else if (state == "UT") {
    $('#checkoutTaxLabel').show();
    $('#checkoutTaxValue').show();
    tax_rate = 0.0676;
    taxValue = update_tax_amount(tax_rate);          
    update_total_amount(parseFloat($('#product_price').html()),shipping_rate,taxValue);
  }
  else {
    $('#checkoutTaxLabel').hide();
    $('#checkoutTaxValue').hide();
    display_shipping_rate(shipping_rate);
    taxValue = 0.00;
    update_total_amount(parseFloat($('#product_price').html()),shipping_rate,taxValue);
  }
});

//handles changes of CA provinces or AU states
$("#caProvince").change(function() {
  const state = $(this).find('option:selected').val();
  $('#regionValue').val(state);
});

$("#auProvince").change(function() {
  const state = $(this).find('option:selected').val();
  $('#regionValue').val(state);
});

//handles separate billing address from shipping address
$('input[type=radio][name=billingradio]').change(function() {
  if (this.value == '0') {
    $('#billing_info').hide();
    $('#billingAddrChoice').val("0");
    // removes required fields for form validator
    $('#billingFname').prop('required', false);
    $('#billingLname').prop('required', false);
    $('#billing_address').prop('required', false);
    $('#billingCity').prop('required', false);
    $('#billingPostal').prop('required', false);
    $('#billingpostal_code').prop('required', false);
    $('#billingUSState').prop('required', false);
    $('#billingCAProvince').prop('required', false);
  }
  else if (this.value == '1') {
    $('#billing_info').show();
    $('#billingAddrChoice').val("1");
    // adds required fields for form validator
    $('#billingFname').prop('required', true);
    $('#billingLname').prop('required', true);
    $('#billing_address').prop('required', true);
    $('#billingCity').prop('required', true);
    $('#billingpostal_code').prop('required', true);
    // add and removes fields for form validator based on billing country = US, CA or others
    if ($('#billingCountry').val() == "US") {
      $('#billingUSState').prop('required', true);
      $('#billingCAProvince').prop('required', false);
    } else if ($('#billingCountry').val() == "CA") {
      $('#billingUSState').prop('required', false);
      $('#billingCAProvince').prop('required', true);
    } else {
      $('#billingUSState').prop('required', false);
      $('#billingCAProvince').prop('required', false);
    }
  }
});

// update billing country change
$("#billingCountry").change(function() {
  const billingCountry = $(this).find('option:selected').val();
  $('#billingRegionValue').val("");
  if (billingCountry == 'US') {
    $('#billingRegion').show();
    $('#billingCAProvince').hide();
    $('#billingAUProvince').hide();
    $('#billingUSState').show();
    $('#billingUSState').prop('selectedIndex',0);
    $('#billingUSState').prop('required', true);
    $('#billingCAProvince').prop('required', false);    
    $('#billingCountrySelect').addClass('col-sm-4').removeClass('col-sm-6');
    $('#billingPostal').addClass('col-sm-4').removeClass('col-sm-6');
    // $("#billingUSState").change(function() {
    //   const state = $(this).find('option:selected').val();
    //   $('#billingRegionValue').val(state);
    // });
  }
  else if (billingCountry == 'CA') {
    $('#billingRegion').show();
    $('#billingAUProvince').hide();
    $('#billingUSState').hide();
    $('#billingCAProvince').show();
    $('#billingCAProvince').prop('selectedIndex',0);
    $('#billingUSState').prop('required', false);
    $('#billingCAProvince').prop('required', true);
    $('#billingCountrySelect').addClass('col-sm-4').removeClass('col-sm-6');
    $('#billingPostal').addClass('col-sm-4').removeClass('col-sm-6');
    // $("#billingCAProvince").change(function() {
    //   const state = $(this).find('option:selected').val();
    //   $('#billingRegionValue').val(state);
    // });
  }
  else if (billingCountry == 'AU') {
    $('#billingRegion').show();
    $('#billingCAProvince').hide();
    $('#billingUSState').hide();
    $('#billingAUProvince').show();
    $('#billingAUProvince').prop('selectedIndex',0);
    $('#billingUSState').prop('required', false);
    $('#billingCAProvince').prop('required', false);
    $('#billingCountrySelect').addClass('col-sm-4').removeClass('col-sm-6');
    $('#billingPostal').addClass('col-sm-4').removeClass('col-sm-6');
    // $("#billingAUProvince").change(function() {
    //   const state = $(this).find('option:selected').val();
    //   $('#billingRegionValue').val(state);
    // });
  }
  else {
    $('#billingUSState').prop('required', false);
    $('#billingCAProvince').prop('required', false);
    $('#billingRegion').hide();
    $('#billingCountrySelect').addClass('col-sm-6').removeClass('col-sm-4');
    $('#billingPostal').addClass('col-sm-6').removeClass('col-sm-4');
  }
});

$("#billingUSState").change(function() {
  const state = $(this).find('option:selected').val();
  $('#billingRegionValue').val(state);
});

$("#billingCAProvince").change(function() {
  const state = $(this).find('option:selected').val();
  $('#billingRegionValue').val(state);
});

$("#billingAUProvince").change(function() {
  const state = $(this).find('option:selected').val();
  $('#billingRegionValue').val(state);
});

// create checkout id as uuid
const checkoutid = uniqid();
function uniqid() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
}
//handles cid from Voluum
let clickid = "nocid";
if (getParameterByName('cid')) {
  clickid = getParameterByName('cid');
}

//gets funnel map from API
$.get(`${apiUrl}/getfunnel`, successGetFN);
function successGetFN(data, status) {
  if (status == 'success') {
    checkouts = data.checkouts;
    shipping_info = data.ship_rate;
    US_funnels = data.funnels;

    checkouts.map(function(checkout) {
      if (checkout.id == currentPageName) {
        product_title = checkout.title;
        $('#product_name').html(checkout.title);
        $('#product_price').html(checkout.price);
        productVariantId = checkout.product_id;
        quantity = checkout.quantity;
        discount_amt = checkout.discount_amt;
        $('#subtotal').html(checkout.price);
        $('#totalprice').html(checkout.price);
        $('#collapse_btn_price').html(checkout.price);
        funnelRoute = checkout.US_funnel;
        if (currentPageName == 'cbl001') {
          shipping_rate = parseFloat(shipping_info.US[0].rate);
          display_shipping_rate(shipping_rate);
          update_total_amount(parseFloat($('#product_price').html()),shipping_rate,taxValue);
        }
        else {
          display_shipping_rate(0.00);
          update_total_amount(parseFloat($('#product_price').html()),0.00,taxValue);
        }
      }
    })
    US_funnels.map(function(funnel) {
      if (funnel.id == funnelRoute) {
        nextpage =  funnel.offers[0].pagename; // might add different offers for split test
        return;
      }
    })
  }
  else {
    alert("We're having issue with network! Please try again later!!");
    return;
  }
}

let currentPageName = getPageNameInURL();

function getPageNameInURL() {
  let path = window.location.pathname;
  let pagename = path.split("/").pop();
  return pagename.split(".html")[0];
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

$("#expiration-date").keyup(function(){ //handle expiration date field
  if ($(this).val().length == 4) {
    var temp = $(this).val(); 
    if (temp.indexOf('/') <= -1)
      $(this).val(`${temp.substring(0,2)}/${temp.substring(2,4)}`)
  }
});

function expiryDateFormat(dateStr) {
  let xDate = dateStr.split("/");
  return `${xDate[0]}-20${xDate[1]}`;
}

$('#payment_form').validator().on('submit', function (e) {
  if (e.isDefaultPrevented()) {
    // handle the invalid form...
    alert("Please enter valid fields in the checkout form");
  } else {
      e.preventDefault();
      //check if the email input is valid
      let emailStr = $('#email').val();
      if (emailStr.indexOf('@') > -1) {
        // everything looks good!
        handleFormSubmission();
      }
      else {
        alert("Please enter a valid email address");
      } 
  }
})

$('.js-loading-bar').modal({
  backdrop: 'static',
  show: false
});

const $modal = $('.js-loading-bar');
const $bar = $modal.find('.progress-bar');

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

function handleFormSubmission () {
  let formdata = {};
  formdata.access_key = "3a901f4e2f3633ca9a686bc4c263295a";
  formdata.profile_id = "citybeauty";
  formdata.reference_number = String(new Date().getTime());
  formdata.transaction_type = "sale,create_payment_token";
  formdata.currency = "USD";
  formdata.payment_method = 'card';
  formdata.transaction_uuid = uniqid();
  formdata.merchant_defined_data5 = checkoutid;
  formdata.merchant_defined_data6 = clickid;
  formdata.merchant_defined_data7 = productVariantId;
  formdata.merchant_defined_data8 = shipping_rate;
  formdata.merchant_defined_data9 = nextpage;
  formdata.merchant_defined_data10 = String(funnelRoute);
  formdata.merchant_defined_data11 = String(tax_rate);
  formdata.merchant_defined_data12 = String(quantity);
  formdata.merchant_defined_data13 = String(discount_amt);
  formdata.signed_field_names = "access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency,payment_method,bill_to_forename,bill_to_surname,bill_to_email,bill_to_company_name,bill_to_address_line1,bill_to_address_line2,bill_to_address_city,bill_to_address_state,bill_to_address_country,bill_to_address_postal_code,merchant_defined_data5,merchant_defined_data6,merchant_defined_data7,merchant_defined_data8,merchant_defined_data9,merchant_defined_data10,merchant_defined_data11,merchant_defined_data12,merchant_defined_data13,ship_to_forename,ship_to_surname,ship_to_phone,ship_to_company_name,ship_to_address_line1,ship_to_address_line2,ship_to_address_city,ship_to_address_country,ship_to_address_state,ship_to_address_postal_code,override_custom_receipt_page,tax_amount";
  formdata.unsigned_field_names = "card_type,card_number,card_expiry_date";
  formdata.signed_date_time = String(new Date().toISOString().split('.')[0]+"Z");
  formdata.locale = "en";
  formdata.amount = parseFloat($('#amount').val()).toFixed(2);
  formdata.tax_amount = taxValue.toFixed(2);

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
    formdata.bill_to_address_postal_code = $('#billingpostal_code').val();
  }
  formdata.override_custom_receipt_page =  "https://citybeauty.com/scripts/processingorder.php";
  formdata.card_type = $('select[name=card_type]').val();
  formdata.card_number = $('input[name=card_number]').val();
  formdata.card_expiry_date = expiryDateFormat($('input[name=card_expiry_date]').val());
  
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
        formdata.signature = data.signature;
        //add another ajax call to CS endpoint
        submitForm('https://secureacceptance.cybersource.com/silent/pay','POST',formdata);
        // console.log(formdata);
      },
      error: function (data, status) {
        alert("We're having network issue!! Please try again later!!");
        return;
      }
  });
}

$('#collapseBtn').click(function(){
  var sign;
  $('#collapse_label').text(function(i,old){
    sign=old;
    return old=='Show order summary' ?  'Hide order summary' : 'Show order summary';
  });
})

paypal.Button.render({

  env: 'production', // sandbox | production

  // Show the buyer a 'Pay Now' button in the checkout flow
  commit: true,

  style: {
    label: 'checkout',
    size:  'medium',    // small | medium | large | responsive
    shape: 'rect',     // pill | rect
    color: 'gold',     // gold | blue | silver | black
    tagline: false    
  },

  // payment() is called when the button is clicked
  payment: function() {
      // Set up a url on your server to create the payment
    var CREATE_URL = `${apiUrl}/pcreatebill`;
    data = {
      product_title : product_title,
      return_url : window.location.href,
      cancel_url : window.location.href,
      amount : $('#product_price').html()
    };
    // Make a call to your server to set up the payment
    return paypal.request.post(CREATE_URL,data)
    .then(function(res) {
      return res.TOKEN;
    });
  },

  // onAuthorize() is called when the buyer approves the payment
  onAuthorize: function(data, actions) {
    $modal.modal('show');
    $bar.addClass('animate');     
    // Set up a url on your server to execute the payment
    var EXECUTE_URL = `${apiUrl}/pexecbill`;
    data.checkoutid = checkoutid;
    data.clickid = clickid;
    data.productVariantId = productVariantId;
    data.quantity = quantity;
    data.discount_amt = discount_amt;
    data.product_title = product_title;
    // Make a call to your server to execute the payment
    return paypal.request.post(EXECUTE_URL, data)
    .then(function (res) {
      analytics.track('Order Completed', {
        category: 'Conversion',
        label: 'Checkout',
        userId: analytics.user().anonymousId(),
        value: res.PAYMENTINFO_0_AMT
      });
      pid = String(funnelRoute);
      if (res.BILLINGAGREEMENTID) {
        cc_token = res.BILLINGAGREEMENTID;
        window.location = `${baseUrl}/src/fnl/${nextpage}.html?pid=${pid}&token=${cc_token}&checkoutid=${checkoutid}&chtx=${res.tax_rate}&gwp=pp`;
      }
    });
  }

}, '#paypal-button');

  // $("#submit").on('touchstart', function(event) {
  //   $(this).trigger('click');
  // });

// Segment analytics section
analytics.identify(analytics.user().anonymousId());
$('#fname').bind('input', function(){
  if ($('#email').val()) {
    analytics.identify(`User ${$('#email').val()}`, {
      email: $('#email').val(),
      anonymousId: analytics.user().anonymousId()
    })
  } 
});

