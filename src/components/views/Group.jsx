import { useState, useEffect, useContext} from "react";
import { Input, ButtonIcon, Modal, Button, Card, Select, Container, Loading } from "../../component";
// import useList from '../../hooks/useList';
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import useModal from "../../hooks/useModal";
import axios from '../../config/axios'
import { getList } from '../../helpers/listHelper';

import { useHistory } from 'react-router-dom'
import { AppContext } from "../../store/AppProvider";

const Group = () => {
    const [championships, setChampionships] = useState([]);
    const [currentChampionshipId, setCurrentChampionshipId] = useState(0);

    const [groups, setGroups] = useState([]);
    const [currentGroupId, setCurrentGroupId] = useState(0);

    const defaultData = {group_id: 0, name: ''};

    const [isOpenModal, openModal, closeModal] = useModal();

    const { setGlobalGroupId } = useContext(AppContext);
    const history = useHistory();

    const [loading, setLoading] = useState(true);

    /*USEEFFECT ####################################################################################*/
    useEffect(() => {
        async function fetchChampionships() {
            const res = await getList("championship/active");
            setChampionships(res);
            fetchGroups(res[0].championship_id);
            setCurrentChampionshipId(res[0].championship_id);
        };
        fetchChampionships();
    }, []);

    const openGroup = (id) => {
        setGlobalGroupId(id);
        history.push('/admin');
    };

    /*VALIDATIONS ####################################################################################*/
    const schema = Yup.object().shape({
        name: Yup.string().required('Required'),
        championship_id: Yup.string().required('Required')
    });

    const { register, handleSubmit, errors, reset } = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(schema)
    });

    const openForm = (group) => {
        setCurrentGroupId(group.group_id);
        reset(group);
        openModal();
    };

    const handleChampionshipOnChange = (id) => {
        setCurrentChampionshipId(id);
        fetchGroups(id);
    };

    /*CRUD ###########################################################################################*/
    const fetchGroups = async (id) => {
        setLoading(true);
        const res = await getList("group/" + id);
        setGroups(res);
        setLoading(false);
    };

    const addGroup = async data => {
        // console.log('Antes de guardar', {group_id: 0, ...data});
        try {
            const res = await axios.post("group", {group_id: currentGroupId, ...data});
            switch(res.data.result[0][0].cod) {
                case 0:
                    // alert('registrado correctamente!');
                    fetchGroups(currentChampionshipId);
                    closeModal();
                    break;
                case 1:
                    alert('Ya existe!');
                    break;
                case 2:
                    alert('Ya existe inactivo!');
                    break;
                default:
                    alert('Otro problema, error: ' + + res.data.result[0][0].msg);
                    break;
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const staGroup = async (group_id) => {
        try {
            const res = await axios.put("group/" + group_id);
            if (!res.data.error) {
                fetchGroups(currentChampionshipId);
            };
        } catch (err) {
            console.log(err);
        };
    };

    return (
        <Container.Primary>

            <Modal.ForForm isOpen={isOpenModal} closeModal={closeModal}>
                <Card.Primary title={currentGroupId === 0 ? 'New Group' : 'Update Group'}>
                    <Input.TextValidation name="name" placeholder="Name" register={register} error={errors.name} />
                    <Button.Primary action={handleSubmit(addGroup)}>Save</Button.Primary>
                </Card.Primary>
            </Modal.ForForm>

            <div className="search-container">
                <Select.OnChange name="championship_id" register={register} content={championships} action={handleChampionshipOnChange} />
                {championships[0] && <ButtonIcon.Add action={() => openForm(defaultData)}/>}
            </div>

            {loading 
                ? <Loading/>
                : <div className="card-container">
                    {groups.map(group => (
                        <div className="card" key={group.group_id}>
                            <div className="text-container" onClick={() => openGroup(group.group_id)}>
                                {group.name}
                            </div>
                            <div className="icon-container">
                                <ButtonIcon.Update action={() => openForm(group)} />
                                <ButtonIcon.Delete action={() => staGroup(group.group_id)}/>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </Container.Primary>
    );
};

export default Group;