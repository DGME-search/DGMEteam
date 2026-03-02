// 설정 정보
const SPREADSHEET_ID = '1_tiF71t5Fw_8kMN2lRwkeh79yAhmXW_iArezdelO5LI';
const API_KEY = 'AIzaSyAaja3hDnEOYASt6x7Uz2M-PY3m1N-RahQ';

/** * 중요: 구글 시트 하단 탭 이름이 'Sheet1'이 아닐 경우 
 * 실제 이름(예: '시트1' 또는 '발표팀')으로 수정하세요. 
 */
const SHEET_NAME = '대구ME발표팀'; 
const RANGE = `${SHEET_NAME}!B:G`; // B열(차수)부터 G열(자신부부)까지 가져옴

async function searchData() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    
    if (!searchTerm) {
        alert('이름 또는 세례명을 입력하세요.');
        return;
    }

    // API 호출 URL (인코딩 포함)
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${1_tiF71t5Fw_8kMN2lRwkeh79yAhmXW_iArezdelO5LI}/values/${encodeURIComponent('대구ME발표팀')}?key=${AIzaSyAaja3hDnEOYASt6x7Uz2M-PY3m1N-RahQ}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            processResults(data.values, searchTerm);
        } else {
            // 400 에러 발생 시 상세 원인 출력
            console.error('Error Details:', data.error);
            alert(`오류가 발생했습니다.\n원인: ${data.error.message}\n(시트 이름 '${SHEET_NAME}'과 공유 설정을 확인하세요.)`);
        }
    } catch (error) {
        console.error('Network Error:', error);
        alert('서버에 연결할 수 없습니다. 인터넷 연결을 확인해 주세요.');
    }
}

function processResults(rows, term) {
    const tbody = document.getElementById('resultBody');
    const resultSection = document.getElementById('result-section');
    tbody.innerHTML = ''; // 기존 결과 초기화

    if (!rows || rows.length === 0) {
        alert('데이터가 비어 있습니다.');
        return;
    }

    // 데이터 필터링 (B~G열 중 하나라도 검색어 포함 시)
    const filteredRows = rows.filter(row => {
        return row.some(cell => cell.toString().includes(term));
    });

    if (filteredRows.length === 0) {
        alert('검색 결과가 없습니다.');
        resultSection.style.display = 'none';
        return;
    }

    // 필터링된 결과 출력 (순번 추가)
    filteredRows.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td> <td>${row[0] || ''}</td> <td>${row[1] || ''}</td> <td>${row[2] || ''}</td> <td>${row[3] || ''}</td> <td>${row[4] || ''}</td> <td>${row[5] || ''}</td> `;
        tbody.appendChild(tr);
    });

    // 결과 화면 표시
    resultSection.style.display = 'block';
}

