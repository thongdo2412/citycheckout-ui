const baseUrl = "https://checkout.citybeauty.com";
const apiUrl = "https://dbh99ppw9f.execute-api.us-east-1.amazonaws.com/prod/api";
var nextpage = "";
var nopage = "";

function getCheckoutNameInURL(checkoutcode) {
  const path = window.location.pathname;
  const pagename = path.split("/").pop();
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

function uniqid() {
  var ts=String(new Date().getTime()), i = 0, out = '';
  for(i=0;i<ts.length;i+=1) {        
     out+=Number(ts.substr(i, 2)).toString(36);    
  }
  return (Math.floor(Math.random() * 10)+out);
}

const cc_token = getParameterByName('token');
const checkoutid = getParameterByName('checkoutid');
const chtx = parseFloat(getParameterByName('chtx'));
const pid = getParameterByName('pid');
var checkouts;
var amountValue;
var productVariantId;
var tax_amount = 0.0;
$.get(`${apiUrl}/getFunnel`, successGetFN);
function successGetFN(data, status) {
  if (status == 'success') {
    const pagename = getCheckoutNameInURL();
    offers = data.lipcheckouts[pid].funnels[0].offers;
    offers.map(function (item) {
      if (pagename == item.pagename) {
        nextpage = item.nextpage;
        nopage = item.nopage;
        if (chtx > 0) {
          amountValue = parseFloat(item.product.price) * (1 + chtx);
          tax_amount = parseFloat(item.product.price) * chtx;
          amountValue = amountValue.toFixed(2);
        }else {
          amountValue = parseFloat(item.product.price);
        }
        productVariantId = item.product.id;
      }
    });
    return;
  }
  else {
    alert("We're having issue with network! Please try again!!");
    return;
  }
}

$('#submit').click(function (event) {
  event.preventDefault();
  var formdata = {};
  formdata.access_key = "9b3c7d838ed93bbc9d3d05953bab7dd4";
  formdata.profile_id = "citybeautycheckout";
  formdata.reference_number = String(new Date().getTime());
  formdata.payment_token = cc_token;
  formdata.transaction_type = "sale";
  formdata.currency = "USD";
  formdata.transaction_uuid = uniqid();
  formdata.tax_amount = tax_amount;
  formdata.signed_field_names = "access_key,profile_id,transaction_uuid,signed_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency,payment_token,tax_amount,merchant_defined_data5,merchant_defined_data7";
  formdata.signed_date_time = String(new Date().toISOString().split('.')[0]+"Z");
  formdata.locale = "en";
  
  formdata.amount = amountValue;
  formdata.merchant_defined_data5 = checkoutid;
  formdata.merchant_defined_data7 = productVariantId;
  const $modal = $('.js-loading-bar');
  const $bar = $modal.find('.progress-bar');
  $.ajax({
      type: 'POST',
      data: JSON.stringify(formdata),
      contentType: 'application/json',
      crossDomain: true,
      url: `${apiUrl}/oneclicksale`,
      beforeSend: function() {
        $modal.modal('show');
        $bar.addClass('animate');
      },
      success: function(data, status){
        $bar.removeClass('animate');
        $modal.modal('hide');
        if (nextpage == "orderconfirmation") {
          window.location = `https://citybeauty.com/orderconfirmation.php?checkoutid=${checkoutid}`;
        }
        else {
          window.location = `${baseUrl}/src/fnl/${nextpage}.html?pid=${pid}&token=${cc_token}&checkoutid=${checkoutid}&chtx=${chtx}`;
        }
      },
      error: function (data, status) {
        alert("We're having network issue!! Please try again.");
        return;
      }
  })
});
$('#NotTakeOffer').click(function (event) {
  event.preventDefault();
  if (nextpage == "orderconfirmation") {
    window.location = `https://citybeauty.com/orderconfirmation.php?checkoutid=${checkoutid}`;
  }
  else {
    window.location = `${baseUrl}/src/fnl/${nopage}.html?pid=${pid}&token=${cc_token}&checkoutid=${checkoutid}&chtx=${chtx}`;
  }
});

$("#submit").on('touchstart', function(event) {
  $(this).trigger('click');
});

$("#NotTakeOffer").on('touchstart', function(event) {
  $(this).trigger('click');
});

// // Segment analytics section
// analytics.page('City Checkout Upsell', {
//   title: 'City Lips 3 tubes with special offer',
//   url: 'https://checkout.citybeauty.com/src/fnl/cbloto3us.html'
// });
// analytics.page('City Checkout Upsell', {
//   title: 'City Lips 3 colors tubes with special offer',
//   url: 'https://checkout.citybeauty.com/src/fnl/cbloto3us.html'
// });
