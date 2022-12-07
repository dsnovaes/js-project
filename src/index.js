import * as staticData from "./scripts/data"
import Chart from 'chart.js/auto';

document.addEventListener("DOMContentLoaded", () => {
    // formats the timestamp
    const formattedTimestamp = (timestamp) => {
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        let date = new Date(timestamp * 1000);
        // Hours part from the timestamp
        let hours = date.getHours();
        // Minutes part from the timestamp
        let minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        let seconds = "0" + date.getSeconds();
        // Will display time in 10:30:23 format
        let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        document.querySelector("#exchangeStatus strong").innerHTML = formattedTime;
        return formattedTime;
    }

    let currencies = JSON.parse(localStorage.getItem("currencies")) || {};

    async function fetchAndUpdate(shouldForce = false) {

        let myCookie = document.cookie;

        // checks if there is a cookie
        if (myCookie.split(";").indexOf("currenciesUpdated=true") !== -1) {
            // if there's a cookie, then do nothing
            console.log("cookie found", myCookie)
            // console.log("currencies before the fetch",JSON.stringify(currencies))
        } else {
            // if there isn't a cookie, creates the cookie 
            console.warn("cookie not found")
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            const end2 = new Date();
            end2.setDate(end.getDate() + 1)
            document.cookie = `currenciesUpdated=true;expires=${end2}; path=/`;
            // document.cookie = "currenciesUpdated=true;expires=;path=/";
            if (myCookie.split(";").indexOf("currenciesUpdated=true") !== -1) { console.warn("cookie created") }
        }

        // if shouldForce is set to true then fetch the api 
        // and update currencies in the local storage
        if (shouldForce) {
            let myHeaders = new Headers();
            myHeaders.append("apikey", "i6Gvyy6na70P0E5YGt4d2FyO7dlu59mk");

            let requestOptions = {
                method: 'GET',
                redirect: 'follow',
                headers: myHeaders
            };

            await fetch("https://api.apilayer.com/currency_data/live?source=USD&currencies=BRL%2CEUR%2CINR%2CRUB%2CCNY", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log("fetching api and setting the results to local storage")
                    localStorage.setItem('currencies', JSON.stringify(result))
                    formattedTimestamp(currencies.timestamp)
                    console.log("exchange rates updated in local storage")
                    return JSON.stringify(result)
                })
                .catch((error) => {
                    console.error('error', error)
                });
        } else {
            console.warn("exchange rates (not) updated")
            return currencies
        }

        
    }

    let btnUpdate = document.querySelector("header button")
    btnUpdate.addEventListener("click",(e)=>{
        e.preventDefault();
        currencies = fetchAndUpdate(true)
    })

    // populate section "products"
    function populateProducts() {
        const productsContainer = document.getElementById("products")
        productsContainer.innerHTML = "";

        Object.entries(staticData.products).forEach((product,index) => {
            // creates the main div of a product
            const section = document.createElement("section");
            section.setAttribute("id",`product-${index}`)
            section.setAttribute("style",`background-color:${product[1].primaryColor};color:${product[1].secondaryColor}`)

            // creates elements and populates them
            const asideInfo = document.createElement("aside")
            asideInfo.setAttribute("class","info")
            const asideCharts = document.createElement("aside")
            asideCharts.setAttribute("class","charts")
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

            // creates the tabs navigations and panels on the right
            const navTabs = document.createElement("nav")
            section.appendChild(asideCharts)
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
                    divTab.classList.add("tabPanel")
                    divTab.classList.add("selected")

                    // populates with data to create prices chart
                    const plainDiv = document.createElement("div")
                    const chartCanvas = document.createElement("canvas")
                    chartCanvas.setAttribute("id",`myChart-${product[0]}-prices`)
                    
                    plainDiv.appendChild(chartCanvas)
                    divTab.appendChild(plainDiv)
                    

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
                        divTab.classList.add("tabPanel")
                        divTab.classList.add("hidden")
    
                        // populates with data to create prices chart
                        const plainDiv = document.createElement("div")
                        const chartCanvas = document.createElement("canvas")
                        chartCanvas.setAttribute("id",`myChart-${product[0]}-minWage`)
                        
                        plainDiv.appendChild(chartCanvas)
                        divTab.appendChild(plainDiv)


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
                    divTab.classList.add("tabPanel")
                    divTab.classList.add("hidden")

                    // populates with data to create prices chart
                    const plainDiv = document.createElement("div")
                    const chartCanvas = document.createElement("canvas")
                    chartCanvas.setAttribute("id",`myChart-${product[0]}-days`)
                    
                    plainDiv.appendChild(chartCanvas)
                    divTab.appendChild(plainDiv)


                }
                
                chartPanel.appendChild(divTab)
                
                navTabs.appendChild(btnTab)
            }
            asideCharts.appendChild(navTabs)
            asideCharts.appendChild(chartPanel)

            // logic to set 'selected' when a tab is clicked
            navTabs.addEventListener("click",(e) => {
                // lists all tabs of the product and removes 'selected' class
                const buttons = document.querySelectorAll(`#product-${index} nav button`) 
                Object.values(buttons).forEach(btn => btn.classList.remove("selected"))

                // lists all tab panels of the product and removes 'selected' class
                const tabs = document.querySelectorAll(`.product-${index}-panel > div`) 
                Object.values(tabs).forEach(tab => tab.classList.add("hidden"))
                Object.values(tabs).forEach(tab => tab.classList.remove("selected"))

                // enables 'selected' only to the clicked tab and panel
                e.target.classList.add("selected")
                document.getElementById(e.path[0].attributes[0].value).classList.remove("hidden")
                document.getElementById(e.path[0].attributes[0].value).classList.add("selected")
            })

            // appends asideInfo to div and div to container
            section.appendChild(asideInfo)
            section.appendChild(asideCharts)

            productsContainer.appendChild(section)


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

    fetchAndUpdate()

    // calculates the conversion
    function _convertCurrency(currency,cost) {
        let rate = currencies.quotes["USD" + currency] || 1 // in this case 1 represents USD to USD conversion
        return cost / rate
    }

    // returns the object of a product with converted prices 
    function listPrices(product,format = true) {
        let prices = []
        // if (product[0] === "mcchicken") console.log(product)
        Object.entries(product[1].prices).forEach((country) => {
            let countryPrice = {}
            countryPrice[country[0]] = _convertCurrency(country[0],country[1])
            if (format) {
                countryPrice[country[0]] = countryPrice[country[0]].toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                })
            }
            prices.push(countryPrice)
        })
        return prices
    }

    function percentageMinimumWage(product) {
        let prices = listPrices(product,false)
        let salariesUSD = []
        let salaries = Object.entries(staticData.countries)
        salaries.forEach((country)=> {
            let countryMinWage = 0;
            countryMinWage = _convertCurrency(Object.keys(country[1])[0],country[1][Object.keys(country[1])[0]])
            salariesUSD.push(countryMinWage)
        })
        let percentage = []
        for (let i = 0; i < salariesUSD.length; i++) {
            let eachPercentage = {}
            eachPercentage[Object.keys(prices[i])[0]] = ((prices[i][Object.keys(prices[i])[0]] / salariesUSD[i]) * 100).toFixed(2)
            percentage.push(eachPercentage)
        }
        // console.log(`Percentage ${product[1].title}`,percentage)
        return percentage
    }


    function days(product) {
        let prices = listPrices(product,false)
        let salariesUSD = []
        let salaries = Object.entries(staticData.countries)
        salaries.forEach((country)=> {
            let countryMinWage = 0;
            countryMinWage = _convertCurrency(Object.keys(country[1])[0],country[1][Object.keys(country[1])[0]])
            salariesUSD.push(countryMinWage)
        })
        let days = []
        for (let i = 0; i < salariesUSD.length; i++) {
            let eachPercentage = {}
            let perDay = (Object.values(prices[i]) / (salariesUSD[i] / 30)).toFixed(2)
            eachPercentage[Object.keys(prices[i])[0]] = (Object.values(prices[i]) / (salariesUSD[i] / 30)).toFixed(2)
            days.push(eachPercentage)
        }
        // console.log(`Days ${product[1].title}`,days)
        return days
    }

    // swapping country names
    let i = 0;
    let text = "USA";
    let countriesNames = Object.keys(staticData.countries)
    document.querySelector(".headline h2 span").innerHTML = countriesNames.length;
    function _getChangedText() {
        i = (i + 1) % countriesNames.length;
        return text.replace(/USA/, countriesNames[i]);
    }
    function _changeText() {
        let txt = _getChangedText();
        document.querySelector(".headline h1 span").innerHTML = txt;
    }
    setInterval(_changeText, 2500);


    function _renderChart(type,product) {

        let showData = []
        let showLabel = "";
        if (type === "prices") {
            listPrices(product,false).forEach(p=>{
                Object.values(p).forEach((v)=>{
                    showData.push(v)
                })
            })
            showLabel = "Price in dollars";

        } else if (type === "minWage") {
            percentageMinimumWage(product,false).forEach(p=>{
                Object.values(p).forEach((v)=>{
                    showData.push(v)
                })
            })
            showLabel = "Percentage";
        } else if (type === "days") {
            days(product,false).forEach(p=>{
                Object.values(p).forEach((v)=>{
                    showData.push(v)
                })
                
            })
            showLabel = "Days of labor";
        } else {
            return;
        }

        const ctx = document.getElementById(`myChart-${product[0]}-${type}`);

                new Chart(ctx, {
                    type: 'bar',
                    data: {
                    labels: Object.keys(staticData.countries),
                    datasets: [{
                        label: showLabel,
                        data: showData,
                        borderWidth: 1
                    }]
                    },
                    options: {
                        scales: {
                            y: {
                            beginAtZero: true
                            }
                        },
                        backgroundColor: product[1].secondaryColor,
                        hoverBackgroundColor: '#ffffff',
                        borderColor: '#ff9900'
                    }
                });
        }
     
        function createCharts() {
            Object.entries(staticData.products).forEach((product) => {
                _renderChart("prices",product)
                _renderChart("minWage",product)
                _renderChart("days",product)
            })
        }
    
        createCharts()
});

