// ICONS ############################################################################################################################################
import { BiTrash, BiEdit, BiFilterAlt } from "react-icons/bi";
import { MdClose, MdMoreVert } from "react-icons/md";
import { IoMdPersonAdd , IoMdSearch, IoIosAdd, IoIosArrowRoundBack, IoIosMore} from "react-icons/io";
import { FiArrowRightCircle } from "react-icons/fi";
import { FaCheck, FaCheckDouble, FaRegUser } from "react-icons/fa";
import { AiOutlineClear, AiOutlineTrophy } from "react-icons/ai";
import { RiAliensLine, RiLockPasswordLine, RiSeedlingLine } from "react-icons/ri";
import { CgGirl, CgBoy } from "react-icons/cg";
import { GiConfirmed } from "react-icons/gi";

// IMAGES ###########################################################################################################################################
import boy from '../assets/images/boy.png';
import girl from '../assets/images/girl.png';
import championshipSeed from '../assets/images/championshipSeed.png';
import championshipAgainst from '../assets/images/championshipAgainst.png';

// MESSAGES #########################################################################################################################################
export const MSG_NO_PLAYERS = "Sorry! you have no players assigned yet, please contact the administrator.";
export const MSG_NO_CHAMPIONSHIP = "Sorry! this player have no championships assigned yet, please contact the administrator.";

// SCREEN ###########################################################################################################################################
export const SMALL_SCREEN_SIZE = 500;
export const MEDIUM_SCREEN_SIZE = 768;
export const SMALL_SCREEN_SIZE_PX = SMALL_SCREEN_SIZE + "px";
export const MEDIUM_SCREEN_SIZE_PX = MEDIUM_SCREEN_SIZE + "px";

// REGEX ############################################################################################################################################
export const LOWERCASEREGEX = /(?=.*[a-z])/;
export const UPPERCASEREGEX = /(?=.*[A-Z])/;
export const NUMERICREGEX = /(?=.*[0-9])/;

export const PRIMARY_COLOR = "#0e70b8";
export const SECONDARY_COLOR = "#fff";

export const getImageByFamily = family => {
    switch(family) {
        case "girl": return girl;
        case "boy": return boy;
        case "championshipSeed": return championshipSeed;
        case "championshipAgainst": return championshipAgainst;
        default: return girl;
    };
};

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
        case "go": return PRIMARY_COLOR;
        case "password": return PRIMARY_COLOR;
        case "user": return PRIMARY_COLOR;
        case "trophy": return PRIMARY_COLOR;
        case "seed": return PRIMARY_COLOR;
        case "female": return PRIMARY_COLOR;
        case "male": return PRIMARY_COLOR;
        case "commit": return PRIMARY_COLOR;
        case "more": return PRIMARY_COLOR;
        case "options": return PRIMARY_COLOR;
        case "back": return "#959595";
        case "newFloat": return "#ced922";
        case "backFloat": return "#959595";
        case "moreFloat": return "#0e70b8";
        default: return "#0e70b8"
    };
};

export const getIconByFamily = family => {
    switch(family) {
        case "close": return <MdClose />;
        case "add": return <IoIosAdd />;
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
        case "user": return <FaRegUser />;
        case "trophy": return <AiOutlineTrophy />;
        case "seed": return <RiSeedlingLine />;
        case "female": return <CgGirl />;
        case "male": return <CgBoy />;
        case "commit": return <GiConfirmed />;
        case "more": return <MdMoreVert />;
        case "options": return <IoIosMore />;
        case "back": return <IoIosArrowRoundBack />;

        case "newFloat": return  <IoIosAdd />;
        case "backFloat": return <IoIosArrowRoundBack />;
        case "moreFloat": return <IoIosMore />;

        default: return <RiAliensLine />
    };
};
