import handbookService from '../services/handbookService';

let createHandBook = async (req, res) => {
    try {
        let infor = await handbookService.createHandBook(req.body);
        return res.status(200).json(
            infor
        )

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getAllHandbook = async (req, res) => {
    try {
        let infor = await handbookService.getAllHandbook();
        return res.status(200).json(
            infor
        )

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getDetailHandBookById = async (req, res) => {
    try {
        let infor = await handbookService.getDetailHandBookById(req.query.id);
        return res.status(200).json(
            infor
        )

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
module.exports = {
    createHandBook: createHandBook,
     getAllHandbook: getAllHandbook,
     getDetailHandBookById: getDetailHandBookById
}