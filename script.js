// 1. 정보를 변수에 담습니다. (문자열이므로 반드시 ' ' 따옴표로 감싸야 합니다)
const SPREADSHEET_ID = '1_tiF71t5Fw_8kMN2lRwkeh79yAhmXW_iArezdelO5LI';
const API_KEY = 'AIzaSyAaja3hDnEOYASt6x7Uz2M-PY3m1N-RahQ';
const SHEET_NAME = '대구ME발표팀'; 
const RANGE = `${SHEET_NAME}!B:G`; 

async function searchData() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (!searchTerm) {
        alert('이름 또는 세례명을 입력하세요.');
        return;
    }

    // 2. URL 생성 시 변수 이름만 넣습니다. (값 자체를 직접 넣지 마세요)
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(RANGE)}?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            displayResults(data.values, searchTerm);
        } else {
            console.error('API Error:', data.error);
            alert("데이터를 가져오지 못했습니다. 시트 공유 설정과 시트 이름을 확인하세요.");
        }
    } catch (error) {
        alert("네트워크 오류가 발생했습니다.");
    }
}

function displayResults(rows, term) {
    const tbody = document.getElementById('resultBody');
    tbody.innerHTML = '';
    
    if (!rows) return;

    // 검색어 필터링
    const filtered = rows.filter(row => row.some(cell => cell.toString().includes(term)));

    if (filtered.length === 0) {
        alert('검색 결과가 없습니다.');
        return;
    }

    // 결과 출력 (순번 추가)
    filtered.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${row[0] || ''}</td>
            <td>${row[1] || ''}</td>
            <td>${row[2] || ''}</td>
            <td>${row[3] || ''}</td>
            <td>${row[4] || ''}</td>
            <td>${row[5] || ''}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('result-section').style.display = 'block';
}
