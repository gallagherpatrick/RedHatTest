let cors_api_url = "http://localhost:3000/";
let dest_url = "https://deployteam.com/eshop/api/";
let full_url = cors_api_url + dest_url;


let BOPISStored = sessionStorage.getItem("BOPIS");
let ROPISStored = sessionStorage.getItem("ROPIS");
let inProgressStored = sessionStorage.getItem("Picking");

getOrder(23);

async function getOrder(orderID) {
    let orderNumber = orderID;
    let destination = `orders/${orderNumber}/&?output_format=JSON`;
    let endpoint = full_url + destination;
    console.log(orderNumber);

    let req = new Request(endpoint, {
        method: 'GET',
        mode: 'cors',
        headers: {
            "Authorization": "Basic OUJJUUo0VURQSUNOV1BMWEFEODZUNFNYVzM0UDZETDI6OUJJUUo0VURQSUNOV1BMWEFEODZUNFNYVzM0UDZETDI=",
        },
        redirect: 'follow'
    });

    let response = await fetch(req);
    let jsonOrderResp = await response.json();
    // let jsonString = JSON.stringify(response);
    // console.log(jsonOrderResp.order.id_address_delivery);
    if (response.status != 200) {
        console.log("Response Status " + response.status);
    }
    // console.log("Response : " + JSON.stringify(response));
    // console.log("Order Response : " + JSON.stringify(jsonOrderResp));

    localStorage.setItem("JSON Response", JSON.stringify(jsonOrderResp));
    // JSONData = JSON.stringify(jsonOrderResp.order.id);
    // console.log(JSONData);
}

//Gets all the orders from the presta shop
async function getAllOrders() {
    let allOrderDestination = 'orders&?display=full&output_format=JSON';
    let allOrderEndPoint = full_url + allOrderDestination;

    let allOrderReq = new Request(allOrderEndPoint, {
        method: 'GET',
        mode: 'cors',
        headers: {
            "Authorization": "Basic OUJJUUo0VURQSUNOV1BMWEFEODZUNFNYVzM0UDZETDI6OUJJUUo0VURQSUNOV1BMWEFEODZUNFNYVzM0UDZETDI=",
        },
        redirect: 'follow'
    });

    let allOrderResponse = await fetch(allOrderReq);
    let jsonAllOrderResponse = await allOrderResponse.json();
    if (allOrderResponse.status != 200) {
        console.log("Response Status " + allOrderResponse.status);
    }
    let allOrderLength = jsonAllOrderResponse.orders.length - 1;
    orderStorage(allOrderLength, jsonAllOrderResponse);
}

function timeFunction() {
    let orderID = document.getElementById("orderID").value;
    setTimeout(changeOrderStatus(orderID), 5000);
}

function buttonEnable() {
    button.disabled = false;
    console.log("CLICKED")
}


//Creates and stores data from the Presta shop
function orderStorage(orderLength, data) {
    let BOPIS = [];
    let ROPIS = [];
    let inProgress = [];


    for (let i = 0; i < orderLength; i++) {
        // console.log(jsonAllOrderResponse.orders[i].current_state);
        let currentStatus = data.orders[i].current_state

        switch (currentStatus) {
            case '1':
                console.log("Current State 1");
                BOPIS.push(data.orders[i]);
                break;
            case '3':
                console.log("Current State 3");
                ROPIS.push(data.orders[i]);
                break;
            case '5':
                console.log("Current State 5");
                inProgress.push(data.orders[i]);
                break;
        }
    }

    sessionStorage.setItem("BOPIS", JSON.stringify(BOPIS));
    sessionStorage.setItem("ROPIS", JSON.stringify(ROPIS));
    sessionStorage.setItem("Picking", JSON.stringify(inProgress));
}


