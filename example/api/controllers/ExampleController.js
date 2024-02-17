"use strict";
module.exports = {
    index: async function (req, res) {
        let examples = await Article.find();
        res.send({ status: examples });
    }
};
