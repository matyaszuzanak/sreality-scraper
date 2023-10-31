import express, { Request, Response } from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import { Client } from 'pg';
import { scrapePage } from './scrapePage';

const app = express();
const PORT = 5001;

app.use(cors());

// Endpoint to fetch data from database
app.get('/api/data', async (req: Request, res: Response) => {
    const client = new Client({
        port: 5432,
        user: 'demo',
        host: 'sreality-postgres',
        database: 'scrapping',
        password: 'demopass1.'
    });

    await client.connect();
    
    const result = await client.query('SELECT * FROM listings LIMIT 500');
    await client.end();
    
    res.json(result.rows);
});

// Function to scrape the data (can be run separately, not on server start)
const scrapeData = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const client = new Client({
        port: 5432,
        user: 'demo',
        host: 'sreality-postgres',
        database: 'scrapping',
        password: 'demopass1.'
    });

    await client.connect();
    console.log("Connected to the database.");

    for (let i = 1; i <= 25; i++) {
        console.log(`Going to page number ${i}`);
        await page.goto(`https://www.sreality.cz/en/search/for-sale/apartments?page=${i}`, { waitUntil: 'networkidle2' });

        const items = await scrapePage(page);
        console.log(`Fetched ${items.length} items from page ${i}`);

        for (let item of items) {
            if (item.title && item.imageUrl) {
                console.log(`Inserting: ${item.title} | ${item.imageUrl}`);
                await client.query('INSERT INTO listings(title, image_url) VALUES($1, $2)', [item.title, item.imageUrl]);
            }
        }
    }

    await browser.close();
    client.end();
    console.log("Scraping completed and browser closed.");
};

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

// If you want to scrape data when the server starts, uncomment the line below.
// Otherwise, you can run the `scrapeData` function separately as per your requirements.
scrapeData();

