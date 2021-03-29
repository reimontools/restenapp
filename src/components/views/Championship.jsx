import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { Input, Modal, Button, Card, Table, Container, Icon, Loading } from "../../component";
import useModal from "../../hooks/useModal";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { getList } from '../../helpers/listHelper'; 
import axios from '../../config/axios'
import moment from 'moment';

const Championship = () => {
    useEffect(() => fetchChampionship(), []);
    const [championships, setChampionships] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentID, setCurrentID] = useState(0);
    const [isOpenModal, openModal, closeModal] = useModal();
    const defaultData = {championship_id: 0, name: '', state: 0};
    const [loading, setLoading] = useState(true);

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
        setLoading(true);
        const championships = await getList("championship");
        setChampionships(championships);
        setLoading(false);
    };

    const addChampionship = async data => {
        // console.log('Antes de guardar', {user_id: currentID, ...data});
        try {
            const res = await axios.post("championship", {championship_id: currentID, ...data});
            switch(res.data.result.cod) {
                case 0:
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

    /*JSX ############################################################################################*/ 
    return (
        <Container.Primary>
            <Modal.ForForm isOpen={isOpenModal} closeModal={closeModal}>
                <Card.Primary title={currentID === 0 ? 'New Championship' : 'Update Championship'}>
                    <Input.TextValidation name="name" placeholder="Championship name" register={register} error={errors.name} />
                    {currentID !== 0 && <Input.Check name="state" text="Finished?" register={register} />}
                    <Button.Basic action={handleSubmit(addChampionship)}>Save</Button.Basic>
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
                                <th>Championship</th>
                                <th>State</th>
                                <th>Created</th>
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
                                <tr key={championship.championship_id}>
                                    <td data-label='Championship'>{championship.name}</td>
                                    <td data-label='State' className={championship.state === 0 ? 'active' : ''}>{championship.state_name} {championship.state === 0 && '✔'}</td>
                                    <td data-label='Created'>{ moment(championship.created_date).format('YYYY-MM-DD') }</td>
                                    <td data-label=''>
                                        <div className="td-container">
                                            <Icon.Basic family="edit" action={() => openForm(championship)} hover/>
                                            <Icon.Basic family="delete" action={() => staChampionship(championship.championship_id)} hover/>
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

export default Championship;