import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserDataAction } from "../../redux/actions/AuthAction";
import {
  deleteImageUserAction,
  getUserInfoAction,
  updateImageUserAction,
  updateUserInfoAction,
} from "../../redux/actions/Profile/ProfileActions";
export default function UpdateUserInfoHook() {
  let userDB = [];
  if (localStorage.getItem("user_popeShounda")) {
    userDB.push(JSON.parse(localStorage.getItem("user_popeShounda")));
  }

  const convertImageToFile = async (imageUrl, fileName = "image.jpg") => {
    // Fetch the image as a blob
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Convert the blob to a File object
    const file = new File([blob], fileName, {
      type: blob.type,
      lastModified: Date.now(), // Use the current time as the last modified time
    });

    return file;
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [press, setPress] = useState(false);
  const [userNameProfile, setUserNameProfile] = useState(userDB[0].name);
  const [emailProfile, setEmailProfile] = useState(userDB[0].email);
  const [passProfile, setPassProfile] = useState();
  const [confirmPassProfile, setConfirmPassProfile] = useState();
  const [img, setImg] = useState(userDB[0].image);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userNameProfileMessage, setUserNameProfileMessage] = useState("");
  const [emailProfileMessage, setEmailProfileMessage] = useState("");
  const [passProfileMessage, setPassProfileMessage] = useState("");
  const [confirmPassProfileMessage, setConfirmPassProfileMessage] =
    useState("");
  const [imgProfileMessage, setImgProfileMessage] = useState("");
  const [deleteImgMessage, setDeleteImgMessage] = useState("");
  const [generlaProfileMessage, setGenerlaProfileMessage] = useState("");
  const [imgGenerlaProfileMessage, setImgGenerlaProfileMessage] = useState("");
  const userNameProfileRef = useRef();
  const emailProfileRef = useRef();
  const passProfileRef = useRef();
  const confirmPassProfileRef = useRef();

  // methods
  const onChangeUserNameProfile = (e) => {
    setUserNameProfile(e.target.value);
  };

  const onChangeEmailProfile = (e) => {
    setEmailProfile(e.target.value);
  };

  const onChangePassProfile = (e) => {
    setPassProfile(e.target.value);
  };
  const onChangePassConfirmProfile = (e) => {
    setConfirmPassProfile(e.target.value);
  };

  const handleIMGDelete = async (e) => {
    e.preventDefault();
    setImg("/assets/profile/avatar.svg");
  };
  const handleIMGChange = async (e) => {
    if (e.target.files) {
      setImg(URL.createObjectURL(e.target.files[0]));
      setSelectedFile(e.target.files[0]);
      console.log(e.target.files[0]);
    }
  };

  //authReducer
  const validate = () => {
    if (passProfile != confirmPassProfile) {
      console.log("yes");
      return;
    }
  };
  const onSubmitProfile = async (e) => {
    e.preventDefault();
    validate();
    setPress(true);
    setLoading(true);

    await dispatch(
      updateUserInfoAction({
        name: userNameProfile,
        email: emailProfile,
        password: passProfile
          ? passProfile
          : localStorage.getItem("pass_popeShounda"),
        password_confirmation: confirmPassProfile
          ? confirmPassProfile
          : localStorage.getItem("pass_popeShounda"),
      })
    );

    const formData = new FormData();
    let fileToUpload = selectedFile;
    if (!selectedFile) {
      fileToUpload = userDB[0].image
        ? convertImageToFile(userDB[0].image)
        : "/assets/profile/avatar.svg";
      if (fileToUpload == "/assets/profile/avatar.svg") {
        setImg("/assets/profile/avatar.svg");
      }
    }
    formData.append("image", fileToUpload);

    await dispatch(updateImageUserAction(formData));
    if (img == "/assets/profile/avatar.svg") {
      await dispatch(deleteImageUserAction());
    }
    setLoading(false);
  };
  const res = useSelector((state) => state.ProfileReducer.updateInfoUser);
  const resImg = useSelector((state) => state.ProfileReducer.updateUserImg);
  const resImgDelete = useSelector(
    (state) => state.ProfileReducer.deleteUserImg
  );

  useEffect(() => {
    if (loading == false) {
      if (res) {
        console.log("azakak", img);
        if (res.status == 200) {
          setUserNameProfileMessage("");
          setEmailProfileMessage("");
          setPassProfileMessage("");
          setConfirmPassProfileMessage("");
          setGenerlaProfileMessage(res.data.message);
          if (res.status != 422) {
            userNameProfileRef.current.classList.remove("profileActive");
            emailProfileRef.current.classList.remove("profileActive");
            passProfileRef?.current?.classList?.remove("profileActive");
            confirmPassProfileRef?.current?.classList?.remove("profileActive");
            setTimeout(() => {
              window.location.href = "/";
            }, 500);
          }
        }
        if (res.status == 422 && res.data.data) {
          if (res.data.data.name) {
            setUserNameProfileMessage(res.data.data.name[0]);
            userNameProfileRef.current.classList.add("profileActive");
          } else {
            setUserNameProfileMessage("");
            userNameProfileRef.current.classList.remove("profileActive");
          }
          if (res.data.data.email) {
            setEmailProfileMessage(res.data.data.email[0]);
            emailProfileRef.current.classList.add("profileActive");
          } else {
            setEmailProfileMessage("");
            emailProfileRef.current.classList.remove("profileActive");
          }
          if (res.data.data.password) {
            setPassProfileMessage(res.data.data.password[0]);
            passProfileRef?.current?.classList?.add("profileActive");
          } else {
            setPassProfileMessage("");
            passProfileRef?.current?.classList?.remove("profileActive");
          }
          if (res.data.data.password_confirmation) {
            setConfirmPassProfileMessage(
              res.data.data.password_confirmation[0]
            );
            confirmPassProfileRef?.current?.classList?.add("profileActive");
          } else {
            setConfirmPassProfileMessage("");
            confirmPassProfileRef?.current?.classList?.remove("profileActive");
          }
        }
      }
      if (resImg) {
        if (resImg.status == 200) {
          if (selectedFile) {
            setImgGenerlaProfileMessage(resImg.data.message);
          }
          if (
            res.status != 422 &&
            resImg.status != 422 &&
            resImgDelete.status != 422
          ) {
            setTimeout(() => {
              window.location.href = "/";
            }, 500);
          }
        }
        if (resImg.status == 422 && res.data.data && selectedFile) {
          if (res.data.data.name) {
            setImgProfileMessage(
              `${resImg.data.data.image[0]} ${
                resImg.data.data.image[1] ? resImg.data.data.image[1] : ""
              }`
            );
          } else {
            setImgProfileMessage("");
          }
        }
      }
      if (resImgDelete) {
        if (resImgDelete.status == 200) {
          setImgGenerlaProfileMessage(resImgDelete.data.message);
          if (
            res.status != 422 &&
            resImg.status != 422 &&
            resImgDelete.status != 422
          ) {
            setTimeout(() => {
              window.location.href = "/";
            }, 500);
          }
        }

        if (resImgDelete.status == 422 && resImgDelete.data.data) {
          if (res.data.data.name) {
            setDeleteImgMessage(resImgDelete.data.data.image[0]);
          } else {
            setDeleteImgMessage("");
          }
        }
      }
    }
    setLoading(true);
    setPress(false);
  }, [loading]);

  return [
    userNameProfile,
    emailProfile,
    passProfile,
    confirmPassProfile,
    userNameProfileMessage,
    emailProfileMessage,
    passProfileMessage,
    confirmPassProfileMessage,
    generlaProfileMessage,
    imgProfileMessage,
    deleteImgMessage,
    imgGenerlaProfileMessage,
    userNameProfileRef,
    emailProfileRef,
    passProfileRef,
    confirmPassProfileRef,
    img,
    selectedFile,
    onChangeUserNameProfile,
    onChangeEmailProfile,
    onChangePassConfirmProfile,
    onChangePassProfile,
    handleIMGChange,
    handleIMGDelete,
    onSubmitProfile,
    loading,
    press,
  ];
}
