// 1. 설정 정보 (여기에만 값을 넣으세요)
const SPREADSHEET_ID = '1_tiF71t5Fw_8kMN2lRwkeh79yAhmXW_iArezdelO5LI';
const API_KEY = 'AIzaSyAaja3hDnEOYASt6x7Uz2M-PY3m1N-RahQ';
const SHEET_NAME = '대구ME발표팀'; // 시트 탭 이름 반영
const RANGE = `${SHEET_NAME}!B:G`;

/**
 * 검색 실행 함수
 */
async function searchData() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        alert('이름 또는 세례명을 입력하세요.');
        return;
    }

    // 2. URL 생성 (변수 이름을 사용하여 안전하게 호출)
    const encodedRange = encodeURIComponent(RANGE);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodedRange}?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            processResults(data.values, searchTerm);
        } else {
            console.error('Google API Error:', data.error);
            alert(`데이터 로드 실패: ${data.error.message}\n구글 시트의 [공유] 설정이 '링크가 있는 모든 사용자'인지 확인하세요.`);
        }
    } catch (error) {
        console.error('Network Error:', error);
        alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
    }
}

/**
 * 결과를 표에 출력하는 함수
 */
function processResults(rows, term) {
    const tbody = document.getElementById('resultBody');
    const resultSection = document.getElementById('result-section');
    
    tbody.innerHTML = ''; 

    if (!rows || rows.length === 0) {
        alert('조회할 데이터가 시트에 없습니다.');
        return;
    }

    // 검색어 필터링
    const filteredRows = rows.filter(row => {
        return row.some(cell => cell.toString().includes(term));
    });

    if (filteredRows.length === 0) {
        alert('검색 결과가 없습니다.');
        resultSection.style.display = 'none';
        return;
    }

    // 순번(No.)을 포함하여 결과 생성
    filteredRows.forEach((row, index) => {
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

    resultSection.style.display = 'block';
}
