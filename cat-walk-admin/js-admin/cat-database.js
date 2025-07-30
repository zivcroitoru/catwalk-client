document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://catwalk-server.onrender.com/api/cats/allcats');
        const cats = await response.json();

        const gridWrapper = document.querySelector('.grid-wrapper-cats');
        gridWrapper.innerHTML = ''; // clear existing

        cats.forEach(cat => {
            const catCard = document.createElement('div');
            catCard.className = 'cat-card';

            const img = document.createElement('img');
            img.src = cat.sprite_url;
            img.className = 'users-stuff';
            img.width = 150;
            img.height = 150;

            const name = document.createElement('p');
            name.textContent = cat.type;
            name.className = 'cat-name';

            catCard.appendChild(img);
            catCard.appendChild(name);
            gridWrapper.appendChild(catCard);
        });

    } catch (error) {
        console.error('Failed to load cats:', error);
        document.getElementById('warning').textContent = 'Error loading cat data.';
    }
});
