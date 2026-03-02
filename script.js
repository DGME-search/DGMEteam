1 document.addEventListener('DOMContentLoaded', () => {                                                                             │
 │      2     const searchInput = document.getElementById('searchInput');                                                                   │
 │      3     const searchButton = document.getElementById('searchButton');                                                                 │
 │      4     const resultsContainer = document.getElementById('resultsContainer');                                                         │
 │      5     const loadingIndicator = document.getElementById('loadingIndicator');                                                         │
 │      6     const initialMessage = document.getElementById('initialMessage');                                                             │
 │      7                                                                                                                                   │
 │      8     // 사용자로부터 제공받은 정보                                                                                                 │
 │      9     const API_KEY = 'AIzaSyAaja3hDnEOYASt6x7Uz2M-PY3m1N-RahQ';                                                                    │
 │     10     const SPREADSHEET_ID = '1_tiF71t5Fw_8kMN2lRwkeh79yAhmXW_iArezdelO5LI';                                                        │
 │     11     // 데이터가 있는 시트 이름 (기본값 'Sheet1')                                                                                  │
 │     12     const SHEET_NAME = 'Sheet1';                                                                                                  │
 │     13     // 가져올 데이터 범위 (A열부터 G열까지)                                                                                       │
 │     14     const RANGE = 'A:G';                                                                                                          │
 │     15                                                                                                                                   │
 │     16     const API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!${RANGE}?key=           │
 │        ${API_KEY}`;                                                                                                                      │
 │     17                                                                                                                                   │
 │     18     async function fetchDataAndSearch() {                                                                                         │
 │     19         const searchTerm = searchInput.value.trim();                                                                              │
 │     20         if (!searchTerm) {                                                                                                        │
 │     21             resultsContainer.innerHTML = '';                                                                                      │
 │     22             initialMessage.style.display = 'block';                                                                               │
 │     23             return;                                                                                                               │
 │     24         }                                                                                                                         │
 │     25                                                                                                                                   │
 │     26         initialMessage.style.display = 'none';                                                                                    │
 │     27         loadingIndicator.style.display = 'block';                                                                                 │
 │     28         resultsContainer.innerHTML = '';                                                                                          │
 │     29                                                                                                                                   │
 │     30         try {                                                                                                                     │
 │     31             const response = await fetch(API_URL);                                                                                │
 │     32             if (!response.ok) {                                                                                                   │
 │     33                 const errorData = await response.json();                                                                          │
 │     34                 const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;                        │
 │     35                 throw new Error(`데이터를 불러오는 데 실패했습니다: ${errorMessage}`);                                            │
 │     36             }                                                                                                                     │
 │     37                                                                                                                                   │
 │     38             const data = await response.json();                                                                                   │
 │     39             const rows = data.values || [];                                                                                       │
 │     40                                                                                                                                   │
 │     41             if (rows.length === 0) {                                                                                              │
 │     42                 displayResults([], searchTerm);                                                                                   │
 │     43                 return;                                                                                                           │
 │     44             }                                                                                                                     │
 │     45                                                                                                                                   │
 │     46             const headerRow = rows[0]; // 첫 번째 행을 헤더로 가정                                                                │
 │     47             const dataRows = rows.slice(1); // 나머지 행을 데이터로 사용                                                          │
 │     48                                                                                                                                   │
 │     49             const lowerCaseSearchTerm = searchTerm.toLowerCase();                                                                 │
 │     50                                                                                                                                   │
 │     51             const filteredData = dataRows.filter(row => {                                                                         │
 │     52                 if (row.length < 7) return false; // 데이터가 부족한 행은 제외                                                    │
 │     53                 // B열부터 G열까지 (차수, 년도, 발표사제, 성사부부, 사회부부, 자신부부) 검색                                      │
 │     54                 const searchRange = row.slice(1, 7).join(' ').toLowerCase();                                                      │
 │     55                 return searchRange.includes(lowerCaseSearchTerm);                                                                 │
 │     56             });                                                                                                                   │
 │     57                                                                                                                                   │
 │     58             displayResults(filteredData, searchTerm, headerRow);                                                                  │
 │     59                                                                                                                                   │
 │     60         } catch (error) {                                                                                                         │
 │     61             console.error(error);                                                                                                 │
 │     62             resultsContainer.innerHTML = `<p class="no-results">${error.message}</p>`;                                            │
 │     63         } finally {                                                                                                               │
 │     64             loadingIndicator.style.display = 'none';                                                                              │
 │     65         }                                                                                                                         │
 │     66     }                                                                                                                             │
 │     67                                                                                                                                   │
 │     68     function displayResults(results, searchTerm, header) {                                                                        │
 │     69         resultsContainer.innerHTML = '';                                                                                          │
 │     70         if (results.length === 0) {                                                                                               │
 │     71             resultsContainer.innerHTML = `<p class="no-results">'${escapeHTML(searchTerm)}'에 대한 검색 결과가                    │
 │        없습니다.</p>`;                                                                                                                   │
 │     72             return;                                                                                                               │
 │     73         }                                                                                                                         │
 │     74                                                                                                                                   │
 │     75         const table = document.createElement('table');                                                                            │
 │     76         table.className = 'results-table';                                                                                        │
 │     77                                                                                                                                   │
 │     78         // 요청된 헤더 순서: 주말 차수, 주말날짜, 발표사제, 성사 부부, 사회 부부, 자신 부부                                       │
 │     79         const displayHeaders = ['주말 차수', '주말날짜', '발표사제', '성사 부부', '사회 부부', '자신 부부'];                      │
 │     80                                                                                                                                   │
 │     81         const thead = document.createElement('thead');                                                                            │
 │     82         const headerRow = document.createElement('tr');                                                                           │
 │     83         displayHeaders.forEach(text => {                                                                                          │
 │     84             const th = document.createElement('th');                                                                              │
 │     85             th.textContent = text;                                                                                                │
 │     86             headerRow.appendChild(th);                                                                                            │
 │     87         });                                                                                                                       │
 │     88         thead.appendChild(headerRow);                                                                                             │
 │     89         table.appendChild(thead);                                                                                                 │
 │     90                                                                                                                                   │
 │     91         const tbody = document.createElement('tbody');                                                                            │
 │     92         results.forEach(rowData => {                                                                                              │
 │     93             const tr = document.createElement('tr');                                                                              │
 │     94             // B, C, D, E, F, G 열에 해당하는 데이터를 순서대로 표시                                                              │
 │     95             const columnsToShow = [                                                                                               │
 │     96                 rowData[1], // B열: 주말 차수                                                                                     │
 │     97                 rowData[2], // C열: 주말날짜                                                                                      │
 │     98                 rowData[3], // D열: 발표사제                                                                                      │
 │     99                 rowData[4], // E열: 성사 부부                                                                                     │
 │    100                 rowData[5], // F열: 사회 부부                                                                                     │
 │    101                 rowData[6]  // G열: 자신 부부                                                                                     │
 │    102             ];                                                                                                                    │
 │    103                                                                                                                                   │
 │    104             columnsToShow.forEach(cellData => {                                                                                   │
 │    105                 const td = document.createElement('td');                                                                          │
 │    106                 td.textContent = cellData ? escapeHTML(cellData) : ''; // 데이터가 없는 경우 빈 문자열 처리                       │
 │    107                 tr.appendChild(td);                                                                                               │
 │    108             });                                                                                                                   │
 │    109             tbody.appendChild(tr);                                                                                                │
 │    110         });                                                                                                                       │
 │    111         table.appendChild(tbody);                                                                                                 │
 │    112                                                                                                                                   │
 │    113         resultsContainer.appendChild(table);                                                                                      │
 │    114     }                                                                                                                             │
 │    115                                                                                                                                   │
 │    116     // XSS(Cross-Site Scripting) 공격 방지를 위한 간단한 HTML 이스케이프 함수                                                     │
 │    117     function escapeHTML(str) {                                                                                                    │
 │    118         const p = document.createElement('p');                                                                                    │
 │    119         p.appendChild(document.createTextNode(str));                                                                              │
 │    120         return p.innerHTML;                                                                                                       │
 │    121     }                                                                                                                             │
 │    122                                                                                                                                   │
 │    123     searchButton.addEventListener('click', fetchDataAndSearch);                                                                   │
 │    124     searchInput.addEventListener('keyup', (event) => {                                                                            │
 │    125         if (event.key === 'Enter') {                                                                                              │
 │    126             fetchDataAndSearch();                                                                                                 │
 │    127         }                                                                                                                         │
 │    128     });                                                                                                                           │
 │    129 });                                             