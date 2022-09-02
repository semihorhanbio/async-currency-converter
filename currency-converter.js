const axios = require('axios');

const getExchangeRate = async (fromCurrency, toCurrency) => {
    //const access_key = 'YOUR ACCESS KEY'
    const response = await axios.get('http://data.fixer.io/api/latest?access_key=f68b13604ac8e570a00f7d8fe7f25e1b&format=1')
    const rate = response.data.rates;
    const euro = 1 / rate[fromCurrency];
    const exchageRate = euro * rate[toCurrency];

    if(isNaN(exchageRate)) {
        throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`);
    }

    return exchageRate;
  
}

const getCountries = async (toCurrency) => {
    try {
        const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${toCurrency}`);
        return response.data.map(country => country.name);
    } catch {
        throw new Error(`Unable to get countries that use ${toCurrency}.`);
    }
}

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    const exchageRate = await getExchangeRate(fromCurrency, toCurrency);
    const countries = await getCountries(toCurrency);
    const convertedAmount = (exchageRate * amount).toFixed(2);
    return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spend these in the following countries ${countries}`;
}

convertCurrency('USD', 'EUR', 30)
    .then(message => console.log(message))
    .catch(error => console.log(error.message));