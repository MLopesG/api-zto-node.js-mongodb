const router = require('express').Router();

router.get('/', (req, res) => {
    res.redirect("http://www.zto.digital/");
});

module.exports = router;