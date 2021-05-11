import { useState, useEffect } from "react";
import { Input, Icon, Table, Container, Loading } from "../../component";
import { getList } from '../../helpers/listHelper'; 
import useAppContext from '../../hooks/useAppContext';

const PlayerResult = () => {
    const { user } = useAppContext();
    useEffect(() => fetchPlayersByUser(user.id), [user]);
    const [players, setPlayers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    

    /*CRUD ###########################################################################################*/ 
    const fetchPlayersByUser = async id => {
        setLoading(true);
        const res = await getList("player/" + id);
        setPlayers(res);
        setLoading(false);
    };

    function filPlayer(player) {
        if(searchTerm === "") {
            return player;
        } else if (player.player_fullname.toLowerCase().includes(searchTerm.toLowerCase())) {
            return player;
        };
        return null;
    };

    /*JSX ############################################################################################*/ 
    return (
        <Container.Primary>
            <div className="search-container">
                <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
            </div>
            {loading 
                ? <Loading/>
                : <Container.Table>
                    <Table.Primary>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Age</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.filter(filPlayer).map(player => (
                                <tr key={player.player_id}>
                                    <td data-label='Name'>{player.player_fullname}</td>
                                    <td data-label='Gender'>{player.gender_name}</td>
                                    <td data-label='Age'>{player.player_age}</td>
                                    <td data-label='Actions'>
                                        <div className="td-container">
                                            <Icon.Basic onClick={() => console.log("En desarrollo")} family="edit" hover/>
                                            <Icon.Basic onClick={() => console.log("En desarrollo")} family="delete" hover/>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table.Primary>
                </Container.Table>
            }
        </Container.Primary>
    );
};

export default PlayerResult;