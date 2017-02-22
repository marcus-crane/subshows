const imdb = require('imdb-api')

imdb.get('Lost').then(series => {
    series.episodes((err, eps) => {
        for (i in eps) {
            if (eps[i].episode < 10) {
                console.log(`S${eps[i].season}E0${eps[i].episode}`)
            } else {
                console.log(`S${eps[i].season}E${eps[i].episode}`)
            }
        }
    })
})