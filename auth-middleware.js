module.exports = function (request, response, next){
    console.log(request.headers);

    if (!request.headers.authorization){
        response.status(401).end();
        //response.end(); vi kan chaine response som ovenfor
        return
    }
     
    if (request.headers.authorization !== `Bearer ${process.env.TOKEN}`) {
        response.status(403)
        response.send(`<img src="https://static.wixstatic.com/media/836406_c8df9df76b1f436b961f4f8850352207~mv2.gif">`)
        //response.send("Ah ah ah, you didn't say the magic word!!!");
        return
    }
    next()
}

