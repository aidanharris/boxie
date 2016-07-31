module.exports = (router) => {
    /* GET users listing. */
    router.get('/users', (req, res) => {
        res.json({ message: "respond with a resource"});
    });
    router.get('/users/bob', (req, res) => {
        res.json({firstname: "bob", etc: true});
    });
}
