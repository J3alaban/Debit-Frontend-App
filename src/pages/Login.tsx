import { FC, useEffect } from "react";
import { useAppDispatch } from "../redux/hooks";
import { updateModal } from "../redux/features/authSlice";
import LoginModal from "../components/LoginModal";


const Login: FC = () => {
const dispatch = useAppDispatch();


useEffect(() => {
dispatch(updateModal(true));
}, [dispatch]);


return (
<div className="container mx-auto min-h-[83vh] font-karla">
<LoginModal />
</div>
);
};


export default Login;
