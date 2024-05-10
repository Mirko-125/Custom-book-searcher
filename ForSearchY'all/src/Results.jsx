import { useState, useEffect } from 'react'

function Results() {
    const [storedResults, setStoredResults] = useState('');

    useEffect(() => {
        const storedResults = JSON.parse(sessionStorage.getItem('results'));
        setStoredResults(storedResults);
        console.log(storedResults);
    }, []);

return (
    <>
        <div>
            Hits: {storedResults && console.log(storedResults.hits)}
        </div>
        <div>
            {storedResults.results && storedResults.results.map((result, index) => (
                <div key={index}>
                    <div>Title: {result.title}</div>
                    <div>Body: {result.body}</div>
                    <div>Modification Date: {result.modification_date}</div>
                    <div>
                        <a href={"http://localhost:8080/data/" + result.title} download>Download</a>
                    </div>
                </div>
            ))}
        </div>
        <div>
            {Math.ceil(storedResults.hits / 5) && Array.from({ length: Math.ceil(storedResults.hits / 5) }, (_, index) => (
                <a key={index} href={`http://localhost:8080/data?page=${index + 1}`}>{index + 1} </a>
            )
            )
            }
        </div>
    </>
)
}

export default Results
