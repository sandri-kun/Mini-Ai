// FUNGSI UTAMA UNTUK PERMINTAAN KE GEMINI
window.addEventListener("gemini-request", async (e) => {
  const originalText = e.detail;

  const prompt = `Pikirkan secara mendalam dan jawaban di akhir.

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
    container.style.height = "40px";
    container.style.fontSize = "6px";
    container.style.overflow = "hidden";
    container.style.backgroundColor = "transparent";
    container.style.color = "rgba(128, 128, 128, 0.8)";
    container.style.border = "none";
    container.style.boxShadow = "none";
    container.style.zIndex = 999999;
    container.style.padding = "2px 72px 2px 2px";
    container.style.borderRadius = "4px";
    container.style.cursor = "move";
    container.style.transition = "all 0.2s ease";
    container.style.whiteSpace = "pre-wrap";

    // Sembunyikan scrollbar
    container.style.scrollbarWidth = "none"; // Firefox
    container.style.msOverflowStyle = "none"; // IE 10+
    container.style.overflowY = "auto";
    container.style.setProperty("scrollbar-width", "none");
    container.style.setProperty("::-webkit-scrollbar", "display: none");

    const replySpan = document.createElement("span");
    replySpan.textContent = reply;
    container.appendChild(replySpan);

    // Scroll otomatis ke bawah setelah konten dimuat
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });

    // Tombol Copy
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "📋";
    copyBtn.title = "Salin jawaban";
    copyBtn.style.position = "absolute";
    copyBtn.style.top = "2px";
    copyBtn.style.right = "44px";
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

    // Tombol Auto-Hide Toggle
    let autoHideTimeout;
    let autoHideEnabled = true;

    const autoHideBtn = document.createElement("button");
    autoHideBtn.textContent = "⏳";
    autoHideBtn.title = "Nonaktifkan auto-tutup";
    autoHideBtn.style.position = "absolute";
    autoHideBtn.style.top = "2px";
    autoHideBtn.style.right = "64px";
    autoHideBtn.style.fontSize = "10px";
    autoHideBtn.style.background = "transparent";
    autoHideBtn.style.border = "none";
    autoHideBtn.style.cursor = "pointer";
    autoHideBtn.style.color = "rgba(128, 128, 128, 0.8)";
    autoHideBtn.style.opacity = "0.5";
    autoHideBtn.addEventListener("mouseenter", () => autoHideBtn.style.opacity = "1");
    autoHideBtn.addEventListener("mouseleave", () => autoHideBtn.style.opacity = "0.5");

    autoHideBtn.addEventListener("click", () => {
      autoHideEnabled = false;
      clearTimeout(autoHideTimeout);
      autoHideBtn.textContent = "✅";
      autoHideBtn.title = "Auto-tutup dinonaktifkan";
      setTimeout(() => {
        autoHideBtn.textContent = "⏳";
        autoHideBtn.title = "Nonaktifkan auto-tutup";
      }, 2000);
    });

    container.appendChild(autoHideBtn);

    // Tombol Close
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✖";
    closeBtn.title = "Tutup";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "2px";
    closeBtn.style.right = "4px";
    closeBtn.style.fontSize = "10px";
    closeBtn.style.background = "transparent";
    closeBtn.style.border = "none";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.color = "rgba(128, 128, 128, 0.8)";
    closeBtn.style.opacity = "0.5";
    closeBtn.addEventListener("mouseenter", () => closeBtn.style.opacity = "1");
    closeBtn.addEventListener("mouseleave", () => closeBtn.style.opacity = "0.5");

    closeBtn.addEventListener("click", () => {
      container.remove();
    });

    container.appendChild(closeBtn);

    // Expand saat diklik (kecuali tombol)
    container.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") return;
      const isExpanded = container.classList.contains("expanded");
      if (isExpanded) {
        container.classList.remove("expanded");
        container.style.height = "12px";
        container.style.overflow = "hidden";
      } else {
        container.classList.add("expanded");
        container.style.height = "auto";
        container.style.overflow = "auto";
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight;
        });
      }
    });

    document.body.appendChild(container);

    // DRAG & DROP
    let isDragging = false;
    let offsetX, offsetY;

    container.addEventListener("mousedown", (e) => {
      if (e.target.tagName === "BUTTON") return;
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

    // Auto remove (default aktif, bisa dibatalkan)
    autoHideTimeout = setTimeout(() => {
      if (autoHideEnabled) container.remove();
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
        background-color: rgba(0, 255, 0, 0.03);
        color: inherit;
      }
    `;
    document.head.appendChild(style);
  }
});
