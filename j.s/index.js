 
const NASA_API_KEY = "wNqTdQNmAlRSEugaGgmOWUg0bicYVMb02a4omJpP"

const apodDateInput = document.getElementById("apod-date-input")
const apodImage = document.getElementById("apod-image")
const apodTitle = document.getElementById("apod-title")
const apodExplanation = document.getElementById("apod-explanation")
const apodDate = document.getElementById("apod-date");


const Allinks = document.querySelectorAll("nav a")
const Allsections = document.querySelectorAll("section")

Allinks.forEach((link) => {
  link.addEventListener("click", function () {
    Allsections.forEach((sec) => {
      sec.classList.add("hidden")
    })

    document
      .getElementById(link.getAttribute("data-section"))
      .classList.remove("hidden")
  })
})


apodDateInput.addEventListener("change", function () {
  this.nextElementSibling.textContent = new Date(this.value).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
});


async function getApod(date) {
  try {
    let url = "https://api.nasa.gov/planetary/apod?api_key=" + NASA_API_KEY;

    if (date) {
      url += "&date=" + date;
    }

    let response = await fetch(url)
    let data = await response.json()

    if (data.media_type === "image") {
      apodImage.src = data.url;
    } else {
      apodImage.src = "./assets/images/placeholder.webp"
    }

    apodTitle.textContent = data.title;
    apodExplanation.textContent = data.explanation;
    apodDate.textContent = data.date;
    apodDateInput.value = data.date;

  } catch (error) {
    console.log("Error:", error);
  }
}

getApod();


async function getLaunches() {
  try {
    let url =
      "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10";

    let response = await fetch(url);
    let data = await response.json();

    console.log(data);

    let launches = data.results;

    launchesGrid.innerHTML = "";

    launches.forEach(function (launch) {
      launchesGrid.innerHTML += 
        `<div
          class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
        >
          <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
            <img
              src="${launch.image}"
              class="w-full h-full object-cover"
              alt="${launch.name}"
            />
          </div>

          <div class="p-5">
            <h4 class="font-bold text-lg mb-2">
              ${launch.name}
            </h4>

            <p class="text-sm text-slate-400 mb-3">
              ${launch.launch_service_provider?.name || "Unknown"}
            </p>

            <div class="space-y-2 text-sm">
              <p>
                <i class="fas fa-calendar text-slate-500"></i>
                ${new Date(launch.net).toLocaleDateString()}
              </p>

              <p>
                <i class="fas fa-clock text-slate-500"></i>
                ${new Date(launch.net).toLocaleTimeString()}
              </p>

              <p>
                <i class="fas fa-rocket text-slate-500"></i>
                ${launch.rocket?.configuration?.name || "Unknown"}
              </p>

              <p>
                <i class="fas fa-map-marker-alt text-slate-500"></i>
                ${launch.pad?.name || "Unknown"}
              </p>
            </div>
          </div>
        </div>`
      ;
    });
  } catch (error) {
    console.log("Error:", error);
  }
}

const launchesGrid = document.getElementById("launches-grid");

getLaunches();

document.getElementById("load-date-btn").addEventListener("click", function () {
  let date = apodDateInput.value;

  if (date) {
    getApod(date);
  }
});

document.getElementById("today-apod-btn").addEventListener("click", function () {
  apodDateInput.value = "";
  getApod();
});

async function getPlanets() {
    const res = await fetch('https://solar-system-opendata-proxy.vercel.app/api/planets');
    const response = await res.json();
    console.log(response.bodies);
    displayPlantes(response.bodies)
}
function displayPlantes(plantes){
    let content=``

    for (let i = 0; i < plantes.length; i++) {
        content+= ` <div

            class="planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group"
            data-planet-id="mercury"
            style="--planet-color: #eab308"
            onmouseover="this.style.borderColor='#eab30880'"
            onmouseout="this.style.borderColor='#334155'"
            >
            <div class="relative mb-3 h-24 flex items-center justify-center">
                <img
                    class="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
                    src="${plantes[i].image}"
                    alt="Mercury"
                />
            </div>
            <h4 class="font-semibold text-center text-sm">${plantes[i].name}</h4>
            <p class="text-xs text-slate-400 text-center">0.39 AU</p>
        </div>`
    }
    document.getElementById('planet-grid').innerHTML=content

}