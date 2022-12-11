import * as staticData from "./scripts/data"
import Chart from 'chart.js/auto';
import * as API_KEY from './scripts/apiKey';

document.addEventListener("DOMContentLoaded", () => {

    const navProducts = document.getElementById("navProducts")
    const btnScrollUp = document.getElementById("scrollUp")
    btnScrollUp.addEventListener("click",function (e) {
        e.preventDefault();
        document.querySelector("#splash-screen").scrollIntoView();
    })

    window.addEventListener("scroll", () => {
        let element = document.querySelector("#splash-screen")
        var offset = element.getBoundingClientRect().top - element.offsetParent.getBoundingClientRect().top;
        const top = window.pageYOffset + window.innerHeight - offset;
        if (top > 1600) {
            btnScrollUp.style.display = "block"
        } else {
            btnScrollUp.style.display = "none"
        }
    }, { passive: false });

    let currencies = JSON.parse(localStorage.getItem("currencies")) || {};

    async function fetchAndUpdate(shouldForce = false) {
        let myCookie = document.cookie;

        if (myCookie.split(";").indexOf("currenciesUpdated=true") !== -1) {
            console.log("cookie found:", myCookie)
        } else {
            console.warn("cookie not found")
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1)
            document.cookie = `currenciesUpdated=true;expires=${tomorrow}; path=/`;
            if (myCookie.split(";").indexOf("currenciesUpdated=true") !== -1) { console.warn("cookie created") }
            shouldForce = true;
        }

        if (shouldForce) {
            let myHeaders = new Headers();
            myHeaders.append("apikey", API_KEY.API_KEY);
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
                    console.log("exchange rates updated in local storage")
                    populateProducts()
                    createCharts()
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
        localStorage.setItem('currencies', JSON.stringify(currencies))
    })

    // populate section "products"
    function populateProducts() {
        const productsContainer = document.getElementById("products")
        productsContainer.innerHTML = "";
        navProducts.innerHTML = '<button data-id="splash-screen"><i class="fa-solid fa-house"></i> <span data-id="splash-screen">Navigate to the top</span></button>';
        

        Object.entries(staticData.products).forEach((product,index) => {

            // creates a button in the navProducts
            const btnNavProduct = document.createElement("button")
            btnNavProduct.innerHTML = `${index+1} <span data-id=product-${index}>${product[1].title}</span>`
            btnNavProduct.setAttribute("data-id",`product-${index}`)
            navProducts.appendChild(btnNavProduct)

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
                    btnTab.innerHTML = "days of labor"
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
                if (e.target.tagName === "BUTTON") {
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
                }
            })

            navProducts.addEventListener("click",(e) => {
                if (e.target.tagName === "BUTTON" || e.target.tagName === "SPAN") {
                    e.preventDefault()
                    let anchor = e.target.getAttribute('data-id')
                    if (anchor === undefined) console.error(e.target);
                    document.getElementById(anchor).scrollIntoView()
                }
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
    const initialProduct = document.getElementById("products")
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
        let exchangeRates = currencies.quotes || staticData.staticExchangeRates.quotes
        let rate = exchangeRates["USD" + currency] || 1 // in this case 1 represents USD to USD conversion
        return cost / rate
    }

    function listPrices(product,format = true) {
        let prices = []
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
        
        return days
    }

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
        let showTitle = "";
        let showLabel = "";
        if (type === "prices") {
            listPrices(product,false).forEach(p=>{
                Object.values(p).forEach((v)=>{
                    showData.push(v)
                })
            })
            showTitle = "Price in Dollars";
            showLabel = "USD"

        } else if (type === "minWage") {
            percentageMinimumWage(product).forEach(p=>{
                Object.values(p).forEach((v)=>{
                    showData.push(v)
                })
            })
            showTitle = "Percentage of the minimum wage";
            showLabel = "%"
        } else if (type === "days") {
            days(product).forEach(p=>{
                Object.values(p).forEach((v)=>{
                    showData.push(v)
                })
                
            })
            showTitle = "Days of labor to afford the product";
            showLabel = "Days"
        } else {
            return;
        }

        const labels = Object.keys(staticData.countries);
        labels.map(country=>{
            return country.toLowerCase()
        })
        const ctx = document.getElementById(`myChart-${product[0]}-${type}`);

        let delayed;
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                    labels: labels,
                    datasets: [{
                        label: showLabel,
                        data: showData,
                        borderWidth: 1,
                        backgroundColor: product[1].secondaryColor,
                        hoverBackgroundColor: '#ffffff',
                        borderColor: product[1].borderColor, 
                    }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    zeroLineColor: product[1].secondaryColor,
                                    color: product[1].gridColor
                                },
                                border: {
                                    color: product[1].secondaryColor
                                },
                                ticks: {
                                    color: product[1].secondaryColor,
                                    font: {
                                        size: 18
                                    }
                                }
                            },
                            x: {
                                drawTicks: true,
                                beginAtZero: true,
                                grid: {
                                    zeroLineColor: product[1].secondaryColor,
                                    color: product[1].gridColor
                                },
                                border: {
                                    color: product[1].secondaryColor
                                },
                                ticks: {
                                    color: product[1].secondaryColor,
                                    font: {
                                        size: 18
                                    }
                                },
                                mirror: true
                            }
                        },
                        animation: {
                            onComplete: () => {
                                delayed = true;
                            },
                            delay: (context) => {
                                let delay = 0;
                                if (context.type === 'data' && context.mode === 'default' && !delayed) {
                                    delay = context.dataIndex * 300 + context.datasetIndex * 100;
                                }
                                return delay;
                            },
                        },
                        plugins:
                        {
                            legend: {
                                labels: {
                                    font: {
                                        size: 12
                                    },
                                    color: product[1].secondaryColor
                                }
                            },
                            title: {
                                display: true,
                                text: showTitle,
                                font: {
                                    size: 24
                                },
                                color: product[1].secondaryColor
                            }
                        }
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

