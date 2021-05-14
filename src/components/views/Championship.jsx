import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { Input, Modal, Button, Title, TableNew, Container, Icon, Loading, Select, Dialog, Avatar, ButtonFloat } from "../../component";
import useModal from "../../hooks/useModal";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { getList } from '../../helpers/listHelper'; 
import axios from '../../config/axios'
import moment from 'moment';
import useList from '../../hooks/useList';
import { useHistory } from 'react-router-dom';

const Championship = () => {
    // EFFECT #######################################################################################################################################
    useEffect(() => fetchChampionships(), []);

    // CONST ########################################################################################################################################
    const defaultChampionshipData = {championship_id: 0, name: '', state: 0, championship_type_id: ""};
    const history = useHistory();
    
    // STATE ########################################################################################################################################
    const [championships, setChampionships] = useState([]);
    const [currentChampionshipId, setCurrentChampionshipId] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [dialogOptions, setDialogOptions] = useState({});

    // USEMODAL #####################################################################################################################################
    const [isOpenModalCrud, openModalCrud, closeModalCrud] = useModal();
    
    // LIST #########################################################################################################################################
    const championshipTypeList = useList("list/championship_type");

    // CRUD VALIDATIONS ############################################################################################################################# 
    const schemaCrud = Yup.object().shape({
        name: Yup.string()
            .required('Required'),
        championship_type_id: Yup.string()
            .required('Required')
    });

    const { register: registerCrud, handleSubmit: handleSubmitCrud, errors: errorsCrud, reset: resetCrud } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schemaCrud)
    });

    // FETCHS #######################################################################################################################################
    const fetchChampionships = async () => {
        setLoading(true);
        const championships = await getList("championship");
        setChampionships(championships);
        setLoading(false);
    };

    // CRUD #########################################################################################################################################
    const updateChampionship = async data => {
        try {
            const res = await axios.post("championship", {championship_id: currentChampionshipId, ...data});
            switch(res.data.result.cod) {
                case 0:
                    fetchChampionships();
                    closeModalCrud();
                    break;
                case 1:
                    setDialogOptions({family: "info", title: 'Alert', text : 'Championship already exists!'})
                    break;
                case 2:
                    setDialogOptions({family: "info", title: 'Alert', text : 'Championship already exists! (nonActive)'})
                    break;
                default:
                    setDialogOptions({family: "info", title: 'Error', text : 'Error: ' + res.data.result.msg})
                    break;
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };
    
    const updateChampionshipState = async (id, state_id) => {
        try {
            const res = await axios.post("state/", {state_id, name: "championship", id});
            if (res.data.result.cod === 0) return fetchChampionships();
            setDialogOptions({family: "info", title: 'Alert', text : 'Error: ' + res.data.result.msg})
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const updateChampionshipIsActive = async id => {
        try {
            const res = await axios.put("championship/" + id);
            if (!res.data.error) {
                fetchChampionships();
            };
        } catch (err) {
            console.log(err);
        };
    };

    // FILTERS ######################################################################################################################################
    function filChampionshipByText(championship) {
        if(searchTerm === "") {
            return championship;
        } else if (championship.name.toLowerCase().includes(searchTerm.toLowerCase()) || championship.state_name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return championship;
        };
        return null;
    };

    // HANDLES ######################################################################################################################################
    const handleExpandir = championship_id => {
        if (championship_id === currentChampionshipId) {
            setCurrentChampionshipId(0);
        } else {
            setCurrentChampionshipId(championship_id);
        };
    };

    const handleChampionshipState = (e, championship) => {
        e.stopPropagation();
        if (championship.state_id === 1) updateChampionshipState(championship.championship_id, 2);
        if (championship.state_id === 2) updateChampionshipState(championship.championship_id, 1);
    };

    const handleModalCrud = (e, championship) => {
        e.stopPropagation();
        setCurrentChampionshipId(championship.championship_id);
        resetCrud(championship);
        openModalCrud();
    };

    const handleGoToChampionshipDetail = (e, championship) => {
        e.stopPropagation();
        if (championship.championship_type_id === 2) {
            history.push('/championship/seed/' + championship.championship_id);
        } else {
            history.push('/championship/against/' + championship.championship_id);
        };
    };

    const handleDelete = (e, championship) => {
        e.stopPropagation();
        setDialogOptions({family: "delete", title: 'Delete this championship?', text: 'Are you sure you want to delete this championship?', action: () => updateChampionshipIsActive(championship.championship_id) });
    };

    // RENDERS ######################################################################################################################################
    const renderTableHead = () => {
        return (
            <tr>
                <th>Championship</th>
                <th>Type</th>
                <th>Created</th>
                <th>State</th>
                <th>Actions</th>
            </tr>
        );
    };

    const renderTableRows = championship => {
        var classContent = "";
        var classActions = "";

        if (championship.championship_id === currentChampionshipId) {
            classContent = "content unhide"
            classActions = "unhide"
        } else {
            classContent = "content hide"
            classActions = "hide"
        };

        return (
            <tr key={championship.championship_id} onClick={() => handleExpandir(championship.championship_id)}>
                <td className="head">
                    {renderAvatarByChampionchipTypeId(championship.championship_type_id)}
                    {championship.name}
                </td>
                <td className={classContent} data-label='Type'>{championship.championship_type_name}</td>
                <td className={classContent} data-label='Created'>{ moment(championship.created_date).format('YYYY-MM-DD') }</td>
                <td className={classContent} data-label='Status'>{renderButtonState(championship)}</td>
                <td className={classActions}>{renderActions(championship)}</td>
            </tr>  
        );
    };

    const renderAvatarByChampionchipTypeId = championship_type_id => {
        let backColor="#f8db27";
        if (championship_type_id === 1) return <Avatar.Letter backColor={backColor}>A</Avatar.Letter>
        if (championship_type_id === 2) return <Avatar.Letter backColor={backColor}>S</Avatar.Letter>
        return null;        
    };
    
    const renderActions = championship => {
        return (
            <div className="td-container">
                <Icon.Basic 
                    onClick={e => handleGoToChampionshipDetail(e, championship)}
                    family="go" 
                    hover
                />
                <Icon.Basic 
                    onClick={e => handleModalCrud(e, championship)}
                    family="edit"
                    hover
                />
                <Icon.Basic 
                    onClick={e => handleDelete(e, championship)}
                    family="delete" 
                    hover
                />
            </div>
        );
    };

    const renderButtonState = championship => {
        var text = championship.state_name, family = "";
        championship.state_id === 1 ? family = "addPerson" : family = "check";
        return <Button.Basic family={family} onClick={e => handleChampionshipState(e, championship)} fit height="auto" size="12px" weight="400" hover>{text}</Button.Basic>;
    };

    // JSX ##########################################################################################################################################
    return (
        <Container.Primary>
            <div className="search-container">
                <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
            </div>
            {loading 
                ? <Loading/>
                : <Container.Table>
                    <TableNew.Basic>
                        <thead>{renderTableHead()}</thead>
                        <tbody>
                            {championships.filter(filChampionshipByText).map(championship => renderTableRows(championship))}
                        </tbody>
                    </TableNew.Basic>
                </Container.Table>
            }

            {/* MODAL CRUD ########################################################################################################################## */}
            <Modal.ForForm isOpen={isOpenModalCrud} closeModal={closeModalCrud}>
                <Container.Basic>
                    <Title.Basic>{currentChampionshipId === 0 ? 'New Championship' : 'Update Championship'}</Title.Basic>
                    <Input.TextValidation name="name" placeholder="Championship name" register={registerCrud} error={errorsCrud.name} />
                    <Select.Validation disable={currentChampionshipId === 0 ? false : true} name="championship_type_id" text="Championship type" register={registerCrud} error={errorsCrud.championship_type_id} content={championshipTypeList} />
                    <Button.Basic onClick={handleSubmitCrud(updateChampionship)} width="100%">Save</Button.Basic>
                </Container.Basic>
            </Modal.ForForm>
            
            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />

            {/* NEW  ################################################################################################################################ */}
            <ButtonFloat.Icon hover onClick={e => handleModalCrud(e, defaultChampionshipData)} />
        </Container.Primary>
    );
};

export default Championship;