export const targetTopic = {
    id : null,
    title : null,
    description : null,
}

export const targetEntry = {
    id : null,
    name : null,
    description: null,
}

export const TournamentStageName = {
    2 : '결승',
    4 : '준결승',

    getTournamentStageNameByTournament(tournament){
        return this[tournament] || `${tournament}강`;
    }
}