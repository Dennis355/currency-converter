import React from 'react';
import {Block} from './Block';
import './index.scss';

function App() {
    const [fromCurrensy, setFromCurrensy] = React.useState('UAH');
    const [toCurrensy, setToCurrensy] = React.useState('USD');
    const [fromPrice, setFromPrice] = React.useState(0);
    const [toPrice, setToPrice] = React.useState(1);


    const ratesRef = React.useRef({});

    React.useEffect(() => {
        fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
            .then(response => response.json())
            .then(data => {
                const transformedData = data.reduce((acc, item) => {
                    acc[item.cc] = item.rate;
                    return acc;
                }, {});
                transformedData['UAH'] = 1;
                ratesRef.current = transformedData;
                onChangeToPrice(1)
            })
            .catch(error => console.error('Ошибка при запросе:', error));
    }, []);


    const onChangeFromPrice = (value) => {
        const price = value / ratesRef.current[toCurrensy];
        const result = price * ratesRef.current[fromCurrensy];

        setFromPrice(value);
        setToPrice(result.toFixed(2));
    }

    const onChangeToPrice = (value) => {
        const price = value / ratesRef.current[fromCurrensy];
        const result = price * ratesRef.current[toCurrensy];

        setFromPrice(result.toFixed(2));
        setToPrice(value);
    }

    React.useEffect(() => {
        onChangeFromPrice(fromPrice);
    }, [fromCurrensy]);

    React.useEffect(() => {
        onChangeToPrice(toPrice);
    }, [toCurrensy]);

    return (
        <div className="App">
            <Block value={fromPrice} currency={fromCurrensy} onChangeCurrency={setFromCurrensy}
                   onChangeValue={onChangeFromPrice}/>
            <Block value={toPrice} currency={toCurrensy} onChangeCurrency={setToCurrensy}
                   onChangeValue={onChangeToPrice}/>

        </div>
    );
}

export default App;
