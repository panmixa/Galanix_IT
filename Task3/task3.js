document.addEventListener('DOMContentLoaded', function() {
    const countryInput = document.getElementById('country-input');
    const submitBtn = document.getElementById('submit-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultsContainer = document.getElementById('results-container');
    const loader = document.getElementById('loader');

    submitBtn.addEventListener('click', function() {
        const country = countryInput.value.trim();
        if (country) {
            fetchUniversities(country);
        } else {
            alert('Пожалуйста, введите название страны');
        }
    });

    resetBtn.addEventListener('click', function() {
        resetForm();
    });

    countryInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const country = countryInput.value.trim();
            if (country) {
                fetchUniversities(country);
            } else {
                alert('Пожалуйста, введите название страны');
            }
        }
    });

    function fetchUniversities(country) {
        loader.classList.remove('hidden');

        const apiUrl = `http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('error');
                }
                return response.json();
            })
            .then(data => {
                loader.classList.add('hidden');

                displayResults(data);
            })
            .catch(error => {
                loader.classList.add('hidden');

                resultsContainer.innerHTML = `<p class="error">Произошла ошибка: ${error.message}</p>`;
            });
    }

    function displayResults(universities) {
        resultsContainer.innerHTML = '';

        if (universities.length === 0) {
            resultsContainer.innerHTML = '<p>Университеты не найдены. Проверьте название страны.</p>';
            return;
        }

        const table = document.createElement('table');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        headerRow.innerHTML = '<th>#</th>';

        const keys = new Set();
        universities.forEach(uni => {
            Object.keys(uni).forEach(key => keys.add(key));
        });

        Array.from(keys).forEach(key => {
            const headerName = key
                .replace(/_/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());

            const th = document.createElement('th');
            th.textContent = headerName;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        universities.forEach((uni, index) => {
            const row = document.createElement('tr');

            const indexCell = document.createElement('td');
            indexCell.textContent = index + 1;
            row.appendChild(indexCell);

            Array.from(keys).forEach(key => {
                const cell = document.createElement('td');

                if (uni.hasOwnProperty(key)) {
                    if (key === 'web_pages' && uni[key].length > 0) {
                        const links = uni[key].map(url => {
                            return `<a href="${url}" target="_blank">${url}</a>`;
                        }).join('<br>');
                        cell.innerHTML = links;
                    } else if (Array.isArray(uni[key])) {
                        cell.textContent = uni[key].join(', ');
                    } else {
                        cell.textContent = uni[key];
                    }
                }

                row.appendChild(cell);
            });

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        resultsContainer.appendChild(table);
    }

    function resetForm() {
        countryInput.value = '';
        resultsContainer.innerHTML = '';
    }
});
