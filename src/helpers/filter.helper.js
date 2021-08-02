export const filterMatchesByChampionshipId = championship_id => match => {
    return match.championship_id === championship_id;
};

export const filterUserNameByText = text => user => {
    if(text === "") return user;
    return user.name.toLowerCase().includes(text.toLowerCase());
};

// function filterUserNameByText(user) {
//     if(searchTerm === "") {
//         return user;
//     } else if (user.name.toLowerCase().includes(searchTerm.toLowerCase())) {
//         return user;
//     };
//     return null;
// };

export const filterScoresByMatchId = match_id => score => {
    return score.match_id === match_id;
};

export const filterChampionshipNameStateByText = text => championship => {
    return championship.championship_name.toLowerCase().includes(text.toLowerCase()) || championship.state_name.toLowerCase().includes(text.toLowerCase());
};

export const filterPlayerGenderIdByText = text => player => {
    if(text === "") return player;
    return player.gender_id === parseInt(text);
};

// function filterPlayerGenderIdByText(player) { 
//     if(searchOptions.filter_gender === "") {
//         return player;
//     } else if (player.gender_id === parseInt(searchOptions.filter_gender)) {
//         return player;
//     };
//     return null;
// };

export const filterPlayerAgeByText = text => player => {
    if(text === "") return player;
    return text.split(',').map(Number).includes(player.player_age);
};

// function filterPlayerAgeByText(player) { 
//     const ages = searchOptions.filter_age.split(',').map(Number);
//     if(searchOptions.filter_age === "") {
//         return player;
//     } else if (ages.includes(player.player_age)) {
//         return player;
//     };
//     return null;
// };

export const filterPlayerFullnameByText = text => player => {
    return player.player_fullname.toLowerCase().includes(text.toLowerCase());
};

// function filterPlayerFullnameByText(player) { 
//     if(searchOptions.filter_fullname === "") {
//         return player;
//     } else if (player.player_fullname.toLowerCase().includes(searchOptions.filter_fullname.toLowerCase())) {
//         return player;
//     };
//     return null;
// };

export const filterPlayerObjectByPlayerArray = playerArray => playerObject => {
    if(playerArray.length === 0) return playerObject;
    return !playerArray.includes(playerObject);
};

// function filterPlayerObjectByPlayerArray(player) { 
//     if(playerSelected.length === 0) {
//         return player;
//     } else if (!playerSelected.includes(player)) {
//         return player;
//     };
//     return null;
// };

export const filterPlayerPropertyByPlayerArray = playerArray => playerObject => {
    if(playerArray.length === 0) return playerObject;
    return !playerArray.some(value => value.player_id === playerObject.player_id)
};

// function filterPlayerPropertyByPlayerArray(player) {
//     if(groupPlayers.length === 0) {
//         return player;
//     } else if (!groupPlayers.some(value => value.player_id === player.player_id)) {
//         return player;
//     };
//     return null;
// };