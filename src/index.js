import * as charts from "./scripts/charts"
import * as staticData from "./scripts/data"

document.addEventListener("DOMContentLoaded", () => {

    // updates the currencies
    // still needs to have a logic that if it fails, 
    // the variable should have static values

    const btnUpdate = document.querySelector("#exchangeStatus button")
    btnUpdate.addEventListener("click",updateCurrencies)

    function updateCurrencies() {
        let icon = document.querySelector("#exchangeStatus button i")
        const btnUpdateText = document.querySelector("#exchangeStatus button span")
        icon.classList.add("rotate")
        btnUpdateText.textContent = "Updating currencies"

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
            icon.classList.remove("rotate")
            btnUpdateText.textContent = "Update currencies"
            return exchangeRates
        } else {
            console.log("exchange rates (not) updated")
            icon.classList.remove("rotate")
            btnUpdateText.textContent = "Update currencies"
            return exchangeRatesStatic
        }
        
    }

    




    // populate section "products"
    function populateProducts() {
        const productsContainer = document.getElementById("products")
        Object.entries(staticData.products).forEach((product,index) => {
            // creates the main div of a product
            const div = document.createElement("section");
            div.setAttribute("id",`product-${index}`)
            div.setAttribute("style",`background-color:${product[1].primaryColor};color:${product[1].secondaryColor}`)

            // creates elements and populates them
            const asideInfo = document.createElement("aside")
            asideInfo.setAttribute("class","info")
            const asideGraphs = document.createElement("aside")
            asideGraphs.setAttribute("class","graphs")
            const h1 = document.createElement("h1")
            h1.innerHTML = product[1].title
            const h2 = document.createElement("h2")
            h2.innerHTML = product[1].subtitle
            const image = document.createElement("img")
            image.setAttribute("src",`assets/img/${product[0]}.png`)
            image.setAttribute("alt",product[1].title) // for accessibility purposes

            // appends elements to asideInfo
            asideInfo.appendChild(h1)
            asideInfo.appendChild(h2)
            asideInfo.appendChild(image)


            // creates the 'previous' button if it isn't the first element
            if (index !== 0) {
                const btnPrevious = document.createElement("button")
                btnPrevious.setAttribute("style",`background-color:${product[1].primaryColor};color:${product[1].secondaryColor};border:1px solid ${product[1].secondaryColor};border-radius:5px;margin-right:15px;`)
                btnPrevious.innerHTML = '<i class="fa-solid fa-arrow-left"></i>'
                asideInfo.appendChild(btnPrevious)

                btnPrevious.addEventListener("click",function (e) {
                    e.preventDefault();
                    document.getElementById(`product-${index-1}`).scrollIntoView();
                })
            }

            // creates the 'next' button if it isn't the last element
            if (index !== Object.entries(staticData.products).length-1) {
                const btnNext = document.createElement("button")
                btnNext.setAttribute("style",`background-color:${product[1].secondaryColor};color:${product[1].primaryColor};border-radius:5px;border:0;`)
                btnNext.innerHTML = 'Next <i class="fa-solid fa-arrow-right" style="margin-left:30px;"></i>'
                asideInfo.appendChild(btnNext)

                btnNext.addEventListener("click",function (e) {
                    e.preventDefault();
                    document.getElementById(`product-${index+1}`).scrollIntoView();
                })
            }

            // creates the 'back to top' button if it is the last element
            if (index === Object.entries(staticData.products).length-1) {
                const btnTop = document.createElement("button")
                btnTop.setAttribute("style",`
                    background-color:${product[1].primaryColor};
                    color:${product[1].secondaryColor};
                    border-radius:5px;
                    border:1px solid ${product[1].secondaryColor};`)
                btnTop.innerHTML = 'Back to top <i class="fa-solid fa-arrow-up" style="margin-left:15px;"></i>'
                asideInfo.appendChild(btnTop)

                btnTop.addEventListener("click",function (e) {
                    e.preventDefault();
                    document.getElementById("splash-screen").scrollIntoView();
                })
            }

            // creates the tabs naviagations and panels on the right
            const navTabs = document.createElement("nav")
            div.appendChild(asideGraphs)
            let chartPanel = document.createElement("div")
            chartPanel.classList.add(`product-${index}-panel`)

            for (let i = 0; i < 3; i ++) {
                let btnTab = document.createElement("button")
                let divTab = document.createElement("div")
                btnTab.setAttribute("data-id",`product-${index}-tab-${i}`)
                if (i === 0) {
                    // creates the button
                    btnTab.innerHTML = "price"
                    btnTab.classList.add(`tab-${index}`)
                    btnTab.classList.add("selected")
                    btnTab.setAttribute("style",`
                        background-color:${product[1].primaryColor};
                        color:${product[1].secondaryColor};
                        border:1px solid ${product[1].secondaryColor};
                        border-radius:5px 0 0 5px;`)

                    // creates the panel
                    divTab.setAttribute("id",`product-${index}-tab-${i}`)
                    divTab.classList.add("selected")
                    divTab.innerHTML = `content for prices tab`
                    chartPanel.appendChild(divTab)

                } else if (i === 1) {
                    // creates the button
                    btnTab.innerHTML = "% minimum wage"
                    btnTab.classList.add(`tab-${index}`)
                    btnTab.setAttribute("style",`
                        background-color:${product[1].primaryColor};
                        color:${product[1].secondaryColor};
                        border:1px solid ${product[1].secondaryColor};
                        border-left:0;
                        border-right:0;
                        border-radius:0;`)

                    // creates the panel
                    divTab.setAttribute("id",`product-${index}-tab-${i}`)
                    divTab.classList.add("hidden")
                    divTab.innerHTML = `content for % minimum wage tab`
                    chartPanel.appendChild(divTab)

                } else if (i === 2) {
                    // creates the button
                    btnTab.innerHTML = "days to buy"
                    btnTab.classList.add(`tab-${index}`)
                    btnTab.setAttribute("style",`
                        background-color:${product[1].primaryColor};
                        color:${product[1].secondaryColor};
                        border:1px solid ${product[1].secondaryColor};
                        border-radius:0 5px 5px 0;`)

                    // creates the panel
                    divTab.setAttribute("id",`product-${index}-tab-${i}`)
                    divTab.classList.add("hidden")
                    divTab.innerHTML = `content for days of work tab`
                    chartPanel.appendChild(divTab)

                }
                
                navTabs.appendChild(btnTab)
            }
            asideGraphs.appendChild(navTabs)
            asideGraphs.appendChild(chartPanel)

            // logic to set 'selected' when a tab is clicked
            navTabs.addEventListener("click",(e) => {
                // lists all tabs of the product and removes 'selected' class
                const buttons = document.querySelectorAll(`#product-${index} nav button`) 
                Object.values(buttons).forEach(btn => btn.classList.remove("selected"))

                // lists all tab panels of the product and removes 'selected' class
                const tabs = document.querySelectorAll(`.product-${index}-panel div`) 
                Object.values(tabs).forEach(tab => tab.classList.add("hidden"))
                Object.values(tabs).forEach(tab => tab.classList.remove("selected"))

                // enables 'selected' only to the clicked tab and panel
                e.target.classList.add("selected")
                document.getElementById(e.path[0].attributes[0].value).classList.remove("hidden")
                document.getElementById(e.path[0].attributes[0].value).classList.add("selected")
            })

            // appends asideInfo to div and div to container
            div.appendChild(asideInfo)
            div.appendChild(asideGraphs)
            productsContainer.appendChild(div)

            // const ul = document.createElement("ul")
            // div.appendChild(ul)
            // const productPrices = listPrices(product)
            // productPrices.forEach((price)=>{
            //     const li = document.createElement("li")
            //     li.innerHTML = price;
            //     ul.appendChild(li)
            // })

        })
    }

    populateProducts()


    // creates a listener to the "start" button
    const btnStart = document.querySelector(".headline button")
    const initialProduct = document.getElementById("product-0")
    btnStart.addEventListener("click",function (e) {
        e.preventDefault();
        initialProduct.scrollIntoView();
    })

    // creates a listener so the footer becomes a link back to the top
    const footer = document.querySelector("footer")
    footer.addEventListener("click",function (e) {
        document.getElementById("splash-screen").scrollIntoView();
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
    document.querySelector(".headline h2 span").innerHTML = staticData.countries.length;
    function _getChangedText() {
        i = (i + 1) % staticData.countries.length;
        // console.log(countries[i]);
        // console.log(i);
        return text.replace(/USA/, staticData.countries[i]);
    }
    function _changeText() {
        var txt = _getChangedText();
        // console.log(txt);
        document.querySelector(".headline h1 span").innerHTML = txt;
    }
    setInterval(_changeText, 2500);


});