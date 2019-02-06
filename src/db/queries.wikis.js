const Wiki = require ('./models').Wiki;
const User = require ('./models').User;
const Collaborator = require ("./models").Collaborator;

module.exports ={

	getAllWikis(callback){
		return Wiki.findAll()
		.then((wikis) => {
			callback(null, wikis);
		});
	},
    addWiki(newWiki, callback) {
        return Wiki.create(newWiki)
        .then(wiki =>{
            callback(null,wiki);
        })
        .catch((err) =>{
            callback(err);
        });
    },

    getWikis(id, callback) {
        let result = {};
        Wiki.findById(id)
            .then((wiki) => {
                if (!wiki) {
                    callback(404);
                } else {
                    result["wiki"] = wiki;
                    Collaborator.scope({
                            method: ["collaboratorsFor", id]
                        }).all()
                        .then((collaborators) => {
                            result["collaborators"] = collaborators;
                            callback(null, result);
                        })
                        .catch((err) => {
                            callback(err);
                   })
             }
          })
    },
    deleteWiki(id, callback) {
        return Wiki.destroy({
           where: {id}
        })
        .then((wiki) => {
           callback(null, wiki);
        })
        .catch((err) => {
           callback(err);
        });
     },
     updateWiki(id, updatedWiki, callback){
        return Wiki.findByPk(id)
        .then((wiki) => {
            if(!wiki){
                return callback("Wiki not found");
            }
  
            wiki.update(updatedWiki, {
                fields: Object.keys(updatedWiki)
            })
            .then(() => {
                callback(null, wiki);
            })
            .catch((err) => {
                callback(err);
            });
        });
    },

    privateToPublic(id) {
		return Wiki.findAll()
		.then(wikis => {
			wikis.forEach(wiki => {
			    if (wiki.userId == id && wiki.private == true) {
			    	wiki.update({
							private: false,
						});
					}
				});
			})
		.catch(err => {
			callback(err);
		});
	},


}