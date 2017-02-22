const imdb = require('imdb-api')
const WunderlistSDK = require('wunderlist')
const env = require('dotenv').config()

const wunderlistAPI = new WunderlistSDK({
    'accessToken': process.env.WUNDERLIST_ACCESS_TOKEN,
    'clientID': process.env.WUNDERLIST_CLIENT_ID
})

let data = []

imdb.get(process.argv[2]).then(series => {
    series.episodes((err, episodes) => {
        if (!err) {
            for (i in episodes) {
                if (episodes[i].episode < 10) {
                    data.push(`S${episodes[i].season}E0${episodes[i].episode}`)
                } else {
                    data.push(`S${episodes[i].season}E${episodes[i].episode}`)
                }
            }

            addTasks()
        } else {
            console.log('Episode fetching went haywire!', err)
        }
    })
})
.catch(err => {
    console.log(err)
})

const addTasks = () => {
    wunderlistAPI.http.tasks.create({
        'list_id': parseInt(process.env.WUNDERLIST_TVSERIES_LIST),
        'title': process.argv[2]
    })
    .done((taskData, statusCode) => {
        console.log('Created task. Adding episodes...', statusCode, taskData)

        for (i in data) {
            addSubtask(taskData.id, data[i])
        }
    })
    .fail((resp, code) => {
        console.log(code, resp)
    })
}

const addSubtask = (taskID, episodeTitle) => {
    wunderlistAPI.http.subtasks.create({
        'task_id': taskID,
        'title': episodeTitle
    })
    .done(subTask => {
        console.log(`Added ${subTask.title}`)
        console.log(subTask)
    })
}