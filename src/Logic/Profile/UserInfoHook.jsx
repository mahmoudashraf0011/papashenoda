import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserInfoAction } from '../../redux/actions/Profile/ProfileActions';

// module-level flag persists across mounts/unmounts
let hasFetchedUserInfo = false;

export default function UserInfoHook() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        setLoading(true);
        await dispatch(getUserInfoAction());
        setLoading(false);
    };

    useEffect(() => {
        if (localStorage.getItem("token_popeShounda") && !hasFetchedUserInfo) {
            hasFetchedUserInfo = true; // prevents subsequent calls across remounts
            getData();
        }
    }, []);

    const res = useSelector(state => state.ProfileReducer.userInfo);

    let userInfo = [];
    try {
        if (res && res.data) {
            userInfo.push(res.data);
            localStorage.setItem("user_popeShounda", JSON.stringify(res.data));
        }
    } catch (e) {
        console.log(e);
    }

    return [userInfo, loading];
}
