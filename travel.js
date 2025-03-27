function searchCondition() {
    const input = document.getElementById('conditionInput').value.toLowerCase();
    const resultDiv = document.getElementById('searchResults');
    const resultsGrid = document.getElementById('resultsGrid');
    const noResults = document.getElementById('noResults');

    fetch('./travel.json')
        .then(response => response.json())
        .then(data => {
            let results = [];
            resultsGrid.innerHTML = '';

            // Handle different search categories
            if (input.includes('beach') || input.includes('beaches')) {
                results = data.beaches;
            } else if (input.includes('temple') || input.includes('temples')) {
                results = data.temples;
            } else if (input.includes('country') || input.includes('countries')) {
                results = data.countries.reduce((acc, country) => {
                    return acc.concat(country.cities);
                }, []);
            } else {
                // Search across all categories
                const allResults = [
                    ...data.countries.flatMap(country => country.cities),
                    ...data.temples,
                    ...data.beaches
                ];
                
                results = allResults.filter(item => 
                    item.name.toLowerCase().includes(input) ||
                    item.description.toLowerCase().includes(input)
                );
            }

            // Display results
            if (results.length > 0) {
                resultDiv.classList.remove('hidden');
                noResults.classList.add('hidden');
                resultsGrid.classList.remove('hidden');
                
                results.forEach(result => {
                    const card = document.createElement('div');
                    card.className = 'bg-white rounded-lg shadow-lg overflow-hidden';
                    card.innerHTML = `
                        <img src="${result.imageUrl}" alt="${result.name}" class="w-full h-48 object-cover">
                        <div class="p-4">
                            <h3 class="text-xl font-semibold text-gray-800">${result.name}</h3>
                            <p class="text-gray-600 mt-2">${result.description}</p>
                        </div>
                    `;
                    resultsGrid.appendChild(card);
                });
            } else {
                resultDiv.classList.remove('hidden');
                noResults.classList.remove('hidden');
                resultsGrid.classList.add('hidden');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.innerHTML = 'An error occurred while fetching data.';
        });
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('button[type="submit"]');
    const resetButton = document.querySelector('button[type="reset"]');
    const searchInput = document.getElementById('conditionInput');

    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        searchCondition();
    });

    resetButton.addEventListener('click', () => {
        searchInput.value = '';
        document.getElementById('searchResults').classList.add('hidden');
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchCondition();
        }
    });
});