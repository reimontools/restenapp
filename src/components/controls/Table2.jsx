import styled from "styled-components";
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";

const TableStyled = styled.table `
    width: 100%;
    border-collapse: collapse;
    margin: ${({ margin }) => margin ? margin : '0'};

    thead {
        background: #0e70b8;
    };

    thead tr th {
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0.35px;
        color: #FFFFFF;
        padding: 12px;
        vertical-align: center;
        height: 45px;
    };

    thead tr th:first-child {
        border-radius: 5px 0 0 0
    };

    thead tr th:last-child {
        border-radius: 0 5px 0 0
    };

    tbody tr td {
        font-size: 14px;
        font-weight: normal;
        letter-spacing: 0.35px;
        padding: 8px;
        text-align: center;   
    };

    tbody tr:hover td {
        background-color: #dddd;
        cursor: pointer;
    };

    .td-container {
        display: flex;
        align-items: center; 
        justify-content: space-evenly;
    };

    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        color: #222;
        border-collapse: separate; 
        border-spacing: 0 10px; 

        thead {
            display: none;
        };

        .hide {
            display:none;
        };

        .unhide {
            display:flex;
        };

        td {
            border: solid 2px #0e70b8;
            background-color: #c8e1f3;
            padding: 10px;
            border-style: solid none;
        };

        td:first-child {
            border-left-style: solid;
            border-top-left-radius: 5px; 
            border-bottom-left-radius: 5px;
        };
        
        td:last-child {
            border-right-style: solid;
            border-bottom-right-radius: 5px; 
            border-top-right-radius: 5px; 
        };

        tbody tr > td {
            text-align: left;
        };

        /* tbody tr:hover td {
            background-color: none;
        }; */

        .td-container {
            justify-content: flex-end;
        };
    };
`;

const Table = {
    Primary: ({children, ...props}) => {
        return (
            <TableStyled {...props}>
                {children}
            </TableStyled>
        );
    }
};

export default Table;