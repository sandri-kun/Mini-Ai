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

    // Kontainer utama
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.bottom = "8px";
    container.style.right = "20px";
    container.style.width = "300px";
    container.style.height = "12px";
    container.style.fontSize = "6px";
    container.style.overflow = "hidden";
    container.style.backgroundColor = "transparent";
    container.style.color = "rgba(128, 128, 128, 0.8)";
    container.style.border = "none";
    container.style.boxShadow = "none";
    container.style.zIndex = 999999;
    container.style.padding = "2px 24px 2px 2px";
    container.style.borderRadius = "4px";
    container.style.cursor = "move";
    container.style.transition = "all 0.2s ease";
    container.style.whiteSpace = "pre-wrap";

    // Bungkus teks jawaban dalam span agar bisa dicopy
    const replySpan = document.createElement("span");
    replySpan.textContent = reply;
    container.appendChild(replySpan);

    // Tombol copy
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "📋";
    copyBtn.title = "Salin jawaban";
    copyBtn.style.position = "absolute";
    copyBtn.style.top = "2px";
    copyBtn.style.right = "4px";
    copyBtn.style.fontSize = "10px";
    copyBtn.style.background = "transparent";
    copyBtn.style.border = "none";
    copyBtn.style.cursor = "pointer";
    copyBtn.style.color = "rgba(128, 128, 128, 0.8)";
    copyBtn.style.opacity = "0.5";
    copyBtn.addEventListener("mouseenter", () => copyBtn.style.opacity = "1");
    copyBtn.addEventListener("mouseleave", () => copyBtn.style.opacity = "0.5");

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(replySpan.textContent)
        .then(() => {
          copyBtn.textContent = "✅";
          setTimeout(() => copyBtn.textContent = "📋", 1500);
        })
        .catch(err => console.error("Gagal menyalin:", err));
    });

    container.appendChild(copyBtn);

    // Klik untuk expand/contract
    container.addEventListener("click", () => {
      const isExpanded = container.classList.contains("expanded");
      if (isExpanded) {
        container.classList.remove("expanded");
        container.style.height = "12px";
        container.style.overflow = "hidden";
      } else {
        container.classList.add("expanded");
        container.style.height = "auto";
        container.style.overflow = "visible";
      }
    });

    document.body.appendChild(container);

    // ==== DRAG & DROP ====
    let isDragging = false;
    let offsetX, offsetY;

    container.addEventListener("mousedown", (e) => {
      if (e.target.tagName === "BUTTON") return; // biar tombol copy tetap bisa diklik
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

    // Auto remove (bisa dihilangkan jika ingin tetap muncul)
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

// ==== STYLING: SELEKSI TEKS TRANSPARAN ====
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
