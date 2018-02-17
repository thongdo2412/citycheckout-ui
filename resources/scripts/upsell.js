const baseUrl = "https://checkout.citybeauty.com";
const apiUrl = "https://dbh99ppw9f.execute-api.us-east-1.amazonaws.com/prod/api";
var nextpage = "";
var nopage = "";
var product_title = "";

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
const gateway = getParameterByName('gwp');
var checkouts;
var amountValue;
var productVariantId;
var tax_amount = 0.0;
var quantity = 0;
var discount_amt = 0.0;

$.get(`${apiUrl}/getfunnel`, successGetFN);
function successGetFN(data, status) {
  if (status == 'success') {
    const pagename = getPageNameInURL();
    let funnels = data.funnels;
    var offers;
    funnels.map(function (funnel){
      if (funnel.id == pid) {
        offers = funnel.offers;
      }
    })

    offers.map(function (offer) {
      if (offer.pagename == pagename) {
        nextpage = offer.nextpage;
        nopage = offer.nopage;
        if (chtx > 0) {
          amountValue = parseFloat(offer.price) * (1 + chtx);
          tax_amount = parseFloat(offer.price) * chtx;
          amountValue = amountValue.toFixed(2);
        }else {
          amountValue = offer.price;
        }
        productVariantId = offer.product_id;
        product_title = offer.title;
        quantity = offer.quantity;
        discount_amt = offer.discount_amt;
      }
    });
    return;
  }
  else {
    alert("We're having issue with network! Please try again!!");
    return;
  }
}

$('.js-loading-bar').modal({
  backdrop: 'static',
  show: false
});

$('#submit').click(function (event) {
  event.preventDefault();
  const $modal = $('.js-loading-bar');
  const $bar = $modal.find('.progress-bar');

  var formdata = {};
  formdata.access_key = "3a901f4e2f3633ca9a686bc4c263295a";
  formdata.profile_id = "citybeauty";
  formdata.reference_number = String(new Date().getTime());
  formdata.payment_token = cc_token;
  formdata.transaction_type = "sale";
  formdata.currency = "USD";
  formdata.transaction_uuid = uniqid();
  formdata.tax_amount = tax_amount.toFixed(2);
  formdata.signed_field_names = "access_key,profile_id,transaction_uuid,signed_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency,payment_token,tax_amount,merchant_defined_data5,merchant_defined_data7,merchant_defined_data8,merchant_defined_data11,merchant_defined_data12,merchant_defined_data13";
  formdata.signed_date_time = String(new Date().toISOString().split('.')[0]+"Z");
  formdata.locale = "en";
  
  formdata.amount = amountValue;
  formdata.merchant_defined_data5 = checkoutid;
  formdata.merchant_defined_data7 = productVariantId;
  formdata.merchant_defined_data8 = "0.0"; // shipping is free for upsell
  formdata.merchant_defined_data11 = chtx;
  formdata.merchant_defined_data12 = quantity;
  formdata.merchant_defined_data13 = discount_amt;
  formdata.gateway = gateway;
  formdata.product_title = product_title;
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
        // $bar.removeClass('animate');
        // $modal.modal('hide');
        // Segment analytics section
        analytics.track('Upsell Order Completed', {
          category: 'Conversion',
          label: 'Upsell',
          user: analytics.user().anonymousId(),
          value: formdata.amount
        });
        if (nextpage == "orderconfirmation") {
          window.location = `https://citybeauty.com/orderconfirmation.php?checkoutid=${checkoutid}`;
        }
        else {
          window.location = `${baseUrl}/src/fnl/${nextpage}.html?pid=${pid}&token=${cc_token}&checkoutid=${checkoutid}&chtx=${chtx}&gwp=${gateway}`;
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
  // Segment analytics section
  analytics.track('Upsell Declined', {
    category: 'Conversion',
    label: 'Upsell',
    user: analytics.user().anonymousId()
  });
  if (nopage == "orderconfirmation") {
    window.location = `https://citybeauty.com/orderconfirmation.php?checkoutid=${checkoutid}`;
  }
  else {
    window.location = `${baseUrl}/src/fnl/${nopage}.html?pid=${pid}&token=${cc_token}&checkoutid=${checkoutid}&chtx=${chtx}&gwp=${gateway}`;
  }
});

$("#submit").on('touchstart', function(event) {
  $(this).trigger('click');
});

$("#NotTakeOffer").on('touchstart', function(event) {
  $(this).trigger('click');
});

// // Segment analytics section
// analytics.identify(analytics.user().anonymousId());

// handle back button click event
function back() {
  // pathEl.innerHTML = window.location.pathname;
  window.location = `https://citybeauty.com/orderconfirmation.php?checkoutid=${checkoutid}`;
}

function push() {
  const url = window.location.href + '&#' + Date.now();
  history.pushState({}, null, url);
}
push();

window.addEventListener('popstate',handleBackButton, false);
function handleBackButton() {
  if(confirm("Are you sure you want to go back? If you go back, you'll lose your one-time only offer. You can click Cancel to stay in this page or click OK to go back.")) {
    back();
  }else {
    push();
  }
}

setTimeout(function(){
  $("#page_content").hide();
  alert("Your one time offer has been expired!");
  window.location = 'https://citybeauty.com/';
}, 1800000);
// if (checkoutid) {
    //   $.post(`${apiUrl}/checkexpired`, {"checkout_id": checkoutid}, successCheckExp);
    //   function successCheckExp(data, status) {
    //     if (status == 'success') {
    //       if (data.expired == "true") {
    //         $("#page_content").hide();
    //         alert("Your one time offer has been expired!");
    //         window.location = 'https://citybeauty.com/';
    //         return;
    //       }
    //     }
    //     else {
    //       alert("We're having issue with network! Please try again!!");
    //       return;
    //     }
    //   }
    // }
    // else {
    //   $("#page_content").hide();  
    //   alert("Your one time offer has been expired!");
    //   window.location = 'https://citybeauty.com/';
    // }