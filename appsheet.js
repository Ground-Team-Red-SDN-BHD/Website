document.addEventListener('DOMContentLoaded', () => {
    // [PENTING] Tampal URL Web app anda di sini
    const API_URL = "https://script.google.com/a/macros/groundteamred.com/s/AKfycbyad-7COwmtRr6qpf9MHV8dNMiz4vc0_eWIGEKSEJh_gwj5PJuK-wLVRl3B1lam_gTI/exec";

    const container = document.getElementById('card-container');

    async function fetchData() {
        try {
            const response = await fetch(API_URL, { mode: 'no-cors' });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            
            container.innerHTML = ''; // Kosongkan mesej "Loading"

            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'data-card';

                // Anda boleh ubah suai kad ini mengikut data anda
                card.innerHTML = `
                    <img src="${item.ImageURL || 'placeholder.jpg'}" alt="${item.NAME}" class="card-image">
                    <div class="card-content">
                        <h3>${item.NAME}</h3>
                        <p>Station: ${item.STATION} | Status: ${item.APP}</p>
                        <a href="${item.LINK}" class="card-button" target="_blank">View Details</a>
                    </div>
                `;
                container.appendChild(card);
            });

        } catch (error) {
            container.innerHTML = '<p>Error loading data. Please check the API URL and permissions.</p>';
            console.error('Error:', error);
        }
    }

    fetchData();

});



