document.addEventListener('DOMContentLoaded', () => {
    
    // Fungsi untuk memuatkan dan memaparkan memo dari data2.json
    async function loadMemoEntries() {
        // [DIBAIKI] Menggunakan getElementById yang betul
        const container = document.getElementById('memo-container');
        if (!container) {
            console.error('Error: Element with id "memo-container" not found.');
            return;
        }

        try {
            // Muat turun kandungan dari fail data2.json
            const response = await fetch('data2.json');
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            const entries = await response.json();
            
            container.innerHTML = ''; // Kosongkan mesej 'Loading'

            if (entries.length === 0) {
                container.innerHTML = '<p>No memos found.</p>';
                return;
            }

            // Loop melalui setiap entri dan cipta elemen HTML yang betul
            entries.forEach(entry => {
                const memoItem = document.createElement('div');
                memoItem.className = 'memo-item';

                // Format tarikh
                const formattedDate = formatDate(new Date(entry.timestamp));

                // [DIBAIKI] Menggunakan struktur HTML yang betul untuk memo
                memoItem.innerHTML = `
                    <h4><span class="memo-date">${formattedDate}</span> | ${entry.title}</h4>
                    <p>${entry.description}</p>
                `;
                container.appendChild(memoItem);
            });

        } catch (error) {
            container.innerHTML = '<p style="color: red;">Error loading memos. Please check data2.json file and console.</p>';
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    // Fungsi bantuan untuk memformat tarikh (cth: 16 Jul 2025)
    function formatDate(date) {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options).replace(/ /g, ' ');
    }

    // Panggil fungsi utama apabila halaman dimuatkan
    loadMemoEntries();

    // Set tahun semasa di footer
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear().toString();
    }
});
