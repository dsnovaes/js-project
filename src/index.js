document.addEventListener("DOMContentLoaded", () => {

    // updates the currencies
    // still needs to have a logic that if it fails, 
    // the variable should have static values

    const exchangeRatesStatic = {
        "quotes": {
            "USDBRL": 5.185203,
            "USDCNY": 7.054298,
            "USDEUR": 0.94975,
            "USDINR": 81.180497,
            "USDRUB": 61.715006
        },
        "source": "USD",
        "success": true,
        "timestamp": 1669964283
    }


    function updateCurrencies() {
        // keep this false to save requests
        // change to true to fetch from the API
        let fetching = false;
        if (fetching) {
            var myHeaders = new Headers();
            myHeaders.append("apikey", "i6Gvyy6na70P0E5YGt4d2FyO7dlu59mk");
            let exchangeRates = {}
            var requestOptions = {
                method: 'GET',
                redirect: 'follow',
                headers: myHeaders
            };

            fetch("https://api.apilayer.com/currency_data/live?source=USD&currencies=BRL%2CEUR%2CINR%2CRUB%2CCNY", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log("exchange rates updated")
                    exchangeRates = result
                })
                .catch((error) => {
                    // makes sure that exchangeRates will have rates
                    exchangeRates = exchangeRatesStatic 
                    console.error('error', error)
                });

            return exchangeRates
        } else {
            console.log("exchange rates (not) updated")
            return exchangeRatesStatic
        }
    }

    function fetchingAPI() {
        // keep this false to save requests
        let fetching = true;
        // change to true to fetch from the API
        var resultStatic = "bla bla bla"
        let resultFromFetch = {}

        if (fetching) {
            var baseURL = "https://api.emailable.com/v1/verify?email=dnovaes@ftc.edu.br&api_key="
            var requestOptions = {
                method: 'GET'
            };
            var apikey = "test_90f87cd6d7112599232c"
            fetch(`${baseURL}${apikey}`)
                .then(response => response.json())
                .then(result => {
                    console.log("exchange rates updated", result)
                    resultFromFetch = result
                })
                .catch((error) => {
                    // makes sure that result will have rates
                    resultFromFetch = resultStatic 
                    console.error('error', error)
                });
        } else {
            console.log("exchange rates (not) updated")
        }
            console.log("printing result",resultFromFetch)
            return resultFromFetch
    }


    // static data

    const countries = ["Brazil", "China", "India", "Spain", "Russia", "USA"]

    const products = {
        mcchicken: {
            prices: {
                "BRL": 20.90,
                "CNY": 12,
                "EUR": 4.58,
                "INR": 112,
                "RUB": 100
            },
            primaryColor: "#FFC72C",
            secondaryColor: "#27251F",
            title: "Mc Chicken",
            subtitle: "Burger only, not the meal",
            imageOffset: null
        },
        corolla: {
            prices: {
                "BRL": 147790,
                "CNY": 120000,
                "EUR": 22100,
                "INR": 1646000,
                "RUB": 2032000
            },
            primaryColor: "#fff",
            secondaryColor: "#EB0A1E",
            title: "Toyota Corolla",
            subtitle: "2022 model, entry version",
            imageOffset: null
        },
        jeans: {
            prices: {
                "BRL": 460,
                "CNY": 439,
                "EUR": 110,
                "INR": 8500,
                "RUB": 8600
            },
            primaryColor: "#C41230",
            secondaryColor: "#fff",
            title: "Levi's Jeans",
            subtitle: "501® Original Fit Jeans",
            imageOffset: null
        },
        iphone: {
            prices: {
                "BRL": 9499,
                "CNY": 7999,
                "EUR": 1319,
                "INR": 129900,
                "RUB": 99990
            },
            primaryColor: "#000",
            secondaryColor: "#fff",
            title: "iPhone",
            subtitle: "iPhone 14 Pro 128GB",
            imageOffset: null
        },
        coke: {
            prices: {
                "BRL": 3.99,
                "CNY": 9.975, // 4-pack price, divided by 4 (39.9/4)
                "EUR": 1.95,
                "INR": 65,
                "RUB": 51.85
            },
            primaryColor: "#F40009",
            secondaryColor: "#fff",
            title: "Coke",
            subtitle: "1L (33oz) bottle",
            imageOffset: null
        }
    }
    window.products = products;

    // national average minimum wage: 22 CNY per hour
    // national average is about 5000 CNY per month

    const minimumWage = {
        "BRL": 1212,
        "CNY": 3872, // yuan / rmb => ChiNeseYuan
        "EUR": 1050,
        "INR": 9306,
        "RUB": 13617
    }


    // populate section "products"
    function populateProducts() {
        console.log("populating products")
        const productsContainer = document.getElementById("products")
        Object.entries(products).forEach((product) => {
            console.log("now populating " + product[1].title)
            const div = document.createElement("div");
            div.setAttribute("id",product[0])
            div.setAttribute("style",`background-color:${product[1].primaryColor};color:${product[1].secondaryColor}`)
            const h1 = document.createElement("h1")
            h1.innerHTML = product[1].title
            div.appendChild(h1)
            const h2 = document.createElement("h2")
            h2.innerHTML = product[1].subtitle
            div.appendChild(h2)
            productsContainer.appendChild(div)

            const ul = document.createElement("ul")
            div.appendChild(ul)
            const productPrices = listPrices(product)
            productPrices.forEach((price)=>{
                const li = document.createElement("li")
                li.innerHTML = price;
                ul.appendChild(li)
            })

        })
    }



    function repopulateAfterUpdateCurrencies() {
        // updateCurrencies()
        populateProducts()
    }
    const btnUpdate = document.querySelector("header button")
    // btnUpdate.addEventListener("click",repopulateAfterUpdateCurrencies)
    populateProducts()
    btnUpdate.addEventListener("click",() =>{
        const resultFromClick = fetchingAPI()
        console.log(resultFromClick)
    })

    // formats the timestamp

    const formattedTimestamp = (timestamp) => {
        let unix_timestamp = exchangeRateResponse.timestamp
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = new Date(unix_timestamp * 1000);
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();

        // Will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }

    // calculates the conversion
    function _convertCurrency(currency,cost) {
        let rate = exchangeRatesStatic.quotes["USD" + currency]
        return cost / rate
    }

    // returns the object of a product with converted prices 
    function listPrices(product) {
        let prices = []
        Object.entries(product[1].prices).forEach((country) => {
            prices.push(_convertCurrency(country[0],country[1]).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
            }))
        })
        return prices
    }

    // swapping country names
    var i = 0;
    var text = "USA";
    document.querySelector("h2 span").innerHTML = countries.length;
    function _getChangedText() {
        i = (i + 1) % countries.length;
        // console.log(countries[i]);
        // console.log(i);
        return text.replace(/USA/, countries[i]);
    }
    function _changeText() {
        var txt = _getChangedText();
        // console.log(txt);
        document.querySelector("h1 span").innerHTML = txt;
    }
    setInterval(_changeText, 2500);

    {/* <span id="changer">This is cool</span> */}

});