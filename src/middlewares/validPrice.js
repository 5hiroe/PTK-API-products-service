export function isValidPrice(req, res, next) {
    const price = req.body.price;
    
    if (price < 0) {
        return res.status(400).json({ error: "Le prix ne peut être négatif" });
    }

    next();
}
