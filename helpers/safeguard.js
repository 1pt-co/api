export default async (f, logger, req, res) => {
    f(req, res).catch(err => {
        res.status(500).send({
            message: "Internal server error!"
        })

        logger.error(err)
    })
}