function changeOrderStatus(orderID) {
    //This creates the objects needed to change the orders status
    let currentState = sessionStorage.getItem("Current State");
    var JSONString = localStorage.getItem("JSON Response");
    var JSONObject = JSON.parse(JSONString);

    /*------These are the variables needed to update any put request------*/
    // let orderNumber = JSONObject.order.id;
    let orderNumber = orderID
    let idAddressDelivery = JSONObject.order.id_address_delivery;
    let idAddressInvoice = JSONObject.order.id_address_invoice;
    let idCart = JSONObject.order.id_cart;
    let idCurrency = JSONObject.order.id_currency;
    let idLanguage = JSONObject.order.id_lang;
    let idCustomer = JSONObject.order.id_customer;
    let idCarrier = JSONObject.order.id_carrier;
    let module = JSONObject.order.module;
    let payment = JSONObject.order.payment;
    let totalPaid = JSONObject.order.total_paid;
    let totalPaidReal = JSONObject.order.total_paid_real;
    let totalProducts = JSONObject.order.total_products;
    let totalProductsWT = JSONObject.order.total_products_wt;
    let conversionRate = JSONObject.order.conversion_rate;


    //Creates the destination url 
    let destination = `orders/${JSON.stringify(orderNumber)}/&ws_key=9BIQJ4UDPICNWPLXAD86T4SXW34P6DL2`;
    let endpoint = full_url + destination;

    /*--------These log all data to the console------------*/
    console.log("/*------These are the variables needed to update any put request------*/")
    console.log(orderNumber);
    console.log(idAddressDelivery);
    console.log(idAddressInvoice);
    console.log(idCart);
    console.log(idCurrency);
    console.log(idLanguage);
    console.log(idCustomer);
    console.log(idCarrier);
    console.log(module);
    console.log(payment);
    console.log(totalPaid);
    console.log(totalPaidReal);
    console.log(totalProducts);
    console.log(totalProductsWT);
    console.log(conversionRate);

    console.log("/*------This is the object------*/")
    console.log(JSONObject);

    //xml request and data
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", endpoint);
    xhr.setRequestHeader("Content-Type", "application/JSON")
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        }
    };

    data = `<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
        <order>
          <id><![CDATA[${orderNumber}]]></id>
          <id_address_delivery><![CDATA[${idAddressDelivery}]]></id_address_delivery>
          <id_address_invoice><![CDATA[${idAddressInvoice}]]></id_address_invoice>
          <id_cart><![CDATA[${idCart}]]></id_cart>
          <id_currency><![CDATA[${idCurrency}]]></id_currency>
          <id_lang><![CDATA[${idLanguage}]]></id_lang>
          <id_customer><![CDATA[${idCustomer}]]></id_customer>
          <id_carrier><![CDATA[${idCarrier}]]></id_carrier>
          <current_state><![CDATA[${currentState}]]></current_state>
          <module><![CDATA[${module}]]></module>
          <invoice_number><![CDATA[29]]></invoice_number>
          <invoice_date><![CDATA[2022-20-13 12:53:43]]></invoice_date>
          <delivery_number><![CDATA[24]]></delivery_number>
          <delivery_date><![CDATA[2022-20-13 12:53:43]]></delivery_date>
          <valid><![CDATA[0]]></valid>
          <date_add><![CDATA[2022-07-22 14:04:24]]></date_add>
          <date_upd><![CDATA[2022-20-13 12:53:43]]></date_upd>
          <shipping_number><![CDATA[]]></shipping_number>
          <note><![CDATA[]]></note>
          <id_shop_group><![CDATA[1]]></id_shop_group>
          <id_shop><![CDATA[1]]></id_shop>
          <secure_key><![CDATA[b2f8925c0012d1bd0a6f2882209b485f]]></secure_key>
          <payment><![CDATA[${payment}]]></payment>
          <recyclable><![CDATA[0]]></recyclable>
          <gift><![CDATA[0]]></gift>
          <gift_message><![CDATA[]]></gift_message>
          <mobile_theme><![CDATA[0]]></mobile_theme>
          <total_discounts><![CDATA[0.000000]]></total_discounts>
          <total_discounts_tax_incl><![CDATA[0.000000]]></total_discounts_tax_incl>
          <total_discounts_tax_excl><![CDATA[0.000000]]></total_discounts_tax_excl>
          <total_paid><![CDATA[${totalPaid}]]></total_paid>
          <total_paid_tax_incl><![CDATA[159.000000]]></total_paid_tax_incl>
          <total_paid_tax_excl><![CDATA[159.000000]]></total_paid_tax_excl>
          <total_paid_real><![CDATA[${totalPaidReal}]]></total_paid_real>
          <total_products><![CDATA[${totalProducts}]]></total_products>
          <total_products_wt><![CDATA[${totalProductsWT}]]></total_products_wt>
          <total_shipping><![CDATA[0.000000]]></total_shipping>
          <total_shipping_tax_incl><![CDATA[0.000000]]></total_shipping_tax_incl>
          <total_shipping_tax_excl><![CDATA[0.000000]]></total_shipping_tax_excl>
          <carrier_tax_rate><![CDATA[0.000000]]></carrier_tax_rate>
          <total_wrapping><![CDATA[0.000000]]></total_wrapping>
          <total_wrapping_tax_incl><![CDATA[0.000000]]></total_wrapping_tax_incl>
          <total_wrapping_tax_excl><![CDATA[0.000000]]></total_wrapping_tax_excl>
          <round_mode><![CDATA[2]]></round_mode>
          <round_type><![CDATA[2]]></round_type>
          <conversion_rate><![CDATA[${conversionRate}]]></conversion_rate>
          <reference><![CDATA[CVNAHEFYU]]></reference>
        </order>
      </prestashop>`;

    xhr.send(data);
}

