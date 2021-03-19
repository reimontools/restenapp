import { useState, useEffect, useContext} from "react";
import { AppContext } from "../../store/AppProvider";
import { getList } from '../../helpers/listHelper';
import styled from "styled-components";
import { Table, ButtonIcon, Container, Input} from "../../component";

const DivTitle = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center; 
`;

const GroupAdmin = () => {
    const { globalGroupId } = useContext(AppContext);
    const [groupInfo, setGroupInfo] = useState({});
    const [groupPlayers, setgroupPlayers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchGroup() {
            const res = await getList("group/admin/" + globalGroupId);
            setGroupInfo(res[0]);
        };
        fetchGroup();
    }, [globalGroupId]); 

    useEffect(() => {
        async function fetchGroupPlayer() {
            const res = await getList("group-player/" + globalGroupId);
            setgroupPlayers(res);
        };
        fetchGroupPlayer();
    }, [globalGroupId]); 

    /*JSX ############################################################################################*/ 
    return (
        <Container.Primary>
            <DivTitle>
                <h2>{groupInfo?.championship_name}</h2>
                <h1>{groupInfo?.name}</h1>
            </DivTitle>

            <div className="search-container">
                <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
                <ButtonIcon.AddPerson />
            </div>

            <Table.Primary>
                <thead>
                    <tr>
                        <th>Players</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {groupPlayers.filter(val => {
                        if(searchTerm === "") {
                            return val;
                        } else if (val.user_fullname.toLowerCase().includes(searchTerm.toLowerCase())) {
                            return val;
                        };
                        return null;
                    }).map(groupPlayer => (
                        <tr key={groupPlayer.group_player_id}>
                            <td data-label='Player'>{groupPlayer.user_fullname}</td>
                            <td data-label=''>
                                <div className="td-container">
                                    <ButtonIcon.Delete />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table.Primary>
        </Container.Primary>
    );
};

export default GroupAdmin;