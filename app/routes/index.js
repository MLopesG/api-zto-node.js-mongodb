const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('index', {
        msg: 'Desculpe, você não possui permissão para acessar Api SOS Máquinas - entre em contato conosco equipe: ricardobzorzato@gmail.com'
    });
});

module.exports = router;