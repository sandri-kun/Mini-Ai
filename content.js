// FUNGSI UTAMA UNTUK PERMINTAAN KE GEMINI
window.addEventListener("gemini-request", async (e) => {
  const originalText = e.detail;

  const prompt = `Jika merupakan soal pilihan ganda cukup jawab hanya pilihan yang benar beserta keterangan tanpa penjelasan. Jika bukan pilihan ganda jawablah seringkas mungkin.

${originalText}`;

  const apiKey = "AIzaSyBRHpURLHm_rlpSMJzKE3Pyf-6fqp1LJBI";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const result = await response.json();

    const reply = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Tidak ada respons dari Gemini.";

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.bottom = "8px";
    container.style.right = "20px";
    container.style.width = "300px";
    container.style.height = "12px";
    container.style.fontSize = "6px";
    container.style.overflow = "hidden";
    container.style.backgroundColor = "transparent";  // transparan penuh
    container.style.color = "rgba(128, 128, 128, 0.8)"; // warna teks
    container.style.border = "none";
    container.style.boxShadow = "none";  // tanpa bayangan
    container.style.zIndex = 999999;
    container.style.padding = "2px";
    container.style.borderRadius = "4px";
    container.style.cursor = "move";
    container.textContent = reply;

    document.body.appendChild(container);

    // ==== DRAG & DROP ====
    let isDragging = false;
    let offsetX, offsetY;

    container.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - container.getBoundingClientRect().left;
      offsetY = e.clientY - container.getBoundingClientRect().top;
      container.style.transition = "none";
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        container.style.left = `${e.clientX - offsetX}px`;
        container.style.top = `${e.clientY - offsetY}px`;
        container.style.bottom = "auto";
        container.style.right = "auto";
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    setTimeout(() => {
      container.remove();
    }, 8000);

  } catch (error) {
    console.error("Gagal mengambil respons dari Gemini:", error);
  }
});


// ==== FITUR TAMBAHAN: AUTO-FETCH SAAT COPY (JIKA DIAKTIFKAN) ====
chrome.storage.local.get(["autoFetchOnCopy"], (result) => {
  if (result.autoFetchOnCopy) {
    document.addEventListener("copy", async (e) => {
      const selectedText = window.getSelection().toString().trim();
      if (!selectedText) return;

      const customEvent = new CustomEvent("gemini-request", {
        detail: selectedText,
      });
      window.dispatchEvent(customEvent);
    });
  }
});

// Transparant select
chrome.storage.local.get("blurSelectionEnabled", (result) => {
  const enabled = result.blurSelectionEnabled ?? true;
  if (enabled) {
    const style = document.createElement('style');
    style.textContent = `
      ::selection {
        background-color: rgba(0, 255, 0, 0.03); /* hijau 3% opacity */
        color: inherit;
      }
    `;
    document.head.appendChild(style);
  }
});