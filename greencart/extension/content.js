function getProductTitle() {
  let title = document.getElementById("productTitle");
  return title ? title.innerText.trim() : null;
}

async function fetchEcoRating(title) {
  try {
    const res = await fetch("http://localhost:5000/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    });
    return await res.json();
  } catch (err) {
    console.error("Error fetching eco rating:", err);
    return null;
  }
}

async function injectBadge() {
  const title = getProductTitle();
  if (!title) return;

  const ratingData = await fetchEcoRating(title);
  if (!ratingData) return;

  const badge = document.createElement('div');
  badge.innerText = `Eco-Rating: ${ratingData.rating}`;
  badge.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background-color: ${ratingData.color};
    color: #fff;
    padding: 10px 15px;
    border-radius: 8px;
    z-index: 10000;
    font-weight: bold;
  `;
  document.body.appendChild(badge);
}

window.addEventListener('load', injectBadge);

