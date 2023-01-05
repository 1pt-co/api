import query from "./db.js";

export default async url => {
    return Boolean(await query(`SELECT 1 FROM 1pt WHERE short_url = '${url}'`));
}
