import { Input } from "../component.controls";
import { ContainerSearch } from "../styled/Search.styled";

const Search = ({value, action}) => {
    // JSX ##########################################################################################################################################
    return (
        <ContainerSearch>
            <Input.TextAction name="search" placeholder="Search..." value={value} action={action} />
        </ContainerSearch>
    );
};

export default Search;