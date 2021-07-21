const loadButton = document.getElementById("load-button");
const designDiv = document.getElementById("design-div");

async function fetchWithTimeout(resource, options) {
  const { timeout = 8000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);
  return response;
}

async function loadPosts() {
  try {
    log('Loading posts...');
    const response = await fetchWithTimeout('https://newsdata.io/api/1/news?apikey=pub_607c2b3e99265d361feb3f51b628860208a&language=fr,en&q=cuisine%20OR%20recette%20-terrasse%20-salle%20-h%C3%B4teliers%20-Lille%20-alcohol%20-Domino%20-restaurant%20-festival%20-Ripe%20-HomePod%20-Marseille%20-micro%20-truffles%20-succ%C3%A8s%20-iPhone%20-Labour', {
      timeout: 6000
    });
    //console.log(response);
    if (response.ok) {
      const responseJson = await response.json();
      //const posts = JSON.stringify(responseJson);
      //console.log(`posts: ${posts}`);
      return responseJson;
    } else {
      console.log("Not successful");
      return null;
    }
  } catch (error) {
    log(`Error: ${error}`);
  }
}

loadButton.addEventListener("click", () => {
  loadPosts().then(function(res) {
    if (res !== null) {
      //console.log(`res: ${JSON.stringify(res)}`);
      const results = res.results;
      const totalResults = results.length;
      log(`${totalResults} Posts have been loaded.`);
      //console.log(`Fetched results: ${JSON.stringify(results)}`);
      results.map((result) => showPost(designDiv, result.image_url, result.title, result.description));
    }
  });
});

function log(message) {
  document.getElementById("message").innerText = message;
}

const showPost = (selector, URL, title, descriptionText) => {
  selector.innerHTML += `
    <div class="colonnes-3">
      <div class="carte">
        <p>${descriptionText}</p>
        <img class="image-carte" src='${URL}' alt='${title}'/>
      </div>
    </div>
  `;
}
