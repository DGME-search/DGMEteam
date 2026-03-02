1 document.addEventListener('DOMContentLoaded', () => {                                                                             │
 │      2     const searchInput = document.getElementById('searchInput');                                                                   │
 │      3     const searchButton = document.getElementById('searchButton');                                                                 │
 │      4     const resultsContainer = document.getElementById('resultsContainer');                                                         │
 │      5     const loadingIndicator = document.getElementById('loadingIndicator');                                                     │
 │      6   const initialMessage = document.getElementById('initialMessage');                                                         │
 │      7                                                                                                                             │
 │      8 - // 사용자로부터 제공받은 정보                                                                                             │
 │      8   const API_KEY = 'AIzaSyAaja3hDnEOYASt6x7Uz2M-PY3m1N-RahQ';                                                                │
 │      9   const SPREADSHEET_ID = '1_tiF71t5Fw_8kMN2lRwkeh79yAhmXW_iArezdelO5LI';                                                    │
 │     11 - // 데이터가 있는 시트 이름 (기본값 'Sheet1')                                                                              │
 │     10   const SHEET_NAME = 'Sheet1';                                                                                              │
 │     13 - // 가져올 데이터 범위 (A열부터 G열까지)                                                                                   │
 │     11   const RANGE = 'A:G';                                                                                                      │
 │     12                                                                                                                             │
 │     13   const API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!${RANGE}?key=       │
 │          ${API_KEY}`;                                                                                                              │
 │    ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════  │
 │     29           if (!response.ok) {                                                                                               │
 │     30               const errorData = await response.json();                                                                      │
 │     31               const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;                    │
 │     35 -             throw new Error(`데이터를 불러오는 데 실패했습니다: ${errorMessage}`);                                        │
 │     32 +             throw new Error(`데이터 로딩 실패: ${errorMessage}`);                                                         │
 │     33           }                                                                                                                 │
 │     34                                                                                                                             │
 │     35           const data = await response.json();                                                                               │
 │     36           const rows = data.values || [];                                                                                   │
 │     37                                                                                                                             │
 │     41 -         if (rows.length === 0) {                                                                                          │
 │     38 +         if (rows.length < 2) { // 헤더 포함 최소 2줄은 있어야 데이터가 있는 것                                            │
 │     39               displayResults([], searchTerm);                                                                               │
 │     40               return;                                                                                                       │
 │     41           }                                                                                                                 │
 │     42                                                                                                                             │
 │     46 -         const headerRow = rows[0]; // 첫 번째 행을 헤더로 가정                                                            │
 │     47 -         const dataRows = rows.slice(1); // 나머지 행을 데이터로 사용                                                      │
 │     43 +         const dataRows = rows.slice(1);                                                                                   │
 │     44                                                                                                                             │
 │     45           const lowerCaseSearchTerm = searchTerm.toLowerCase();                                                             │
 │     46                                                                                                                             │
 │     47           const filteredData = dataRows.filter(row => {                                                                     │
 │     52 -             if (row.length < 7) return false; // 데이터가 부족한 행은 제외                                                │
 │     53 -             // B열부터 G열까지 (차수, 년도, 발표사제, 성사부부, 사회부부, 자신부부) 검색                                  │
 │     48 +             if (row.length < 7) return false;                                                                             │
 │     49               const searchRange = row.slice(1, 7).join(' ').toLowerCase();                                                  │
 │     50               return searchRange.includes(lowerCaseSearchTerm);                                                             │
 │     51           });                                                                                                               │
 │     52                                                                                                                             │
 │     58 -         displayResults(filteredData, searchTerm, headerRow);                                                              │
 │     53 +         displayResults(filteredData, searchTerm);                                                                         │
 │     54                                                                                                                             │
 │     55       } catch (error) {                                                                                                     │
 │     56           console.error(error);                                                                                             │
 │     60       }                                                                                                                     │
 │     61   }                                                                                                                         │
 │     62                                                                                                                             │
 │     68 - function displayResults(results, searchTerm, header) {                                                                    │
 │     63 + function displayResults(results, searchTerm) {                                                                            │
 │     64       resultsContainer.innerHTML = '';                                                                                      │
 │     65       if (results.length === 0) {                                                                                           │
 │     66           resultsContainer.innerHTML = `<p class="no-results">'${escapeHTML(searchTerm)}'에 대한 검색 결과가                │
 │          없습니다.</p>`;                                                                                                           │
 │     70       const table = document.createElement('table');                                                                        │
 │     71       table.className = 'results-table';                                                                                    │
 │     72                                                                                                                             │
 │     78 -     // 요청된 헤더 순서: 주말 차수, 주말날짜, 발표사제, 성사 부부, 사회 부부, 자신 부부                                   │
 │     73       const displayHeaders = ['주말 차수', '주말날짜', '발표사제', '성사 부부', '사회 부부', '자신 부부'];                  │
 │     74                                                                                                                             │
 │     75       const thead = document.createElement('thead');                                                                        │
 │    ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════  │
 │     85       const tbody = document.createElement('tbody');                                                                        │
 │     86       results.forEach(rowData => {                                                                                          │
 │     87           const tr = document.createElement('tr');                                                                          │
 │    ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════  │
 │     94 -         // B, C, D, E, F, G 열에 해당하는 데이터를 순서대로 표시                                                          │
 │     95 -         const columnsToShow = [                                                                                           │
 │     96 -             rowData[1], // B열: 주말 차수                                                                                 │
 │     97 -             rowData[2], // C열: 주말날짜                                                                                  │
 │     98 -             rowData[3], // D열: 발표사제                                                                                  │
 │     99 -             rowData[4], // E열: 성사 부부                                                                                 │
 │    100 -             rowData[5], // F열: 사회 부부                                                                                 │
 │    101 -             rowData[6]  // G열: 자신 부부                                                                                 │
 │    102 -         ];                                                                                                                │
 │     88 +         const columnsToShow = [ rowData[1], rowData[2], rowData[3], rowData[4], rowData[5], rowData[6] ];                 │
 │     89                                                                                                                             │
 │     90           columnsToShow.forEach(cellData => {                                                                               │
 │     91               const td = document.createElement('td');                                                                      │
 │    ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════  │
 │    106 -             td.textContent = cellData ? escapeHTML(cellData) : ''; // 데이터가 없는 경우 빈 문자열 처리                   │
 │     92 +             td.textContent = cellData ? escapeHTML(cellData) : '';                                                        │
 │     93               tr.appendChild(td);                                                                                           │
 │     94           });                                                                                                               │
 │     95           tbody.appendChild(tr);                                                                                            │
 │     99       resultsContainer.appendChild(table);                                                                                  │
 │    100   }                                                                                                                         │
 │    101                                                                                                                             │
 │    ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════  │
 │    116 - // XSS(Cross-Site Scripting) 공격 방지를 위한 간단한 HTML 이스케이프 함수                                                 │
 │    102   function escapeHTML(str) {                                                                                                │
 │    103       const p = document.createElement('p');                                                                                │
 │    104       p.appendChild(document.createTextNode(str));      