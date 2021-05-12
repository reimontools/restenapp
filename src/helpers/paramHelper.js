import { BiEdit, BiFilterAlt } from "react-icons/bi";
import { GoPlus } from "react-icons/go";
import { MdClose } from "react-icons/md";
import { RiAliensLine } from "react-icons/ri";
import { BiTrash } from "react-icons/bi";
import { IoMdPersonAdd , IoMdSearch} from "react-icons/io";
import { FiArrowRightCircle } from "react-icons/fi";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { AiOutlineClear } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";

export const SMALL_SCREEN_SIZE = 500;
export const MEDIUM_SCREEN_SIZE = 768;
export const SMALL_SCREEN_SIZE_PX = SMALL_SCREEN_SIZE + "px";
export const MEDIUM_SCREEN_SIZE_PX = MEDIUM_SCREEN_SIZE + "px";

export const LOWERCASEREGEX = /(?=.*[a-z])/;
export const UPPERCASEREGEX = /(?=.*[A-Z])/;
export const NUMERICREGEX = /(?=.*[0-9])/;

export const PRIMARY_COLOR = "#0e70b8";
export const SECONDARY_COLOR = "#fff";

export const getColorByFamily = family => {
    switch(family) {
        case "close": return "#666666";
        case "add": return "#ced922";
        case "addPerson": return "#ced922";
        case "check": return "#0e70b8";
        case "dobleCheck": return "#FFFFFF";
        case "edit": return "#0e70b8";
        case "save": return "#0e70b8";
        case "delete": return "#bb3345";
        case "remove": return "#bb3345";
        case "search": return "#0d5f1b";
        case "filter": return "#0d5f1b";
        case "clear": return "#0d5f1b";
        case "go": return "#0d5f1b";
        case "password": return PRIMARY_COLOR;
        default: return "#0e70b8"
    };
};

export const getIconByFamily = family => {
    switch(family) {
        case "close": return <MdClose />;
        case "add": return <GoPlus />;
        case "addPerson": return <IoMdPersonAdd />;
        case "check": return <FaCheck />;
        case "dobleCheck": return <FaCheckDouble />;
        case "edit": return <BiEdit />;
        case "save": return <IoMdPersonAdd />;
        case "delete": return <BiTrash />;
        case "remove": return <MdClose />;
        case "search": return <IoMdSearch />;
        case "filter": return <BiFilterAlt />;
        case "clear": return <AiOutlineClear />;
        case "go": return <FiArrowRightCircle />;
        case "password": return <RiLockPasswordLine />;
        default: return <RiAliensLine />
    };
};
