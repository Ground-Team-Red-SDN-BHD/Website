document.addEventListener('DOMContentLoaded', () => {
    
    // Fungsi untuk memuatkan dan memaparkan entri dari data.json
    async function loadLibraryEntries() {
        const container = document.getElementById('memo-container');
        if (!container) return;

        try {
            // Muat turun kandungan dari fail data.json
            const response = await fetch('data2.json');
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const entries = await response.json();
            
            container.innerHTML = ''; // Kosongkan mesej 'Loading'

            if (entries.length === 0) {
                container.innerHTML = '<p>No documents found.</p>';
                return;
            }

            // Loop melalui setiap entri dan cipta elemen HTML
            entries.forEach(entry => {
                const post = document.createElement('article');
                post.className = 'content-post';
                const date = new Date(entry.timestamp);
                const timeAgo = getTimeAgo(date);

                post.innerHTML = `
                    <div class="section-header-content">
                        <img src="circleGTR.png" alt="Avatar" class="post-avatar">
                        <div class="post-author">
                            <strong>${entry.author}</strong> posted a new document.
                            <span>${timeAgo}</span>
                        </div>
                    </div>
                    <div class="post-body">
                        <h3>${entry.title}</h3>
                        <p>${entry.description}</p>
                        <a href="${entry.fileLink}" class="btn-download-doc" target="_blank">View/Download</a>
                    </div>
                `;
                container.appendChild(post);
            });

        } catch (error) {
            container.innerHTML = '<p>Error loading documents.</p>';
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    // Fungsi bantuan untuk paparan 'time ago'
    function getTimeAgo(date) {
        // ... (fungsi getTimeAgo yang sama seperti sebelum ini) ...
    }

    // Panggil fungsi utama apabila halaman dimuatkan
    loadLibraryEntries();

    // ... (kod lain seperti untuk hamburger menu atau footer boleh diletak di sini) ...
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear().toString();
    }
});
