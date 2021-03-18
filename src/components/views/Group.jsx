import { useState, useEffect} from "react";
import { Input, ButtonIcon, Modal, Button, Card, Select, Table, Container } from "../../component";
import useList from '../../hooks/useList';
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import useModal from "../../hooks/useModal";
import axios from '../../config/axios'
import { getList } from '../../helpers/listHelper'; 

const Group = () => {
    const [championships, setChampionships] = useState([]);
    const [currentChampionshipId, setCurrentChampionshipId] = useState(0);

    const [groups, setGroups] = useState([]);
    const [currentGroupId, setCurrentGroupId] = useState(0);

    const defaultData = {group_id: 0, name: ''};

    const [isOpenModal, openModal, closeModal] = useModal();

    /*USEEFFECT ####################################################################################*/ 
    useEffect(() => {
        fetchChampionships();
    }, []);

    useEffect(() => {
        fetchGroups();
    }, [currentChampionshipId]);

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
        fetchGroups();
    };

    /*CRUD ###########################################################################################*/ 
    const fetchChampionships = async () => {
        const res = await getList("championship");
        setChampionships(res);
        setCurrentChampionshipId(res[0]?.championship_id);
    };

    const fetchGroups = async () => {
        const res = await getList("group/" + currentChampionshipId);
        setGroups(res);
    };

    const addGroup = async data => {
        // console.log('Antes de guardar', {group_id: 0, ...data});
        try {
            const res = await axios.post("group", {group_id: currentGroupId, ...data});
            switch(res.data.result[0][0].cod) {
                case 0:
                    alert('registrado correctamente!');
                    fetchGroups();
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

    return (
        <Container.Primary>
            
            <Modal isOpen={isOpenModal} closeModal={closeModal}>
                <Card.Primary title={currentGroupId === 0 ? 'New Group' : 'Update Group'}>
                    <Input.TextValidation name="name" placeholder="Name" register={register} error={errors.name} />
                    <Button.Primary action={handleSubmit(addGroup)}>Save</Button.Primary>   
                </Card.Primary>
            </Modal>

            <div className="search-container">
                <Select.OnChange name="championship_id" label="Choose a Championship" register={register} content={championships} action={handleChampionshipOnChange} />
                {championships[0] && <ButtonIcon.Add action={() => openForm(defaultData)}/>}
            </div>

            <div className="card-container">
                {groups.map(group => (
                    <div className="card" key={group.group_id}>
                        <div className="text-container">
                            {group.name}
                        </div>
                        <div className="icon-container">
                            <ButtonIcon.Update action={() => openForm(group)} />
                            <ButtonIcon.Delete />
                        </div>
                    </div>
                ))}
            </div>
        </Container.Primary>
    );
};

export default Group;