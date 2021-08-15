import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, ModalNew, Title, Button, Select2, Dialog, Input2 } from "../../component.controls";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../../config/axios'
import { getCapitalInSentence } from "../../../helpers/parameters.helper";
import { useChampionshipType } from "../../../custom-hooks/useChampionshipType";

const ChampionshipCrud = ({fetch, championship, isOpen, close}) => {        
    // CUSTOM HOOKS #################################################################################################################################
    const { championshipTypes } = useChampionshipType("fetchChampionshipTypes");

    // STATE ########################################################################################################################################
    const [dialogOptions, setDialogOptions] = useState({});

    // CRUD VALIDATIONS #############################################################################################################################
    const schema = Yup.object().shape({
        championship_name: Yup.string()
            .required('Required !')
            .trim()
            .min(2, "Too short!")
            .transform(value => getCapitalInSentence(value)),
        championship_type_id: Yup.string()
            .required('Required!')
    });

    const { register, handleSubmit, errors, reset } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schema)
    });

    // EFFECT ###################################################################################################################################
    useEffect(() => reset(championship), [championship, reset]);

    // CRUD #####################################################################################################################################
    const updateChampionship = async data => {
        try {
            const res = await axios.post("championship", {championship_id: championship.championship_id, ...data});
            switch(res.data.result.cod) {
                case 0:
                    fetch();
                    close();
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

    // JSX ######################################################################################################################################
    return (
        <ModalNew.ForForm isOpen={isOpen} closeModal={close}>
            <Container.Basic>
                <Title.Basic>{championship.championship_id === 0 ? 'New Championship' : 'Update Championship'}</Title.Basic>
                <Input2.Validation name="championship_name" label="Name" register={register} error={errors.name} />
                <Select2.Validation disable={championship.championship_id === 0 ? false : true} name="championship_type_id" label="Type" placeholder="Select a type" register={register} content={championshipTypes} error={errors.championship_type_id}/>
                <Button.Basic onClick={handleSubmit(updateChampionship)} margin="9px 0 0 0">Save</Button.Basic>
            </Container.Basic>
            
            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />
        </ModalNew.ForForm>
    );
}

export default ChampionshipCrud;