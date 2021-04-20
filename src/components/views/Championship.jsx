import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { Input, Modal, Button, Title, Table, Container, Icon, Loading, Select, Dialog } from "../../component";
import useModal from "../../hooks/useModal";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { getList } from '../../helpers/listHelper'; 
import axios from '../../config/axios'
import moment from 'moment';
import useList from '../../hooks/useList';
import { useHistory } from 'react-router-dom';

const Championship = () => {
    useEffect(() => fetchChampionship(), []);
    const [championships, setChampionships] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentChampionshipId, setCurrentChampionshipId] = useState(0);
    const [isOpenModalCrud, openModalCrud, closeModalCrud] = useModal();
    const defaultData = {championship_id: 0, name: '', state: 0, championship_type_id: ""};
    const [loading, setLoading] = useState(true);
    const championshipTypeList = useList("list/championship_type");
    const [dialogOptions, setDialogOptions] = useState({});
    const history = useHistory();

    const goChampionshipDetail = obj => {
        if (obj.championship_type_id === 2) {
            history.push('/championship/seed/' + obj.championship_id);
        } else {
            history.push('/championship/against/' + obj.championship_id);
        };
    };

    /*VALIDATIONS ####################################################################################*/ 
    const schema = Yup.object().shape({
        name: Yup.string().required('Required'),
        championship_type_id: Yup.string().required('Required')
    });

    const { register, handleSubmit, errors, reset } = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(schema)
    });

    const showModalCrud = championship => {
        setCurrentChampionshipId(championship.championship_id);
        reset(championship);
        openModalCrud();
    };

    /*CRUD ###########################################################################################*/ 
    const fetchChampionship = async () => {
        setLoading(true);
        const championships = await getList("championship");
        setChampionships(championships);
        setLoading(false);
    };

    const addChampionship = async data => {
        // return console.log({championship_id: currentChampionshipId, ...data});
        
        try {
            const res = await axios.post("championship", {championship_id: currentChampionshipId, ...data});
            switch(res.data.result.cod) {
                case 0:
                    fetchChampionship();
                    closeModalCrud();
                    break;
                case 1:
                    setDialogOptions({title: 'Info', text : 'Ya esta la wea!'})
                    break;
                case 2:
                    alert('Ya existe inactivo!');
                    break;
                default:
                    alert('Otro problema!, error: ' + res.data.result.msg);
                    break;
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };
    
    const staChampionship = async (id) => {
        try {
            const res = await axios.put("championship/" + id);
            if (!res.data.error) {
                fetchChampionship();
            };
        } catch (err) {
            console.log(err);
        };
    };

    const renderBtnState = obj => {
        var text = obj.state_name, family = "";
        obj.state_id === 1 ? family = "addPerson" : family = "check";
        return <Button.Basic family={family} action={() => handleState(obj)} fit height="auto" size="12px" weight="400" hover>{text}</Button.Basic>;
    };

    const setState = async (id, state_id) => {
        try {
            const res = await axios.post("state/", {state_id, name: "championship", id});
            if (res.data.result.cod === 0) return fetchChampionship();
            alert('Otro problema!, error: ' + res.data.result.msg);
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const handleState = obj => {
        if (obj.state_id === 1) setState(obj.championship_id, 2);
        if (obj.state_id === 2) setState(obj.championship_id, 1);
    };

    const renderActions = obj => {
        return (
            <div className="td-container">
                <Icon.Basic 
                    action={() => showModalCrud(obj)}
                    family="edit"
                    hover
                />
                <Icon.Basic 
                        action={() => setDialogOptions({
                            family: "delete",
                            title: 'Delete this championship?', 
                            text : 'Are you sure you want to delete this championship?', 
                            action: () => staChampionship(obj.championship_id)})} 
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
            {loading 
                ? <Loading/>
                : <Container.Table>
                    <Table.Primary>
                        <thead>
                            <tr>
                                <th>Championship</th>
                                <th>Type</th>
                                <th>Created</th>
                                <th>State</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {championships.filter(val => {
                                if(searchTerm === "") {
                                    return val;
                                } else if (val.name.toLowerCase().includes(searchTerm.toLowerCase()) || val.state_name.toLowerCase().includes(searchTerm.toLowerCase())) {
                                    return val;
                                };
                                return null;
                            }).map(championship => (
                                <tr key={championship.championship_id} onClick={() => goChampionshipDetail(championship)}>
                                    <td data-label='Championship'>{championship.name}</td>
                                    <td data-label='Type'>{championship.championship_type_name}</td>
                                    <td data-label='Created'>{ moment(championship.created_date).format('YYYY-MM-DD') }</td>
                                    <td>{renderBtnState(championship)}</td>
                                    <td data-label=''>{renderActions(championship)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table.Primary>
                </Container.Table>
            }

            {/* MODAL CRUD ################################################################################################## */}
            <Modal.ForForm isOpen={isOpenModalCrud} closeModal={closeModalCrud}>
                <Container.Basic>
                    <Title.Basic>{currentChampionshipId === 0 ? 'New Championship' : 'Update Championship'}</Title.Basic>
                    <Input.TextValidation name="name" placeholder="Championship name" register={register} error={errors.name} />
                    <Select.Validation disable={currentChampionshipId === 0 ? false : true} name="championship_type_id" text="Championship type" register={register} error={errors.championship_type_id} content={championshipTypeList} />
                    <Button.Basic action={handleSubmit(addChampionship)} width="100%">Save</Button.Basic>
                </Container.Basic>
            </Modal.ForForm>
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />
        </Container.Primary>
    );
};

export default Championship;
