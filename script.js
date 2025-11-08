document.getElementById("generateBtn").addEventListener("click", generateQRs);
document.getElementById("downloadAllBtn").addEventListener("click", downloadAllZIP);

let qrImages = [];

function generateQRs() {
  const container = document.getElementById("qrContainer");
  container.innerHTML = "";
  qrImages = [];

  const urls = document.getElementById("urlInput").value
    .split("\n")
    .map(u => u.trim())
    .filter(u => u !== "");

  if (urls.length === 0) {
    alert("URLを1つ以上入力してください。");
    return;
  }

  urls.forEach((url, i) => {
    const box = document.createElement("div");
    box.className = "qr-box";

    const title = document.createElement("p");
    title.textContent = `リンク ${i + 1}`;
    box.appendChild(title);

    const qrDiv = document.createElement("div");
    box.appendChild(qrDiv);

    new QRCode(qrDiv, {
      text: url,
      width: 200,
      height: 200,
    });

    setTimeout(() => {
      const canvas = qrDiv.querySelector("canvas");
      const imgData = canvas.toDataURL("image/png");
      qrImages.push({ name: `qr_${i + 1}.png`, data: imgData });

      const dl = document.createElement("a");
      dl.href = imgData;
      dl.download = `qr_${i + 1}.png`;
      dl.className = "download-link";
      dl.textContent = "このQRをダウンロード";
      box.appendChild(dl);
    }, 300);

    container.appendChild(box);
  });
}

async function downloadAllZIP() {
  if (qrImages.length === 0) {
    alert("まずQRコードを生成してください。");
    return;
  }

  const zip = new JSZip();
  qrImages.forEach(img => {
    const base64 = img.data.split(",")[1];
    zip.file(img.name, base64, { base64: true });
  });

  const blob = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "qr_codes.zip";
  a.click();
}
