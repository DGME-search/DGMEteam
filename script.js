const SPREADSHEET_ID = '1_tiF71t5Fw_8kMN2lRwkeh79yAhmXW_iArezdelO5LI';
const API_KEY = 'AIzaSyAaja3hDnEOYASt6x7Uz2M-PY3m1N-RahQ';
const RANGE = '대구ME발표팀!A:G'; // 시트 이름이 다를 경우 '시트이름!A:G'로 수정하세요.

// 로고 클릭 시 초기 화면으로 복구
document.getElementById('logo').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('result-area').style.display = 'none';
    document.getElementById('search-area').style.display = 'block';
});

async function searchData() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (!searchTerm) {
        alert('이름 또는 세례명을 입력하세요.');
        return;
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.values) {
            displayResults(data.values, searchTerm);
        } else {
            alert('데이터를 불러올 수 없습니다.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('서버 오류가 발생했습니다. API 키 및 설정을 확인하세요.');
    }
}

function displayResults(rows, term) {
    const tbody = document.getElementById('resultBody');
    tbody.innerHTML = ''; // 이전 결과 초기화
    
    // 헤더 제외 (첫 번째 줄이 제목일 경우)
    const dataRows = rows.slice(1); 
    
    // B(차수), C(년도), D(사제), E(성사), F(사회), G(자신) 열에서 검색
    const filtered = dataRows.filter(row => {
        return row.some((cell, index) => {
            // B~G열 (index 1~6) 범위 내에서 검색어 포함 여부 확인
            if (index >= 1 && index <= 6) {
                return cell.toString().includes(term);
            }
            return false;
        });
    });

    if (filtered.length === 0) {
        alert('검색 결과가 없습니다.');
        return;
    }

    filtered.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row[1] || ''}</td>
            <td>${row[2] || ''}</td>
            <td>${row[3] || ''}</td>
            <td>${row[4] || ''}</td>
            <td>${row[5] || ''}</td>
            <td>${row[6] || ''}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('result-area').style.display = 'block';

}
