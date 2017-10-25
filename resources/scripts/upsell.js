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

const ccToken = getParameterByName('token');
const checkoutID = getParameterByName('checkoutid');
const chtx = parseFloat(getParameterByName('chtx'));
const pid = getParameterByName('pid');
var checkouts;
var shippingRate;
var amountValue;
var productValue;
$.get(`${apiUrl}/getFunnel`, successGetFN);
function successGetFN(data, status) {
  if (status == 'success') {
    const pagename = getCheckoutNameInURL();
    offers = data.checkouts[pid].funnels[0].offers;
    offers.map(function (item) {
      if (pagename == item.pagename) {
        nextpage = item.nextpage;
        nopage = item.nopage;
        if (chtx > 0) {
          amountValue = parseFloat(item.product.price) * (1 + chtx);
          amountValue = amountValue.toFixed(2);
        }else {
          amountValue = parseFloat(item.product.price);
        }
        productValue = item.product;
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
  formdata.amount = amountValue;
  formdata.token = ccToken;
  formdata.product = productValue;
  formdata.checkoutID = checkoutID;
  formdata.tax_rate = chtx;
  const $modal = $('.js-loading-bar');
  const $bar = $modal.find('.progress-bar');
  $.ajax({
      type: 'POST',
      data: JSON.stringify(formdata),
      contentType: 'application/json',
      crossDomain: true,
      url: `${apiUrl}/aClickCharge`,
      beforeSend: function() {
        $modal.modal('show');
        $bar.addClass('animate');
      },
      success: function(data, status){
        $bar.removeClass('animate');
        $modal.modal('hide');
        if (nextpage == "orderconfirmation") {
          window.location = `https://citybeauty.com/orderconfirmation.php?checkoutid=${checkoutID}`;
        }
        else {
          window.location = `${baseUrl}/src/fnl/${nextpage}.html?pid=${pid}&token=${data.transaction.creditCard.token}&checkoutid=${checkoutID}&chtx=${chtx}`;
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
    window.location = `https://citybeauty.com/orderconfirmation.php?checkoutid=${checkoutID}`;
  }
  else {
    window.location = `${baseUrl}/src/fnl/${nopage}.html?pid=${pid}&token=${ccToken}&checkoutid=${checkoutID}&chtx=${chtx}`;
  }
});
