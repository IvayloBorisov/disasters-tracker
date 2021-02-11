import { useState, useEffect, useRef } from 'react';

const API_KEY = process.env.REACT_APP_GEOCAGE_API_KEY;

const Location = () => {

    const formValue = useRef(null);
    const [ inputAddress, setInputAddress ] = useState(null);
    const [coordinates, setCoordinates] = useState([]);

    useEffect(() => {
        if(inputAddress) {
            const getCoordinates = async () => {
                const fetchCoordinates = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${inputAddress}&key=${API_KEY}`);
                const {results} = await fetchCoordinates.json();
                  setCoordinates(results[0].geometry);
                }
            getCoordinates();
        }

    }, [inputAddress]);

    const handleClick = () => {
        const form = formValue.current;
        setInputAddress(form['address'].value)
    }

    const handleSubmit = event => {
        event.preventDefault();
    }

    return(
        <div>
            <form ref={formValue} onSubmit={handleSubmit}>
                <div>
                    <label>Address:</label>
                    <input name={'address'}/>
                </div>
            </form>
            <button onClick={handleClick} type="submit">Get Location</button>
        </div>
    )
}

export default Location;