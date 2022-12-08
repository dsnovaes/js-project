# Libra

## Background
Where is McChicken cheapest to buy? 
Where is the best place to buy an iPhone? 
This project compares prices of some products in 6 different countries:
- Brazil
- China
- India
- Spain
- Russia
- USA

## Live version
Live version can be seen on [this link](https://dsnovaes.github.io/libra/)

## Instructions
Navigate through the slides to see the prices of the product in each country. Click on the "home" button to navigate back to the beggining.

## Technologies
### User Interface
- HTML
- CSS
### Programming
- DOM Manipulation
- Vanilla JavaScript
- API Fetch

## Libraries
- [Currency Data API](https://apilayer.com/marketplace/currency_data-api)
- [Chart.js](https://www.chartjs.org/)
- [Font Awesome](https://fontawesome.com/)

## Technical Implementation
To save resources and be more efficient the exchange rates are updated only once per day and saved to the user's browser, as an object in the local storage.
The application checks if there is a cookie called "currenciesUpdated" in the user's browser and if there isn't, then the cookie is created with the expiry of 1 day, the API is fetched and the results are saved to the local storage.
If the user loads the page on the next day the cookie won't exist and the exchange rates will be updated.

```javascript
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
```

## Future Features
### Data Analytics
- Implementation of some kind of web analytics, such as Google Analytics

### Feedback from the user
- Implementation of a contact form so the user can give suggestions of new products to be compared

### User Experience
- Add related news so the user can read more about the prices of a product around the world