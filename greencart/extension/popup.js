document.addEventListener("DOMContentLoaded", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => {
        const title = document.getElementById("productTitle");
        return title ? title.innerText.trim() : null;
      },
    },
    async (injectionResults) => {
      const title = injectionResults[0].result || "Unknown Product";
      const res = await fetch("http://localhost:5000/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();

      document.getElementById("rating").innerHTML = `Eco-Rating: <strong>${data.rating}</strong>`;
      document.getElementById("footprint").innerHTML = `Estimated CO₂: <strong>${data.co2}</strong>`;

      const altList = document.getElementById("altList");
      altList.innerHTML = "";
      data.alternatives.forEach((alt) => {
        const li = document.createElement("li");
        li.textContent = `${alt.name} (${alt.rating}, ${alt.co2})`;
        altList.appendChild(li);
      });

      const certifications = document.getElementById("certifications");
      certifications.innerHTML = "";
      data.certifications.forEach((cert) => {
        const li = document.createElement("li");
        li.textContent = cert;
        certifications.appendChild(li);
      });

      const priceComparison = document.getElementById("priceComparison");
      priceComparison.innerHTML = "";
      data.alternatives.forEach((alt) => {
        const li = document.createElement("li");
        li.textContent = `${alt.name}: ${alt.price} (${alt.rating}, ${alt.co2})`;
        priceComparison.appendChild(li);
      });
    }
  );
});

document.getElementById("submitRating").addEventListener("click", async () => {
  const userRating = document.getElementById("userRating").value;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => {
        const title = document.getElementById("productTitle");
        return title ? title.innerText.trim() : null;
      },
    },
    async (injectionResults) => {
      const title = injectionResults[0].result || "Unknown Product";
      await chrome.storage.local.set({ [title]: { userRating } });

      const res = await fetch("http://localhost:5000/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, userRating }),
      });
      const data = await res.json();
      document.getElementById("rating").innerHTML = `Eco-Rating: <strong>${data.rating}</strong>`;
      document.getElementById("footprint").innerHTML = `Estimated CO₂: <strong>${data.co2}</strong>`;
    }
  );
});

document.getElementById("shareTwitter").addEventListener("click", () => {
  const ecoRating = document.getElementById("rating").textContent;
  const productName = document.getElementById("productTitle").textContent;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${productName} - ${ecoRating}`)}`;
  window.open(url, "_blank");
});

document.getElementById("shareFacebook").addEventListener("click", () => {
  const ecoRating = document.getElementById("rating").textContent;
  const productName = document.getElementById("productTitle").textContent;
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(`${productName} - ${ecoRating}`)}`;
  window.open(url, "_blank");
});
