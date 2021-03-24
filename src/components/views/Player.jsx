import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { Input, Icon, Modal, Button, Card, Select, Table, Container, Loading } from "../../component";
import useModal from "../../hooks/useModal";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { getList } from '../../helpers/listHelper'; 
import axios from '../../config/axios'
import moment from 'moment';
import useList from '../../hooks/useList';

const Player = () => {
    useEffect(() => fetchPlayers(), []);
    const [players, setPlayers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentID, setCurrentID] = useState(0);
    const [isOpenModal, openModal, closeModal] = useModal();
    const defaultData = {player_id: 0, name: '', surname: '', gender_id: 1, birth_date: ''};
    const genderList = useList("list/gender");
    const [loading, setLoading] = useState(true);
    
    /*VALIDATIONS ####################################################################################*/ 
    const schema = Yup.object().shape({
        name: Yup.string().required('Required'),
        surname: Yup.string().required('Required'),
        birth_date: Yup
            .date()
            .nullable()
            .transform((curr, orig) => orig === '' ? null : curr)
            .max(moment().subtract(2, 'years').calendar(), "Too young")
            .min(moment().subtract(70, 'years').calendar(), "Too old")
            .required('Required')
    });

    const { register, handleSubmit, errors, reset } = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(schema)
    });

    const openForm = player => {
        setCurrentID(player.player_id);
        reset(player);
        openModal();
    };

    /*CRUD ###########################################################################################*/ 
    const fetchPlayers = async () => {
        setLoading(true);
        const res = await getList("player");
        setPlayers(res);
        setLoading(false);
    };

    const addPlayer = async data => {
        console.log('Antes de guardar', {player_id: currentID, ...data});
        try {
            const res = await axios.post("player", {player_id: currentID, ...data});
            switch(res.data.result[0][0].cod) {
                case 0:
                    fetchPlayers();
                    closeModal();
                    break;
                case 1:
                    alert('Ya existe!');
                    break;
                case 2:
                    alert('Ya existe inactivo!');
                    break;
                default:
                    alert('Otro problema, error: ' + res.data.result[0][0].msg);
                    break;
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };
    
    const staPlayer = async (id) => {
        try {
            const res = await axios.put("player/" + id);
            if (!res.data.error) {
                fetchPlayers();
            };
        } catch (err) {
            console.log(err);
        };
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
            <Modal.ForForm isOpen={isOpenModal} closeModal={closeModal}>
                <Card.Primary title={currentID === 0 ? 'New Player' : 'Update Player'}>
                    <Input.TextValidation name="name" placeholder="Name" register={register} error={errors.name} />
                    <Input.TextValidation name="surname" placeholder="Surname" register={register} error={errors.surname} />
                    <Select.TextValidation name="gender_id" type="select" register={register} content={genderList} />
                    <Input.DateValidation name="birth_date" register={register} error={errors.birth_date}/>
                    <Button.Basic action={handleSubmit(addPlayer)}>Save</Button.Basic>
                </Card.Primary>
            </Modal.ForForm>

            <div className="search-container">
                <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
                <Icon.Basic family="add" action={() => openForm(defaultData)} right="12px" hover/>
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
                                            <Icon.Basic family="edit" action={() => openForm(player)} hover/>
                                            <Icon.Basic family="delete" action={() => staPlayer(player.player_id)} hover/>
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

export default Player;