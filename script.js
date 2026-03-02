const API_KEY = 'YOUR_API_KEY';
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
const RANGE = 'Sheet1!B:G'; // 시트 범위

document.getElementById('logo').onclick = () => {
    document.getElementById('resultsContainer').style.display = 'none';
    document.getElementById('searchInput').value = '';
};

document.getElementById('searchButton').onclick = () => {
    const searchTerm = document.getElementById('searchInput').value;
    searchInSheet(searchTerm);
};

function searchInSheet(searchTerm) {
    axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`)
        .then(response => {
            const rows = response.data.values;
            const results = rows.filter(row => row.includes(searchTerm));
            displayResults(results);
        })
        .catch(error => {
            console.error('Error fetching data from Google Sheets', error);
        });
}

function displayResults(results) {
    const resultsBody = document.getElementById('resultsBody');
    resultsBody.innerHTML = '';

    results.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        resultsBody.appendChild(tr);
    });

    document.getElementById('resultsContainer').style.display = 'block';
}
