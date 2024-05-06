const db = require("../models");


let createHandBook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name ||
                !data.imageBase64 ||
                !data.descriptionHTML ||
                !data.descriptionMarkdown 
                
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter from sever handbook'
                })
            } else {
                await db.HandBook.create({
                    name: data.name,
                    image: data.imageBase64,
                    
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage: 'create clinic succed'
                })
            }


        } catch (e) {
            reject(e);
        }
    })
}
let getAllHandbook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.HandBook.findAll({

            });
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errMessage: 'ok',
                errCode: 0,
                data
            })
        } catch (e) {
            reject(e);

        }
    })
}

let getDetailHandBookById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }
            else {
                let data = await db.HandBook.findOne({
                    where: {
                        id: inputId
                    },
                    
                })

                

                resolve({
                    errMessage: 'ok',
                    errCode: 0,
                    data
                })
            }

        } catch (e) {
            reject(e);

        }
    })
}
module.exports = {
    createHandBook: createHandBook,
     getAllHandbook: getAllHandbook,
     getDetailHandBookById: getDetailHandBookById
}