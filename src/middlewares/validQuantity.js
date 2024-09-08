export function isValidQuantity(req, res, next) {
    const quantity = req.body.stock_quantity;
    
    if (quantity < 0) {
        return res.status(400).json({ error: "La quantité ne peut être négative" });
    }

    next();
}
