const API_KEY = 'AIzaSyAaja3hDnEOYASt6x7Uz2M-PY3m1N-RahQ';
const SPREADSHEET_ID = '1_tiF71t5Fw_8kMN2lRwkeh79yAhmXW_iArezdelO5LI';
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
    axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${1_tiF71t5Fw_8kMN2lRwkeh79yAhmXW_iArezdelO5LI}/values/${RANGE}?key=${AIzaSyAaja3hDnEOYASt6x7Uz2M-PY3m1N-RahQ}`)
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