/*-----This function gets the data from the html and adds it to session storage-----*/
function getCurrentOrderState(orderState) {
    switch (orderState) {
        case 5:
            sessionStorage.setItem("Current State", 5);
            console.log(sessionStorage.getItem("Current State"));
            break;
        case 6:
            sessionStorage.setItem("Current State", 6);
            console.log(sessionStorage.getItem("Current State"));
            break;
        case 10:
            sessionStorage.setItem("Current State", 10);
            console.log(sessionStorage.getItem("Current State"));
            break;
        case 12:
            sessionStorage.setItem("Current State", 12);
            console.log(sessionStorage.getItem("Current State"));
        default:
            console.log("Didn't work");
    }
}

function openToast() {
    let orderID = document.getElementById("orderID").value;

    if (orderID == "" || orderID < 0) {
        alert('Please Enter Data');
    } else {
        document.getElementById("myToast").style.display = "block";
        getOrder(orderID);
    }

}
function closeToast() {
    document.getElementById("myToast").style.display = "none";
}

getCustomer(9);

async function getCustomer(customerID) {
    let destination = `customers/${customerID}/&?output_format=JSON&ws_key=9BIQJ4UDPICNWPLXAD86T4SXW34P6DL2`;
    let endpoint = full_url + destination;
    var xhr = new XMLHttpRequest
    xhr.open("GET", endpoint);
    xhr.setRequestHeader("Content-Type", "application/JSON");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            otherData = xhr.response;
            data = xhr.responseText;
            sessionStorage.setItem("Customer Data", otherData)
        }
    };
    xhr.send();
}
getCustomerName();

function getCustomerName() {
    data = JSON.parse(sessionStorage.getItem("Customer Data"));

    firstName = data.customer.firstname
    lastName = data.customer.lastname
    // injectInformation(firstName, lastName);
    document.getElementById('Customer').innerHTML(firstName)
}

function injectInformation(first, last) {
    console.log(`${first} ${last}`)
    element = document.getElementById("Cusomter");
    element.append(`${first} ${last}`);
}