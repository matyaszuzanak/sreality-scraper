import { Page } from 'puppeteer';

interface Listing {
    title: string | null;
    imageUrl: string | null;
}

export const scrapePage = async (page: Page): Promise<Listing[]> => {
    return page.$$eval('.property', listings => {
        return listings.map(listing => {
            const titleElement = listing.querySelector('a.title span.name') as HTMLSpanElement;
            const title = titleElement ? titleElement.innerText : null;

            const imageUrlElement = listing.querySelector('a[href^="/en/detail/sale"] img') as HTMLImageElement;
            const imageUrl = imageUrlElement ? imageUrlElement.src : null;

            return { title, imageUrl };
        });
    });
};

