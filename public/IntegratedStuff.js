const taskInput = document.getElementById("task");
        const addBtn = document.getElementById("add");
        const refreshBtn = document.getElementById("refresh");
        const taskList = document.getElementById("tasks");

        addBtn.addEventListener("click", addTask);
        refreshBtn.addEventListener("click", refreshTasks);

        function refreshTasks() {
            taskList.innerHTML = '';
            fetch("/api/tasks")
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((task, index) => {
                        const li = document.createElement("li");
                        const isCompleted = task.completed ? 'active' : '';
                        li.innerHTML = `
                            <button class="check-button ${isCompleted}">✓</button> 
                            <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
                            <button class="remove" style="${task.completed ? 'display: inline-block;' : 'display: none;'}">X</button>
                        `;
                        taskList.appendChild(li);
                        addCheckButtonEventListener(li, index);
                    });
                });
        }

        refreshTasks();

        function addCheckButtonEventListener(li, index) {
            const checkButton = li.querySelector(".check-button");
            checkButton.addEventListener("click", () => {
                toggleCompleted(index);
            });
        }

        function toggleCompleted(index) {
            fetch(`/api/tasks/${index}`, {
                method: "PUT"
            })
                .then(() => {
                    refreshTasks();
                });
        }

        function addTask() {
            const taskText = taskInput.value.trim();
            if (taskText === "") return;

            fetch("/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ taskText }),
            })
                .then(() => {
                    taskInput.value = "";
                    refreshTasks();
                });
        }

        taskList.addEventListener("click", (event) => {
            if (event.target.classList.contains("check-button")) {
                const listItem = event.target.parentElement;
                const removeButton = listItem.querySelector("button.remove");
                listItem.querySelector("span").classList.toggle("completed");
                removeButton.style.display = event.target.classList.contains("active") ? "inline-block" : "none";
            } else if (event.target.classList.contains("remove")) {
                const listItem = event.target.parentElement;
                const index = Array.from(listItem.parentElement.children).indexOf(listItem);
                if (index !== -1) {
                    fetch(`/api/tasks/${index}`, {
                        method: "DELETE",
                    })
                        .then(() => {
                            listItem.remove();
                        });
                }
            }
        });


function fetchTime() {
    const currentTimeElement = document.getElementById("time-display");
    const currentTime = new Date().toLocaleTimeString();
    currentTimeElement.textContent = `${currentTime}`;
}

function fetchNASAImage() {
    fetch("https://api.nasa.gov/planetary/apod?api_key=Uo3NgIUerSqCUZn9EgvivQCiRci8fYAyCV5EBaGH")
        .then(response => response.json())
        .then(data => {
            document.getElementById("apod-image").src = data.url;
            document.getElementById("apod-caption").textContent = data.explanation;
            document.getElementById("photographer").textContent = `Photographer: ${data.copyright}`;
        })
        .catch(error => {
            console.error('Error fetching NASA APOD:', error);
        });
}

function getWeather() {
    var city = document.getElementById('cityInput').value;
    var apiKey = 'Ym8Ahge4k7MmAgsUYaylDgIDuhSYtV4W';

    fetch(`https://api.tomorrow.io/v4/weather/realtime?location=${city}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => console.error('Error:', error));
}

function displayWeather(data) {
    var weatherDataDiv = document.getElementById('weatherData');
    weatherDataDiv.innerHTML = '';

    var values = data.data.values;
    var location = data.location;

    var html = `
        <p><strong>Location:</strong> ${location.name}</p>
        <p><strong>Temperature:</strong> ${values.temperature}°C</p>
        <p><strong>Humidity:</strong> ${values.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${values.windSpeed} m/s</p>
        <p><strong>Cloud Cover:</strong> ${values.cloudCover}%</p>
    `;

    weatherDataDiv.innerHTML = html;
}

function fetchTopHeadlines() {
    const apiKey = '10becb8d7bef4b2fbf1ac9a411a82de5';
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const articles = data.articles.slice(0, 4);
            const articleContainer = document.getElementById('articleContainer');
            articleContainer.innerHTML = '';

            articles.forEach(article => {
                const articleElement = document.createElement('div');
                articleElement.classList.add('article');

                const linkElement = document.createElement('a');
                linkElement.href = article.url;
                linkElement.target = '_blank';

                const imgElement = document.createElement('img');
                imgElement.src = article.urlToImage;
                imgElement.alt = article.title;
                imgElement.onclick = () => window.open(article.url, '_blank');
                
                // Set max-width and max-height for the images
                imgElement.style.maxWidth = '100%';
                imgElement.style.maxHeight = '100%';

                linkElement.appendChild(imgElement);

                const titleElement = document.createElement('h4');
                titleElement.textContent = article.title;
                linkElement.appendChild(titleElement);

                articleElement.appendChild(linkElement);
                articleContainer.appendChild(articleElement);
            });

            // Add a CSS class to the container for flexbox styling
            articleContainer.classList.add('flex-container');
        })
        .catch(error => console.error('Error fetching top headlines:', error));
}


function fetchRandomQuote() {
    fetch('https://api.quotable.io/random')
        .then(response => response.json())
        .then(data => {
            displayQuote(data);
        })
        .catch(error => console.error('Error fetching quote:', error));

    function displayQuote(quoteData) {
        const quoteContainer = document.getElementById('quote-container');
        const quoteElement = document.getElementById('quote');
        const authorElement = document.getElementById('author');

        quoteElement.textContent = `"${quoteData.content}"`;
        authorElement.textContent = `- ${quoteData.author}`;

        quoteContainer.style.opacity = 1;
    }
}


fetchTime();
fetchNASAImage();
getWeather();
fetchTopHeadlines();
fetchRandomQuote();




setInterval(fetchTime, 1000);
setInterval(() => {
    fetchNASAImage();
    getWeather();
    fetchTopHeadlines();
    fetchRandomQuote();
}, 2000000);