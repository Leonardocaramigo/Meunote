const express = require("express");
const { chromium, install } = require("playwright");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// Instalar navegador se necessário
(async () => {
  const browserPath = path.join(process.env.HOME || "", ".cache", "ms-playwright");
  if (!fs.existsSync(browserPath)) {
    console.log("🛠 Instalando navegador Playwright...");
    await install();
  }
})();

app.get("/", (req, res) => {
  res.send(`
    <form method="POST" action="/abrir">
      <input type="text" name="url" placeholder="Cole um link" style="width:300px;" />
      <button type="submit">Abrir site</button>
    </form>
  `);
});

app.post("/abrir", async (req, res) => {
  const url = req.body.url;
  if (!url) return res.send("URL inválida");

  try {
    const browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto(url);
    const html = await page.content();
    await browser.close();

    res.send(`<pre>${html.replace(/</g, "&lt;")}</pre>`);
  } catch (err) {
    res.send("Erro ao abrir o site: " + err.message);
  }
});

app.listen(port, () => {
  console.log("Servidor rodando na porta " + port);
});
