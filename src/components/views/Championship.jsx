import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { Input, ButtonIcon, Modal, Button, Card, Table, Container } from "../../component";
import useModal from "../../hooks/useModal";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { getList } from '../../helpers/listHelper'; 
import axios from '../../config/axios'

const Championship = () => {
    useEffect(() => fetchChampionship(), []);
    const [championships, setChampionships] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentID, setCurrentID] = useState(0);
    const [isOpenModal, openModal, closeModal] = useModal();
    const defaultData = {championship_id: 0, name: ''};

    /*VALIDATIONS ####################################################################################*/ 
    const schema = Yup.object().shape({
        name: Yup.string().required('Required')
    });

    const { register, handleSubmit, errors, reset } = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(schema)
    });

    const openForm = championship => {
        setCurrentID(championship.championship_id);
        reset(championship);
        openModal();
    };

    /*CRUD ###########################################################################################*/ 
    const fetchChampionship = async () => {
        const championships = await getList("championship");
        setChampionships(championships);
    };

    const addChampionship = async data => {
        // console.log('Antes de guardar', {user_id: currentID, ...data});
        try {
            const res = await axios.post("championship", {championship_id: currentID, ...data});
            switch(res.data.result[0][0].cod) {
                case 0:
                    alert('registrado correctamente!');
                    fetchChampionship();
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
    
    const staChampionship = async (championship_id) => {
        try {
            const res = await axios.put("championship/" + championship_id);
            if (!res.data.error) {
                alert('Inactivado!');
                fetchChampionship();
            };
        } catch (err) {
            console.log(err);
        };
    };

    /*JSX ############################################################################################*/ 
    return (
        <Container.Primary>
            <Modal isOpen={isOpenModal} closeModal={closeModal}>
                <Card.Primary title="Championship">
                    <Input.TextValidation name="name" placeholder="Championship name" register={register} error={errors.name} />
                    <Button.Primary action={handleSubmit(addChampionship)}>Save</Button.Primary>   
                </Card.Primary>
            </Modal>

            <div className="search-container">
                <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
                <ButtonIcon.Add action={() => openForm(defaultData)}/>
            </div>

            <Table.Primary>
                <thead>
                    <tr>
                        <th>Championship name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {championships.filter(val => {
                        if(searchTerm === "") {
                            return val;
                        } else if (val.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                            return val;
                        };
                        return null;
                    }).map(championship => (
                        <tr key={championship.championship_id}>
                            <td data-label='Name'>{championship.name}</td>
                            <td data-label='Actions'>
                                <div className="td-container">
                                    <ButtonIcon.Update action={() => openForm(championship)} />
                                    <ButtonIcon.Delete action={() => staChampionship(championship.championship_id)} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table.Primary>
        </Container.Primary>
    );
};

export default Championship;