const routeValidator = (req, res, next) => {
    if(!req.route){
        const err = new Error("Route not found");
        err.status = 404;
        return next(err);
    }
    next();
}

export default routeValidator;
