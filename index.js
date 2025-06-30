const express = require("express");
const { chromium } = require("playwright");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

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
    const browser = await chromium.launch();
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
