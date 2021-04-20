import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { Input, Icon, Title, Modal, Button, Select, Table, Container, Loading, Dialog } from "../../component";
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
    const [currentPlayerId, setCurrentPlayerId] = useState(0);
    const [isOpenModalCrud, openModalCrud, closeModalCrud] = useModal();
    const defaultData = {player_id: 0, name: '', surname: '', gender_id: 1, birth_date: ''};
    const genderList = useList("list/gender");
    const [loading, setLoading] = useState(true);
    const [dialogOptions, setDialogOptions] = useState({});
    
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

    const showModalCrud = player => {
        setCurrentPlayerId(player.player_id);
        reset(player);
        openModalCrud();
    };

    /*CRUD ###########################################################################################*/ 
    const fetchPlayers = async () => {
        setLoading(true);
        const res = await getList("player");
        setPlayers(res);
        setLoading(false);
    };

    const addPlayer = async data => {
        try {
            const res = await axios.post("player", {player_id: currentPlayerId, ...data});
            switch(res.data.result.cod) {
                case 0:
                    fetchPlayers();
                    closeModalCrud();
                    break;
                case 1:
                    alert('Ya existe!');
                    break;
                case 2:
                    alert('Ya existe inactivo!');
                    break;
                default:
                    alert('Otro problema! error: ' + res.data.result.msg);
                    break;
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };
    
    const staPlayer = async id => {
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

    const renderActions = player => {
        return (
            <div className="td-container">
                <Icon.Basic 
                    action={() => showModalCrud(player)}
                    family="edit"
                    hover
                />
                <Icon.Basic 
                    action={() => setDialogOptions({
                        family: "delete",
                        title: 'Delete this player?', 
                        text : 'Are you sure you want to delete this player?', 
                        action: () => staPlayer(player.player_id)})} 
                    family="delete" 
                    hover
                />
            </div>
        );
    };

    /*JSX ############################################################################################*/ 
    return (
        <Container.Primary>
            <div className="search-container">
                <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
                <Icon.Basic family="add" action={() => showModalCrud(defaultData)} right="12px" hover/>
            </div>
            {loading ? <Loading/> : <Container.Table>
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
                                <td data-label='Actions'>{renderActions(player)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table.Primary>
            </Container.Table> }

            {/* MODAL CRUD ################################################################################################## */}
            <Modal.ForForm isOpen={isOpenModalCrud} closeModal={closeModalCrud}>
                <Container.Basic>
                    <Title.Basic>{currentPlayerId === 0 ? 'New Player' : 'Update Player'}</Title.Basic>
                    <Input.TextValidation name="name" placeholder="Name" register={register} error={errors.name} />
                    <Input.TextValidation name="surname" placeholder="Surname" register={register} error={errors.surname} />
                    <Select.Validation name="gender_id" type="select" register={register} content={genderList} />
                    <Input.DateValidation name="birth_date" register={register} error={errors.birth_date}/>
                    <Button.Basic action={handleSubmit(addPlayer)} width="100%">Save</Button.Basic>
                </Container.Basic>
            </Modal.ForForm>
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />
        </Container.Primary>
    );
};

export default Player;