import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [jsonInput, setJsonInput] = useState(''); // For handling input
    const [response, setResponse] = useState(null); // For storing API response
    const [selectedOptions, setSelectedOptions] = useState([]); // For storing selected dropdown options

    // Handle input change in text area
    const handleJsonInput = (e) => {
        setJsonInput(e.target.value);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Print raw JSON input for debugging
        console.log("Raw JSON Input:", jsonInput);

        try {
            // Try to parse the JSON input
            const data = JSON.parse(jsonInput);
            console.log("Parsed Data:", data);

            // Validate parsed data format
            if (!data || !data.data || !Array.isArray(data.data)) {
                alert('Invalid JSON format: Expected { "data": [...] }');
                return;
            }

            // Log before making API call
            console.log("Sending data to backend:", data.data);

            // Make POST request to backend
            const res = await axios.post('https://trail2-sandy.vercel.app/bfhl', { data: data.data });

            // Log API response for debugging
            console.log("API Response:", res.data);

            // Save the response to state
            setResponse(res.data);

        } catch (error) {
            console.error('Error occurred during submission:', error);

            // Check if the backend responded with an error
            if (error.response) {
                console.error('Backend responded with an error:', error.response.data);
                alert('Server error: ' + error.response.data.message);
            } else {
                // Log if there's a network or parsing issue
                console.error('Client-side error or invalid input:', error.message);
                alert('Invalid JSON input or server error. Please check your input or try again later.');
            }
        }
    };

    // Handle multi-select dropdown selection
    const handleSelectChange = (event) => {
        const options = event.target.options;
        const selectedValues = [];

        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedValues.push(options[i].value);
            }
        }

        setSelectedOptions(selectedValues);
    };

    // Render the response data based on selected options
    const renderResponse = () => {
        if (!response) return null;

        const displayData = {};
        if (selectedOptions.includes('numbers')) displayData.numbers = response.numbers;
        if (selectedOptions.includes('alphabets')) displayData.alphabets = response.alphabets;
        if (selectedOptions.includes('highestAlphabets')) displayData.highest_alphabet = response.highest_alphabet;

        return (
            <div>
                <h3>Response Data:</h3>
                <pre>{JSON.stringify(displayData, null, 2)}</pre>
            </div>
        );
    };

    return (
        <div className="App">
            <h1>BFHL Frontend</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={jsonInput}
                    onChange={handleJsonInput}
                    placeholder='Enter JSON request here'
                    rows="5"
                    cols="50"
                ></textarea>
                <br />
                <button type="submit">Submit</button>
            </form>

            {/* Multi-select dropdown to display options */}
            {response && (
                <div>
                    <h3>Select Data to Display</h3>
                    <select multiple={true} onChange={handleSelectChange}>
                        <option value="numbers">Numbers</option>
                        <option value="alphabets">Alphabets</option>
                        <option value="highestAlphabets">Highest Alphabets</option>
                    </select>
                </div>
            )}

            {renderResponse()}
        </div>
    );
}

export default App;
