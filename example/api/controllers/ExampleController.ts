

module.exports = {
    index: async function(req: ReqType, res: ResType )  {
        let examples = await Article.find();
		res.send({status: examples})
	}
}
