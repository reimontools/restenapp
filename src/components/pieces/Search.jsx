import { Input2 } from "../component.controls";
import { ContainerSearch } from "../styled/Search.styled";

const Search = ({value, action, placeholder=""}) => {
    // JSX ##########################################################################################################################################
    return (
        <ContainerSearch>
            <Input2.Action name="search" label="Search" value={value} action={action} placeholder={placeholder} />
        </ContainerSearch>
    );
};

export default Search;