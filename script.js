// --- THEME SWITCHER LOGIC ---
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('theme-icon-sun');
const moonIcon = document.getElementById('theme-icon-moon');

// Function to set the theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme); // Save the choice
}

// Event listener for the toggle button
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        setTheme('light');
    } else {
        setTheme('dark');
    }
});

// Check for saved theme preference on page load
const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark
setTheme(savedTheme);


// --- SEARCH LOGIC (from before) ---
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('search-results-container');
const animatedBorder = document.querySelector('.animated-border');
const loadingMessage = document.getElementById('loading-message');

searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const query = searchInput.value;
  if (query) {
    fetchResults(query);
  }
});

async function fetchResults(query) {
  animatedBorder.classList.add('searching');
  loadingMessage.textContent = 'Searching...';
  resultsContainer.innerHTML = '';

  const apiUrl = `/.netlify/functions/search?q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayResults(data);
  } catch (error) {
    console.error("Error fetching search results:", error);
    loadingMessage.textContent = 'Failed to fetch search results.';
  } finally {
    animatedBorder.classList.remove('searching');
    if (!loadingMessage.textContent.includes('Failed')) {
      if (resultsContainer.hasChildNodes()) {
         loadingMessage.textContent = '';
      }
    }
  }
}

function displayResults(data) {
  if (data.items && data.items.length > 0) {
    data.items.forEach(item => {
      const resultElement = document.createElement('div');
      resultElement.classList.add('search-result-item');

      resultElement.innerHTML = `
        <a href="${item.link}" target="_blank" class="result-title">${item.htmlTitle}</a>
        <p class="result-url">${item.formattedUrl}</p>
        <p class="result-snippet">${item.htmlSnippet}</p>
      `;
      resultsContainer.appendChild(resultElement);
    });
  } else {
    loadingMessage.textContent = 'No results found for your query.';
  }
  }
