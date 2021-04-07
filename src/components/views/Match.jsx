import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { getList } from '../../helpers/listHelper';
import { Input, Table, Container, Icon, Loading, Title } from "../../component";
import axios from '../../config/axios';

const Match = () => {
    const { prm_group_id } = useParams();
    const [groupInfo, setGroupInfo] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        fetchGroupInfo(prm_group_id);
        fetchMatches(prm_group_id)
    }, [prm_group_id]); 
    
    /*FETCH ############################################################################################*/ 
    const fetchGroupInfo = async id => {
        const res = await getList("group/admin/" + id);
        setGroupInfo(res[0]);
    };

    const fetchMatches = async id => {
        setLoading(true);
        const res = await getList("match/" + id);
        setMatches(res);
        setLoading(false);
    };

    const staMatch = async id => {
        try {
            const res = await axios.put("match/" + id);
            if (!res.data.error) {
                fetchMatches(prm_group_id);
            };
        } catch (err) {
            console.log(err);
        };
    };

    /*FILTER ############################################################################################*/ 
    function filMatch(match) {
        if(searchTerm === "") {
            return match;
        } else if (match.player_a_fullname.toLowerCase().includes(searchTerm.toLowerCase())) {
            return match;
        };
        return null;
    };

    /*JSX ############################################################################################*/ 
    return (
        <Container.Primary>
            <Title.Basic fontSize="20px">{groupInfo?.championship_name}</Title.Basic> 
            <Title.Basic>{groupInfo?.name}</Title.Basic>
            <div className="search-container">
                <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
                {/* <Icon.Basic family="addPerson" action={() => openFilter()} right="12px" hover/> */}
            </div>
            {loading 
                ? <Loading/>
                : <Container.Table>
                    <Table.Primary>
                        <thead>
                            <tr>
                                <th>Players</th>
                                <th></th>
                                <th>Players</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matches.filter(filMatch).map(match => (
                                <tr key={match.match_id}>
                                    <td data-label='Player'>{match.player_a_fullname}</td>
                                    <td data-label=''>Versus</td>
                                    <td data-label='Player'>{match.player_b_fullname}</td>
                                    <td data-label=''>
                                        <div className="td-container">
                                            <Icon.Basic family="delete" action={() => staMatch(match.match_id)} hover/>
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
export default Match;