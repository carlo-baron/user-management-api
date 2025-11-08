const errorHandler = (err, req, res, next) => {
    console.error(`[${req.method}] ${req.url} → ${err.message}`);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || "Internal Server Error",
    });
}

export default errorHandler;
