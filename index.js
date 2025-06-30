const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

const API_KEY = "HE5BPZC91JQ0SF3CTWL0GSXL87M0D7KL1303806FG74VSKRUUNZD4NC2DO6HXCZN39FIBADB9FEW1R83";

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
    const response = await axios.get("https://app.scrapingbee.com/api/v1", {
      params: {
        api_key: API_KEY,
        url: url,
        render_js: "true"
      }
    });

    res.send(`<pre>${response.data.replace(/</g, "&lt;")}</pre>`);
  } catch (err) {
    res.send("Erro ao abrir o site: " + err.message);
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log("Servidor rodando na porta " + port);
});
